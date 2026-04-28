'use client'

import { useAuth } from '@/lib/auth/use-auth'
import { OperationalDashboard } from '@/components/dashboard/operational-dashboard'
import { ExecutiveDashboard } from '@/components/dashboard/executive-dashboard'
import { ParentDashboard } from '@/components/dashboard/parent-dashboard'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Routing logic based on role
  const role = user?.role

  if (role === 'director') {
    return <ExecutiveDashboard user={user} />
  }

  if (role === 'parent') {
    return <ParentDashboard user={user} />
  }

  // Fallback for admin, manager, staff, teacher
  return <OperationalDashboard user={user} />
}
