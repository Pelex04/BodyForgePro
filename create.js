import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://qeolxzekqsbjwohjwahs.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlb2x4emVrcXNiandvaGp3YWhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNzU5MjcsImV4cCI6MjA3ODg1MTkyN30.Dg-6ptI5gUFrNsPzIRcD476z7z87j8NjvIN5_azWnzg');

async function handLogin(email, password) {
  // 1. Login user
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    console.error('Login error:', loginError.message);
    return { success: false, message: loginError.message };
  }

  const user = loginData.user;
  if (!user) {
    return { success: false, message: 'No user returned' };
  }

  // 2. Check admin access
  const { data: adminCheck, error: adminError } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    

  if (adminError) {
    console.error('Admin check error:', adminError.message);
    return { success: false, message: 'Failed to check admin status' };
  }

  if (!adminCheck) {
    return { success: false, message: 'Unauthorized: Admin access required' };
  }

  // 3. Success
  return { success: true, message: 'Login successful as admin', user };
}

// Example usage:
handLogin('kingsleychideru1404@gmail.com', '1234567890').then(console.log);
