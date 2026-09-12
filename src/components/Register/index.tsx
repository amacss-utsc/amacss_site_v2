"use client"

import Logo from "@/components/svg/Logo"
import Close from "@/components/svg/Close"
import { useAuth } from "@/providers/Auth"
import {
  isUofTEmail,
  isValidPhoneNumber,
  ACCOUNT_REGISTRATION_OPEN,
  PHONE_ERROR,
  UOFT_EMAIL_ERROR,
} from "@/utilities/auth"
import { cn } from "@/utilities/cn"
import { colors } from "@/utilities/colors"
import { InputStyle } from "@/utilities/tailwindShared"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useCallback, useState } from "react"
import { useForm } from "react-hook-form"

type FormData = {
  fullName: string
  email: string
  phone: string
  password: string
  passwordConfirm: string
}

function safeRedirect(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/"
}

export default function RegisterForm() {
  const { create } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get("redirect")
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  const password = watch("password", "")

  const onSubmit = useCallback(
    async (data: FormData) => {
      setError(null)
      try {
        await create(data)
        router.replace(safeRedirect(redirectParam))
        router.refresh()
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : ""
        setError(
          message === UOFT_EMAIL_ERROR
            ? message
            : message ||
                "There was an error creating your account. Please try again.",
        )
      }
    },
    [create, redirectParam, router],
  )

  if (!ACCOUNT_REGISTRATION_OPEN) {
    return (
      <main className="flex min-h-screen flex-col overflow-y-auto bg-gray-90 px-8 pb-10 uppercase lg:w-screen lg:items-center lg:justify-center lg:pb-0">
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

        <section className="text-center font-bold text-white lg:mx-auto lg:w-[670px] lg:rounded-[32px] lg:bg-gray-80 lg:px-14 lg:py-16">
          <p className="mb-3 text-sm tracking-[0.16em] text-blue-10">
            Coming soon
          </p>
          <h1 className="text-3xl font-black">Member registration is paused</h1>
          <p className="mx-auto mt-4 max-w-lg normal-case font-medium text-gray-10">
            We’re finishing email verification before opening new accounts.
            Existing members can still log in.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block w-full rounded-2xl bg-blue-30 py-[18px] text-2xl font-black text-white transition-colors hover:bg-blue-40"
          >
            Log in
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen overflow-y-auto bg-gray-90 pb-10 uppercase lg:w-screen lg:pb-20">
      <Link
        href="/"
        aria-label="Continue browsing without signing in"
        title="Continue browsing"
        className="fixed right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gray-30 bg-gray-80 transition-colors hover:border-gray-02 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-10"
      >
        <Close className="h-5 w-5 [&_path]:stroke-gray-02" />
      </Link>

      <header className="py-16 lg:pb-12 lg:pt-20">
        <Link href="/" aria-label="Back to AMACSS home">
          <Logo fill={colors.gray["02"]} className="mx-auto lg:scale-150" />
        </Link>
      </header>

      <section className="px-8 font-bold text-white lg:mx-auto lg:w-[670px] lg:rounded-[32px] lg:bg-gray-80 lg:px-14 lg:py-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8 normal-case">
            <h1 className="text-3xl font-black uppercase">
              Create your account
            </h1>
            <p className="mt-2 font-medium text-gray-10">
              Create an account using your UofT email address.
            </p>
          </div>

          {error && (
            <p role="alert" className="mb-5 normal-case text-red-400">
              {error}
            </p>
          )}

          <fieldset className="mb-5">
            <label htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              {...register("fullName", {
                required: "Full name is required",
                minLength: { value: 2, message: "Enter your full name" },
              })}
              type="text"
              autoComplete="name"
              className={cn(InputStyle)}
            />
            {errors.fullName && (
              <p className="mt-1 normal-case text-red-400">
                {errors.fullName.message}
              </p>
            )}
          </fieldset>

          <fieldset className="mb-5">
            <label htmlFor="signup-email">UofT Email</label>
            <input
              id="signup-email"
              {...register("email", {
                required: "Email is required",
                validate: (value) => isUofTEmail(value) || UOFT_EMAIL_ERROR,
              })}
              type="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              maxLength={254}
              spellCheck={false}
              className={cn(InputStyle)}
            />
            {errors.email && (
              <p className="mt-1 normal-case text-red-400">
                {errors.email.message}
              </p>
            )}
          </fieldset>

          <fieldset className="mb-5">
            <label htmlFor="signup-phone">Phone Number</label>
            <input
              id="signup-phone"
              {...register("phone", {
                required: "Phone number is required",
                validate: (value) => isValidPhoneNumber(value) || PHONE_ERROR,
              })}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={24}
              placeholder="(416) 555-0123"
              className={cn(
                InputStyle,
                "placeholder:font-medium placeholder:text-gray-20",
              )}
            />
            {errors.phone && (
              <p className="mt-1 normal-case text-red-400">
                {errors.phone.message}
              </p>
            )}
          </fieldset>

          <div className="lg:grid lg:grid-cols-2 lg:gap-x-6">
            <fieldset className="mb-5">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Use at least 8 characters" },
                })}
                type="password"
                autoComplete="new-password"
                className={cn(InputStyle)}
              />
              {errors.password && (
                <p className="mt-1 normal-case text-red-400">
                  {errors.password.message}
                </p>
              )}
            </fieldset>

            <fieldset className="mb-8">
              <label htmlFor="signup-password-confirm">Confirm Password</label>
              <input
                id="signup-password-confirm"
                {...register("passwordConfirm", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                type="password"
                autoComplete="new-password"
                className={cn(InputStyle)}
              />
              {errors.passwordConfirm && (
                <p className="mt-1 normal-case text-red-400">
                  {errors.passwordConfirm.message}
                </p>
              )}
            </fieldset>
          </div>

          <button
            className="mb-3 w-full rounded-2xl bg-blue-30 py-[18px] text-2xl font-black uppercase transition-colors hover:bg-blue-40 disabled:cursor-wait disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          <p className="flex w-full items-center justify-center normal-case text-gray-10">
            Already have an account?{" "}
            <Link
              href={`/login${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""}`}
              className="ml-1 text-blue-10"
            >
              Log in
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}
