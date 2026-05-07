import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('social_accounts')
    .select('*')
    .order('connected_at', { ascending: false });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { accountId } = await req.json();

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('social_accounts')
    .delete()
    .eq('id', accountId);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}