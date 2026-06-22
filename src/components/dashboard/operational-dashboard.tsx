'use client'

import { Card } from '@/components/ui/card'
import { Users, CreditCard, BarChart3, TrendingUp, Loader2 } from 'lucide-react'
import { useDashboardStats } from '@/lib/hooks/use-dashboard-stats'

export function OperationalDashboard({ user }: { user: any }) {
  const { data: statsData, isLoading, error } = useDashboardStats()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
  }

  const formatGrowth = (growth: number) => {
    const sign = growth > 0 ? '+' : ''
    return `${sign}${growth.toFixed(1)}%`
  }

  const stats = [
    {
      title: 'Total Students',
      value: isLoading ? '...' : (statsData?.totalStudents?.toString() || '0'),
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Total Revenue',
      value: isLoading ? '...' : formatCurrency(statsData?.totalRevenue || 0),
      icon: CreditCard,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Active Programs',
      value: isLoading ? '...' : (statsData?.activePrograms?.toString() || '0'),
      icon: BarChart3,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Monthly Growth',
      value: isLoading ? '...' : formatGrowth(statsData?.monthlyGrowth || 0),
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Operational Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome back, {user?.full_name || user?.email || 'User'}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Gagal memuat data dashboard</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-600 font-medium">{stat.title}</p>
                  <p className="text-xl xl:text-2xl font-bold text-slate-900 mt-2 break-all leading-tight">
                    {isLoading && stat.value === '...' ? (
                       <Loader2 className="h-6 w-6 animate-spin text-slate-400 mt-2" />
                    ) : (
                       stat.value
                    )}
                  </p>
                </div>
                <div className={`p-3 rounded-lg shrink-0 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Getting Started</h2>
        <ul className="space-y-3 text-slate-600">
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Manage student data and track enrollments</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Record attendance daily</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Process tuition payments</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
