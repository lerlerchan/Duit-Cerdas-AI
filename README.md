# Duit-Cerdas AI: The Prosperity Path

[![Project 2030 Hackathon](https://img.shields.io/badge/Project%202030-Hackathon-yellow?style=flat&logo=github)](https://project2030.example)
[![Gemini](https://img.shields.io/badge/Gemini-1.5%20Flash-blue?style=flat&logo=google)](https://cloud.google.com/generative-ai)
[![Vertex AI](https://img.shields.io/badge/Vertex%20AI-Search-blue?style=flat&logo=googlecloud)](https://cloud.google.com/vertex-ai)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange?style=flat&logo=firebase)](https://firebase.google.com)
[![Cloud Functions](https://img.shields.io/badge/Cloud%20Functions-GoogleCloud-blue?style=flat&logo=googlecloud)](https://cloud.google.com/functions)
[![Supabase](https://img.shields.io/badge/Supabase-VectorDB-brightgreen?style=flat&logo=supabase)](https://supabase.com)


*A submission for the Project 2030: MyAI Future Hackathon.*

Duit-Cerdas AI is a culturally-resonant financial education and investment advisor that leverages **Four Pillars of Destiny (Bazi)** and **Fengshui** metaphors to gamify wealth management for the Malaysian B40 & M40 communities.

## Why this README update for judges
This README highlights all Google technologies used in the project (models, APIs, and infrastructure) and provides quick visual badges so judges can immediately verify the project's use of Google tools.

## Google tools & APIs used
- Google Gemini (gemini-1.5-flash / gemini-1.5-pro): text generation, reasoning and multimodal (vision) analysis — used by BaZi Profiler, Scam Simulator, and Vision Analyzer. See GEMINI.md for details.
- Vertex AI Search: retrieval/grounding for RAG pipelines (used to supplement Gemini with authoritative data).
- Firebase Authentication & Firestore: user auth and lightweight data storage used for session-related features.
- Google Cloud Functions: secure proxy for Gemini API calls and server-side reasoning.
- text-embedding-004: embedding model used to generate vectors for semantic search / RAG retrieval.

For implementation details, per-agent usage, and configuration notes, see: [GEMINI.md](GEMINI.md) and [CLAUDE.md](CLAUDE.md).

## Quick start
1. Copy `.env.example` → `.env` and fill required keys (see CLAUDE.md).
2. Run:
```bash
npm install
npm run dev
```

## Notes for judges
- All Google model usage is clearly documented in GEMINI.md. Embeddings are generated with `text-embedding-004` and RAG retrieval happens via Supabase + pgvector.
- Sensitive API keys are expected to be provided via environment variables and proxied through Cloud Functions in production.
- This project is educational and not financial advice.

## Contributors
- Gemini CLI (AI Agent)

