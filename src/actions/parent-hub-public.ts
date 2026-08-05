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
        roles: ct.users.roles || [],
        image: ct.users.profile_picture_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        bio: ct.users.bio || ''
      })
    }
  })

  // Also explicitly fetch Principal and Head of Department to make sure they appear at the top
  const { data: leaders } = await supabase
    .from('users')
    .select('id, full_name, roles, profile_picture_url, bio')
    .filter('is_active', 'eq', true)
    .or('roles.cs.{"Principal"},roles.cs.{"Head of Department"}')
  
  if (leaders) {
    leaders.forEach((l: any) => {
      if (!uniqueTeachers.has(l.id)) {
        uniqueTeachers.set(l.id, {
          id: l.id,
          name: l.full_name || 'Teacher',
          role: l.roles?.[0] || 'Teacher',
          roles: l.roles || [],
          image: l.profile_picture_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
          bio: l.bio || ''
        })
      } else {
         // Update existing with roles array just in case
         const existing = uniqueTeachers.get(l.id)
         existing.roles = l.roles || []
      }
    })
  }

  const result = Array.from(uniqueTeachers.values())
  // Sort: Principal first, then HOD, then others
  result.sort((a, b) => {
    const aIsPrincipal = a.roles?.includes('Principal')
    const bIsPrincipal = b.roles?.includes('Principal')
    const aIsHOD = a.roles?.includes('Head of Department')
    const bIsHOD = b.roles?.includes('Head of Department')
    
    if (aIsPrincipal && !bIsPrincipal) return -1
    if (!aIsPrincipal && bIsPrincipal) return 1
    if (aIsHOD && !bIsHOD) return -1
    if (!aIsHOD && bIsHOD) return 1
    return a.name.localeCompare(b.name)
  })

  return result
}

export async function getPublicActiveClasses() {
  const supabase = getSupabase()
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return []

  const { data, error } = await supabase
    .from('classes')
    .select(`
      *,
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
    .select('*, classes(name)')
    .eq('document_type', 'MAGAZINE')
    .in('class_id', preschoolClassIds)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data ?? []
}

export async function getPublicPreschoolActivities() {
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
  
  const classIds = classes.map((c: any) => c.id)

  // 2. Fetch class activities
  const { data: classActivities, error: err1 } = await supabase
    .from('class_activities')
    .select('*, classes(name)')
    .in('class_id', classIds)

  if (err1) throw err1

  // 3. Fetch gallery items for this program
  const { data: galleryItems, error: err2 } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('category', programs.id)
    .eq('is_active', true)

  if (err2) throw err2

  const combined = [
    ...(classActivities ?? []),
    ...(galleryItems ?? [])
  ]

  // 4. Map to match GalleryItemData structure expected by GalleryGrid
  return combined
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      category: 'preschool',
      is_active: true,
      event_date: item.created_at,
      created_at: item.created_at,
      classes: item.classes,
    }))
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
    .select('id, name')
    .eq('program_id', programs.id)
    
  if (classError || !classes.length) return []
  
  const classIds = classes.map(c => c.id)

  // 2. Get teachers assigned to those classes
  const { data: classTeachers, error: ctError } = await supabase
    .from('class_teachers')
    .select('class_id, users(id, full_name, roles, profile_picture_url)')
    .in('class_id', classIds)
    
  if (ctError || !classTeachers) return []

  // 3. Deduplicate and format teachers
  const uniqueTeachers = new Map()
  classTeachers.forEach((ct: any) => {
    if (ct.users) {
      const className = classes.find(c => c.id === ct.class_id)?.name || ''
      const cleanClassName = className.replace(/MEC\s*/i, '').trim()
      
      if (!uniqueTeachers.has(ct.users.id)) {
        uniqueTeachers.set(ct.users.id, {
          id: ct.users.id,
          name: ct.users.full_name || 'Teacher',
          image: ct.users.profile_picture_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
          classes: [cleanClassName],
          role: `${cleanClassName} Teacher`,
          roles: ct.users.roles || []
        })
      } else {
        const teacher = uniqueTeachers.get(ct.users.id)
        if (cleanClassName && !teacher.classes.includes(cleanClassName)) {
          teacher.classes.push(cleanClassName)
          teacher.role = `${teacher.classes.join(' & ')} Teacher`
        }
      }
    }
  })

  // Also explicitly fetch Principal
  const { data: principals } = await supabase
    .from('users')
    .select('id, full_name, roles, profile_picture_url')
    .filter('is_active', 'eq', true)
    .contains('roles', ['Principal'])
    
  if (principals) {
    principals.forEach((p: any) => {
      if (!uniqueTeachers.has(p.id)) {
        uniqueTeachers.set(p.id, {
          id: p.id,
          name: p.full_name || 'Principal',
          image: p.profile_picture_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
          classes: [],
          role: 'Principal',
          roles: p.roles || []
        })
      } else {
         const existing = uniqueTeachers.get(p.id)
         existing.roles = p.roles || []
         if (!existing.role.includes('Principal')) {
             existing.role = `Principal & ${existing.role}`
         }
      }
    })
  }

  const result = Array.from(uniqueTeachers.values())
  // Sort: Principal first, then others
  result.sort((a, b) => {
    const aIsPrincipal = a.roles?.includes('Principal')
    const bIsPrincipal = b.roles?.includes('Principal')
    if (aIsPrincipal && !bIsPrincipal) return -1
    if (!aIsPrincipal && bIsPrincipal) return 1
    return a.name.localeCompare(b.name)
  })

  return result
}

export async function getPublicClassDocuments(classId?: string, documentType?: string) {
  if (!classId) return []
  const supabase = getSupabase()
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return []
  
  let query = supabase
    .from('class_documents')
    .select('*')
    .eq('class_id', classId)
    .order('created_at', { ascending: false })

  if (documentType) {
    query = query.eq('document_type', documentType)
  }

  const { data, error } = await query

  if (error) throw error
  return data ?? []
}

export async function getPublicPreschoolClasses() {
  const supabase = getSupabase()
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return []

  // 1. Get classes that belong to MEC PRESCHOOL
  const { data: programs, error: progError } = await supabase
    .from('programs')
    .select('id')
    .eq('name', 'MEC PRESCHOOL')
    .single()
    
  if (progError || !programs) return []

  const { data, error } = await supabase
    .from('classes')
    .select('id, name, weekly_schedule')
    .eq('program_id', programs.id)
    .eq('is_active', true)
    .order('name')
    
  if (error) throw error
  return data ?? []
}
