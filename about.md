# TemariWare: The Unified Student & Career Ecosystem

TemariWare is an all-in-one, AI-powered platform specifically designed for the Ethiopian student and youth ecosystem. It bridges the gap between academic learning, financial inclusion, and professional career development.

---

## 🌟 What Problem Are We Solving?

Ethiopian students face several critical challenges:
- **Resource Fragmentation**: Academic materials, job postings, and financial tools are scattered across different platforms.
- **Financial Exclusion**: Limited access to easy credit or saving mechanisms tailored for students.
- **Career Gap**: Lack of guidance on how to transition from university to the job market with a strong portfolio.
- **Data Costs**: High internet prices make heavy web applications inaccessible.

---

## 🚀 The Solution

TemariWare provides a **unified digital ecosystem** that integrates learning, working, and saving. It leverages AI to guide users through their career journey while providing the financial tools needed to manage their student life.

### 💎 Unique Value Propositions
1. **AI-First Career Coaching**: Personalized guidance using the Gemini AI model.
2. **Community Financials (Ekub)**: Digitizing traditional Ethiopian "Ekub" for modern students.
3. **Data-Friendly PWA**: Built for offline-first and low-bandwidth environments.
4. **Instant Financial Connectivity**: Native integration with M-PESA, Telebirr, and Chapa.

---

## 🛠 Core Features

### 1. AI Coaching Hub (Powered by Gemini)
- **AI Study Buddy**: Generates custom study plans and roadmaps for complex topics.
- **AI Resume Reviewer**: Analyzes resumes and provides Ethiopian-market-specific improvement tips.
- **Career Matchmaker**: Recommends jobs and internships based on user skills and university project history.

### 2. Career & Micro-Jobs (WorkHub)
- **Micro-Internships**: Short-term, task-based projects from local startups.
- **Portfolio Builder**: Automatically turns your coursework and certifications into a professional profile.
- **Hire/Complete Workflow**: End-to-end task management with integrated evidence submission.

### 3. Gebeta Learning
- **Course Marketplace**: Premium student-made and instructor-led courses.
- **XP Reward System**: Earn Experience Points (XP) for learning, which can be converted into platform discounts or "Gebeta" meal deals.

### 4. Financial Services (Wallet & Ekub)
- **Digital Wallet**: Real-time balance management and peer-to-peer transfers.
- **M-PESA/Telebirr Top-up**: Instant STK-Push integration for ease of payment.
- **Digital Ekub**: Form rotating savings groups with classmates, with automated payout logic.

### 5. Collaboration Suite
- **Live Classrooms**: Peer-to-peer video/audio collaboration using WebRTC (no external server dependency).
- **Project Workspaces**: Real-time shared task boards and synchronized code collaboration via Socket.io.

---

## 💻 Technology Stack

- **Frontend**: React (Vite), Tailwind CSS (for premium aesthetics), Framer Motion (animations).
- **Backend**: Node.js, Express, Sequelize ORM.
- **Database**: SQLite (Development) / PostgreSQL (Production ready).
- **Real-time**: Socket.io (Messaging/Sync), WebRTC (Video/Audio).
- **Intelligence**: Google Gemini Pro API.
- **Connectivity**: Safaricom M-PESA Node.js SDK.

---

## 🛠 Setup & Installation

### Prerequisites
- Node.js (v18+)
- NPM or Yarn

### Step 1: Clone and Install Dependencies
```bash
# Install root & frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Configure Environment
Create a `.env` file in the root and `backend/` directories.

**Root/Frontend (`.env`):**
```env
VITE_API_BASE=http://localhost:5000
```

**Backend (`backend/.env`):**
```env
PORT=5000
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_SHORTCODE=...
```

### Step 3: Run the Ecosystem
```bash
### Default Test Accounts
For testing and demonstration, use the following credentials (Password: `Password123`):
- **Neba User**: `nebaware@gmail.com`
- **Temari User**: `temari@gmail.com`
- **Admin**: `admin@temariware.com`
- **Student**: `student@temariware.com`

---

## 📈 Future Expectations
- **Blockchain Verification**: Storing course certificates on-chain for tamper-proof credentials.
- **Offline Mesh Networking**: Allowing students to share notes in-campus without active internet.
- **Direct Employer Dashboard**: A dedicated portal for local tech companies to recruit directly from the talent pool.

---

### **Presentation Highlights**
- **Slogan**: "The Student Life, Digitized."
- **Focus**: The fusion of traditional values (Ekub) with futuristic AI (Gemini).
- **Local Impact**: Solving Ethiopian connectivity and payment friction natively.
