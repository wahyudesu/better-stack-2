import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { apiKey } = await req.json();

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('users')
    .update({ api_key: apiKey })
    .eq('clerk_id', userId);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}