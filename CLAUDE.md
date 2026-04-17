# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
node scripts/seed_scams.js  # Seed Supabase with scam pattern embeddings
```

## Environment Setup

Copy `.env.example` → `.env` and fill:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `GEMINI_API_KEY` — Google Gemini API key

Run `supabase/schema.sql` in Supabase SQL Editor before first use (enables `pgvector`, creates tables, creates `match_scam_patterns` RPC function).

## Architecture

**Stack:** Next.js 15 App Router · React 19 · Gemini 1.5 Flash · Supabase + pgvector · Tailwind CSS

### Request Flow

```
page.tsx (single-page, 3-step UI)
  └── Step 1: POST /api/agents/bazi-profile
        → calculateBaziElement(dob) → Gemini prompt → INSERT users → return profile + userId
  └── Step 2: POST /api/agents/simulate-quest
        → fetch user element → generateEmbedding() → match_scam_patterns RPC (cosine similarity)
        → Gemini prompt with RAG context → INSERT simulations → return scam scenario + choices
  └── (Scam Shield, separate): POST /api/agents/analyze-shield
        → multipart file upload → analyzeImage() → Gemini vision analysis → return fraud score
```

### Key Files

| Path | Role |
|------|------|
| `src/app/page.tsx` | Entire frontend — single page, 3-step wizard |
| `src/lib/gemini.ts` | Gemini SDK wrapper: `getGeminiModel`, `generateEmbedding`, `analyzeImage` |
| `src/lib/supabase.ts` | Supabase client singleton |
| `src/app/api/agents/bazi-profile/route.ts` | Agent 1: DOB → BaZi element → psychological profile |
| `src/app/api/agents/simulate-quest/route.ts` | Agent 2: RAG pipeline → personalized scam simulation |
| `src/app/api/agents/analyze-shield/route.ts` | Agent 3: Screenshot → multimodal fraud analysis |
| `supabase/schema.sql` | DB schema + `match_scam_patterns` vector similarity function |
| `agent/*.md` | Agent persona specs (prompt, schema, examples) |

### Database Tables

- `users` — stores DOB, BaZi element, risk level per session
- `scam_patterns` — RAG corpus; `embedding vector(1536)` for cosine similarity via pgvector
- `simulations` — persists generated quest scenarios per user

### BaZi Element Mapping

Current implementation uses a simple hash (`timestamp % 5`) — prototype only. For production, replace `calculateBaziElement()` in `bazi-profile/route.ts` with a proper BaZi calendar library.

Element → vulnerability: Wood=Romance/Charity, Fire=Crypto/FOMO, Earth=Fake FD/Ponzi, Metal=Macau/LHDN, Water=Phishing/Account-locked.

### Gemini Response Parsing

All three agents strip markdown fences before `JSON.parse`:
```ts
JSON.parse(responseText.replace(/```json|```/g, ''))
```
This is fragile — if Gemini changes output format, parsing breaks. Prefer `response_mime_type: "application/json"` in production.

### UI Design System

CSS classes `garden-card` and `primary-btn` defined in `src/app/globals.css`. "Wealth Garden" theme — green palette, Tailwind utility classes.
