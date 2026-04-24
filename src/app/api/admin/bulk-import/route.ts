import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ success: false, errors: ['No file provided'] }, { status: 400 });

  const text = await file.text();
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return NextResponse.json({ success: false, errors: ['CSV is empty'] }, { status: 400 });

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const requiredCols = ['city', 'city_slug', 'area', 'area_slug', 'state'];
  const missing = requiredCols.filter(c => !headers.includes(c));
  if (missing.length) return NextResponse.json({ success: false, errors: [`Missing columns: ${missing.join(', ')}`] }, { status: 400 });

  const rows = lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = vals[i] ?? ''; });
    return row;
  });

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ success: false, errors: ['DB error'] }, { status: 500 });

  const toInsert = rows.map(r => ({
    city: r.city, city_slug: r.city_slug,
    area: r.area, area_slug: r.area_slug,
    state: r.state,
    lat: r.lat ? parseFloat(r.lat) : null,
    lng: r.lng ? parseFloat(r.lng) : null,
  }));

  const { error, count } = await supabase.from('locations').upsert(toInsert, { onConflict: 'id', count: 'exact' });
  if (error) return NextResponse.json({ success: false, errors: [error.message] }, { status: 500 });

  return NextResponse.json({ success: true, inserted: count ?? toInsert.length });
}
