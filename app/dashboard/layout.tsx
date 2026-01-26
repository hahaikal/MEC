import React from "react"
import { Sidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-64">
          <DashboardHeader />
          <main className="flex-1 overflow-auto bg-slate-50 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
