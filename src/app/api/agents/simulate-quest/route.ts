import { NextResponse } from 'next/server';
import { getGeminiModel, generateEmbedding } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 1. Fetch user element and risk profile
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('bazi_element, risk_level')
      .eq('id', userId)
      .single();

    if (userError || !user) throw new Error('User not found');

    // 2. RAG Pipeline: Fetch latest scam patterns from Supabase
    // We'll search based on the user's vulnerability type
    const queryEmbedding = await generateEmbedding(user.bazi_element + " scam vulnerability");
    
    const { data: scamPatterns, error: ragError } = await supabase.rpc('match_scam_patterns', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 3
    });

    if (ragError) throw ragError;

    const ragContext = scamPatterns && scamPatterns.length > 0 
      ? scamPatterns.map((p: any) => p.content).join('\n')
      : "General phishing and financial scam tactics in Malaysia.";

    // 3. Generate the AI Quest
    const model = getGeminiModel("gemini-1.5-flash");
    const prompt = `
      You are the Game Master for "Duit-Cerdas AI", a cybersecurity simulation for the Malaysian B40 demographic.

      INPUT:
      - Psychological vulnerability: Based on the ${user.bazi_element} element (${user.risk_level}).
      - Recent Scam Context (RAG): ${ragContext}.

      INSTRUCTIONS:
      1. Generate a realistic 'Scam Message' based on the context designed to trigger the user's vulnerability.
      2. Use Malaysian colloquialisms (Manglish, "bro", "RM", "tolong", "bossku"). Keep it under 50 words.
      3. Generate three choices for the user (A: Fall For It, B: Block/Ignore, C: Verify).
      4. For each choice, provide feedback explaining the red flag or positive action.
      5. Output strictly in the provided JSON schema. No markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const simulation = JSON.parse(responseText.replace(/```json|```/g, ''));

    // 4. Save simulation to Supabase for history
    await supabase.from('simulations').insert([
      {
        user_id: userId,
        scenario_title: simulation.scenario_title,
        scammer_message: simulation.scammer_message,
        choices: simulation.choices
      }
    ]);

    return NextResponse.json(simulation);

  } catch (error: any) {
    console.error('Quest Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
