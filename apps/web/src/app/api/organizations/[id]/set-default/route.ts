import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // Clear existing default
  await supabase
    .from('organizations')
    .update({ is_default: false })
    .eq('user_id', userId);

  // Set new default
  const { error } = await supabase
    .from('organizations')
    .update({ is_default: true })
    .eq('id', id);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}