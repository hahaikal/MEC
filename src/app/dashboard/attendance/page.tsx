'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from '@/lib/supabase/client'
import DailyAttendancePage from './daily/page'
import AttendanceReportPage from './report/page'
import { AttendanceCompletion } from './completion'
import { Loader2 } from 'lucide-react'

export default function AttendancePage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('users').select('roles').eq('id', user.id).single()
        if (data && data.roles) {
          const isAdmin = data.roles.some((r: string) => 
            ['admin', 'manager', 'director', 'staff', 'head of department', 'principal'].includes(r.toLowerCase())
          );
          setUserRole(isAdmin ? 'admin' : 'teacher');
        }
      }
      setLoading(false)
    }
    getUser()
  }, [supabase])

  if (loading) {
    return <div className="flex h-full items-center justify-center p-8"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
  }



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Absensi & Kehadiran</h1>
        <p className="text-muted-foreground mt-1">Input kehadiran harian dan lihat laporan absensi.</p>
      </div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="daily">Input Kehadiran</TabsTrigger>
          <TabsTrigger value="report">Laporan Absensi</TabsTrigger>
          {userRole === 'admin' && (
            <TabsTrigger value="completion">Status Pengisian</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="daily">
          <DailyAttendancePage />
        </TabsContent>
        <TabsContent value="report">
          <AttendanceReportPage />
        </TabsContent>
        {userRole === 'admin' && (
          <TabsContent value="completion">
            <AttendanceCompletion />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
