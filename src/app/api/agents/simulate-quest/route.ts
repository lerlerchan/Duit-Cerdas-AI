import { NextResponse } from 'next/server';
import { getGeminiModel, generateEmbedding } from '@/lib/gemini';
import { getDb } from '@/lib/firebase';
import { memoryStore } from '@/lib/memory-store';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let user: any;
    let db = null as ReturnType<typeof getDb> | null;
    let ragContext = "General phishing and financial scam tactics in Malaysia.";

    try {
      db = getDb();
      // 1. Fetch user element and risk profile from Firestore
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) throw new Error('User not found');

      user = userDoc.data();
      if (!user) throw new Error('User data missing');

      // 2. RAG Pipeline: Vector Search in Firestore
      const queryEmbedding = await generateEmbedding(user.bazi_element + " scam vulnerability");

      const snapshot = await db.collection('scam_patterns')
        .findNearest({
          vectorField: 'embedding',
          queryVector: FieldValue.vector(queryEmbedding),
          distanceMeasure: 'COSINE',
          limit: 3
        }).get();

      if (snapshot.docs.length > 0) {
        ragContext = snapshot.docs.map(doc => doc.data().content).join('\n');
      }
    } catch (dbError: any) {
      console.warn('Firestore unavailable, using in-memory store:', dbError?.message || dbError);
      user = memoryStore.getUser(userId);
      if (!user) {
        throw new Error('User not found');
      }
    }

    // 3. Generate the AI Quest
    const model = getGeminiModel();
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

    const fallbackSimulation = {
      scenario_title: 'Suspicious Bonus Alert',
      scammer_message: 'Bossku, your bonus RM500 pending. Click link to confirm now, cepat.',
      choices: [
        { id: 'A', action_text: 'Click the link and claim the bonus', feedback: 'Scammers use urgency and rewards to trap victims. Never click unknown links.' },
        { id: 'B', action_text: 'Ignore and block the sender', feedback: 'Good move. Blocking removes future contact from this scammer.' },
        { id: 'C', action_text: 'Verify with the official company hotline', feedback: 'Best practice. Verify using trusted channels before acting.' }
      ]
    };

    let simulation = fallbackSimulation;
    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      simulation = JSON.parse(responseText.replace(/```json|```/g, ''));
    } catch (modelError: any) {
      console.warn('Gemini unavailable, using fallback simulation:', modelError?.message || modelError);
    }

    // 4. Save simulation to Firestore for history when available
    if (db) {
      try {
        await db.collection('simulations').add({
          userId: userId,
          scenario_title: simulation.scenario_title,
          scammer_message: simulation.scammer_message,
          choices: simulation.choices,
          createdAt: FieldValue.serverTimestamp()
        });
      } catch (persistError: any) {
        console.warn('Skipping simulation persistence: Firestore unavailable.', persistError?.message || persistError);
      }
    }

    return NextResponse.json(simulation);

  } catch (error: any) {
    console.error('Quest Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
