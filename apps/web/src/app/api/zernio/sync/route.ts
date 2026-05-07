import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { syncFromZernio } from '@/lib/api/zernio';

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const result = await syncFromZernio(userId);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sync failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}