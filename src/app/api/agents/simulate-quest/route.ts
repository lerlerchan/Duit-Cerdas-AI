import { NextResponse } from 'next/server';
import { getGeminiModel, generateEmbedding } from '@/lib/gemini';
import { db } from '@/lib/firebase';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 1. Fetch user element and risk profile from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) throw new Error('User not found');

    const user = userDoc.data();
    if (!user) throw new Error('User data missing');

    // 2. RAG Pipeline: Vector Search in Firestore
    const queryEmbedding = await generateEmbedding(user.bazi_element + " scam vulnerability");

    const snapshot = await db.collection('scam_patterns')
      .findNearest({
        vectorField: 'embedding',
        queryVector: queryEmbedding,
        distanceMeasure: 'COSINE',
        limit: 3
      }).get();

    const ragContext = snapshot.docs.length > 0
      ? snapshot.docs.map(doc => doc.data().content).join('\n')
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

    // 4. Save simulation to Firestore for history
    await db.collection('simulations').add({
      userId: userId,
      scenario_title: simulation.scenario_title,
      scammer_message: simulation.scammer_message,
      choices: simulation.choices,
      createdAt: FieldValue.serverTimestamp()
    });

    return NextResponse.json(simulation);

  } catch (error: any) {
    console.error('Quest Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
