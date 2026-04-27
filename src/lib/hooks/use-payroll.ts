import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function usePayroll(month: number, year: number) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['payroll', month, year],
    queryFn: async () => {
      // 1. Get all active teachers
      const { data: teachers, error: teachersError } = await supabase
        .from('users')
        .select('id, full_name, email')
        .eq('role', 'teacher')
        .eq('is_active', true)

      if (teachersError) throw teachersError

      // 2. Get attendance logs for the specified month/year
      // We will count DISTINCT (date, class_id) to count how many sessions happened.

      const d1 = new Date(year, month - 1, 1)
      const d2 = new Date(year, month, 0)

      const startOfMonth = `${d1.getFullYear()}-${String(d1.getMonth() + 1).padStart(2, '0')}-${String(d1.getDate()).padStart(2, '0')}`
      const endOfMonth = `${d2.getFullYear()}-${String(d2.getMonth() + 1).padStart(2, '0')}-${String(d2.getDate()).padStart(2, '0')}`

      const { data: logs, error: logsError } = await supabase
        .from('attendance_logs')
        .select('date, class_id, classes(teacher_id, name, fee_per_meeting)')
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)

      if (logsError) throw logsError

      // Process logs to count unique sessions per teacher per class
      // A "session" is unique by (date + class_id)

      const sessionsByTeacher = new Map<string, {
        teacher: any,
        classes: Record<string, { className: string, sessionCount: number, feePerMeeting: number, total: number }>,
        grandTotal: number
      }>()

      // Initialize map with all teachers
      teachers.forEach(t => {
        sessionsByTeacher.set(t.id, {
          teacher: t,
          classes: {},
          grandTotal: 0
        })
      })

      // Track unique sessions to avoid double counting if multiple students attended same class same day
      const uniqueSessions = new Set<string>()

      logs.forEach(log => {
        if (!log.classes || !log.classes.teacher_id) return

        const teacherId = log.classes.teacher_id
        const sessionKey = `${log.date}_${log.class_id}`

        if (!uniqueSessions.has(sessionKey)) {
          uniqueSessions.add(sessionKey)

          if (sessionsByTeacher.has(teacherId)) {
            const teacherData = sessionsByTeacher.get(teacherId)!

            if (!teacherData.classes[log.class_id]) {
              teacherData.classes[log.class_id] = {
                className: log.classes.name,
                sessionCount: 0,
                feePerMeeting: log.classes.fee_per_meeting || 0,
                total: 0
              }
            }

            const classData = teacherData.classes[log.class_id]
            classData.sessionCount++
            classData.total = classData.sessionCount * classData.feePerMeeting

            // Recompute grand total
            teacherData.grandTotal = Object.values(teacherData.classes).reduce((sum, c) => sum + c.total, 0)
          }
        }
      })

      return Array.from(sessionsByTeacher.values())
    },
    enabled: !!month && !!year
  })
}
