import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xywepkydqfrjhjlbksya.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5d2Vwa3lkcWZyamhqbGJrc3lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NjU4ODgsImV4cCI6MjA4OTQ0MTg4OH0.rP5CT7guzikfq8gqusFkcqnq4YlZsIEbFMEZnCAO0gg'

export const supabase = createClient(supabaseUrl, supabaseKey)