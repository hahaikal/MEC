'use client'

import { Card } from '@/components/ui/card'
import { Users, CreditCard, BarChart3, TrendingUp } from 'lucide-react'

export function OperationalDashboard({ user }: { user: any }) {
  const stats = [
    {
      title: 'Total Students',
      value: '0',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Total Revenue',
      value: 'Rp 0',
      icon: CreditCard,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Active Programs',
      value: '0',
      icon: BarChart3,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Monthly Growth',
      value: '0%',
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
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
