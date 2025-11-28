# Firebase Setup for EduLens

## Prerequisites

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Login to Firebase: `firebase login`

## Firebase Services Used

- **Firestore**: NoSQL database for institutions, reviews, users
- **Authentication**: Phone and Email authentication
- **Storage**: Image and file uploads
- **Hosting**: (Optional) Host the web apps

## Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `edulens` (or your preferred name)
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Services

#### Firestore Database
1. Go to Firestore Database in the console
2. Click "Create database"
3. Choose "Start in production mode"
4. Select your preferred location (e.g., `asia-south1` for India)

#### Authentication
1. Go to Authentication > Sign-in method
2. Enable "Phone" provider
3. Enable "Email/Password" provider (optional)

#### Storage
1. Go to Storage
2. Click "Get started"
3. Choose "Start in production mode"
4. Select your preferred location

### 3. Get Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click "Add app" > Web
4. Register app with nickname
5. Copy the `firebaseConfig` object

### 4. Configure Environment Variables

Create `.env` files in both `web-public` and `web-admin`:

```bash
# Copy from .env.example
cp web-public/.env.example web-public/.env
cp web-admin/.env.example web-admin/.env
```

Fill in the values from your Firebase config:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=edulens-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=edulens-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=edulens-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 5. Deploy Security Rules

```bash
cd firebase
firebase init  # Select your project
firebase deploy --only firestore:rules
firebase deploy --only storage
firebase deploy --only firestore:indexes
```

### 6. Create Admin User

After deploying, create your first admin user:

1. Sign up through the app
2. Go to Firestore Console
3. Find your user document in `users` collection
4. Change `role` from `"user"` to `"admin"`

## Collections Structure

### institutions
```javascript
{
  name: string,
  type: "school" | "college" | "university" | "coaching" | ...,
  description: string,
  address: string,
  city: string,
  state: string,
  pincode: string,
  phone: string,
  email: string,
  website: string,
  board: string,
  established: number,
  rating: number,
  reviewCount: number,
  etiScore: number,
  fees: { level: amount },
  facilities: string[],
  courses: string[],
  images: string[],
  status: "pending" | "verified" | "rejected",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### users
```javascript
{
  uid: string,
  email: string,
  phone: string,
  displayName: string,
  photoURL: string,
  role: "user" | "admin" | "moderator",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### reviews
```javascript
{
  institutionId: string,
  userId: string,
  userName: string,
  rating: number,
  title: string,
  text: string,
  pros: string[],
  cons: string[],
  helpful: number,
  reported: boolean,
  status: "pending" | "approved" | "rejected",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Netlify Deployment

Add environment variables in Netlify:
1. Go to Site settings > Environment variables
2. Add all `VITE_FIREBASE_*` variables

## Local Development

```bash
# Start web-public
cd web-public
npm run dev

# Start web-admin (in another terminal)
cd web-admin
npm run dev
```
