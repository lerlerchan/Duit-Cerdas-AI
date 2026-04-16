# Product Requirements Document (PRD): Duit-Cerdas AI
**Hackathon:** UTM Hackathon (Project 2030)
**Theme:** Digital Fraud & Real-Time Protection Layers
**Target Audience:** Malaysian B40 demographic

---

## 1. Problem Statement & Impact
* **The Problem:** Malaysian citizens lose millions annually to sophisticated digital fraud. The B40 demographic is specifically targeted using psychological triggers (fear, greed, authority). Current solutions are generic and reactive.
* **Relevance to Malaysia 2030:** Duit-Cerdas AI directly supports the National Agenda by building a resilient digital economy and empowering the B40 community. It shifts the demographic from being vulnerable "technology consumers" to educated digital citizens equipped with advanced, proactive defense mechanisms.
* **Real-World Potential:** By gamifying cybersecurity training based on psychological profiles, we drastically reduce the friction of financial literacy, protecting the wealth of vulnerable communities.

## 2. Solution Overview & Innovation
* **Originality & Unfair Advantage (The "Wow" Factor):** We introduce **Cyber-Psychology Profiling via BaZi**. By mapping traditional Four Pillars of Destiny elements to psychological vulnerabilities (e.g., Fire = Impulsive/FOMO, Metal = Deferential to Authority), we offer a culturally resonant, highly personalized approach that has never been applied to cybersecurity.
* **Creative Use of Technology:** We are not just providing a static quiz. Using the Gemini API, users are dropped into a dynamic, real-time "AI Quest" that actively attempts to scam them in a safe sandbox using highly localized Manglish and current threat tactics.

## 3. Technical Architecture
* **Core Stack:** Next.js (Frontend), Node.js/Express (Backend), Google Gemini API.
* **Advanced Architecture (RAG System):** * We will implement a lightweight Retrieval-Augmented Generation (RAG) pipeline. 
    * **How it works:** When generating a scam simulation, the system retrieves data from a vector database populated with *recent, real-world Malaysian scam reports* (e.g., recent Macau scam scripts, fake Shopee job offers). The Gemini model uses this retrieved context + the user's BaZi vulnerability profile to generate the most relevant, dangerous simulation possible.
* **Multimodal Input:** The "Shield Utility" feature uses `gemini-1.5-flash` or `gemini-pro-vision` to allow users to upload screenshots of suspicious WhatsApp messages for real-time risk scoring, proving multimodal capability.

## 4. UI/UX & Accessibility
* **Design System:** Tailwind CSS will be used to ensure a clean, modern, and highly responsive interface across mobile and desktop. 
* **User Experience Flow:** 1. **Onboarding:** Simple date-of-birth input (low friction).
    2. **Insight:** Immediate reveal of their psychological "Scam Vulnerability."
    3. **Action:** A one-click entry into the gamified "AI Quest."
* **Accessibility:** High-contrast color palettes, large typography for older B40 demographics, and clear, simple language. 

## 5. Code Quality & Security
* **Best Practices:** * Strict use of `.env` files for Gemini API keys (No hardcoded secrets).
    * Modular component structure in React/Next.js.
    * Input validation on all forms to prevent injection attacks.
* **Documentation:** A comprehensive `README.md` will be included in the GitHub repository, featuring:
    * Architecture diagram (showing the RAG flow).
    * Step-by-step local setup instructions.
    * Explicit breakdown of how the Gemini API was utilized.

## 6. Minimum Viable Product (MVP) Features
* **Feature 1: The Profiler Engine** Calculates the user's BaZi Day Master and generates their "Cyber-Psychology Profile."
* **Feature 2: Dynamic Scam Simulator** A chat interface where the Gemini AI acts as a scammer tailored to the user's profile, providing an interactive "Verify, Ignore, or Fall for it" game loop.
* **Feature 3: Real-Time Screenshot Analyzer** Users can upload images of suspicious messages for the AI to parse and highlight red flags.