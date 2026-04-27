import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { authService } from '@/services/auth.service'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SITE_NAME } from '@/utils/constants'
import { Mail, Lock, AlertCircle } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
type FormData = z.infer<typeof schema>

export default function Login() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  if (user) return <Navigate to="/" replace />

  const onSubmit = async (data: FormData) => {
    setError(null)
    try {
      await authService.signIn({ email: data.email, password: data.password })
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    }
  }

  return (
    <>
      <Helmet>
        <title>Sign in — {SITE_NAME}</title>
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <h1 className="font-display text-4xl text-ink-50 text-center mb-2">Welcome back</h1>
          <p className="text-center text-ink-500 font-sans text-sm mb-10">
            Sign in to track reading progress and save bookmarks.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
              autoComplete="current-password"
            />

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 font-sans bg-red-500/10
                              border border-red-500/20 rounded-md px-3 py-2.5">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <Button type="submit" isLoading={isSubmitting} className="w-full justify-center">
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-ink-500 font-sans mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-500 hover:underline">Create one</Link>
          </p>
        </motion.div>
      </div>
    </>
  )
}
