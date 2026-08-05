'use client'

import { useState, useMemo } from 'react'
import { Users, BookOpen, GraduationCap, Loader2, FilterX } from 'lucide-react'
import { useDashboardStats } from '@/lib/hooks/use-dashboard-stats'
import { useClasses } from '@/lib/hooks/use-classes'
import { useTeachers } from '@/lib/hooks/use-teachers'
import { mapClassesToScheduleGroups } from '@/data/schedule'
import { Greeting } from './Greeting'
import { StatCard } from './StatCard'
import { ScheduleSection } from './ScheduleSection'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export function OperationalDashboard({ user }: { user: any }) {
  const { data: statsData, isLoading: isLoadingStats } = useDashboardStats()
  const { data: classes, isLoading: isLoadingClasses } = useClasses()
  const { data: teachers, isLoading: isLoadingTeachers } = useTeachers()

  const [selectedDayGroup, setSelectedDayGroup] = useState<string>('all')
  const [selectedTime, setSelectedTime] = useState<string>('all')

  const scheduleGroups = useMemo(() => mapClassesToScheduleGroups(classes || []), [classes])

  // Extract unique day groups and times for filter options
  const filterOptions = useMemo(() => {
    const dayGroups = new Set<string>()
    const times = new Set<string>()

    scheduleGroups.forEach(group => {
      dayGroups.add(group.days)
      group.classes.forEach(c => {
        if (c.time && c.time !== "TBA") times.add(c.time)
      })
    })

    return {
      days: Array.from(dayGroups).sort(),
      times: Array.from(times).sort()
    }
  }, [scheduleGroups])

  const isLoading = isLoadingStats || isLoadingClasses || isLoadingTeachers
  const name = user?.full_name || user?.email || 'User'

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Filter the schedule groups based on selections
  const filteredGroups = scheduleGroups.map(group => {
    // If a day group is selected and this group doesn't match, return null
    if (selectedDayGroup !== 'all' && group.days !== selectedDayGroup) {
      return null
    }

    // Filter classes within the group by time
    const filteredClasses = group.classes.filter(c => {
      if (selectedTime !== 'all' && c.time !== selectedTime) return false
      return true
    })

    // If no classes left after time filter, return null
    if (filteredClasses.length === 0) return null

    return { ...group, classes: filteredClasses }
  }).filter(Boolean) as typeof scheduleGroups

  const hasActiveFilters = selectedDayGroup !== 'all' || selectedTime !== 'all'

  return (
    <div className="space-y-8 pb-10">
      <Greeting name={name} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <div className="mt-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <h2 className="text-xl font-semibold">Jadwal Kelas Aktif</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedDayGroup} onValueChange={setSelectedDayGroup}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Semua Hari" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Hari</SelectItem>
                {filterOptions.days.map(day => (
                  <SelectItem key={day} value={day}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Semua Jam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jam</SelectItem>
                {filterOptions.times.map(time => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setSelectedDayGroup('all')
                  setSelectedTime('all')
                }}
                title="Reset Filter"
              >
                <FilterX className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-10">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group, i) => (
              <ScheduleSection key={`${group.days}-${i}`} group={group} />
            ))
          ) : (
            <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
              Tidak ada jadwal kelas yang sesuai dengan filter.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
