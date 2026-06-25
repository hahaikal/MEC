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
    error,
  } = await supabase.auth.getUser()

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')

  // The critical requirement: Auto-logout / Force redirect
  // If we are on a protected route and we don't have a user (or token is invalid/expired), redirect.
  // By redirecting without setting cookies, we force the client to get a new session on the login page.
  if (isProtectedRoute && (!user || error)) {
    // Optional: Clear any existing invalid auth cookies here if you wanted,
    // but the Supabase client handles this mostly on the browser side.
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (user && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Role-based protection for specific routes
  if (user) {
    // We need to fetch the user's role. Since this is middleware, we query the 'users' table.
    const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single()
    const userRoles: string[] = userData?.roles || (userData?.role ? [userData.role] : [])
    
    const isAdminOrDirector = userRoles.some(r => ['admin', 'director', 'manager'].includes(r.toLowerCase()))

    if (!isAdminOrDirector) {
      const allowedRoutes = [
        '/dashboard/students',
        '/dashboard/attendance',
        '/dashboard/teacher-workspace',
        '/dashboard/settings'
      ];
      
      const path = request.nextUrl.pathname;
      const isAllowed = path === '/dashboard' || allowedRoutes.some(route => path.startsWith(route));
      
      if (!isAllowed) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return supabaseResponse
}
