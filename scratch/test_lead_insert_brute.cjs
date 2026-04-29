const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim().replace(/^"|"$/g, '');
  return acc;
}, {});

async function testInsert() {
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  
  const statuses = ['pending', 'new', 'contacted', 'closed'];
  for (const s of statuses) {
      console.log(`Attempting test insert into leads with status '${s}'...`);
      const { data, error } = await supabase.from('leads').insert([
        {
          listing_id: 'b8176090-4ad0-471e-ab1a-d840cdbef269',
          listing_type: 'venue',
          customer_name: 'Test Bot',
          customer_email: 'test@example.com',
          customer_phone: '1234567890',
          message: 'Test message',
          status: s
        }
      ]).select();

      if (error) {
        console.error(`Status '${s}' Failed:`, error.message);
      } else {
        console.log(`Status '${s}' Success!`);
        await supabase.from('leads').delete().eq('id', data[0].id);
      }
  }

  process.exit(0);
}

testInsert();
