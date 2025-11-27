# EduLens Hybrid System Blueprint
## Engineering Master Plan

### System Architecture Overview

EduLens is a comprehensive educational transparency platform consisting of:
- **Flutter Mobile App** (iOS/Android)
- **Next.js Public Web App** (SEO-optimized)
- **Next.js Admin Panel** (Internal management)
- **Node.js/Express Backend** (API services)
- **PostgreSQL Database** (Primary data store)
- **Meilisearch** (Search engine)
- **AWS S3** (File storage)
- **Redis** (Caching & sessions)

---

## 🔵 1. FLUTTER MOBILE APP

### Project Structure
```
lib/
├── main.dart
├── app/
│   ├── app.dart
│   └── router.dart
├── core/
│   ├── constants/
│   ├── utils/
│   ├── network/
│   └── storage/
├── features/
│   ├── auth/
│   ├── home/
│   ├── school/
│   ├── review/
│   └── complaint/
├── shared/
│   ├── widgets/
│   ├── models/
│   └── providers/
└── gen/
    └── assets.gen.dart
```

### Dependencies (pubspec.yaml)
```yaml
dependencies:
  flutter: ^3.16.0
  flutter_riverpod: ^2.4.9
  riverpod_annotation: ^2.3.3
  go_router: ^12.1.3
  dio: ^5.4.0
  retrofit: ^4.0.3
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  json_annotation: ^4.8.1
  freezed_annotation: ^2.4.1
  connectivity_plus: ^5.0.2
  image_picker: ^1.0.4
  permission_handler: ^11.1.0
  flutter_secure_storage: ^9.0.0

dev_dependencies:
  build_runner: ^2.4.7
  riverpod_generator: ^2.3.9
  retrofit_generator: ^8.0.4
  json_serializable: ^6.7.1
  freezed: ^2.4.6
  hive_generator: ^2.0.1
```

### State Management with Riverpod

#### Auth Provider
```dart
// lib/features/auth/providers/auth_provider.dart
@riverpod
class AuthNotifier extends _$AuthNotifier {
  @override
  AuthState build() {
    return const AuthState.initial();
  }

  Future<void> sendOtp(String phoneNumber) async {
    state = const AuthState.loading();
    try {
      await ref.read(authRepositoryProvider).sendOtp(phoneNumber);
      state = AuthState.otpSent(phoneNumber);
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }

  Future<void> verifyOtp(String phoneNumber, String otp) async {
    state = const AuthState.loading();
    try {
      final token = await ref.read(authRepositoryProvider)
          .verifyOtp(phoneNumber, otp);
      await ref.read(tokenStorageProvider).saveToken(token);
      state = const AuthState.authenticated();
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }
}

@freezed
class AuthState with _$AuthState {
  const factory AuthState.initial() = _Initial;
  const factory AuthState.loading() = _Loading;
  const factory AuthState.otpSent(String phoneNumber) = _OtpSent;
  const factory AuthState.authenticated() = _Authenticated;
  const factory AuthState.error(String message) = _Error;
}
```

### Network Layer with Dio & Retrofit

#### API Client
```dart
// lib/core/network/api_client.dart
@RestApi(baseUrl: "https://api.edulens.com/v1")
abstract class ApiClient {
  factory ApiClient(Dio dio, {String baseUrl}) = _ApiClient;

  @POST("/auth/send-otp")
  Future<ApiResponse<void>> sendOtp(@Body() SendOtpRequest request);

  @POST("/auth/verify-otp")
  Future<ApiResponse<AuthResponse>> verifyOtp(@Body() VerifyOtpRequest request);

  @GET("/schools/search")
  Future<ApiResponse<List<School>>> searchSchools(
    @Query("q") String query,
    @Query("lat") double? latitude,
    @Query("lng") double? longitude,
    @Query("radius") int? radius,
  );

  @GET("/schools/{id}")
  Future<ApiResponse<SchoolDetail>> getSchool(@Path("id") String schoolId);

  @POST("/reviews")
  Future<ApiResponse<Review>> submitReview(@Body() CreateReviewRequest request);

  @POST("/complaints")
  Future<ApiResponse<Complaint>> submitComplaint(@Body() CreateComplaintRequest request);
}
```

### Offline Storage with Hive

#### Models
```dart
// lib/shared/models/school.dart
@HiveType(typeId: 0)
@freezed
class School with _$School {
  const factory School({
    @HiveField(0) required String id,
    @HiveField(1) required String name,
    @HiveField(2) required String address,
    @HiveField(3) required double latitude,
    @HiveField(4) required double longitude,
    @HiveField(5) required double etiScore,
    @HiveField(6) required String board,
    @HiveField(7) required String type,
  }) = _School;

  factory School.fromJson(Map<String, dynamic> json) => _$SchoolFromJson(json);
}
```

#### Offline Repository
```dart
// lib/core/storage/offline_repository.dart
@riverpod
class OfflineRepository extends _$OfflineRepository {
  late Box<School> _schoolBox;
  late Box<Review> _reviewBox;
  late Box<Complaint> _complaintBox;

  @override
  Future<void> build() async {
    _schoolBox = await Hive.openBox<School>('schools');
    _reviewBox = await Hive.openBox<Review>('reviews');
    _complaintBox = await Hive.openBox<Complaint>('complaints');
  }

  Future<void> cacheSchool(School school) async {
    await _schoolBox.put(school.id, school);
  }

  School? getCachedSchool(String id) {
    return _schoolBox.get(id);
  }

  Future<void> queueReview(Review review) async {
    await _reviewBox.put(review.id, review);
  }

  List<Review> getPendingReviews() {
    return _reviewBox.values.where((r) => !r.synced).toList();
  }
}
```

### Background Sync Service
```dart
// lib/core/sync/sync_service.dart
@riverpod
class SyncService extends _$SyncService {
  @override
  void build() {
    _startPeriodicSync();
  }

  void _startPeriodicSync() {
    Timer.periodic(const Duration(minutes: 5), (_) {
      if (ref.read(connectivityProvider).hasConnection) {
        _syncPendingData();
      }
    });
  }

  Future<void> _syncPendingData() async {
    final offlineRepo = ref.read(offlineRepositoryProvider);
    final apiClient = ref.read(apiClientProvider);

    // Sync pending reviews
    final pendingReviews = await offlineRepo.getPendingReviews();
    for (final review in pendingReviews) {
      try {
        await apiClient.submitReview(CreateReviewRequest.fromReview(review));
        await offlineRepo.markReviewSynced(review.id);
      } catch (e) {
        // Keep in queue for next sync
      }
    }
  }
}
```

### Key Screens Implementation

#### Splash Screen
```dart
// lib/features/splash/splash_screen.dart
class SplashScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.listen(authNotifierProvider, (previous, next) {
      next.when(
        initial: () => context.go('/login'),
        authenticated: () => context.go('/home'),
        loading: () {},
        otpSent: (_) {},
        error: (_) => context.go('/login'),
      );
    });

    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset('assets/logo.png', width: 120),
            const SizedBox(height: 24),
            const CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}
```

#### OTP Login Screen
```dart
// lib/features/auth/screens/otp_login_screen.dart
class OtpLoginScreen extends ConsumerStatefulWidget {
  @override
  ConsumerState<OtpLoginScreen> createState() => _OtpLoginScreenState();
}

class _OtpLoginScreenState extends ConsumerState<OtpLoginScreen> {
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authNotifierProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: authState.when(
          initial: () => _buildPhoneInput(),
          loading: () => const Center(child: CircularProgressIndicator()),
          otpSent: (phone) => _buildOtpInput(phone),
          authenticated: () => const SizedBox(),
          error: (message) => Column(
            children: [
              Text(message, style: TextStyle(color: Colors.red)),
              _buildPhoneInput(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPhoneInput() {
    return Column(
      children: [
        TextField(
          controller: _phoneController,
          decoration: const InputDecoration(
            labelText: 'Phone Number',
            prefixText: '+91 ',
          ),
          keyboardType: TextInputType.phone,
        ),
        const SizedBox(height: 16),
        ElevatedButton(
          onPressed: () {
            ref.read(authNotifierProvider.notifier)
                .sendOtp(_phoneController.text);
          },
          child: const Text('Send OTP'),
        ),
      ],
    );
  }

  Widget _buildOtpInput(String phone) {
    return Column(
      children: [
        Text('OTP sent to $phone'),
        TextField(
          controller: _otpController,
          decoration: const InputDecoration(labelText: 'Enter OTP'),
          keyboardType: TextInputType.number,
        ),
        const SizedBox(height: 16),
        ElevatedButton(
          onPressed: () {
            ref.read(authNotifierProvider.notifier)
                .verifyOtp(phone, _otpController.text);
          },
          child: const Text('Verify OTP'),
        ),
      ],
    );
  }
}
```

---

## 🔵 2. NEXT.JS PUBLIC WEB APP

### Project Structure
```
public-web/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── search/
│   │   ├── school/
│   │   ├── compare/
│   │   └── api/
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   └── types/
├── public/
└── next.config.js
```

### Configuration (next.config.js)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['edulens-assets.s3.amazonaws.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.edulens.com/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

### SEO-Optimized Layout
```tsx
// src/app/layout.tsx
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/lib/query-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | EduLens',
    default: 'EduLens - School Transparency Platform',
  },
  description: 'Find and compare schools with transparent ETI scores, reviews, and detailed information.',
  keywords: ['schools', 'education', 'transparency', 'reviews', 'ETI score'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://edulens.com',
    siteName: 'EduLens',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EduLens - School Transparency Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@edulens',
    creator: '@edulens',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

### Home Page with SSR
```tsx
// src/app/page.tsx
import { Metadata } from 'next';
import { SearchForm } from '@/components/search-form';
import { FeaturedSchools } from '@/components/featured-schools';
import { getTopSchools } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Find the Best Schools Near You',
  description: 'Search and compare schools with transparent ETI scores, parent reviews, and comprehensive data.',
};

export default async function HomePage() {
  const topSchools = await getTopSchools();

  return (
    <main className="min-h-screen">
      <section className="hero bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Find the Perfect School for Your Child
          </h1>
          <p className="text-xl mb-8">
            Transparent ETI scores, verified reviews, and comprehensive school data
          </p>
          <SearchForm />
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Top Rated Schools
          </h2>
          <FeaturedSchools schools={topSchools} />
        </div>
      </section>
    </main>
  );
}
```

### School Profile Page with ISR
```tsx
// src/app/school/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SchoolHeader } from '@/components/school-header';
import { ETIBreakdown } from '@/components/eti-breakdown';
import { ReviewsList } from '@/components/reviews-list';
import { getSchool, getSchoolReviews } from '@/lib/api';

export const revalidate = 3600; // ISR: revalidate every hour

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const school = await getSchool(params.id);
  
  if (!school) {
    return {
      title: 'School Not Found',
    };
  }

  return {
    title: `${school.name} - ETI Score ${school.etiScore}`,
    description: `${school.name} in ${school.address}. ETI Score: ${school.etiScore}/100. View detailed breakdown, reviews, and school information.`,
    openGraph: {
      title: `${school.name} - EduLens`,
      description: `ETI Score: ${school.etiScore}/100. ${school.description}`,
      images: [
        {
          url: school.imageUrl || '/default-school.png',
          width: 1200,
          height: 630,
          alt: school.name,
        },
      ],
    },
  };
}

export default async function SchoolPage({ params }: Props) {
  const [school, reviews] = await Promise.all([
    getSchool(params.id),
    getSchoolReviews(params.id),
  ]);

  if (!school) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: school.name,
    address: school.address,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: school.etiScore / 20, // Convert to 5-star scale
      bestRating: 5,
      ratingCount: reviews.length,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="min-h-screen">
        <SchoolHeader school={school} />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ETIBreakdown school={school} />
              <ReviewsList reviews={reviews} />
            </div>
            <aside>
              {/* School sidebar info */}
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
```

### React Query Integration
```tsx
// src/lib/query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            cacheTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Search Hook with React Query
```tsx
// src/hooks/use-school-search.ts
import { useQuery } from '@tanstack/react-query';
import { searchSchools } from '@/lib/api';

interface SearchParams {
  query: string;
  location?: { lat: number; lng: number };
  filters?: {
    board?: string;
    type?: string;
    minScore?: number;
    maxFees?: number;
  };
}

export function useSchoolSearch(params: SearchParams) {
  return useQuery({
    queryKey: ['schools', 'search', params],
    queryFn: () => searchSchools(params),
    enabled: params.query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
```

---

This is the first part of the comprehensive EduLens system blueprint. The document covers the Flutter mobile app architecture with Riverpod state management, offline storage with Hive, and the Next.js public web application with SEO optimization and ISR strategies.
