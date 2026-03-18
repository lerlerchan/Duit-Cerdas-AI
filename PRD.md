
# Product Requirements Document (PRD): Duit-Cerdas AI

## Project Information
- **Project Name:** Duit-Cerdas AI: The Prosperity Path
- **Hackathon Track:** Track 5 - Secure Digital (FinTech & Security)
- **Target Audience:** Malaysian B40 & M40 communities, young professionals, and non-techsavvy citizens
- **Version:** 1.0 (Project 2030 Hackathon Build)

## 1. Executive Summary
Duit-Cerdas AI is a culturally-resonant financial education and investment advisor that leverages **Four Pillars of Destiny (Bazi)** and **Fengshui** metaphors to gamify wealth management. It lowers the psychological barrier to investing in **BNM-recognized** products (ASNB, EPF, Gold) while providing secure, scam-aware financial guidance powered by Google Gemini.

## 2. Goals & Objectives
1. **Financial Inclusion:** Increase participation in National Trust Funds (ASNB).
2. **Digital Sovereignty:** Promote local investment products.
3. **Security Education:** Teach scam awareness using cultural metaphors.
4. **AI Mastery:** Utilize Gemini, Vertex AI, Firebase.

## 3. Core Features
### 3.1 Elemental Wealth Garden (Bazi Profiling)
- User inputs DOB.
- Gemini computes Day Master + Five Element strengths.
- Visualized as a radar chart.
- Identifies weak elements and maps them to financial actions.

### 3.2 Product-to-Element Mapping
- **Wood (Growth):** ASNB, Unit Trusts
- **Fire (Venture):** Equity funds, managed portfolios
- **Earth (Stability):** EPF, FD, REITs
- **Metal (Value):** Gold Investment Accounts
- **Water (Liquidity):** MMF, digital savings

### 3.3 Zodiac of the Month
- Monthly automated insights.
- Wealth forecast per Chinese Zodiac.
- Actionable guidance (e.g., strengthen Earth via EPF).

### 3.4 Festive "Harvest Mode"
- Triggered during CNY, Raya, Deepavali.
- Helps manage windfalls (Angpow/Duit Raya).
- Suggests allocating 50% into ASNB.

### 3.5 Bad Qi Scam Shield
- Users paste suspicious text/URLs.
- Gemini identifies scam patterns.
- Labels threats as "Negative Qi" or "Cunning Snakes".

## 4. Technical Architecture
### 4.1 Intelligence Layer
- **Gemini 1.5 Pro:** Financial reasoning, Bazi, multilingual.
- **Gemini 1.5 Flash:** Fast OCR and chat.
- **Vertex AI Search:** Grounding with BNM/ASNB data.

### 4.2 Backend & Security
- Firebase Auth
- Firestore encrypted NoSQL
- Cloud Functions for secure API calls

## 5. User Journey
1. Onboarding → Enter DOB
2. Discovery → Wealth Destiny + Element Balance
3. Education → Explore Garden
4. Action → Links to official portals
5. Protection → Scam Shield
6. Engagement → Monthly Zodiac notifications

## 6. Constraints & Compliance
- Not financial advice (education only)
- BNM/SC product alignment
- No NRIC or bank password collection

## 7. Success Metrics
- Engagement: Monthly zodiac views
- Conversion: Clicks to ASNB/EPF
- Security Literacy: Scam detection attempts
