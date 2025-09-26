# Firebase Setup Guide for ProjectKepler

## Overview

This guide covers the complete Firebase setup for authentication and Firestore integration in ProjectKepler.

## 🔥 Firebase Features Implemented

### 1. Authentication

- ✅ Email/Password signup with email verification
- ✅ Email/Password login (only verified users)
- ✅ Google authentication (one-click)
- ✅ Sign out functionality
- ✅ Password management for all user types

### 2. Firestore Database

- ✅ User profile storage and management
- ✅ Real-time profile updates
- ✅ Username availability checking
- ✅ Password management for Google users

### 3. UI Components

- ✅ Enhanced ProfileEdit with Firebase integration
- ✅ SetPasswordModal for Google users
- ✅ ChangePasswordModal for existing users
- ✅ Sign out buttons in header and profile

## 📁 New/Modified Files

### Core Firebase Files

1. `src/lib/firestoreUser.ts` - User profile management
2. `src/components/SetPasswordModal.tsx` - Password setup for Google users
3. `src/components/ChangePasswordModal.tsx` - Password change functionality

### Enhanced Components

1. `src/components/ProfileEdit.tsx` - Complete Firebase integration
2. `src/components/AuthForm.tsx` - Profile creation on signup/login
3. `src/lib/authContext.tsx` - Authentication state management

## 🚀 Setup Steps

### 1. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project or select existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google (add your domain to authorized domains)
4. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)

### 2. Environment Variables

Create `.env.local` file with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow users to check username availability
    match /users/{userId} {
      allow read: if request.auth != null &&
                     resource.data.keys().hasOnly(['username']);
    }
  }
}
```

## 📊 Firestore Data Structure

### User Profile Document

```typescript
{
  uid: string;              // Firebase Auth UID
  email: string;            // User email
  displayName?: string;     // Display name
  username?: string;        // Unique username
  bio?: string;            // User bio
  address?: string;        // User address
  dateOfBirth?: string;    // Date of birth
  gender?: 'male' | 'female' | 'other';
  hasPassword?: boolean;   // Whether user has set password
  createdAt: Timestamp;    // Creation date
  updatedAt: Timestamp;    // Last update
}
```

## 🔐 Password Management Features

### For Email/Password Users

- Can change password using current password
- Password requirements: minimum 6 characters
- Re-authentication required for security

### For Google Users

- Can set a password to enable password reset
- Links email/password credential to existing Google account
- Maintains all existing Google sign-in functionality

## 🎯 User Experience Flow

### New User Signup (Email/Password)

1. User fills signup form
2. Account created in Firebase Auth
3. Profile created in Firestore
4. Verification email sent
5. User must verify email before login

### New User Signup (Google)

1. User clicks "Continue with Google"
2. Google popup authentication
3. Account created/signed in
4. Profile created in Firestore (if new user)
5. Immediate access (no email verification needed)

### Profile Management

1. User accesses profile settings
2. Can update: username, display name, bio, address, DOB, gender
3. Username availability checked in real-time
4. Changes saved to Firestore
5. Password management options based on account type

### Sign Out

1. Available in multiple locations (header, profile settings)
2. Firebase sign out
3. Redirects to login page

## 🛠️ Technical Implementation

### Authentication Context

- Provides user state throughout the app
- Handles loading states
- Automatic persistence across sessions

### Error Handling

- Comprehensive Firebase error code handling
- User-friendly error messages
- Validation feedback

### Security Features

- Email verification required for email/password accounts
- Username uniqueness validation
- Secure password requirements
- Re-authentication for sensitive operations

## 📱 UI/UX Enhancements

### Profile Edit Component

- Real-time form validation
- Loading states during operations
- Smooth animations and transitions
- Password management section
- Responsive design

### Modal Components

- SetPasswordModal: For Google users to set password
- ChangePasswordModal: For changing existing passwords
- Proper form validation and error handling
- Accessible design with keyboard support

## 🔍 Testing Checklist

### Authentication Flow

- [ ] Email/password signup with verification
- [ ] Email/password login (verified accounts only)
- [ ] Google signup/login
- [ ] Sign out functionality
- [ ] Error handling for all scenarios

### Profile Management

- [ ] Profile creation for new users
- [ ] Profile updates and saves
- [ ] Username availability checking
- [ ] Password setting for Google users
- [ ] Password changing for email users

### UI/UX

- [ ] Form validation and error display
- [ ] Loading states and animations
- [ ] Responsive design
- [ ] Accessible modals and forms

## 🚨 Important Notes

1. **Email Verification**: Users with email/password accounts cannot log in until they verify their email
2. **Google Users**: Don't require email verification but can optionally set a password
3. **Username Uniqueness**: Usernames must be unique across all users
4. **Security Rules**: Ensure Firestore security rules are properly configured
5. **Environment Variables**: All Firebase config must be in environment variables

## 🎉 Next Steps After Setup

1. Test authentication flow end-to-end
2. Verify Firestore data is being saved correctly
3. Test password management features
4. Ensure all error scenarios are handled gracefully
5. Test responsive design on different devices

The system is now fully integrated with Firebase and provides a complete authentication and profile management solution!
