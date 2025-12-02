import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signUp = async (email, password, userData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Database helpers
export const getClasses = async () => {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

export const getTrainers = async () => {
  const { data, error } = await supabase
    .from('trainers')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

export const getMembershipPlans = async () => {
  const { data, error } = await supabase
    .from('membership_plans')
    .select('*')
    .order('price', { ascending: true })
  return { data, error }
}

export const bookClass = async (userId, classId, bookingDate, bookingTime) => {
  const { data, error } = await supabase
    .from('class_bookings')
    .insert([
      { user_id: userId, class_id: classId, booking_date: bookingDate, booking_time: bookingTime }
    ])
    .select()
  return { data, error }
}

export const bookTrainerSession = async (userId, trainerId, sessionDate, sessionTime, notes) => {
  const { data, error } = await supabase
    .from('trainer_sessions')
    .insert([
      { 
        user_id: userId, 
        trainer_id: trainerId, 
        session_date: sessionDate, 
        session_time: sessionTime,
        notes: notes
      }
    ])
    .select()
  return { data, error }
}

export const selectMembership = async (userId, planId, startDate, endDate) => {
  const { data, error } = await supabase
    .from('user_memberships')
    .insert([
      { user_id: userId, plan_id: planId, start_date: startDate, end_date: endDate }
    ])
    .select()
  return { data, error }
}

export const submitContactForm = async (name, email, phone, message) => {
  const { data, error } = await supabase
    .from('contact_inquiries')
    .insert([
      { name, email, phone, message }
    ])
    .select()
  return { data, error }
}

export const getUserBookings = async (userId) => {
  const { data, error } = await supabase
    .from('class_bookings')
    .select(`
      *,
      classes (
        title,
        description,
        image_url
      )
    `)
    .eq('user_id', userId)
    .order('booking_date', { ascending: true })
  return { data, error }
}

export const getUserSessions = async (userId) => {
  const { data, error } = await supabase
    .from('trainer_sessions')
    .select(`
      *,
      trainers (
        name,
        specialty,
        image_url
      )
    `)
    .eq('user_id', userId)
    .order('session_date', { ascending: true })
  return { data, error }
}

export const getUserMembership = async (userId) => {
  const { data, error } = await supabase
    .from('user_memberships')
    .select(`
      *,
      membership_plans (
        name,
        price,
        features
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()
  return { data, error }
}