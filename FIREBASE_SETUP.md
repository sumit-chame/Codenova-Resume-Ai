# Firebase Setup Guide - ResumeForge AI

This guide provides step-by-step instructions for configuring Firebase Authentication, Firestore Database, and Firebase Storage for **ResumeForge AI**.

---

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or **Create a project**).
3. Name your project (e.g. `resumeforge-ai`).
4. (Optional) Enable Google Analytics and click **Create Project**.

---

## 2. Register a Web Application

1. In your Firebase Project Overview page, click the **Web** icon (`</>`) to add a web app.
2. Enter App nickname: `ResumeForge AI Web`.
3. Do not check Firebase Hosting for now (optional).
4. Click **Register app**.
5. Copy your configuration object values into your local `.env` file (see structure below).

---

## 3. Configure `.env` Environment Variables

Copy `.env.example` to `.env` in the root of the project:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## 4. Enable Firebase Authentication

1. In the Firebase console left menu, select **Build > Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab:
   - **Email/Password**: Click Email/Password, toggle **Enable**, and click **Save**.
   - **Google**: Click Google, toggle **Enable**, set your support email, and click **Save**.
4. In **Settings > Authorized domains**, ensure `localhost` is listed.

---

## 5. Enable Firestore Database

1. In the left menu, select **Build > Firestore Database**.
2. Click **Create database**.
3. Select a location close to your users (e.g. `us-central` or `asia-south1`).
4. Select **Start in test mode** for development, then click **Create**.
5. Recommended Security Rules for production (`firestore.rules`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 6. Enable Firebase Storage

1. Select **Build > Storage** from the sidebar.
2. Click **Get Started**, choose test mode, and click **Done**.
3. Recommended Security Rules (`storage.rules`):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 7. Verification

Run your local development server:

```bash
npm run dev
```

Open `http://localhost:5173` and click **Get Started** or **Sign Up** to create a test user. Your user will be logged in and stored in Firestore under `users/{uid}`.
