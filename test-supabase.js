import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rsxsujawwndzaitirglk.supabase.co';
const supabaseAnonKey = 'sb_publishable_Xox03djDwJVdAHlVu1lRFQ__jGorphj';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  const { data, error } = await supabase.from('_test_connection_').select('*').limit(1);
  if (error) {
    console.log('Error Code:', error.code);
    console.log('Error Message:', error.message);
  } else {
    console.log('Connection Successful (or table missing but authenticated)');
  }
}

testConnection();
