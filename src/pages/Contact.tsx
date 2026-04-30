import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { contactService } from '@/services/newsletter.service'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Check, Mail } from 'lucide-react'
import { SEOHead } from '@/components/ui/SEOHead'

const schema = z.object({
  name: z.string().min(2, 'Name is required').max(200),
  email: z.string().email('Enter a valid email'),
  subject: z.string().max(300).optional(),
  message: z.string().min(10, 'Write a little more?').max(5000),
})
type FormData = z.infer<typeof schema>

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    await contactService.submitMessage({
      name: data.name,
      email: data.email,
      subject: data.subject || '',
      message: data.message,
    })
    setSubmitted(true)
  }

  return (
    <>
      <SEOHead
        title="Contact"
        description="Get in touch with Iron Heist. If a poem hit close to home, or you just want to say something — this is the place."
        path="/contact"
      />

      <div className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs uppercase tracking-widest text-amber-500 font-sans mb-4">Get in touch</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] text-ink-50 leading-none mb-6">Contact</h1>
          <p className="text-ink-400 font-sans text-base leading-relaxed mb-10 max-w-lg">
            If a poem hit close to home, if you have a question about the work, or if you just want to say
            something — this is the place.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center py-12"
          >
            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mb-5">
              <Check size={26} className="text-green-400" />
            </div>
            <h2 className="font-serif text-xl text-ink-100 mb-2">Message received.</h2>
            <p className="text-ink-400 font-sans text-sm max-w-sm">
              I read every message and reply when I can. It might take a few days.
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input {...register('name')} label="Name" error={errors.name?.message} autoComplete="name" />
              <Input {...register('email')} label="Email" type="email" error={errors.email?.message} autoComplete="email" />
            </div>
            <Input {...register('subject')} label="Subject (optional)" />
            <Textarea {...register('message')} label="Message" rows={6} error={errors.message?.message} />
            <Button type="submit" isLoading={isSubmitting} leftIcon={<Mail size={15} />}>
              Send message
            </Button>
          </motion.form>
        )}
      </div>
    </>
  )
}
