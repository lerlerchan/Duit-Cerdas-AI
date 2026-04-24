import { NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No screenshot file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type;

    const prompt = `
      You are the Vision Analyzer Agent for "Duit-Cerdas AI".
      Analyze this screenshot for digital fraud targeting Malaysians.

      INSTRUCTIONS:
      1. Extract and analyze visible text.
      2. Look for Malaysian scam indicators (LHDN/PDRM impersonation, strange bit.ly links, mule account requests).
      3. Assign a Fraud Probability Score (0-100).
      4. Categorize Risk Level (LOW, MEDIUM, HIGH).
      5. Provide a simple explanation and immediate recommended action.
      6. Output strictly in the provided JSON schema. No markdown formatting.
    `;

    const fallbackAnalysis = {
      fraud_probability_score: 50,
      risk_level: 'MEDIUM',
      red_flags_identified: [
        'Urgent language',
        'Unverified sender'
      ],
      explanation: 'We could not complete AI analysis. Treat this as suspicious and verify via official channels.',
      recommended_action: 'Do not click links or share OTP. Verify using official hotlines.'
    };

    let analysis = fallbackAnalysis;
    try {
      const responseText = await analyzeImage(buffer, mimeType, prompt);
      analysis = JSON.parse(responseText.replace(/```json|```/g, ''));
    } catch (modelError: any) {
      console.warn('Gemini unavailable, using fallback analysis:', modelError?.message || modelError);
    }

    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error('Vision Analysis Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
