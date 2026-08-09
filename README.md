<div align="center">
  <br />
  <h1>🚀 ResumeForge AI 2.0</h1>
  <p><strong>"Canva for Resumes" — Next-Generation AI-Powered, ATS-Optimized Resume Builder & Career Suite</strong></p>

  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Build Status](https://img.shields.io/badge/Build-Passing_✓_2098_Modules-10B981?style=for-the-badge)](https://github.com/sumit-chame/Codenova-Resume-Ai)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

  <br />
</div>

---

## 💡 Vision & Core Capabilities

**ResumeForge AI 2.0** combines **Canva’s template freedom** + **Notion’s editor smoothness** + **Rezi/Teal’s ATS intelligence** wrapped in a Vercel/Linear-grade dark & light UI. 

### 🌟 Key Highlights:
- **✍️ Split-Screen Resume Studio**: WYSIWYG live preview editor with zoom controls (`50%` to `120%`), section reordering, theme customizers, and A4 print guidelines.
- **🎨 33 Recruiter-Approved Schema Templates**: Live visual theme demos across Minimal, Tech, Executive, Creative, Academic, Two-Column, and Specialized layouts.
- **🛡️ ATS Intelligence Lab**: Real-time job description scanner, circular ATS score gauge, matched vs. missing keyword tag grid, and compliance linter.
- **📄 Multi-Format Export Engine**: Export your resume directly to **PDF** (with real, selectable ATS text) or **JPG Image** (`.jpg`).
- **📥 Instant Document & Image Parser**: Upload existing resumes in **PDF, JPG, PNG, DOCX, or TXT** format for instant text extraction and automated ATS scoring.
- **🤖 Gemini AI Layer**: Google **XYZ Metric Formula** bullet rewriter, Executive Summary generator, and role-tailored Cover Letter AI generator.
- **🌗 Theme Studio (`⌘J` / `Ctrl+J`)**: Custom accent color presets, dark/light mode toggle, UI density, and font pairings.

---

## 🛠️ Technology Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** + **TypeScript** | Type-safe, component-driven UI architecture |
| **Build Tool & Bundler** | **Vite 6** | Ultra-fast HMR & production bundling |
| **Styling & Design System** | **Tailwind CSS v4** + **Lucide React** | Glassmorphism UI tokens, responsive layouts, icons |
| **Motion & Micro-Interactions** | **Framer Motion 12** | Staggered reveals, smooth drawer transitions |
| **Authentication & Database** | **Firebase Auth** + **Firestore** | User auth, instant demo login, master profile storage |
| **PDF & Image Engine** | **HTML5 Canvas / Cloud Functions** | Selectable PDF text generation & HD JPG image downloads |

---

## 📂 Project Architecture

```
Codenova-Resume-Ai/
├── src/
│   ├── components/
│   │   ├── ats/             # ATS Score Gauge, Keyword Heatmap, Linter Warnings
│   │   ├── common/          # Theme Studio Modal (⌘J), Theme Toggles
│   │   ├── layout/          # Navbar, Sidebar, Footer navigation
│   │   ├── resume/          # ResumeRenderer, Import Modal, AI Layout Modal
│   │   └── ui/              # Buttons, Cards, Modals, Badges, Inputs, Loaders
│   ├── constants/           # 33 JSON Schema Templates & Navigation items
│   ├── features/auth/       # Firebase Authentication & Demo Mode Context
│   ├── hooks/               # useTheme (⌘J shortcut), useToast notifications
│   ├── pages/               # Studio, Template Gallery, ATS Lab, Cover Letter
│   ├── services/            # AI Service, ATS Scanner Engine, PDF/JPG Export
│   └── types/               # Resume Master Profile & ATS Analysis schemas
├── functions/               # Firebase Cloud Functions (exportResumePdf)
├── docs/                    # Full Product Requirement Document (PRD 2.0)
├── ARCHITECTURE.md          # Technical Architecture & System Schemas
└── FIREBASE_SETUP.md        # Firebase Configuration Setup Guide
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sumit-chame/Codenova-Resume-Ai.git
   cd Codenova-Resume-Ai
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser. Click **⚡ Instant Quick Demo Login** to test all features out-of-the-box!

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📄 Export & Upload Capabilities

### Export Formats:
- **PDF Document (`.pdf`)**: Generates ATS-compliant documents with real selectable/searchable text and embedded web fonts (*Inter, Plus Jakarta Sans, Roboto*).
- **JPG Image (`.jpg`)**: Renders HD image files directly to your downloads folder.

### Upload & Parser Formats:
- **PDF** (`.pdf`)
- **JPG / PNG Images** (`.jpg`, `.png`)
- **Word Documents** (`.docx`, `.doc`)
- **Plain Text** (`.txt`)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/sumit-chame/Codenova-Resume-Ai/issues).

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
  <br />
  <sub>Built with ❤️ by Sumit Chame</sub>
</div>