import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { text, platforms, scheduledAt, mediaUrls, accountIds, profileId } = body;

  // Create post via Zernio API
  const zernioRes = await fetch(`${process.env.ZERNIO_API_URL}/posts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.ZERNIO_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, platforms, scheduledAt, mediaUrls, accountIds, profileId }),
  });

  if (!zernioRes.ok) return NextResponse.json({ error: 'Zernio API error' }, { status: 502 });

  const zernioPost = await zernioRes.json();

  // Write to Supabase
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('posts')
    .insert({
      text,
      platforms,
      status: scheduledAt ? 'scheduled' : 'draft',
      scheduled_at: scheduledAt,
      media_urls: mediaUrls ?? [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ postId: data.id, externalId: zernioPost.externalId });
}