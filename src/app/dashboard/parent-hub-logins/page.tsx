import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ParentHubLoginsClient } from '@/components/parent-hub-logins/parent-hub-logins-client'
import { getParentHubLoginLogs } from '@/actions/parent-hub-auth'

export const metadata = {
  title: 'Parent Hub Logins | My English Course',
}

export default async function ParentHubLoginsPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check role - only admin and director can view
  const { data: profile } = await supabase
    .from('users')
    .select('roles')
    .eq('id', user.id)
    .single()

  const hasAccess = profile?.roles?.some((r: string) => ['admin', 'director'].includes(r.toLowerCase()))
  
  if (!hasAccess) {
    redirect('/dashboard')
  }

  const page = typeof searchParams?.page === 'string' ? parseInt(searchParams.page, 10) : 1
  const limit = 20

  const { logs, total } = await getParentHubLoginLogs(page, limit)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Parent Hub Login Logs</h1>
        <p className="text-muted-foreground">
          Pantau riwayat login siswa dan staff ke portal Parent Hub.
        </p>
      </div>
      <ParentHubLoginsClient 
        initialLogs={logs} 
        totalLogs={total} 
        currentPage={page} 
        itemsPerPage={limit} 
      />
    </div>
  )
}
