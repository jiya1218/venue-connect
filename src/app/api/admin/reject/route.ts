import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const id = formData.get('id') as string;
  const type = formData.get('type') as string;
  if (!id || !type) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: 'DB error' }, { status: 500 });

  const table = type === 'venue' ? 'venues' : 'vendors';
  await supabase.from(table).update({ is_active: false }).eq('id', id);

  return NextResponse.redirect(new URL('/admin/pending', req.url));
}
