import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gflsflxbybdmotfcprwg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmbHNmbHhieWJkbW90ZmNwcndnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMTIwODAsImV4cCI6MjA2MzY4ODA4MH0.aJK2BghZ5RwAOUJzDbqZTQ9DFwFybxJzXEjDAYWlQAY'

export const supabase = createClient(supabaseUrl, supabaseKey)

