import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://natqtsjydrpkrmhtikgu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHF0c2p5ZHJwa3JtaHRpa2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzUzNjYsImV4cCI6MjA2NjcxMTM2Nn0.zoJFCY7dcC8Fi_G816Lrld96ZBJKWU6JFcFrTj309vI'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);