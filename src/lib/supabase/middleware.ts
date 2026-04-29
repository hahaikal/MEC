import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('cookie') ?? '')
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from auth pages
  if (user && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Role-based protection for specific routes
  if (user) {
    // We need to fetch the user's role. Since this is middleware, we query the 'users' table.
    const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
    const role = userData?.role

    const adminOnlyRoutes = [
      '/dashboard/classes',
      '/dashboard/payments',
      '/dashboard/expenses',
      '/dashboard/reports',
      '/dashboard/payroll'
    ]

    const path = request.nextUrl.pathname

    if (role === 'teacher') {
      // Prevent teachers from accessing admin-only routes.
      // Exception: They can access /dashboard/attendance/daily but NOT the reports root /dashboard/attendance
      const isTryingToAccessAdminRoute = adminOnlyRoutes.some(route => path.startsWith(route)) || path === '/dashboard/attendance'

      if (isTryingToAccessAdminRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    if (role === 'parent') {
      // Parents can only access the root dashboard. They cannot access any operational routes.
      const operationalRoutes = [
        '/dashboard/classes',
        '/dashboard/students',
        '/dashboard/attendance',
        '/dashboard/payments',
        '/dashboard/expenses',
        '/dashboard/reports',
        '/dashboard/payroll',
        '/dashboard/users'
      ]

      const isTryingToAccessOperationalRoute = operationalRoutes.some(route => path.startsWith(route))

      if (isTryingToAccessOperationalRoute) {
         return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    if (role !== 'admin' && role !== 'director' && path.startsWith('/dashboard/users')) {
      // Only admins and directors can access user management
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}
