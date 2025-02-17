'use client'

import Logo from '@/components/svg/Logo'
import { cn } from '@/utilities/cn'
import { colors } from '@/utilities/colors'
import { InputStyle } from '@/utilities/tailwindShared'
import Link from 'next/link'
import React, { useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/providers/Auth'

type FormData = {
  email: string
  password: string
}

export default function LoginForm() {
  const searchParams = useSearchParams()
  const redirect = useRef(searchParams.get('redirect'))
  const redirectParam = searchParams.get('redirect')
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<null | string>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await login(data)
        if (redirect?.current) {
          router.push(redirect.current)
        } else {
          router.push('/')
        }
      } catch (_) {
        setError('Invalid credentials. Please try again.')
      }
    },
    [login, router]
  )

  return (
    <main className="uppercase bg-gray-90 lg:flex lg:items-center lg:justify-center lg:flex-col min-h-screen h-full overflow-y-scroll lg:w-screen pb-10 lg:pb-0">
      <header className="py-28 lg:pb-14 lg:pt-0">
        <Link href="/">
          <Logo fill={colors.gray['02']} className="mx-auto lg:scale-150" />
        </Link>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-white font-bold px-8 lg:bg-gray-80 lg:px-14 lg:py-12 lg:w-[670px] lg:mx-auto lg:rounded-[32px]"
      >
        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}
        <fieldset className="mb-8">
          <label>Email</label>
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            className={cn(InputStyle)}
          />
          {errors.email && (
            <p className="text-red-500 mt-1">{errors.email.message}</p>
          )}
        </fieldset>
        <fieldset className="mb-16">
          <label>Password</label>
          <input
            {...register('password', { required: 'Password is required' })}
            type="password"
            className={cn(InputStyle)}
          />
          {errors.password && (
            <p className="text-red-500 mt-1">{errors.password.message}</p>
          )}
        </fieldset>
        <button
          type="submit"
          className="mb-2 uppercase font-black text-2xl bg-blue-30 w-full py-[18px] rounded-2xl"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Login'}
        </button>
        <p className="w-full flex items-center justify-center">
          <Link href={`/register${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''}`} className="text-blue-10">
            Or create account
          </Link>
        </p>

        <div className="flex flex-col items-center mt-4 text-sm">
        <Link href="/forgot-password" className="text-blue-10 normal-case">
          Forgot Password?
        </Link>
      </div>
      </form>
    </main>
  )
}

