'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, CheckCircle2, AlertCircle, Clock, Loader2 } from 'lucide-react'
import { useParentStats } from '@/lib/hooks/use-parent'

export function ParentDashboard({ user }: { user: any }) {
  const { data: children, isLoading } = useParentStats()

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Parent Portal</h1>
        <p className="text-slate-600 mt-2">Welcome! Here's an overview of your children's progress.</p>
      </div>

      <div className="grid gap-6">
        {children.map(child => (
          <Card key={child.id} className="overflow-hidden border-t-4 border-t-blue-500">
            <CardHeader className="bg-slate-50 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-blue-900">{child.name}</CardTitle>
                  <p className="text-slate-600 font-medium">{child.program}</p>
                </div>
                {child.tuitionStatus === 'Paid' ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Tuition Up to Date
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                     <AlertCircle className="w-4 h-4 mr-2" /> Tuition Pending
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 flex items-center">
                  <CalendarDays className="w-5 h-5 mr-2 text-slate-500" />
                  Next Class Schedule
                </h4>
                <div className="bg-blue-50 p-4 rounded-lg flex items-center border border-blue-100">
                  <Clock className="w-6 h-6 text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium text-slate-900">{child.nextClass}</p>
                    <p className="text-sm text-slate-600">Please arrive 5 mins early</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-slate-500" />
                  Attendance Summary
                </h4>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-slate-600">Attendance Rate</span>
                    <span className="text-2xl font-bold text-slate-900">{child.attendanceRate}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${child.attendanceRate}%` }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {children.length === 0 && (
          <Card className="p-12 text-center text-slate-500">
            No children records linked to this account yet.
          </Card>
        )}
      </div>
    </div>
  )
}
