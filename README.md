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

## Google Gemini Tools & APIs

This project integrates Google Generative AI for three core agents: BaZi Profiler, Scam Simulator, and Vision Analyzer. Below is a comprehensive reference of all Gemini models, functions, and API methods used.

### Gemini Models Overview

| Model | Purpose | Used In |
|-------|---------|---------|
| **gemini-1.5-flash** | Text generation, reasoning, vision analysis | BaZi Profiler, Scam Simulator, Vision Analyzer |
| **text-embedding-004** | Vector embeddings for RAG retrieval | Scam Simulator (similarity search) |

### Core Library Functions

All Gemini interactions are abstracted through `src/lib/gemini.ts`:

| Function | Signature | Purpose | Method |
|----------|-----------|---------|--------|
| **GoogleGenerativeAI()** | `new GoogleGenerativeAI(apiKey)` | SDK initialization | Client constructor |
| **getGeminiModel()** | `(modelName: string)` | Select and instantiate a Gemini model | `genAI.getGenerativeModel({ model })` |
| **generateEmbedding()** | `(text: string)` | Generate vector embeddings for semantic search | `model.embedContent(text)` with `text-embedding-004` |
| **analyzeImage()** | `(imageBuffer, mimeType, prompt)` | Vision analysis of uploaded files | `model.generateContent()` with multimodal input |

### Gemini API Methods

| API Method | Usage | Response Format |
|------------|-------|-----------------|
| **generateContent(prompt)** | Generate text responses from text/vision prompts | Text (parsed to JSON via `response.text()`) |
| **embedContent(text)** | Generate vector embeddings | Embedding vectors (1536-dimensional for `text-embedding-004`) |

### Per-Agent Gemini Integration

#### 1. BaZi Profiler Agent
**Location:** `src/app/api/agents/bazi-profile/route.ts`

| Component | Details |
|-----------|---------|
| **Model** | `gemini-1.5-flash` |
| **Method** | `generateContent(prompt)` |
| **Input** | Birth date + BaZi element mapping |
| **Output Schema** | JSON: `{ element, core_trait, primary_vulnerability, risk_level, explanation, mental_firewall_tip }` |
| **Purpose** | Generate personality profile and scam vulnerability assessment |

#### 2. Scam Simulator Agent (RAG Pipeline)
**Location:** `src/app/api/agents/simulate-quest/route.ts`

| Component | Details |
|-----------|---------|
| **Embedding Step** | `text-embedding-004` via `generateEmbedding()` |
| **Retrieval** | Supabase RPC `match_scam_patterns()` with pgvector cosine similarity (threshold: 0.5, top-3 results) |
| **Generation Model** | `gemini-1.5-flash` |
| **Method** | `generateContent(prompt)` with RAG context |
| **Output Schema** | JSON: `{ scenario_title, scammer_message, choices[] }` |
| **Purpose** | Generate personalized scam scenario based on user BaZi element |

#### 3. Vision Analyzer Agent
**Location:** `src/app/api/agents/analyze-shield/route.ts`

| Component | Details |
|-----------|---------|
| **Model** | `gemini-1.5-flash` |
| **Method** | `generateContent()` with multimodal input (image + text) |
| **Input** | Base64-encoded image buffer + fraud analysis prompt |
| **Output Schema** | JSON: `{ fraud_probability_score, risk_level, red_flags_identified[], explanation, recommended_action }` |
| **Purpose** | Analyze user-uploaded screenshots for fraud indicators |

#### 4. Reward Token Agent
**Location:** `src/app/api/agents/reward-token/route.ts`

| Component | Details |
|-----------|---------|
| **Gemini Usage** | None (non-AI logic using Supabase RPC only) |
| **Logic** | Choice validation and reward token increment |

### Configuration & Environment

| Parameter | Value | Location |
|-----------|-------|----------|
| **API Key** | `process.env.GEMINI_API_KEY` | `src/lib/gemini.ts` |
| **Default Model** | `gemini-1.5-flash` | `src/lib/gemini.ts` |
| **Embedding Model** | `text-embedding-004` | `src/lib/gemini.ts` |
| **RAG Similarity Threshold** | 0.5 (cosine distance) | `src/app/api/agents/simulate-quest/route.ts` |
| **RAG Result Limit** | 3 (top-3 scam patterns) | `src/app/api/agents/simulate-quest/route.ts` |
| **Response Format** | JSON (auto-parsed, markdown stripped) | All agent routes |

### Response Parsing Pattern

All agent responses are JSON, extracted from Gemini's markdown-wrapped output:
```typescript
JSON.parse(responseText.replace(/```json|```/g, ''))
```

**Note:** This pattern is fragile if Gemini changes output format. For production, use `response_mime_type: "application/json"` in the SDK.

---

For implementation details, architecture decisions, and prompt engineering strategies, see [CLAUDE.md](CLAUDE.md).
