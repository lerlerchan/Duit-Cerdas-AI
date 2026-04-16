import { NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

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
    const model = getGeminiModel("gemini-1.5-flash");

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
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const profile = JSON.parse(responseText.replace(/```json|```/g, ''));

    // Save user to Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([
        { 
          dob, 
          bazi_element: baziElement,
          risk_level: profile.risk_level 
        }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({
      userId: data[0].id,
      profile: {
        ...profile,
        element: baziElement
      }
    });

  } catch (error: any) {
    console.error('Bazi Profiler Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
