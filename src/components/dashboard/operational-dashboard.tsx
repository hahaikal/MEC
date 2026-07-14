'use client'

import { Users, BookOpen, GraduationCap, Loader2 } from 'lucide-react'
import { useDashboardStats } from '@/lib/hooks/use-dashboard-stats'
import { useClasses } from '@/lib/hooks/use-classes'
import { useTeachers } from '@/lib/hooks/use-teachers'
import { mapClassesToScheduleGroups } from '@/data/schedule'
import { Greeting } from './Greeting'
import { StatCard } from './StatCard'
import { ScheduleSection } from './ScheduleSection'

export function OperationalDashboard({ user }: { user: any }) {
  const { data: statsData, isLoading: isLoadingStats } = useDashboardStats()
  const { data: classes, isLoading: isLoadingClasses } = useClasses()
  const { data: teachers, isLoading: isLoadingTeachers } = useTeachers()

  const scheduleGroups = mapClassesToScheduleGroups(classes || [])

  const isLoading = isLoadingStats || isLoadingClasses || isLoadingTeachers

  const name = user?.full_name || user?.email || 'User'

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      <Greeting name={name} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Students"
          value={statsData?.totalStudents || 0}
          icon={Users}
          tone="sky"
          hint="Total seluruh siswa aktif"
        />
        <StatCard
          label="Total Classes"
          value={classes?.length || 0}
          icon={BookOpen}
          tone="lavender"
          hint="Jumlah semua kelas"
        />
        <StatCard
          label="Total Teachers"
          value={teachers?.length || 0}
          icon={GraduationCap}
          tone="peach"
          hint="Pengajar terdaftar"
        />
      </div>

      <div className="mt-12 space-y-10">
        {scheduleGroups.length > 0 ? (
          scheduleGroups.map((group, i) => (
            <ScheduleSection key={`${group.days}-${i}`} group={group} />
          ))
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            Tidak ada jadwal kelas saat ini.
          </div>
        )}
      </div>
    </div>
  )
}
