import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  // Verify Cron Secret if using Vercel CRON to prevent unauthorized execution
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Need service role key to bypass RLS for administrative cron jobs
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const today = new Date().toISOString().split('T')[0]
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()

    const notificationsToSend = []

    // 1. Process ALPHA Attendance Notifications
    const { data: alphaLogs, error: alphaError } = await supabase
      .from('attendance_logs')
      .select('id, student_id, date, students(name, parent_phone, parent_name)')
      .eq('status', 'ALPHA')
      .eq('date', today)

    if (alphaError) throw alphaError

    for (const log of alphaLogs || []) {
      if (log.students?.parent_phone) {
        const message = `Hello ${log.students.parent_name}, this is an automated message from MEC. Your child, ${log.students.name}, was marked as ALPHA (absent without notice) for their class today (${today}). Please contact us for more information.`

        notificationsToSend.push({
          recipient: log.students.parent_phone,
          type: 'WHATSAPP',
          message: message,
          status: 'MOCKED_SENT'
        })
      }
    }

    // 2. Process Overdue Tuition Payments (Assuming due by 10th of the month)
    const currentDay = new Date().getDate()

    // Only send reminders on the 11th of the month
    if (currentDay === 11) {
       const { data: activeStudents, error: studentError } = await supabase
        .from('students')
        .select('id, name, parent_phone, parent_name, email')
        .eq('status', 'ACTIVE')

       if (studentError) throw studentError

       const { data: paidPayments, error: paymentError } = await supabase
         .from('payments')
         .select('student_id')
         .eq('payment_status', 'completed')
         .eq('category', 'tuition')
         .eq('month', currentMonth)
         .eq('year', currentYear)

       if (paymentError) throw paymentError

       const paidIds = new Set((paidPayments || []).map(p => p.student_id))

       for (const student of activeStudents || []) {
         if (!paidIds.has(student.id)) {
           // Student has not paid yet
           if (student.parent_phone) {
             const message = `Reminder: Hello ${student.parent_name}, the tuition fee for ${student.name} for month ${currentMonth}/${currentYear} is currently overdue. Please process the payment at your earliest convenience.`
             notificationsToSend.push({
               recipient: student.parent_phone,
               type: 'WHATSAPP', // Or EMAIL if preferred
               message: message,
               status: 'MOCKED_SENT'
             })
           }
         }
       }
    }

    // 3. Insert all notifications into log
    if (notificationsToSend.length > 0) {
      const { error: insertError } = await supabase
        .from('notification_logs')
        .insert(notificationsToSend)

      if (insertError) throw insertError

      console.log(`[CRON - Notification Engine] Successfully processed and logged ${notificationsToSend.length} mock notifications.`)
    } else {
      console.log(`[CRON - Notification Engine] No notifications needed to be sent today.`)
    }

    return NextResponse.json({
      success: true,
      processed: notificationsToSend.length
    })

  } catch (error: any) {
    console.error('[CRON - Notification Engine] Error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
