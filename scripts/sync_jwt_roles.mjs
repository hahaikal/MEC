import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
} else {
  console.log("No .env.local file found. Assuming variables are in the environment.")
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function syncRoles() {
  console.log("Fetching users from public.users...")

  // 1. Get all users from public.users
  const { data: users, error: fetchError } = await supabase
    .from('users')
    .select('id, role, full_name')

  if (fetchError) {
    console.error("Failed to fetch users:", fetchError.message)
    process.exit(1)
  }

  console.log(`Found ${users.length} users. Starting JWT sync...`)

  // 2. Iterate and update auth.users metadata
  let successCount = 0
  let errorCount = 0

  for (const user of users) {
    if (!user.role) {
       console.log(`Skipping user ${user.id} (${user.full_name}) - No role defined in public.users.`)
       continue
    }

    try {
      const { data, error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: { role: user.role }
      })

      if (updateError) {
        console.error(`Failed to update user ${user.id} (${user.full_name}):`, updateError.message)
        errorCount++
      } else {
        console.log(`Successfully synced role '${user.role}' for user ${user.id} (${user.full_name || 'No Name'})`)
        successCount++
      }
    } catch (e) {
      console.error(`Unexpected error updating user ${user.id}:`, e)
      errorCount++
    }
  }

  console.log("\n=================================")
  console.log("JWT ROLE SYNC COMPLETE")
  console.log(`Successfully Updated: ${successCount}`)
  console.log(`Errors: ${errorCount}`)
  console.log("=================================\n")
}

syncRoles()
