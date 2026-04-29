const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jkfstcaaufhkjzmjhtvk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprZnN0Y2FhdWZoa2p6bWpodHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NzczNTMsImV4cCI6MjA4NzM1MzM1M30.ESXhF2sJaoEsAfvOiKOvAfbnEK9E2rYVYyJmWSozoMk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAccount() {
  console.log("Attempting to sign up...");
  const { data, error } = await supabase.auth.signUp({
    email: 'mjsreenidhi@gmail.com',
    password: 'Sreenidhi@123',
  });

  if (error) {
    console.error("Sign up failed with error:");
    console.error(error);
  } else {
    console.log("Sign up successful!");
    console.log("Session:", data.session ? "Yes" : "No");
  }
}

createAccount();
