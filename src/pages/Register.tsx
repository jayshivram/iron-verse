import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { authService } from '@/services/auth.service'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SITE_NAME } from '@/utils/constants'
import { Mail, Lock, User, AlertCircle, Check } from 'lucide-react'

const schema = z.object({
  display_name: z.string().min(2, 'Display name must be at least 2 characters').max(100),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
})
type FormData = z.infer<typeof schema>

export default function Register() {
  const { user } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  if (user) return <Navigate to="/" replace />

  const onSubmit = async (data: FormData) => {
    setError(null)
    try {
      await authService.signUp({ email: data.email, password: data.password, fullName: data.display_name })
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-5">
            <Check size={26} className="text-green-400" />
          </div>
          <h2 className="font-serif text-2xl text-ink-100 mb-2">Check your email</h2>
          <p className="text-ink-400 font-sans text-sm mb-6">
            We sent a confirmation link to your email. Click it to activate your account.
          </p>
          <Link to="/login" className="btn-secondary">Back to sign in</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Create account — {SITE_NAME}</title>
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <h1 className="font-display text-4xl text-ink-50 text-center mb-2">Create account</h1>
          <p className="text-center text-ink-500 font-sans text-sm mb-10">
            Save your reading progress and bookmark collections.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              {...register('display_name')}
              label="Display name"
              leftIcon={<User size={15} />}
              error={errors.display_name?.message}
              autoComplete="name"
            />
            <Input
              {...register('email')}
              label="Email"
              type="email"
              leftIcon={<Mail size={15} />}
              error={errors.email?.message}
              autoComplete="email"
            />
            <Input
              {...register('password')}
              label="Password"
              type="password"
              leftIcon={<Lock size={15} />}
              error={errors.password?.message}
              autoComplete="new-password"
            />
            <Input
              {...register('confirm_password')}
              label="Confirm password"
              type="password"
              leftIcon={<Lock size={15} />}
              error={errors.confirm_password?.message}
              autoComplete="new-password"
            />

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 font-sans bg-red-500/10
                              border border-red-500/20 rounded-md px-3 py-2.5">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <Button type="submit" isLoading={isSubmitting} className="w-full justify-center">
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-ink-500 font-sans mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-500 hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </>
  )
}
