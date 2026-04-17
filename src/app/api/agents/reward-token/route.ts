import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { FieldValue } from 'firebase-admin/firestore';

// Choices B (Ignore) and C (Verify) are the correct defensive actions
const CORRECT_CHOICES = new Set(['B', 'b']);
const VERIFY_CHOICES = new Set(['C', 'c']);

export async function POST(req: Request) {
  try {
    const { userId, choiceId } = await req.json();

    if (!userId || !choiceId) {
      return NextResponse.json(
        { error: 'userId and choiceId are required' },
        { status: 400 }
      );
    }

    const isCorrect = CORRECT_CHOICES.has(choiceId) || VERIFY_CHOICES.has(choiceId);

    if (!isCorrect) {
      return NextResponse.json({ rewarded: false, growth_tokens: null });
    }

    // Update tokens in Firestore
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      growthTokens: FieldValue.increment(1)
    });

    const updatedDoc = await userRef.get();
    const growthTokens = updatedDoc.data()?.growthTokens;

    return NextResponse.json({ rewarded: true, growth_tokens: growthTokens });

  } catch (error: any) {
    console.error('Reward Token Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
