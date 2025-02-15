'use client'

import Logo from '@/components/svg/Logo'
import { cn } from '@/utilities/cn'
import { colors } from '@/utilities/colors'
import { InputStyle } from '@/utilities/tailwindShared'
import Link from 'next/link'
import React, { useState, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/Auth'

type FormData = {
  firstName: string
  lastName: string
  email: string
  password: string
  passwordConfirm: string
}

export default function Page() {
  const { login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/club-member`, {
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      if (!response.ok) {
        setError('There was an error creating the account.')
        setLoading(false)
        return
      }

      try {
        await login({ email: data.email, password: data.password })
        router.push(`/`)
      } catch {
        setError('There was an error with the credentials provided. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [router]
  )

  return (
    <main className="uppercase bg-gray-90 min-h-screen h-full lg:w-screen overflow-y-scroll pb-10 lg:pb-28">
      <header className="py-28 lg:pb-14 lg:pt-28">
        <Link href="/">
          <Logo fill={colors.gray['02']} className="mx-auto lg:scale-150" />
        </Link>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-white font-bold px-8 lg:bg-gray-80 lg:px-14 lg:py-12 lg:w-[670px] lg:mx-auto lg:rounded-[32px]"
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-14 ">
          <fieldset className="mb-2 lg:mb-6">
            <label>First Name</label>
            <input
              className={cn(InputStyle)}
              {...register('firstName', { required: 'First Name is required' })}
            />
            {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
          </fieldset>
          <fieldset className="mb-2 lg:mb-6">
            <label>Last Name</label>
            <input
              className={cn(InputStyle)}
              {...register('lastName', { required: 'Last Name is required' })}
            />
            {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
          </fieldset>
        </div>
        <fieldset className="mb-2 lg:mb-6">
          <label>Email</label>
          <input
            className={cn(InputStyle)}
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </fieldset>
        <fieldset className="mb-2 lg:mb-6">
          <label>Password</label>
          <input
            className={cn(InputStyle)}
            type="password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </fieldset>
        <fieldset className="mb-8 lg:mb-14">
          <label>Re-Enter Password</label>
          <input
            className={cn(InputStyle)}
            type="password"
            {...register('passwordConfirm', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === password.current || 'The passwords do not match',
            })}
          />
          {errors.passwordConfirm && (
            <p className="text-red-500">{errors.passwordConfirm.message}</p>
          )}
        </fieldset>
        <button
          className="mb-2 uppercase font-black text-2xl bg-blue-30 w-full py-[18px] rounded-2xl"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Register'}
        </button>
        <p className="w-full flex items-center justify-center">
          <Link href="/login" className="text-blue-10 normal-case">
            Login instead
          </Link>
        </p>
      </form>
    </main>
  )
}

