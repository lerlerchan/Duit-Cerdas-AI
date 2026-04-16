import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    const { data, error } = await supabase.rpc('increment_growth_tokens', {
      user_id_input: userId,
    });

    if (error) throw error;

    return NextResponse.json({ rewarded: true, growth_tokens: data });

  } catch (error: any) {
    console.error('Reward Token Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
