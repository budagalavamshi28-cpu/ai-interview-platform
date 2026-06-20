# PrepAI — AI Mock Interview Platform

A full-stack web app that runs voice-driven mock interviews. The AI asks short, role-specific questions out loud, listens to your spoken answer, and replies like a real interviewer — then scores you with actionable feedback.

🔗 Live demo: https://ai-interview-platform-ten-eosin.vercel.app/

## Features
- AI speaks questions and listens to answers (browser Speech API — no extra cost)
- Conversational AI feedback, not just a score
- Role + interview type selection (Technical / Behavioral / Domain / Mixed)
- JWT auth, MongoDB-backed sessions, score tracking

## Tech Stack
**Frontend:** React, Web Speech API
**Backend:** Node.js, Express, MongoDB, JWT
**AI:** Groq API (Llama 3.1 / 3.3)

## Run Locally
```bash
# Backend
cd backend
npm install
# add .env: GROQ_API_KEY, MONGO_URI, JWT_SECRET, PORT
node server.js

# Frontend
cd client
npm install
npm run dev
```

## License
MIT
