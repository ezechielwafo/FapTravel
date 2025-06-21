import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://alfogamlxkrhrhwuotbl.supabase.co'; // Ex: 'https://abcdefgh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsZm9nYW1seGtyaHJod3VvdGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NTM4MTgsImV4cCI6MjA2NjAyOTgxOH0.60I5sQBzygbaPGREWye_LBd8Zq2iwzlTJbsRoOULJDY'; // Ex: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

