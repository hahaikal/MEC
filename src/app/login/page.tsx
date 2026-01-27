import { LoginForm } from '@/components/auth/login-form'

export const metadata = {
  title: 'Login - MEC Finance System',
  description: 'Sign in to your MEC Finance System account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-600">Sign in to manage your finance data</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}
