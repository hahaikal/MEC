import { Database } from '@/types/supabase'

export type Student = Database['public']['Tables']['students']['Row']

export interface AttendanceSummary {
  id: string
  student_id: string
  class_name: string
  semester: number
  year: number
  total_meetings: number
  sick: number
  leave: number
  alpha: number
  created_by?: string | null
  created_at?: string
  updated_at?: string
}

export interface AttendanceDetail extends AttendanceSummary {
  student_name: string
  attended_meetings: number
  attendance_percentage: number
}

// Combined type for the UI (Student + optional Attendance)
export interface StudentAttendanceRow {
  student: Student
  attendance?: AttendanceSummary | null
}

export interface UpsertAttendanceParams {
  student_id: string
  class_name: string
  semester: number
  year: number
  total_meetings: number
  sick: number
  leave: number
  alpha: number
}
