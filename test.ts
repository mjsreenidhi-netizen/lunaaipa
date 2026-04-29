import { createClient } from "./src/lib/supabase/client";
const supabase = createClient();
const newRealm = "work";
supabase.from('users').update({ current_realm: newRealm }).eq('id', '123');
