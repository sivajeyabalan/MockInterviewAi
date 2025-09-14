# 🎯 MockAI - AI-Powered Mock Interview Platform

> **Transform your interview preparation with AI-driven mock interviews that provide real-time feedback and personalized questions.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-🚀%20Try%20Now-blue?style=for-the-badge&logo=vercel)](https://mockinterviewai-5tdrzxl3g-sivajbs-projects.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-React%20%7C%20TypeScript%20%7C%20Firebase%20%7C%20AI-green?style=for-the-badge)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Tech Stack](#️-tech-stack)
- [🔄 How It Works](#-how-it-works)
- [🚀 Getting Started](#-getting-started)
- [📱 Usage](#-usage)
- [🔧 Configuration](#-configuration)
- [📊 Project Structure](#-project-structure)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

## 🎯 Overview

MockAI is an intelligent mock interview platform that leverages Google's Gemini AI to create personalized interview experiences. Users can practice with AI-generated questions, record their answers using speech-to-text, and receive detailed feedback to improve their interview skills.

### 🎪 Live Demo

**🌐 [Try MockAI Now](https://mockinterviewai-5tdrzxl3g-sivajbs-projects.vercel.app)**

## ✨ Features

### 🎤 **Smart Interview Generation**

- **Dynamic Question Count**: Choose 3-10 questions per interview
- **AI-Powered Questions**: Google Gemini generates contextual, relevant questions
- **Multiple Domains**: Support for various job roles and industries
- **Personalized Experience**: Questions tailored to your specified role and experience level

### 🎙️ **Advanced Speech Recognition**

- **Real-time Transcription**: Convert speech to text with high accuracy
- **Confidence Scoring**: Visual feedback on speech recognition quality
- **Audio Quality Monitoring**: Tips for better recording conditions
- **Cross-browser Support**: Works on Chrome, Firefox, Safari, and Edge

### 🤖 **Intelligent Feedback System**

- **AI-Powered Analysis**: Detailed feedback on your answers
- **Performance Metrics**: Confidence scores and improvement suggestions
- **Answer Quality Assessment**: Evaluation of content, structure, and delivery
- **Personalized Recommendations**: Tips for better interview performance

### 🔐 **Secure Authentication**

- **Firebase Authentication**: Secure user management
- **Protected Routes**: Secure access to interview features
- **User Profiles**: Personalized interview history and progress tracking

### 📱 **Modern User Experience**

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Intuitive Interface**: Clean, modern UI with smooth animations
- **Real-time Updates**: Live feedback and progress indicators
- **Accessibility**: WCAG compliant design patterns

## 🏗️ Tech Stack

### **Frontend**

- **React 18** - Modern UI library with hooks and concurrent features
- **TypeScript** - Type-safe development with enhanced IDE support
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### **Backend & Services**

- **Firebase** - Authentication, Firestore database, and hosting
- **Google Gemini AI** - Advanced AI for question generation and feedback
- **React Hook Speech-to-Text** - Browser-based speech recognition

### **Development Tools**

- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting and consistency
- **Git** - Version control and collaboration

## 🔄 How It Works

### **Application Workflow**

```
┌─────────────────────────────────────────────────────────────────┐
│                    🎯 MOCKAI WORKFLOW                          │
└─────────────────────────────────────────────────────────────────┘

1. AUTHENTICATION PHASE
   ┌─────────────┐    ┌──────────────┐    ┌─────────────┐
   │   User      │───▶│  Firebase    │───▶│ Dashboard   │
   │  Login      │    │    Auth      │    │   Access    │
   └─────────────┘    └──────────────┘    └─────────────┘

2. INTERVIEW CREATION
   ┌─────────────┐    ┌──────────────┐    ┌─────────────┐
   │   Form      │───▶│  Validation  │───▶│ AI Prompt   │
   │  Input      │    │   (Zod)      │    │ Generation  │
   └─────────────┘    └──────────────┘    └─────────────┘
                                │
                                ▼
   ┌─────────────┐    ┌──────────────┐    ┌─────────────┐
   │  Questions  │◀───│   Gemini     │◀───│  API Call   │
   │ Generated   │    │     AI       │    │  to Google  │
   └─────────────┘    └──────────────┘    └─────────────┘

3. INTERVIEW EXECUTION
   ┌─────────────┐    ┌──────────────┐    ┌─────────────┐
   │  Question   │───▶│   Speech     │───▶│  Text       │
   │ Display     │    │ Recognition  │    │Transcription│
   └─────────────┘    └──────────────┘    └─────────────┘
                                │
                                ▼
   ┌─────────────┐    ┌──────────────┐    ┌─────────────┐
   │   AI        │◀───│   Gemini     │◀───│  Answer     │
   │ Feedback    │    │  Analysis    │    │ Submission  │
   └─────────────┘    └──────────────┘    └─────────────┘

4. RESULTS & STORAGE
   ┌─────────────┐    ┌──────────────┐    ┌─────────────┐
   │  Feedback   │───▶│  Firestore   │───▶│  User       │
   │ Display     │    │  Database    │    │ History     │
   └─────────────┘    └──────────────┘    └─────────────┘
```

### **Detailed Process Flow**

```
User Journey:
┌─────────────┐
│   Start     │
└──────┬──────┘
       │
       ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Sign Up   │───▶│  Dashboard   │───▶│ Create New  │
│   / Login   │    │   Access     │    │ Interview   │
└─────────────┘    └──────────────┘    └──────┬──────┘
                                               │
                                               ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Fill Form  │───▶│  Generate    │───▶│  Start      │
│ (Role, Exp, │    │  Questions   │    │ Interview   │
│ Questions)  │    │  (AI)        │    │             │
└─────────────┘    └──────────────┘    └──────┬──────┘
                                               │
                                               ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Record     │───▶│  AI Analysis │───▶│  View       │
│  Answer     │    │  & Feedback  │    │ Results     │
│ (Speech)    │    │              │    │             │
└─────────────┘    └──────────────┘    └─────────────┘
```

### **Technical Architecture**

```
Frontend (React + TypeScript)
    │
    ├── Authentication (Firebase Auth)
    │
    ├── Form Management (React Hook Form + Zod)
    │
    ├── Speech Recognition (Browser API)
    │
    └── UI Components (Tailwind CSS)
           │
           ▼
Backend Services
    │
    ├── Firebase Firestore (Data Storage)
    │
    └── Google Gemini AI (Question Generation & Feedback)
```

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+
- npm 8+
- Firebase project
- Google AI API key

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/mockai.git
   cd mockai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # Google AI Configuration
   VITE_GOOGLE_AI_API_KEY=your_google_ai_key
   VITE_GEMINI_API_KEY=your_gemini_key
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 Usage

### **Creating a Mock Interview**

1. **Sign Up/Login** - Create an account or sign in
2. **Fill Interview Form**:
   - Select your target role (e.g., "Software Engineer", "Product Manager")
   - Choose experience level (Entry, Mid, Senior)
   - Specify number of questions (3-10)
   - Add any specific focus areas
3. **Generate Questions** - AI creates personalized questions
4. **Start Interview** - Begin recording your answers

### **During the Interview**

1. **Read Question** - Take time to understand the question
2. **Record Answer** - Click record and speak clearly
3. **Review Transcription** - Check if speech was captured correctly
4. **Submit Answer** - Get instant AI feedback
5. **Continue** - Move to next question

### **Reviewing Results**

- **Performance Metrics** - Confidence scores and timing
- **Detailed Feedback** - AI analysis of your answers
- **Improvement Tips** - Specific recommendations
- **Save Results** - Store for future reference

## 🔧 Configuration

### **Firebase Setup**

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Get your configuration keys

### **Google AI Setup**

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to your environment variables

### **Speech Recognition**

The app uses browser-based speech recognition. For best results:

- Use Chrome or Edge browsers
- Ensure microphone permissions are granted
- Speak clearly in a quiet environment
- Use a good quality microphone

## 📊 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   ├── form-mock-interview.tsx
│   ├── record-answer.tsx
│   └── ...
├── contexts/           # React contexts (Auth, etc.)
├── layouts/            # Page layouts
├── pages/              # Main application pages
├── routes/             # Route components
├── types/              # TypeScript type definitions
├── lib/                # Utility functions
├── config/             # Configuration files
└── assets/             # Static assets
```

## 🚀 Deployment

### **Vercel (Recommended)**

1. **Connect Repository**

   ```bash
   vercel --prod
   ```

2. **Set Environment Variables**

   - Add all environment variables in Vercel dashboard
   - Redeploy after adding variables

3. **Custom Domain** (Optional)
   - Configure in Vercel dashboard
   - Update DNS settings

### **Other Platforms**

- **Netlify**: Use `npm run build` and deploy `dist` folder
- **Firebase Hosting**: Use `firebase deploy`
- **Render**: Connect GitHub repository

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Code Style**

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful AI capabilities
- **Firebase** - For backend infrastructure
- **React Community** - For excellent tooling and libraries
- **Vercel** - For seamless deployment platform

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

[🚀 Live Demo](https://mockinterviewai-5tdrzxl3g-sivajbs-projects.vercel.app) | [📖 Documentation](docs/) | [🐛 Report Bug](issues/) | [💡 Request Feature](issues/)

Made with ❤️ by [Your Name](https://github.com/yourusername)

</div>
