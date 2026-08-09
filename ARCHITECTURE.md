# Project Architecture - ResumeForge AI (Phase 1)

**ResumeForge AI** is built on modern web software engineering principles, following **Clean Architecture**, strong component composition, and modular domain features.

---

## 🛠 Tech Stack Overview

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Vanilla CSS Custom Utilities
- **Animations**: Framer Motion
- **Routing**: React Router DOM (v7)
- **Forms & Validation**: React Hook Form + Zod (`@hookform/resolvers`)
- **Icons**: Lucide React
- **UI System**: Custom shadcn-inspired components with `clsx` and `tailwind-merge`

### Backend & Cloud Services
- **Authentication**: Firebase Auth (Email/Password, Google OAuth, Password Reset, Email Verification)
- **Database**: Firestore Database (User profiles, state synchronization)
- **Storage**: Firebase Storage (Photo uploads, document storage)

---

## 📂 Project Folder Structure

```
ResumeForge AI/
├── public/
│   └── favicon.svg           # Brand SVG Favicon
├── src/
│   ├── app/                  # Application Root & Providers
│   ├── assets/               # Branding assets and graphics
│   ├── components/
│   │   ├── common/           # ThemeToggle, ProtectedRoute, GuestRoute
│   │   ├── layout/           # Navbar, Sidebar, Footer
│   │   └── ui/               # Button, Input, Modal, Card, Avatar, Badge, Loader, Toast, Skeleton, EmptyState
│   ├── constants/            # App branding, Navigation arrays, FAQ items, Testimonials
│   ├── features/
│   │   ├── auth/             # AuthContext, Auth Forms, Session state
│   │   ├── dashboard/        # Dashboard layout, metrics, quick action cards
│   │   └── profile/          # Profile view, edit forms, user settings
│   ├── firebase/
│   │   └── config.ts         # Firebase initialization (Auth, Firestore, Storage)
│   ├── hooks/                # Custom React Hooks (useAuth, useTheme, useToast)
│   ├── layouts/              # MainLayout, DashboardLayout, AuthLayout
│   ├── lib/                  # Utility functions (cn tailwind merge)
│   ├── pages/
│   │   ├── auth/             # LoginPage, SignupPage, ForgotPasswordPage, VerifyEmailPage
│   │   ├── DashboardPage.tsx # Dashboard overview
│   │   ├── LandingPage.tsx   # Premium SaaS landing page
│   │   ├── NotFoundPage.tsx  # 404 page
│   │   └── ProfilePage.tsx   # Account settings page
│   ├── routes/
│   │   └── AppRoutes.tsx     # Route definitions and route guards
│   ├── services/
│   │   └── authService.ts    # Firebase auth & Firestore sync service
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces (User, Profile, Toast, Nav)
│   ├── utils/                # Helper utilities (date formatting, string helpers)
│   ├── App.tsx               # Root app container & provider setup
│   ├── index.css             # Tailwind imports & CSS custom design tokens
│   └── main.tsx              # React DOM entry point
├── .env                      # Local environment variables
├── .env.example              # Environment variable template
├── ARCHITECTURE.md           # Architecture documentation
├── FIREBASE_SETUP.md         # Firebase setup guide
├── index.html                # HTML entry point with Google Fonts
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript root config
└── vite.config.ts            # Vite bundler config with path alias (@/*)
```

---

## 🔑 Key Features Implemented in Phase 1

1. **Authentication Flow**:
   - Email/Password Signup & Sign In
   - One-click Google OAuth Sign In
   - Forgot Password Email Link
   - Resend Verification Email
   - Persistent User Session (`onAuthStateChanged`)
2. **Route Guards**:
   - `ProtectedRoute`: Guards `/dashboard` and `/profile` from unauthenticated users.
   - `GuestRoute`: Redirects authenticated users away from `/login` and `/signup`.
3. **Theme Engine**:
   - Dark / Light mode toggle saved in `localStorage`.
   - Dark mode default optimized for modern SaaS visual aesthetics.
4. **SaaS Dashboard**:
   - Expandable/Collapsible Sidebar
   - Top Header with Search Bar, Notifications Menu, and Profile Dropdown
   - User Overview metrics and status cards.
5. **Premium SaaS Landing Page**:
   - Hero section with Framer Motion animations
   - Interactive FAQ accordion
   - Recruiter & Candidate Testimonial cards
   - Feature highlights and high-converting CTA section.

---

## 🚀 Run & Build Instructions

### Development Server
```bash
npm run dev
```
App will launch at `http://localhost:5173`.

### TypeScript Verification
```bash
npm run lint
```

### Production Build
```bash
npm run build
```
Creates an optimized output bundle in `dist/`.
