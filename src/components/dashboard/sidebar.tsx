'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  CreditCard,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ImageIcon,
  BookOpen,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Students', href: '/dashboard/students' },
  { icon: ClipboardList, label: 'Absensi & Kehadiran', href: '/dashboard/attendance' },
  { icon: Receipt, label: 'Expenses', href: '/dashboard/expenses' },
  { icon: CreditCard, label: 'Penggajian', href: '/dashboard/payroll', adminOnly: true },
  { icon: BarChart3, label: 'Reports', href: '/dashboard/reports' },
  { icon: Users, label: 'Manajemen Kelas', href: '/dashboard/classes', adminOnly: true },
  { icon: Users, label: 'Manajemen Staff', href: '/dashboard/users', adminOnly: true },
  { icon: ImageIcon, label: 'Parent Hub', href: '/dashboard/parent-hub-manager', adminOnly: true },
  { icon: BookOpen, label: 'Teacher Workspace', href: '/dashboard/teacher-workspace' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState(false)
  const [userRoles, setUserRoles] = useState<string[]>([])

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
        if (data) {
          setUserRoles(data.roles || (data.role ? [data.role] : []))
        }
      }
    }
    getUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white shadow"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white z-40 transition-transform duration-300 md:translate-x-0 overflow-hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 space-y-8 h-full flex flex-col overflow-y-auto scrollbar-hide">
          {/* Logo */}
          <div>
            <h1 className="text-2xl font-bold">MEC Finance</h1>
            <p className="text-xs text-slate-400 mt-1">Financial Management System</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
            {navItems.map((item) => {
              const isAdminOrDirector = userRoles.some(r => ['admin', 'director', 'manager'].includes(r.toLowerCase()));
              
              if (!isAdminOrDirector) {
                const allowedRoutes = ['/dashboard', '/dashboard/students', '/dashboard/attendance', '/dashboard/teacher-workspace', '/dashboard/settings'];
                if (!allowedRoutes.includes(item.href)) return null;
                if (item.href === '/dashboard/teacher-workspace' && userRoles.some(r => r.toLowerCase() === 'parent')) return null;
              }
              
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout button */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
