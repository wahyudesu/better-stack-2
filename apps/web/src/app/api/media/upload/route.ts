import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { uploadMedia } from '@/lib/storage';
import { createUserClient } from '@/lib/db';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const { storageId, url } = await uploadMedia(userId, file);

  const supabase = createUserClient(userId);
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