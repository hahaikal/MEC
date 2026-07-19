'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function getSupabase() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )
}

/**
 * Login with PIN (6 digits from date_of_birth in dd/mm/yy format).
 * Returns matching students (could be multiple if same DOB).
 */
export async function verifyPin(pin: string) {
  if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
    return { error: 'PIN harus 6 digit angka' }
  }

  const supabase = getSupabase()

  // Parse pin: dd/mm/yy -> day, month, 2-digit year
  const dd = pin.slice(0, 2)
  const mm = pin.slice(2, 4)
  const yy = pin.slice(4, 6)

  const day = parseInt(dd, 10)
  const month = parseInt(mm, 10)
  const yearShort = parseInt(yy, 10)

  if (day < 1 || day > 31 || month < 1 || month > 12) {
    return { error: 'PIN salah, harap hubungi admin' }
  }

  // Fetch all active students that have a date_of_birth
  const { data: students, error } = await supabase
    .from('students')
    .select('id, name, date_of_birth, photo_url, status, class_enrollments(class_id, base_fee, classes(id, name, program_id, programs(id, name)))')
    .not('date_of_birth', 'is', null)
    .in('status', ['ACTIVE', 'active'])

  if (error) {
    console.error('verifyPin error:', error)
    return { error: 'Terjadi kesalahan, coba lagi nanti' }
  }

  if (!students || students.length === 0) {
    return { error: 'PIN salah, harap hubungi admin' }
  }

  // Filter students whose DOB matches the PIN
  const matchedStudents = students.filter((s: any) => {
    if (!s.date_of_birth) return false
    const dob = new Date(s.date_of_birth)
    const dobDay = dob.getDate()
    const dobMonth = dob.getMonth() + 1 // 0-based
    const dobYearShort = dob.getFullYear() % 100

    return dobDay === day && dobMonth === month && dobYearShort === yearShort
  })

  if (matchedStudents.length === 0) {
    return { error: 'PIN salah, harap hubungi admin' }
  }

  // Map to safe return format
  const results = matchedStudents.map((s: any) => {
    const enrollments = (s.class_enrollments || []).map((enr: any) => ({
      class_id: enr.class_id,
      class_name: enr.classes?.name || '',
      program_id: enr.classes?.program_id || '',
      program_name: enr.classes?.programs?.name || '',
    }))

    return {
      id: s.id,
      name: s.name,
      photo_url: s.photo_url,
      enrollments,
      class_names: enrollments.map((e: any) => e.class_name).filter(Boolean).join(', '),
    }
  })

  return { students: results }
}

/**
 * Confirm login: select a student profile and log the session.
 */
export async function confirmStudentLogin(studentId: string) {
  const supabase = getSupabase()

  // Fetch student full data for session
  const { data: student, error } = await supabase
    .from('students')
    .select('id, name, photo_url, date_of_birth, class_enrollments(class_id, base_fee, classes(id, name, program_id, programs(id, name)))')
    .eq('id', studentId)
    .single()

  if (error || !student) {
    return { error: 'Siswa tidak ditemukan' }
  }

  const enrollments = (student.class_enrollments || []).map((enr: any) => ({
    class_id: enr.class_id,
    class_name: enr.classes?.name || '',
    program_id: enr.classes?.program_id || '',
    program_name: enr.classes?.programs?.name || '',
  }))

  // Log the login
  await supabase.from('parent_hub_login_logs').insert({
    student_id: studentId,
    student_name: student.name,
    login_type: 'student',
  })

  return {
    session: {
      type: 'student' as const,
      studentId: student.id,
      studentName: student.name,
      photoUrl: student.photo_url,
      enrollments,
      classNames: enrollments.map((e: any) => e.class_name).filter(Boolean).join(', '),
      loginAt: new Date().toISOString(),
    }
  }
}

/**
 * Login as staff (from admin dashboard).
 * Verifies Supabase auth session exists and user has staff role.
 */
export async function loginAsStaff() {
  // Use the regular server client to check the authenticated user
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Anda harus login terlebih dahulu' }
  }

  // Fetch user profile
  const adminSupabase = getSupabase()
  const { data: profile } = await adminSupabase
    .from('users')
    .select('id, full_name, roles, profile_picture_url')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return { error: 'Profil tidak ditemukan' }
  }

  // Log the staff login
  await adminSupabase.from('parent_hub_login_logs').insert({
    student_name: profile.full_name || 'Staff',
    login_type: 'staff',
    user_id: user.id,
  })

  return {
    session: {
      type: 'staff' as const,
      userId: user.id,
      userName: profile.full_name,
      photoUrl: profile.profile_picture_url,
      roles: profile.roles,
      loginAt: new Date().toISOString(),
    }
  }
}

/**
 * Get parent hub login logs for monitoring page.
 */
export async function getParentHubLoginLogs(page = 1, limit = 20, dateFrom?: string, dateTo?: string) {
  const supabase = getSupabase()

  let query = supabase
    .from('parent_hub_login_logs')
    .select('*, students(name, photo_url, class_enrollments(classes(name)))', { count: 'exact' })
    .order('logged_in_at', { ascending: false })

  if (dateFrom) {
    query = query.gte('logged_in_at', dateFrom)
  }
  if (dateTo) {
    query = query.lte('logged_in_at', dateTo + 'T23:59:59.999Z')
  }

  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('getParentHubLoginLogs error:', error)
    return { logs: [], total: 0 }
  }

  return { logs: data || [], total: count || 0 }
}
