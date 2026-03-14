import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rsxsujawwndzaitirglk.supabase.co';
const supabaseAnonKey = 'sb_publishable_Xox03djDwJVdAHlVu1lRFQ__jGorphj';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  console.log('--- Testing check_ins INSERT ---');
  const { data: ciData, error: ciError } = await supabase
    .from('check_ins')
    .insert([{
      name: 'Test Knight',
      avatar: 'Felix',
      task: 'Day 01: Test',
      url: 'https://test.com',
      report: 'Test report'
    }])
    .select();

  if (ciError) {
    console.error('check_ins Insert Error:', ciError.message, ciError.code, ciError.details);
  } else {
    console.log('check_ins Insert Successful:', ciData);
  }

  console.log('\n--- Testing messages INSERT ---');
  const { data: msgData, error: msgError } = await supabase
    .from('messages')
    .insert([{
      user_name: 'Test Knight',
      avatar: 'Felix',
      content: 'Testing message',
      msg_type: 'user'
    }])
    .select();

  if (msgError) {
    console.error('messages Insert Error:', msgError.message, msgError.code, msgError.details);
  } else {
    console.log('messages Insert Successful:', msgData);
  }
}

testInsert();
