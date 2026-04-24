import { NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';
import { getDb } from '@/lib/firebase';
import { memoryStore } from '@/lib/memory-store';

// Simple calculation for Day Master element based on DOB for prototype
// For production, this should use a proper BaZi calendar library.
function calculateBaziElement(dob: string) {
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const date = new Date(dob);
  // Using a simple hash for prototype
  return elements[date.getTime() % 5];
}

export async function POST(req: Request) {
  try {
    const { dob } = await req.json();

    if (!dob) {
      return NextResponse.json({ error: 'Date of Birth is required' }, { status: 400 });
    }

    const baziElement = calculateBaziElement(dob);
    const model = getGeminiModel();

    const prompt = `
      You are the BaZi Profiler for Duit-Cerdas AI.
      Input: User's dominant Day Master element: ${baziElement}.

      Instructions:
      1. Map the element to its corresponding psychological trait and high-risk scam type.
      2. Draft an empathetic, 2-3 sentence explanation of their vulnerability for a Malaysian audience.
      3. Suggest a "Mental Firewall" (one actionable psychological defense mechanism).
      4. Output the response strictly in the provided JSON schema. No markdown formatting.

      MAPPING LOGIC:
      - Wood: High Empathy / Trusting. Vulnerable to Romance Scams, Fake Charities.
      - Fire: Impulsive / FOMO. Vulnerable to Get-Rich-Quick, Crypto.
      - Earth: Craves Security. Vulnerable to Fake Fixed Deposits.
      - Metal: Rule-Abiding. Vulnerable to Macau Scams, Fake Police.
      - Water: Fearful / Overthinking. Vulnerable to Phishing, "Account Locked" SMS.

      CRITICAL: The "risk_level" field MUST be exactly one of these three uppercase values: LOW, MODERATE, HIGH.
      Do not use any other values, capitalizations, or variations.
      - Wood, Water = MODERATE
      - Fire, Earth = HIGH
      - Metal = HIGH
    `;

    const fallbackProfile = {
      element: baziElement,
      core_trait: baziElement === 'Fire' ? 'Impulsive / FOMO' :
        baziElement === 'Earth' ? 'Craves Security' :
        baziElement === 'Metal' ? 'Rule-Abiding' :
        baziElement === 'Water' ? 'Fearful / Overthinking' :
        'High Empathy / Trusting',
      primary_vulnerability: baziElement === 'Fire' ? 'Get-Rich-Quick, Crypto' :
        baziElement === 'Earth' ? 'Fake Fixed Deposits' :
        baziElement === 'Metal' ? 'Macau Scams, Fake Police' :
        baziElement === 'Water' ? 'Phishing, "Account Locked" SMS' :
        'Romance Scams, Fake Charities',
      risk_level: (baziElement === 'Wood' || baziElement === 'Water') ? 'MODERATE' : 'HIGH',
      explanation: `Your ${baziElement} element suggests a distinct scam vulnerability. Stay calm and verify before acting on urgent financial requests.`,
      mental_firewall_tip: 'Pause, verify with a trusted channel, and never act on pressure.'
    };

    let profile = fallbackProfile;
    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      profile = JSON.parse(responseText.replace(/```json|```/g, ''));
    } catch (modelError: any) {
      console.warn('Gemini unavailable, using fallback profile:', modelError?.message || modelError);
    }

    // Normalize risk_level to exact DB constraint values
    const riskMap: Record<string, string> = {
      low: 'LOW', moderate: 'MODERATE', medium: 'MODERATE', high: 'HIGH',
    };
    profile.risk_level = riskMap[profile.risk_level?.toLowerCase()] ?? 'MODERATE';

    try {
      const db = getDb();
      // Save user to Firestore
      const userRef = await db.collection('users').add({
        dob,
        bazi_element: baziElement,
        risk_level: profile.risk_level,
        growthTokens: 0,
        createdAt: new Date().toISOString()
      });

      return NextResponse.json({
        userId: userRef.id,
        profile: {
          ...profile,
          element: baziElement
        }
      });
    } catch (dbError: any) {
      console.warn('Firestore unavailable, using in-memory store:', dbError?.message || dbError);
      const userId = crypto.randomUUID();
      memoryStore.setUser(userId, {
        dob,
        bazi_element: baziElement,
        risk_level: profile.risk_level,
        growthTokens: 0,
        createdAt: new Date().toISOString()
      });

      return NextResponse.json({
        userId,
        profile: {
          ...profile,
          element: baziElement
        }
      });
    }

  } catch (error: any) {
    console.error('Bazi Profiler Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
