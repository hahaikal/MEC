export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          name: string
          phone_number: string | null
          father_name: string | null
          mother_name: string | null
          father_occupation: string | null
          mother_occupation: string | null
          parent_phone: string | null
          date_of_birth: string | null
          address: string | null
          place_of_birth: string | null
          gender: string | null
          religion: string | null
          school_origin: string | null
          status: string
          base_fee: number
          discount: number | null
          nis: string | null
          parent_id: string | null
          photo_url: string | null
          enrollment_date: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone_number?: string | null
          father_name?: string | null
          mother_name?: string | null
          father_occupation?: string | null
          mother_occupation?: string | null
          parent_phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          place_of_birth?: string | null
          gender?: string | null
          religion?: string | null
          school_origin?: string | null
          status?: string
          base_fee?: number
          discount?: number | null
          nis?: string | null
          parent_id?: string | null
          photo_url?: string | null
          enrollment_date?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone_number?: string | null
          father_name?: string | null
          mother_name?: string | null
          father_occupation?: string | null
          mother_occupation?: string | null
          parent_phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          place_of_birth?: string | null
          gender?: string | null
          religion?: string | null
          school_origin?: string | null
          status?: string
          base_fee?: number
          discount?: number | null
          nis?: string | null
          parent_id?: string | null
          photo_url?: string | null
          enrollment_date?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: string
          department: string | null
          phone_number: string | null
          profile_picture_url: string | null
          bio: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role: string
          department?: string | null
          phone_number?: string | null
          profile_picture_url?: string | null
          bio?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: string
          department?: string | null
          phone_number?: string | null
          profile_picture_url?: string | null
          bio?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      programs: {
        Row: {
          id: string
          name: string
          description: string | null
          duration_months: number | null
          price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          duration_months?: number | null
          price: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          duration_months?: number | null
          price?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          student_id: string
          amount: number
          payment_method: string
          payment_status: string
          payment_date: string
          invoice_number: string | null
          notes: string | null
          received_by: string | null
          program_id: string | null
          category: string
          payment_for_month: string | null
          discount_amount: number | null
          month: number | null
          year: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          amount: number
          payment_method: string
          payment_status?: string
          payment_date?: string
          invoice_number?: string | null
          notes?: string | null
          received_by?: string | null
          program_id?: string | null
          category?: string
          payment_for_month?: string | null
          discount_amount?: number | null
          month?: number | null
          year?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          amount?: number
          payment_method?: string
          payment_status?: string
          payment_date?: string
          invoice_number?: string | null
          notes?: string | null
          received_by?: string | null
          program_id?: string | null
          category?: string
          payment_for_month?: string | null
          discount_amount?: number | null
          month?: number | null
          year?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          program_id: string | null
          teacher_id: string | null
          capacity: number | null
          target_meetings: number
          schedule_days: string[] | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          program_id?: string | null
          teacher_id?: string | null
          capacity?: number | null
          target_meetings?: number
          schedule_days?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          program_id?: string | null
          teacher_id?: string | null
          capacity?: number | null
          target_meetings?: number
          schedule_days?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      class_enrollments: {
        Row: {
          id: string
          class_id: string
          student_id: string
          enrolled_at: string
        }
        Insert: {
          id?: string
          class_id: string
          student_id: string
          enrolled_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          student_id?: string
          enrolled_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          description: string
          amount: number
          category: string
          date: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          description: string
          amount: number
          category: string
          date?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          description?: string
          amount?: number
          category?: string
          date?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      attendance_logs: {
        Row: {
          id: string
          class_id: string
          student_id: string
          status: string
          date: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          class_id: string
          student_id: string
          status: string
          date?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          student_id?: string
          status?: string
          date?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      student_programs: {
        Row: {
          id: string
          student_id: string
          program_id: string
          enrollment_date: string
          completion_date: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          program_id: string
          enrollment_date?: string
          completion_date?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          program_id?: string
          enrollment_date?: string
          completion_date?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      student_discounts: {
        Row: {
          id: string
          student_id: string
          program_id: string
          discount_name: string
          discount_type: string
          discount_value: number
          start_date: string
          end_date: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          program_id: string
          discount_name: string
          discount_type: string
          discount_value: number
          start_date: string
          end_date: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          program_id?: string
          discount_name?: string
          discount_type?: string
          discount_value?: number
          start_date?: string
          end_date?: string
          created_at?: string
        }
      }
      transaction_summary: {
        Row: {
          id: string
          transaction_date: string
          total_income: number
          total_paid_programs: number
          total_outstanding: number
          payment_count: number
          updated_at: string
        }
        Insert: {
          id?: string
          transaction_date: string
          total_income?: number
          total_paid_programs?: number
          total_outstanding?: number
          payment_count?: number
          updated_at?: string
        }
        Update: {
          id?: string
          transaction_date?: string
          total_income?: number
          total_paid_programs?: number
          total_outstanding?: number
          payment_count?: number
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          table_name: string | null
          record_id: string | null
          action: string | null
          old_values: Json | null
          new_values: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          table_name?: string | null
          record_id?: string | null
          action?: string | null
          old_values?: Json | null
          new_values?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          table_name?: string | null
          record_id?: string | null
          action?: string | null
          old_values?: Json | null
          new_values?: Json | null
          created_at?: string
        }
      }
      legacy_attendance_summaries: {
        Row: {
          id: string
          student_id: string
          year: number
          semester: number
          class_name: string
          total_meetings: number
          attended_meetings: number
          sick: number
          leave: number
          alpha: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          year: number
          semester: number
          class_name: string
          total_meetings?: number
          attended_meetings?: number
          sick?: number
          leave?: number
          alpha?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          year?: number
          semester?: number
          class_name?: string
          total_meetings?: number
          attended_meetings?: number
          sick?: number
          leave?: number
          alpha?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notification_logs: {
        Row: {
          id: string
          recipient: string
          type: string
          message: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          recipient: string
          type: string
          message: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          recipient?: string
          type?: string
          message?: string
          status?: string
          created_at?: string
        }
      }
      system_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: Json
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_by?: string | null
          updated_at?: string
        }
      }
      gallery_items: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string
          category: string
          is_active: boolean
          event_date: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url: string
          category?: string
          is_active?: boolean
          event_date?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string
          category?: string
          is_active?: boolean
          event_date?: string | null
          created_at?: string
          created_by?: string | null
        }
      }
      class_documents: {
        Row: {
          id: string
          class_id: string | null
          title: string
          document_url: string
          file_size_mb: number | null
          document_type: string
          cover_image_url: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          class_id?: string | null
          title: string
          document_url: string
          file_size_mb?: number | null
          document_type: string
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          class_id?: string | null
          title?: string
          document_url?: string
          file_size_mb?: number | null
          document_type?: string
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
        }
      }
      class_activities: {
        Row: {
          id: string
          class_id: string | null
          title: string
          description: string | null
          image_url: string
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          class_id?: string | null
          title: string
          description?: string | null
          image_url: string
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          class_id?: string | null
          title?: string
          description?: string | null
          image_url?: string
          created_at?: string
          created_by?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
