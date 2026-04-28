'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Loader2 } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const magicLinkSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type LoginFormValues = z.infer<typeof loginSchema>
type MagicLinkValues = z.infer<typeof magicLinkSchema>

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const supabase = createClient()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const magicForm = useForm<MagicLinkValues>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmitPassword(values: LoginFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (signInError) throw signInError

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred during login'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmitMagicLink(values: MagicLinkValues) {
    setIsLoading(true)
    setError(null)

    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (signInError) throw signInError

      setMagicLinkSent(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred sending magic link'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="staff" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="staff">Staff & Admin</TabsTrigger>
          <TabsTrigger value="parent">Parent Portal</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitPassword)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" type="email" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign in with Password
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="parent" className="pt-4">
           {magicLinkSent ? (
              <Alert className="bg-green-50 border-green-200 flex flex-col items-center justify-center py-6">
                <CheckCircle2 className="h-10 w-10 text-green-600 mb-2" />
                <h4 className="font-semibold text-green-900">Check your email</h4>
                <AlertDescription className="text-green-700 text-center mt-2">
                  We've sent a magic link to your email address. Click the link to securely log in.
                </AlertDescription>
                <Button
                  variant="outline"
                  className="mt-6 w-full max-w-[200px]"
                  onClick={() => setMagicLinkSent(false)}
                >
                  Try again
                </Button>
              </Alert>
            ) : (
            <Form {...magicForm}>
              <form onSubmit={magicForm.handleSubmit(onSubmitMagicLink)} className="space-y-4">
                <div className="text-sm text-slate-500 mb-4">
                  No password needed! Enter the email address registered with your child's account, and we'll send you a secure login link.
                </div>

                <FormField
                  control={magicForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registered Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" type="email" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Send Magic Link
                </Button>
              </form>
            </Form>
            )}
        </TabsContent>
      </Tabs>

      <div className="text-center text-sm">
        Don't have an account?{' '}
        <a href="/register" className="font-semibold text-blue-600 hover:underline">
          Sign up
        </a>
      </div>
    </div>
  )
}
