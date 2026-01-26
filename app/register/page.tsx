import { RegisterForm } from '@/components/auth/register-form'

export const metadata = {
  title: 'Register - MEC Finance System',
  description: 'Create a new account for MEC Finance System',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
            <p className="text-slate-600">Set up your finance management account</p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
