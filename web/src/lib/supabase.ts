import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ypzbwfpaelaubmouqucx.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwemJ3ZnBhZWxhdWJtb3VxdWN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NDEwNTYsImV4cCI6MjA4OTExNzA1Nn0.tuJKqM5f4ZqJDv3pbu9zOBuTFlsJeITmusUwoF4Nxqw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
