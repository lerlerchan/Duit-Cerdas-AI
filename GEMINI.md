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

## Key Files
- `PRD.md`: Full product requirements and technical roadmap.
- `GEMINI.md`: This file, providing high-level context for AI interactions.
