import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zhcesrmbjmxfnsuejity.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoY2Vzcm1iam14Zm5zdWVqaXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNTk4NTAsImV4cCI6MjA2ODczNTg1MH0.GbdirWxTlzI7Ka9RWuMkHPL5n1uyz84-6KgwYRd1fZA'

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types
export interface User {
  id: string
  username: string
  email: string
  role: 'USER' | 'ADMIN'
  created_at: string
}

export interface Comic {
  id: string
  title: string
  slug: string
  author: string
  synopsis: string
  status: 'ONGOING' | 'COMPLETED'
  cover_image_url: string
  genres: string[]
  created_at: string
  updated_at: string
}

export interface Chapter {
  id: string
  chapter_number: number
  title: string
  comic_id: string
  created_at: string
  comic?: Comic
}

export interface Page {
  id: string
  page_number: number
  image_url: string
  chapter_id: string
}