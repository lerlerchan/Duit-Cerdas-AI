# Security & Compliance Review: Duit-Cerdas AI

## Project Overview
**Duit-Cerdas AI: The Prosperity Path** is a FinTech/educational platform for Malaysian B40/M40 communities. It utilizes cultural metaphors (Bazi/Fengshui) for financial literacy and scam protection.

## Security Controls Review

### 1. Data Privacy & Minimization
- **Finding:** The PRD explicitly states "No collection of NRIC or banking passwords."
- **Analysis:** This is a strong privacy-first approach that reduces the platform's risk profile as a target for data breaches.
- **Recommendation:** Implement strict validation to ensure users don't inadvertently input sensitive data (e.g., regex checks for NRIC-like patterns in chat/OCR).

### 2. Financial Compliance
- **Finding:** The project identifies as an "educational and investment advisor" but also includes a "not financial advice" constraint.
- **Analysis:** This is critical to avoid regulatory issues with BNM (Bank Negara Malaysia) and SC (Securities Commission).
- **Recommendation:** Ensure every AI-generated recommendation includes a clear, culturally-resonant disclaimer (e.g., "The Wisdom of the Garden is for growth; consult a financial master for official rites.").

### 3. API Security & Key Protection
- **Finding:** Planned use of Cloud Functions to proxy Gemini API calls.
- **Analysis:** This prevents the exposure of API keys in the client-side code (frontend).
- **Recommendation:** Use Firebase App Check to ensure only the official frontend can call the Cloud Functions.

### 4. Scam Shield Reliability (Bad Qi Scam Shield)
- **Finding:** Users can paste suspicious text/URLs for Gemini analysis.
- **Analysis:** While useful, LLM-based scam detection can have false negatives/positives.
- **Recommendation:** Augment Gemini's reasoning with external scam databases (e.g., SemakMule) or Vertex AI Search grounded in official BNM alerts.

### 5. Grounding & Accuracy
- **Finding:** Vertex AI Search for grounding with BNM/ASNB data.
- **Analysis:** Essential for ensuring the AI doesn't hallucinate investment terms or products.
- **Recommendation:** Regularly update the grounding corpus to include the latest BNM/SC warnings and product circulars.

## Security Architecture Summary (Proposed)
| Feature | Security Layer | Purpose |
| :--- | :--- | :--- |
| **Bazi Profiling** | Data Minimization | Only DOB used; no PII. |
| **API Calls** | Cloud Functions Proxy | Key protection & backend logic hiding. |
| **Storage** | Firestore Rules | Ensure users can only read/write their own profiles. |
| **Scam Shield** | Gemini + Vertex Search | Multi-layered verification. |

## Conclusion
The current design is highly security-conscious and aligns well with the "Secure Digital" hackathon track. The primary risks are regulatory (misinterpretation as advice) and operational (hallucinations). Mitigation strategies are well-defined in the initial planning.
