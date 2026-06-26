'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// We use the service role key to bypass RLS for public parent-hub data.
// Since these are Server Actions, the key is safely kept on the server.
function getSupabase() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing in environment variables. Please add it to Vercel.");
  }
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )
}

export async function getPublicPrograms() {
  const supabase = getSupabase()
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return []
  
  const { data, error } = await supabase.from('programs').select('id, name, description').eq('is_active', true).order('name')
  if (error) throw error
  return data
}

export async function getPublicProgramTeachers(programId: string) {
  if (!programId) return []
  const supabase = getSupabase()
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return []

  const { data: classes, error: classError } = await supabase
    .from('classes')
    .select('id')
    .eq('program_id', programId)
    
  if (classError || !classes.length) return []
  
  const classIds = classes.map((c: any) => c.id)

  const { data: classTeachers, error: ctError } = await supabase
    .from('class_teachers')
    .select('users(id, full_name, roles, profile_picture_url, bio)')
    .in('class_id', classIds)
    
  if (ctError || !classTeachers) return []

  const uniqueTeachers = new Map()
  classTeachers.forEach((ct: any) => {
    if (ct.users && !uniqueTeachers.has(ct.users.id)) {
      uniqueTeachers.set(ct.users.id, {
        id: ct.users.id,
        name: ct.users.full_name || 'Teacher',
        role: ct.users.roles?.[0] || 'Teacher',
        image: ct.users.profile_picture_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        bio: ct.users.bio || ''
      })
    }
  })

  return Array.from(uniqueTeachers.values())
}

export async function getPublicActiveClasses() {
  const supabase = getSupabase()
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return []

  const { data, error } = await supabase
    .from('classes')
    .select(`
      id, name, level, schedule, room, program_id,
      class_teachers ( users (id, full_name, roles, profile_picture_url, bio) )
    `)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error
  return data.map((c: any) => ({
    ...c,
    teachers: c.class_teachers?.map((ct: any) => ct.users) || []
  }))
}

export async function getPublicClass(id: string) {
  const supabase = getSupabase()
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")

  const { data, error } = await supabase
    .from('classes')
    .select(`
      *,
      class_teachers ( users (id, full_name, roles, profile_picture_url, bio) )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return {
    ...data,
    teachers: data.class_teachers?.map((ct: any) => ct.users) || []
  }
}

export async function getPublicActiveGalleryItems(category?: string) {
  const supabase = getSupabase()
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return []

  let query = supabase
    .from('gallery_items')
    .select('id, title, description, image_url, category, event_date, is_active, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getPublicPreschoolMagazines() {
  const supabase = getSupabase()
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return []

  const { data: classes, error: classErr } = await supabase
    .from('classes')
    .select('id, name')

  if (!classes || classes.length === 0) return []
  
  const preschoolClassIds = classes
    .filter(c => c.name.toLowerCase().includes('preschool') || c.name.toLowerCase().includes('pre-school') || c.name.toLowerCase().includes('kindergarten'))
    .map(c => c.id)

  if (preschoolClassIds.length === 0) return []

  const { data, error } = await supabase
    .from('class_documents')
    .select('id, title, document_url, document_type, cover_image_url, file_size_mb, classes(name)')
    .eq('document_type', 'MAGAZINE')
    .in('class_id', preschoolClassIds)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data ?? []
}

export async function getPublicPreschoolTeachers() {
  const supabase = getSupabase()
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return []

  // 1. Get classes that belong to MEC PRESCHOOL
  const { data: programs, error: progError } = await supabase
    .from('programs')
    .select('id')
    .eq('name', 'MEC PRESCHOOL')
    .single()
    
  if (progError || !programs) return []

  const { data: classes, error: classError } = await supabase
    .from('classes')
    .select('id')
    .eq('program_id', programs.id)
    
  if (classError || !classes.length) return []
  
  const classIds = classes.map(c => c.id)

  // 2. Get teachers assigned to those classes
  const { data: classTeachers, error: ctError } = await supabase
    .from('class_teachers')
    .select('users(id, full_name, roles, profile_picture_url)')
    .in('class_id', classIds)
    
  if (ctError || !classTeachers) return []

  // 3. Deduplicate and format teachers
  const uniqueTeachers = new Map()
  classTeachers.forEach((ct: any) => {
    if (ct.users && !uniqueTeachers.has(ct.users.id)) {
      uniqueTeachers.set(ct.users.id, {
        id: ct.users.id,
        name: ct.users.full_name || 'Teacher',
        role: ct.users.roles?.[0] || 'Teacher',
        image: ct.users.profile_picture_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
      })
    }
  })

  return Array.from(uniqueTeachers.values())
}

export async function getPublicClassDocuments(classId?: string, documentType?: string) {
  if (!classId) return []
  const supabase = getSupabase()
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return []
  
  let query = supabase
    .from('class_documents')
    .select('id, title, document_url, document_type, cover_image_url, file_size_mb')
    .eq('class_id', classId)
    .order('created_at', { ascending: false })

  if (documentType) {
    query = query.eq('document_type', documentType)
  }

  const { data, error } = await query

  if (error) throw error
  return data ?? []
}
