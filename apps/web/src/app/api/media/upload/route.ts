import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase';
import { uploadMedia } from '@/lib/storage';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  // Upload to Supabase Storage (admin, bypasses RLS for storage operations)
  const { storageId, url } = await uploadMedia(userId, file);

  // Insert media record (user-scoped)
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('media')
    .insert({
      user_id: userId,
      storage_id: storageId,
      filename: file.name,
      mime_type: file.type,
      url,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}