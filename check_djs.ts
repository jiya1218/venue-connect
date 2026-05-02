import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lfkwwyeemrvwyahtzwji.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxma3d3eWVlbXJ2d3lhaHR6d2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MTM4MTAsImV4cCI6MjA5MjQ4OTgxMH0.LcGU0p3cYQIHWn2Z654MU7jOWyreKdoWNn62Iid35TY'
);

async function checkDJs() {
  console.log('Checking DJs in Junagadh...');
  const { data, error } = await supabase
    .from('vendors')
    .select('name, city, category, is_active')
    .ilike('city', '%Junagadh%');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Found ${data.length} vendors in Junagadh:`);
  data.forEach(v => {
    console.log(`- ${v.name} | Category: ${v.category} | Active: ${v.is_active} | City: ${v.city}`);
  });

  const djMatch = data.filter(v => v.category && v.category.toLowerCase().includes('dj'));
  console.log(`Found ${djMatch.length} DJs in Junagadh.`);
}

checkDJs();
