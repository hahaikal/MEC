import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  const { data, error } = await supabase.rpc('exec_sql', { sql: "SELECT policyname, permissive, roles, cmd, qual, with_check FROM pg_policies WHERE tablename = 'students';" })
  if (error) {
     console.error("Couldn't run exec_sql:", error.message)
     // Alternatively, we can just look at the SQL files that created them.
  } else {
     console.log(data)
  }
}

run()
