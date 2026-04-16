# Duit-Cerdas AI: The Prosperity Path

*A submission for the Project 2030: MyAI Future Hackathon.*

Duit-Cerdas AI is a culturally-resonant financial education and investment advisor that leverages **Four Pillars of Destiny (Bazi)** and **Fengshui** metaphors to gamify wealth management for the Malaysian B40 & M40 communities.

## Contributors
- Gemini CLI (AI Agent)

## Getting Started

### 1. Setup Environment
Copy `.env.example` to `.env` and fill in your keys:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`

### 2. Initialize Database
Execute the SQL in `supabase/schema.sql` in your Supabase SQL Editor.
Then, run the seeding script to populate scam patterns for RAG:
```bash
node scripts/seed_scams.js
```

### 3. Run Development Server
```bash
npm install
npm run dev
```

## Architecture
- **Frontend/Backend:** Next.js (App Router)
- **AI Engine:** Google Gemini 1.5 Flash (Profiler, Vision Analyzer, Game Master)
- **Vector DB:** Supabase with `pgvector` for RAG-based scam simulation
- **Styling:** Tailwind CSS with "Wealth Garden" design system

## Features
1. **BaZi Profiler:** Maps DOB to personality-based scam vulnerabilities.
2. **AI Quest (RAG):** Dynamic, localized scam simulations using latest PDRM/BNM threat data.
3. **Scam Shield:** Multimodal screenshot analysis for real-time risk scoring.
