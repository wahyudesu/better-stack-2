import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createUserClient } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { name, logoUrl } = await req.json();

  const supabase = createUserClient(userId);
  const { error } = await supabase
    .from('organizations')
    .update({ name, logo_url: logoUrl })
    .eq('id', id);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}