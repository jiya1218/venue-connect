import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rnnqtzbgqiwovrljzzem.supabase.co'
const supabaseKey = 'sb_publishable_pVcLdHwPSVxocD6hoxrO8A_baslKGLo'
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkData() {
    const { data: apps, error } = await supabase.from('venue_applications').select('*')
    console.log("Apps:")
    console.log(apps, error)
}

checkData()
