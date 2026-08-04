import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://qgfkmrteawypowbqpysc.supabase.co/"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnZmttcnRlYXd5cG93YnFweXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NjQxNzYsImV4cCI6MjEwMTM0MDE3Nn0.PVm7OCzOPsT79hzxehvce3t3wgWEWCpgWifqGBbYYyg"

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)