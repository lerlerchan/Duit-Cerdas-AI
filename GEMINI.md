# GEMINI.md: Duit-Cerdas AI Project Context

## Project Overview
**Duit-Cerdas AI: The Prosperity Path** is a FinTech and financial education platform designed for the Malaysian B40 and M40 communities. It uses a culturally-resonant approach, gamifying wealth management through **Bazi (Four Pillars of Destiny)** and **Fengshui** metaphors. The core objective is to lower psychological barriers to investing in BNM-recognized products like ASNB, EPF, and Gold, while providing AI-driven scam protection.

### Main Technologies
- **Intelligence Layer:** Google Gemini 1.5 Pro (Financial reasoning), Gemini 1.5 Flash (OCR/Chat), Vertex AI Search (Grounding with BNM/ASNB data).
- **Backend & Security:** Firebase Authentication, Firestore (NoSQL Database), Cloud Functions for secure API calls.
- **Project Context:** Part of the Project 2030 Hackathon (Track 5 - Secure Digital).

### Architecture Highlights
- **Bazi Profiling:** Gemini computes wealth elements from user DOB to map them to financial products.
- **Product-to-Element Mapping:** 
  - Wood: ASNB/Unit Trusts
  - Metal: Gold Accounts
  - Earth: EPF/REITs
  - Water: MMF/Savings
  - Fire: Equities
- **Bad Qi Scam Shield:** Real-time scam detection using Gemini to identify malicious patterns in text or URLs.

## Building and Running
*Note: The project is currently in the planning/early development stage. Explicit build and run commands are not yet established.*

- **TODO:** Initialize the frontend (React/Angular or Mobile framework as per PRD's mobile-friendly target).
- **TODO:** Set up Firebase project and CLI.
- **TODO:** Implement Cloud Functions for Gemini API integration.

## Development Conventions
- **Cultural Resonance:** All AI responses and UI elements should use the established "Wealth Garden," "Qi," and "Zodiac" metaphors.
- **Compliance & Safety:** 
  - Strictly educational; must include "not financial advice" disclaimers.
  - No collection of NRIC or banking passwords.
  - Focus on BNM/SC approved products only.
- **Security:** Use Cloud Functions to proxy Gemini API calls to protect sensitive logic and keys.

## Agent Team and Collaboration Model

### Team Composition (Balanced 6-Agent Team)
1. **Product Agent**
   - Owns user journey, feature scope, and PRD alignment.
   - Verifies each output supports B40/M40 accessibility and financial literacy goals.

2. **Prompt/AI Agent**
   - Designs Gemini prompts for Bazi profiling, recommendations, and scam analysis.
   - Enforces grounded, explainable, and educational response style.

3. **Backend/Firebase Agent**
   - Owns Firebase Auth, Firestore schema, and Cloud Functions integration.
   - Ensures secure API proxying for Gemini/Vertex calls and clean data contracts.

4. **Security/Compliance Agent**
   - Enforces "not financial advice" messaging and BNM/SC product boundaries.
   - Reviews privacy controls (no NRIC/password capture) and scam-shield safety behavior.

5. **UX/Cultural Agent**
   - Maintains Wealth Garden, Qi, and Zodiac metaphor consistency across UI and copy.
   - Localizes language and tone for Malaysian audiences without reducing clarity.

6. **QA Agent**
   - Validates feature flows, edge cases, and safety regressions.
   - Confirms that onboarding, recommendation, and scam-shield scenarios work end-to-end.

### Collaboration Workflow
1. **Product Agent** defines feature brief and acceptance criteria.
2. **Prompt/AI Agent** and **Backend/Firebase Agent** co-design logic and implementation boundaries.
3. **Security/Compliance Agent** performs guardrail review before feature sign-off.
4. **UX/Cultural Agent** refines user-facing language and metaphor consistency.
5. **QA Agent** runs end-to-end validation and reports issues.
6. Team loops back to responsible agent(s) until all criteria are met.

### Handoff Protocol
- Use explicit handoffs with three fields: **Input**, **Decision**, **Output**.
- Every major decision must record:
  - PRD requirement reference
  - Compliance impact
  - User-facing wording impact
- Block release if Security/Compliance or QA has unresolved critical findings.

### Conflict Resolution Rules
- **Scope conflict:** Product Agent is final decision maker.
- **Technical conflict:** Backend/Firebase Agent decides implementation path; Prompt/AI Agent decides model behavior constraints.
- **Safety/compliance conflict:** Security/Compliance Agent has veto authority.
- **Language/cultural conflict:** UX/Cultural Agent resolves with Product Agent alignment.

### Utilization Guide (When to Engage Each Agent)
- New feature planning: Product -> Prompt/AI + Backend/Firebase
- Any user-facing financial statement: Security/Compliance + UX/Cultural mandatory review
- Any model-output change: Prompt/AI + QA mandatory regression check
- Pre-release: QA final validation with Security/Compliance approval

## Key Files
- `PRD.md`: Full product requirements and technical roadmap.
- `GEMINI.md`: This file, providing high-level context for AI interactions.
