import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createUserClient } from '@/lib/db';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createUserClient(userId);
  const { data, error } = await supabase
    .from('users')
    .select('api_key, last_synced_at')
    .eq('clerk_id', userId)
    .single();

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}