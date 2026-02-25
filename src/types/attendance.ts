import { Database } from '@/types/supabase'

export type Student = Database['public']['Tables']['students']['Row']
export type Program = Database['public']['Tables']['programs']['Row']

export interface AttendanceSummary {
  id: string
  student_id: string
  program_id: string
  month: number
  year: number
  total_meetings: number
  attended_meetings: number
  created_by?: string | null
  created_at?: string
  updated_at?: string
}

export interface AttendanceDetail extends AttendanceSummary {
  student_name: string
  program_name: string
  attendance_percentage: number
}

// Combined type for the UI (Student + optional Attendance)
export interface StudentAttendanceRow {
  student: Student
  attendance?: AttendanceSummary | null
}

export interface UpsertAttendanceParams {
  student_id: string
  program_id: string
  month: number
  year: number
  total_meetings: number
  attended_meetings: number
}
