"use client"

import type { User } from "@supabase/supabase-js"
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  isUofTEmail,
  isValidPhoneNumber,
  normalizeEmail,
  ACCOUNT_REGISTRATION_OPEN,
  PHONE_ERROR,
  UOFT_EMAIL_ERROR,
} from "@/utilities/auth"
import {
  createSupabaseBrowserClient,
  hasSupabaseBrowserConfig,
} from "@/utilities/supabase/client"
import type { AuthContext, AuthUser } from "./types"

const Context = createContext<AuthContext | null>(null)

function mapUser(user: User): AuthUser {
  const fullName = String(user.user_metadata?.full_name || "").trim()
  const [firstName = "", ...lastNameParts] = fullName.split(/\s+/)

  return {
    id: user.id,
    email: user.email || "",
    fullName,
    firstName,
    lastName: lastNameParts.join(" "),
    phone: String(user.user_metadata?.phone || ""),
    emailConfirmed: Boolean(user.email_confirmed_at),
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const supabase = useMemo(
    () => (hasSupabaseBrowserConfig() ? createSupabaseBrowserClient() : null),
    [],
  )
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    if (!supabase) return

    void supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? mapUser(data.user) : null)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapUser(session.user) : null)
    })

    return () => data.subscription.unsubscribe()
  }, [supabase])

  const requireClient = useCallback(() => {
    if (!supabase) throw new Error("Supabase is not configured yet.")
    return supabase
  }, [supabase])

  const create = useCallback<AuthContext["create"]>(
    async ({ email, fullName, phone, password }) => {
      if (!ACCOUNT_REGISTRATION_OPEN) {
        throw new Error("New member registration is not open yet.")
      }

      if (!isUofTEmail(email)) throw new Error(UOFT_EMAIL_ERROR)
      if (!isValidPhoneNumber(phone)) throw new Error(PHONE_ERROR)

      const client = requireClient()
      const { data, error } = await client.auth.signUp({
        email: normalizeEmail(email),
        password,
        options: {
          data: { full_name: fullName.trim(), phone: phone.trim() },
        },
      })

      if (error) throw error
      if (!data.user || !data.session) {
        throw new Error(
          "Email confirmation is still enabled in Supabase. Turn it off and try again.",
        )
      }

      setUser(mapUser(data.user))
    },
    [requireClient],
  )

  const login = useCallback<AuthContext["login"]>(
    async ({ email, password }) => {
      if (!isUofTEmail(email)) throw new Error(UOFT_EMAIL_ERROR)

      const { data, error } = await requireClient().auth.signInWithPassword({
        email: normalizeEmail(email),
        password,
      })
      if (error) throw error

      const authUser = mapUser(data.user)
      setUser(authUser)
      return authUser
    },
    [requireClient],
  )

  const logout = useCallback<AuthContext["logout"]>(async () => {
    const { error } = await requireClient().auth.signOut()
    if (error) throw error
    setUser(null)
  }, [requireClient])

  const forgotPassword = useCallback<AuthContext["forgotPassword"]>(
    async ({ email }) => {
      if (!isUofTEmail(email)) throw new Error(UOFT_EMAIL_ERROR)

      const { error } = await requireClient().auth.resetPasswordForEmail(
        normalizeEmail(email),
        {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        },
      )
      if (error) throw error
    },
    [requireClient],
  )

  const resetPassword = useCallback<AuthContext["resetPassword"]>(
    async ({ password }) => {
      const { error } = await requireClient().auth.updateUser({ password })
      if (error) throw error
    },
    [requireClient],
  )

  return (
    <Context.Provider
      value={{ create, forgotPassword, login, logout, resetPassword, user }}
    >
      {children}
    </Context.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(Context)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}
