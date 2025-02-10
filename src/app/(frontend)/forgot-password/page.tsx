"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from '@/components/svg/Logo'
import { colors } from '@/utilities/colors'
import { cn } from '@/utilities/cn'
import { InputStyle } from '@/utilities/tailwindShared'

type ForgotPasswordFormData = {
  email: string
}

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>()
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true)
    setServerError(null)
    setSuccessMessage(null)

    try {
      const res = await fetch(`/api/club-member/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      })

      if (!res.ok) {
        throw new Error('Failed to request password reset.')
      }

      setSuccessMessage('Check your email for a reset link.')
    } catch (error) {
      setServerError((error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="uppercase bg-gray-90 min-h-screen lg:h-full lg:w-screen overflow-y-scroll lg:pb-28">
      <header className="py-28 lg:pb-14 lg:pt-28">
        <Link href="/">
          <Logo fill={colors.gray['02']} className="mx-auto lg:scale-150" />
        </Link>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-white font-bold px-8 lg:bg-gray-80 lg:px-14 lg:py-12 lg:w-[670px] lg:mx-auto lg:rounded-[32px]"
      >
        <h1 className="text-2xl font-black mb-6">Forgot Password</h1>

        {serverError && <p className="text-red-500 mb-4">{serverError}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

        <fieldset className="mb-8">
          <label>Email</label>
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            className={cn(InputStyle)}
          />
          {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
        </fieldset>

        <button
          type="submit"
          className="mb-2 uppercase font-black text-2xl bg-blue-30 w-full py-[18px] rounded-2xl"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Send Reset Link'}
        </button>

        <p className="w-full flex items-center justify-center mt-4">
          <Link href="/login" className="text-blue-10 normal-case">
            Back to Login
          </Link>
        </p>
      </form>
    </main>
  )
}
