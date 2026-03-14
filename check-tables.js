import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rsxsujawwndzaitirglk.supabase.co';
const supabaseAnonKey = 'sb_publishable_Xox03djDwJVdAHlVu1lRFQ__jGorphj';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  console.log('--- Checking check_ins ---');
  const { data: ciData, error: ciError } = await supabase.from('check_ins').select('*').limit(1);
  if (ciError) {
    console.error('check_ins Error:', ciError.message);
  } else {
    console.log('Successfully connected to check_ins');
  }

  console.log('\n--- Checking messages ---');
  const { data: msgData, error: msgError } = await supabase.from('messages').select('*').limit(1);
  if (msgError) {
    console.error('messages Error:', msgError.message);
  } else {
    console.log('Successfully connected to messages');
  }
}

checkTables();
