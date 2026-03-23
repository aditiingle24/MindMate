🧠 MindMate — Student Mental Wellness Companion

"Your mind deserves care too."

MindMate is a free, private, full-stack mental health web application built specifically for Indian college students navigating the pressures of placement season. Unlike generic wellness apps, MindMate understands the unique stress of interviews, peer comparison, and academic pressure.
✨ Features
😊 Mood Tracker
Log your daily emotions with a single tap. Track patterns over time and understand your emotional rhythm throughout placement season.
📊 Stress Assessment
Based on the clinically validated Perceived Stress Scale (PSS-10) — not a random quiz. Get an instant score with personalized feedback and track your stress history over time.
🤖 AI Companion
A 24/7 mental wellness companion powered by Groq's Llama 3.3 70B — tuned specifically for placement season support. Get help with interview anxiety, study motivation, relaxation tips, or just someone to talk to.
📓 Daily Journal
Your completely private space to reflect, express, and process your thoughts. Tag your mood, write freely, and revisit past entries. Only you can see this.
🧘 Guided Relaxation
Three scientifically-backed breathing exercises:

Box Breathing — used by Navy SEALs to stay calm under pressure
4-7-8 Breathing — reduces anxiety and helps with sleep
Calm Breath — simple 5-5 pattern to reset your nervous system

🎙️ Voice Affirmations (Unique Feature)
Record your own calming voice notes and replay them whenever stress hits. Hearing your own voice during anxiety is proven to be more effective than reading text — triggering self-compassion and familiarity. Save up to 3 personal affirmations.
👤 User Profile
View your complete wellness journey — mood history, stress trends, most frequent emotions, and account management including password change.

🛠️ Tech Stack
Frontend

React.js (Vite) — component-based UI
React Router v6 — client-side routing with protected routes
Axios — API communication
MediaRecorder API — browser-native audio recording
CSS — custom design system with sky-blue theme

Backend

Node.js — runtime environment
Express.js — REST API framework
MongoDB Atlas — cloud NoSQL database
Mongoose — ODM for MongoDB
JWT — secure authentication
bcryptjs — password hashing
Groq SDK — AI chat integration

AI

Groq API — Llama 3.3 70B Versatile model
Custom system prompt tuned for placement season mental health support

Deployment

Vercel — frontend hosting with automatic CI/CD
Render — backend hosting with automatic CI/CD
MongoDB Atlas — cloud database (free tier)


📁 Project Structure
mindmate/
├── mindmate-frontend/          # React.js frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── Sidebar.jsx     # Collapsible navigation drawer
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── Login.jsx       # Authentication
│   │   │   ├── Register.jsx    # User registration
│   │   │   ├── Dashboard.jsx   # Main dashboard
│   │   │   ├── MoodTracker.jsx # Mood logging
│   │   │   ├── StressCheck.jsx # PSS stress assessment
│   │   │   ├── AIChat.jsx      # AI companion chat
│   │   │   ├── Journal.jsx     # Daily journal
│   │   │   ├── Relaxation.jsx  # Breathing exercises
│   │   │   ├── Affirmations.jsx# Voice affirmations
│   │   │   └── Profile.jsx     # User profile
│   │   ├── services/
│   │   │   └── api.js          # Axios instance with JWT interceptor
│   │   ├── styles.css          # Global design system
│   │   └── App.jsx             # Routes & protected route logic
│   └── vercel.json             # Vercel routing config
│
└── mindmate-backend/           # Node.js + Express backend
    ├── config/
    │   └── db.js               # MongoDB connection
    ├── middleware/
    │   └── authMiddleware.js   # JWT verification
    ├── models/
    │   ├── User.js             # User schema
    │   ├── Mood.js             # Mood entry schema
    │   ├── Stress.js           # Stress assessment schema
    │   ├── Journal.js          # Journal entry schema
    │   └── Affirmation.js      # Voice affirmation schema
    ├── routes/
    │   ├── authRoutes.js       # Register, login, change password
    │   ├── moodRoutes.js       # CRUD mood entries
    │   ├── stressRoutes.js     # Stress assessment
    │   ├── journalRoutes.js    # Journal CRUD
    │   ├── chatRoutes.js       # AI chat proxy
    │   └── affirmationRoutes.js# Voice affirmation storage
    └── server.js               # Express app entry point
