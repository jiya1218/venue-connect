const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env.local
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim().replace(/^"|"$/g, '');
  return acc;
}, {});

async function check() {
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  
  console.log("Checking table: leads");
  const { data, error } = await supabase.from('leads').select('*').limit(1);
  
  if (error) {
    console.error("Error reading leads:", error);
  } else {
    console.log("Leads columns:", data && data.length > 0 ? Object.keys(data[0]) : "No records found");
    if (data && data.length > 0) console.log("Leads sample:", data[0]);
  }

  process.exit(0);
}

check();
