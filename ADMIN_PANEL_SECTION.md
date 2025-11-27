## 🔴 3. NEXT.JS ADMIN PANEL

### Project Structure
```
admin-panel/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── schools/
│   │   │   ├── verification/
│   │   │   ├── moderation/
│   │   │   └── audit/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── forms/
│   │   └── tables/
│   ├── lib/
│   └── hooks/
└── components.json (shadcn config)
```

### Dependencies (package.json)
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.8.0",
    "@tanstack/react-table": "^8.10.0",
    "react-hook-form": "^7.47.0",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^3.22.4",
    "lucide-react": "^0.294.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-toast": "^1.1.5",
    "recharts": "^2.8.0",
    "date-fns": "^2.30.0"
  }
}
```

### Authentication Layout
```tsx
// src/app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">EduLens Admin</h1>
          <p className="text-gray-600">School Management Platform</p>
        </div>
        {children}
      </div>
    </div>
  );
}
```

### Login Page with 2FA
```tsx
// src/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const totpSchema = z.object({
  code: z.string().length(6, 'TOTP code must be 6 digits'),
});

type LoginForm = z.infer<typeof loginSchema>;
type TotpForm = z.infer<typeof totpSchema>;

export default function LoginPage() {
  const [step, setStep] = useState<'login' | 'totp'>('login');
  const [sessionToken, setSessionToken] = useState<string>('');
  const { login, verifyTotp } = useAuth();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const totpForm = useForm<TotpForm>({
    resolver: zodResolver(totpSchema),
  });

  const onLogin = async (data: LoginForm) => {
    try {
      const response = await login(data.email, data.password);
      if (response.requiresTotp) {
        setSessionToken(response.sessionToken);
        setStep('totp');
      }
    } catch (error) {
      // Handle error
    }
  };

  const onVerifyTotp = async (data: TotpForm) => {
    try {
      await verifyTotp(sessionToken, data.code);
      // Redirect to dashboard
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {step === 'login' ? 'Sign In' : 'Two-Factor Authentication'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 'login' ? (
          <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
            <Input
              {...loginForm.register('email')}
              type="email"
              placeholder="Email"
            />
            <Input
              {...loginForm.register('password')}
              type="password"
              placeholder="Password"
            />
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        ) : (
          <form onSubmit={totpForm.handleSubmit(onVerifyTotp)} className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter the 6-digit code from your authenticator app
            </p>
            <Input
              {...totpForm.register('code')}
              placeholder="000000"
              maxLength={6}
            />
            <Button type="submit" className="w-full">
              Verify
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
```

### Dashboard Layout with Sidebar
```tsx
// src/app/(dashboard)/layout.tsx
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Dashboard Overview
```tsx
// src/app/(dashboard)/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KPICard } from '@/components/kpi-card';
import { RecentActivity } from '@/components/recent-activity';
import { PendingVerifications } from '@/components/pending-verifications';

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Schools"
          value={stats.totalSchools}
          change="+12%"
          trend="up"
        />
        <KPICard
          title="Pending Verifications"
          value={stats.pendingVerifications}
          change="-5%"
          trend="down"
        />
        <KPICard
          title="Reviews This Month"
          value={stats.monthlyReviews}
          change="+23%"
          trend="up"
        />
        <KPICard
          title="Complaints Open"
          value={stats.openComplaints}
          change="+8%"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingVerifications />
        <RecentActivity />
      </div>
    </div>
  );
}
```

### School Data Entry Form
```tsx
// src/app/(dashboard)/schools/new/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const schoolSchema = z.object({
  // Basic Info
  name: z.string().min(2, 'School name is required'),
  address: z.string().min(10, 'Complete address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().length(6, 'Valid pincode required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Valid email required'),
  website: z.string().url().optional(),
  
  // School Details
  board: z.enum(['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE']),
  type: z.enum(['Government', 'Private', 'Aided']),
  medium: z.array(z.string()).min(1, 'At least one medium required'),
  grades: z.object({
    from: z.string(),
    to: z.string(),
  }),
  
  // Infrastructure
  totalArea: z.number().positive('Total area must be positive'),
  builtUpArea: z.number().positive('Built-up area must be positive'),
  playgroundArea: z.number().min(0),
  laboratories: z.array(z.string()),
  library: z.boolean(),
  computerLab: z.boolean(),
  sportsComplex: z.boolean(),
  
  // Fees
  admissionFee: z.number().min(0),
  annualFee: z.number().min(0),
  transportFee: z.number().min(0).optional(),
  
  // Safety & Compliance
  fireSafety: z.boolean(),
  cctvSurveillance: z.boolean(),
  securityGuards: z.boolean(),
  medicalRoom: z.boolean(),
  
  // Teachers
  totalTeachers: z.number().positive('Total teachers must be positive'),
  qualifiedTeachers: z.number().min(0),
  studentTeacherRatio: z.number().positive(),
  
  // Academics
  passingRate: z.number().min(0).max(100),
  averageScore: z.number().min(0).max(100),
  
  // Reputation
  awards: z.array(z.string()).optional(),
  affiliations: z.array(z.string()).optional(),
});

type SchoolForm = z.infer<typeof schoolSchema>;

export default function NewSchoolPage() {
  const [activeTab, setActiveTab] = useState('basic');
  
  const form = useForm<SchoolForm>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      medium: [],
      laboratories: [],
      awards: [],
      affiliations: [],
    },
  });

  const onSubmit = async (data: SchoolForm) => {
    try {
      await createSchool(data);
      // Redirect to school list
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New School</h1>
      
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="academics">Academics</TabsTrigger>
            <TabsTrigger value="reputation">Reputation</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    {...form.register('name')}
                    placeholder="School Name"
                  />
                  <Select onValueChange={(value) => form.setValue('board', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Board" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CBSE">CBSE</SelectItem>
                      <SelectItem value="ICSE">ICSE</SelectItem>
                      <SelectItem value="State Board">State Board</SelectItem>
                      <SelectItem value="IB">IB</SelectItem>
                      <SelectItem value="IGCSE">IGCSE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Textarea
                  {...form.register('address')}
                  placeholder="Complete Address"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input {...form.register('city')} placeholder="City" />
                  <Input {...form.register('state')} placeholder="State" />
                  <Input {...form.register('pincode')} placeholder="Pincode" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input {...form.register('phone')} placeholder="Phone Number" />
                  <Input {...form.register('email')} placeholder="Email" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs content... */}
        </Tabs>

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const tabs = ['basic', 'infrastructure', 'fees', 'safety', 'teachers', 'academics', 'reputation'];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1]);
              }
            }}
          >
            Previous
          </Button>
          
          <Button
            type="button"
            onClick={() => {
              const tabs = ['basic', 'infrastructure', 'fees', 'safety', 'teachers', 'academics', 'reputation'];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1]);
              }
            }}
          >
            Next
          </Button>
          
          <Button type="submit">Save School</Button>
        </div>
      </form>
    </div>
  );
}
```

### Verification Queue Component
```tsx
// src/components/verification-queue.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VerificationItem {
  id: string;
  schoolId: string;
  schoolName: string;
  field: string;
  oldValue: any;
  newValue: any;
  aiFlag: string;
  confidence: number;
  submittedBy: string;
  submittedAt: string;
}

export function VerificationQueue() {
  const { data: items, refetch } = useQuery({
    queryKey: ['verification-queue'],
    queryFn: getVerificationQueue,
  });

  const handleApprove = async (itemId: string) => {
    await approveVerification(itemId);
    refetch();
  };

  const handleReject = async (itemId: string, reason: string) => {
    await rejectVerification(itemId, reason);
    refetch();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ai-flagged">
          <TabsList>
            <TabsTrigger value="ai-flagged">AI Flagged</TabsTrigger>
            <TabsTrigger value="manual-review">Manual Review</TabsTrigger>
            <TabsTrigger value="high-priority">High Priority</TabsTrigger>
          </TabsList>

          <TabsContent value="ai-flagged" className="space-y-4">
            {items?.filter(item => item.aiFlag).map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{item.schoolName}</h3>
                  <Badge variant={item.confidence > 0.8 ? 'destructive' : 'secondary'}>
                    {item.aiFlag} ({Math.round(item.confidence * 100)}%)
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Value</p>
                    <p className="text-sm">{JSON.stringify(item.oldValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Proposed Value</p>
                    <p className="text-sm">{JSON.stringify(item.newValue)}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(item.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(item.id, 'Rejected by moderator')}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
```

### ETI Score Editor
```tsx
// src/components/eti-score-editor.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

interface ETIScoreForm {
  infrastructure: number;
  academics: number;
  safety: number;
  teachers: number;
  facilities: number;
  overrideReason?: string;
}

export function ETIScoreEditor({ schoolId, currentScores }: {
  schoolId: string;
  currentScores: ETIScoreForm;
}) {
  const [isOverride, setIsOverride] = useState(false);
  
  const form = useForm<ETIScoreForm>({
    defaultValues: currentScores,
  });

  const watchedValues = form.watch();
  const totalScore = Math.round(
    (watchedValues.infrastructure +
     watchedValues.academics +
     watchedValues.safety +
     watchedValues.teachers +
     watchedValues.facilities) / 5
  );

  const onSubmit = async (data: ETIScoreForm) => {
    await updateETIScore(schoolId, {
      ...data,
      totalScore,
      isOverride,
      updatedBy: 'current-user-id',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ETI Score Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">{totalScore}</div>
            <div className="text-sm text-gray-600">Overall ETI Score</div>
          </div>

          <div className="space-y-4">
            {Object.entries(currentScores).map(([key, value]) => {
              if (key === 'overrideReason') return null;
              
              return (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <Slider
                    value={[form.watch(key as keyof ETIScoreForm) as number]}
                    onValueChange={(values) => form.setValue(key as keyof ETIScoreForm, values[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-right text-sm text-gray-600">
                    {form.watch(key as keyof ETIScoreForm)}/100
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isOverride}
                onChange={(e) => setIsOverride(e.target.checked)}
              />
              <span className="text-sm">Manual Override</span>
            </label>
            
            {isOverride && (
              <Textarea
                {...form.register('overrideReason')}
                placeholder="Reason for manual override..."
                required={isOverride}
              />
            )}
          </div>

          <Button type="submit" className="w-full">
            Update ETI Score
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```
