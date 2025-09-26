# ProjectKepler

A modern authentication and profile management system built with Next.js 15, TypeScript, Framer Motion, React Icons, and ShadCN UI.

## Features

### 🔐 Authentication System
- **Login & Signup**: Seamless authentication with email/password
- **Google Login**: Mock Google authentication integration
- **Password Visibility Toggle**: Enhanced UX with eye icons
- **Form Validation**: Real-time validation with smooth error animations
- **Animated Confirm Password**: Appears with smooth animation when user starts typing password during signup

### 👤 Profile Management
- **Profile Completion**: Mandatory profile setup for new users
- **Required Fields**: Full name, date of birth, gender (radio buttons), address
- **Optional Fields**: Bio section
- **Profile Editing**: Dedicated page to update profile information
- **Logout Functionality**: Secure logout with localStorage cleanup

### 🏠 Home Dashboard
- **Responsive Navbar**: Logo, navigation options (Image, Video, API), and profile button
- **Dynamic Content**: Content changes based on selected option
- **Smooth Animations**: All interactions enhanced with Framer Motion
- **Modern UI**: Dark theme with gradient backgrounds and glass morphism effects

### ✨ Animations & UX
- **Framer Motion**: Smooth, minimal, and noticeable animations throughout
- **Loading States**: Beautiful loading spinner with ProjectKepler branding
- **State Transitions**: Seamless page transitions between auth, profile, and home
- **Responsive Design**: Optimized for all screen sizes

### 💾 Local Storage Management
- **User Data Persistence**: All user information stored in localStorage
- **Profile Completion Tracking**: Automatic redirection based on profile status
- **Session Management**: Maintains user session across browser sessions

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: ShadCN UI
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Storage**: Browser localStorage

## Project Structure

```
src/
├── app/
│   ├── pages/           # Page wrapper components
│   │   ├── LoginPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── HomePage.tsx
│   │   └── ProfileEditPage.tsx
│   ├── api/            # API routes (existing)
│   ├── globals.css     # Global styles and ShadCN CSS variables
│   ├── layout.tsx      # Root layout with dark theme
│   └── page.tsx        # Main app orchestrator
├── components/         # Reusable UI components
│   ├── ui/            # ShadCN UI components
│   ├── AuthForm.tsx   # Login/Signup form
│   ├── ProfileForm.tsx # Profile completion form
│   ├── Home.tsx       # Main home dashboard
│   ├── ProfileEdit.tsx # Profile editing page
│   ├── Navbar.tsx     # Navigation component
│   └── LoadingSpinner.tsx # Loading animation
└── lib/
    ├── localStorage.ts # Local storage utilities
    └── utils.ts       # ShadCN utility functions
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Your Browser**
   Navigate to `http://localhost:3000` (or the displayed port)

## User Flow

1. **Authentication**: Users start with login/signup form
2. **Profile Completion**: New users must complete their profile
3. **Home Dashboard**: Access to main application features
4. **Profile Management**: Edit profile information anytime
5. **Logout**: Secure logout with data cleanup

## Animations

All animations are implemented with Framer Motion for:
- Page transitions and component mounting
- Form field animations (especially confirm password)
- Button hover effects and loading states
- Smooth navigation and modal transitions
- Loading spinner and progress indicators

## Dark Theme

The application features a beautiful dark theme with:
- Gradient backgrounds (slate-900 to slate-800)
- Glass morphism effects with backdrop blur
- Consistent color scheme using CSS custom properties
- High contrast for accessibility

## Future Enhancements

- Real Google OAuth integration
- Backend API integration
- Database storage instead of localStorage
- Advanced profile features (avatar upload, preferences)
- Enhanced security with JWT tokens
- Email verification system

## Contributing

Feel free to contribute to ProjectKepler! Please ensure your code follows the established patterns and includes proper TypeScript types and Framer Motion animations.
