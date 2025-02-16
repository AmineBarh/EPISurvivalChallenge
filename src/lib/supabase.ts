import { createClient } from '@supabase/supabase-js';

// Temporary development values - these will be replaced when connecting to Supabase
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);