import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iahmhdxbvbmdhaloxyae.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhaG1oZHhidmJtZGhhbG94eWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4ODM4NjIsImV4cCI6MjA2MjQ1OTg2Mn0.kEAfQTXlgAmElu_zCe5bsU0Ncgz2Wp-PGvupXAFfcZw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)