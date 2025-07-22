import { supabase } from './supabase'
import { User } from './supabase'

export interface AuthUser extends User {}

export async function signUp(email: string, password: string, username: string) {
  // First create the auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError
  if (!authData.user) throw new Error('Failed to create user')

  // Then create the user record in our users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert([
      {
        id: authData.user.id,
        username,
        email,
        password: '', // We don't store the actual password, Supabase handles auth
        role: 'USER'
      }
    ])
    .select()
    .single()

  if (userError) throw userError

  return userData
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  // Get user profile from our users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single()

  if (userError) throw userError

  return userData
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) return null

  return userData
}