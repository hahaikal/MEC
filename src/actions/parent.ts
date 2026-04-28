'use server'

import { createClient } from '@/lib/supabase/server'

export async function getParentStats() {
  const supabase = await createClient()

  // RLS will enforce that they only get their own children's data
  const { data: students, error: studentError } = await supabase
    .from('students')
    .select('id, name')

  if (studentError) {
    console.error("Error fetching children:", studentError)
    return []
  }

  const childrenData = []

  for (const student of students || []) {
    // Get program/class
    const { data: enrollments } = await supabase
      .from('class_enrollments')
      .select('classes(name, programs(name))')
      .eq('student_id', student.id)
      .limit(1)

    const programName = enrollments?.[0]?.classes?.programs?.name || enrollments?.[0]?.classes?.name || 'Unassigned'

    // Get attendance rate
    const { data: attendance } = await supabase
      .from('attendance_logs')
      .select('status')
      .eq('student_id', student.id)

    const totalAttendance = attendance?.length || 0
    const presentCount = attendance?.filter(a => a.status === 'PRESENT').length || 0
    const attendanceRate = totalAttendance ? Math.round((presentCount / totalAttendance) * 100) : 0

    // Get tuition status (Current month)
    const now = new Date()
    const { data: payment } = await supabase
      .from('payments')
      .select('payment_status')
      .eq('student_id', student.id)
      .eq('category', 'tuition')
      .eq('month', now.getMonth() + 1)
      .eq('year', now.getFullYear())
      .limit(1)

    const isPaid = payment?.[0]?.payment_status === 'completed'

    childrenData.push({
      id: student.id,
      name: student.name,
      program: programName,
      attendanceRate,
      tuitionStatus: isPaid ? 'Paid' : 'Pending',
      nextClass: 'Contact Admin for Schedule' // Placeholder since exact class times aren't fully modeled yet
    })
  }

  return childrenData
}
