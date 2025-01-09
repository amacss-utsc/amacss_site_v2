'use client'

import type { Permissions } from 'payload'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import type { AuthContext, Create, ForgotPassword, Login, Logout, ResetPassword } from './types'

import { gql, CLUB_MEMBER } from './gql'
import { rest } from './rest'
import { ClubMember } from '@/payload-types'

const Context = createContext({} as AuthContext)

export const AuthProvider: React.FC<{ api?: 'gql' | 'rest'; children: React.ReactNode }> = ({
  api = 'rest',
  children,
}) => {
  const [user, setUser] = useState<null | ClubMember>()
  const [permissions, setPermissions] = useState<null | Permissions>(null)

  const create = useCallback<Create>(
    async (args) => {
      if (api === 'rest') {
        const clubMember = await rest(`/api/club-member`, args)
        setUser(clubMember)
        return clubMember
      }

      if (api === 'gql') {
        const { createClubMember: clubMember } = await gql(`mutation {
          createClubMember(data: { email: "${args.email}", password: "${args.password}", firstName: "${args.firstName}", lastName: "${args.lastName}" }) {
            ${CLUB_MEMBER}
          }
        }`)

        setUser(clubMember)
        return clubMember
      }
    },
    [api],
  )

  const login = useCallback<Login>(
    async (args) => {
      if (api === 'rest') {
        const clubMember = await rest(`/api/club-member/login`, args)
        setUser(clubMember)
        return clubMember
      }

      if (api === 'gql') {
        const { loginClubMember } = await gql(`mutation {
          loginClubMember(email: "${args.email}", password: "${args.password}") {
            clubMember {
              ${CLUB_MEMBER}
            }
            exp
          }
        }`)

        setUser(loginClubMember?.clubMember)
        return loginClubMember?.clubMember
      }
    },
    [api],
  )

  const logout = useCallback<Logout>(async () => {
    if (api === 'rest') {
      await rest(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/club-member/logout`)
      setUser(null)
      return
    }

    if (api === 'gql') {
      await gql(`mutation {
        logoutClubMember
      }`)

      setUser(null)
    }
  }, [api])

  useEffect(() => {
    const fetchMe = async () => {
      if (api === 'rest') {
        const clubMember = await rest(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/club-member/me`,
          {},
          { method: 'GET' },
        )
        setUser(clubMember)
      }

      if (api === 'gql') {
        const { meClubMember } = await gql(`query {
          meClubMember {
            clubMember {
              ${CLUB_MEMBER}
            }
            exp
          }
        }`)

        setUser(meClubMember.clubMember)
      }
    }

    void fetchMe()
  }, [api])

  const forgotPassword = useCallback<ForgotPassword>(
    async (args) => {
      if (api === 'rest') {
        const clubMember = await rest(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/club-member/forgot-password`,
          args,
        )
        setUser(clubMember)
        return clubMember
      }

      if (api === 'gql') {
        const { forgotPasswordClubMember } = await gql(`mutation {
          forgotPasswordClubMember(email: "${args.email}")
        }`)

        return forgotPasswordClubMember
      }
    },
    [api],
  )

  const resetPassword = useCallback<ResetPassword>(
    async (args) => {
      if (api === 'rest') {
        const clubMember = await rest(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/club-member/reset-password`,
          args,
        )
        setUser(clubMember)
        return clubMember
      }

      if (api === 'gql') {
        const { resetPasswordClubMember } = await gql(`mutation {
          resetPasswordClubMember(password: "${args.password}", token: "${args.token}") {
            clubMember {
              ${CLUB_MEMBER}
            }
          }
        }`)

        setUser(resetPasswordClubMember.clubMember)
        return resetPasswordClubMember.clubMember
      }
    },
    [api],
  )

  return (
    <Context.Provider
      value={{
        create,
        forgotPassword,
        login,
        logout,
        permissions,
        resetPassword,
        setPermissions,
        setUser,
        user,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useAuth: () => AuthContext = () => useContext(Context)

