import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

async function getCounts() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  const { count: venues } = await supabase.from('venues').select('*', { count: 'exact', head: true });
  const { count: vendors } = await supabase.from('vendors').select('*', { count: 'exact', head: true });
  const { count: cities } = await supabase.from('locations').select('*', { count: 'exact', head: true });
  
  console.log(JSON.stringify({ venues, vendors, cities }));
}

getCounts();
