"use client"

import Logo from "@/components/svg/Logo"
import Close from "@/components/svg/Close"
import { useAuth } from "@/providers/Auth"
import { isUofTEmail, UOFT_EMAIL_ERROR } from "@/utilities/auth"
import { cn } from "@/utilities/cn"
import { colors } from "@/utilities/colors"
import { InputStyle } from "@/utilities/tailwindShared"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useCallback, useState } from "react"
import { useForm } from "react-hook-form"

type FormData = { email: string; password: string }

function safeRedirect(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/"
}

export default function LoginForm() {
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get("redirect")
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "confirmation-link"
      ? "That email link is invalid or has expired. Please try again."
      : null,
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      setError(null)
      try {
        await login(data)
        router.replace(safeRedirect(redirectParam))
        router.refresh()
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : ""
        setError(
          message === UOFT_EMAIL_ERROR
            ? message
            : "We couldn't log you in. Check your email, password, and email verification.",
        )
      }
    },
    [login, redirectParam, router],
  )

  return (
    <main className="uppercase bg-gray-90 flex min-h-screen flex-col overflow-y-auto pb-10 lg:w-screen lg:items-center lg:justify-center lg:pb-0">
      <Link
        href="/"
        aria-label="Continue browsing without signing in"
        title="Continue browsing"
        className="fixed right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gray-30 bg-gray-80 transition-colors hover:border-gray-02 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-10"
      >
        <Close className="h-5 w-5 [&_path]:stroke-gray-02" />
      </Link>

      <header className="py-20 lg:pb-14 lg:pt-0">
        <Link href="/" aria-label="Back to AMACSS home">
          <Logo fill={colors.gray["02"]} className="mx-auto lg:scale-150" />
        </Link>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-8 font-bold text-white lg:mx-auto lg:w-[670px] lg:rounded-[32px] lg:bg-gray-80 lg:px-14 lg:py-12"
      >
        <div className="mb-8 normal-case">
          <h1 className="text-3xl font-black uppercase">Welcome back</h1>
          <p className="mt-2 font-medium text-gray-10">
            Log in with your University of Toronto email.
          </p>
        </div>

        {error && (
          <p role="alert" className="mb-5 normal-case text-red-400">
            {error}
          </p>
        )}

        <fieldset className="mb-6">
          <label htmlFor="login-email">UofT Email</label>
          <input
            id="login-email"
            {...register("email", {
              required: "Email is required",
              validate: (value) => isUofTEmail(value) || UOFT_EMAIL_ERROR,
            })}
            type="email"
            inputMode="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            className={cn(InputStyle)}
          />
          {errors.email && (
            <p className="mt-1 normal-case text-red-400">
              {errors.email.message}
            </p>
          )}
        </fieldset>

        <fieldset className="mb-10">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password">Password</label>
            <Link
              href="/forgot-password"
              className="normal-case text-sm text-blue-10"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="login-password"
            {...register("password", { required: "Password is required" })}
            type="password"
            autoComplete="current-password"
            className={cn(InputStyle)}
          />
          {errors.password && (
            <p className="mt-1 normal-case text-red-400">
              {errors.password.message}
            </p>
          )}
        </fieldset>

        <button
          type="submit"
          className="mb-3 w-full rounded-2xl bg-blue-30 py-[18px] text-2xl font-black uppercase transition-colors hover:bg-blue-40 disabled:cursor-wait disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
        <p className="flex w-full items-center justify-center normal-case text-gray-10">
          New here?{" "}
          <Link
            href={`/register${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""}`}
            className="ml-1 text-blue-10"
          >
            Create an account
          </Link>
        </p>
      </form>
    </main>
  )
}
