'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/Auth'

// ! WARNING !
// IN CASE SOME DEV OTHER THAN ME MAKES THIS PAGE:
//
// This is currently a client page, I am being lazy, what needs to be done when
// this page is build out properly, is as follows.
//
// You must make another component to stick the entire page content in EXCEPT
// THE FETCHING, that should be done in here. This file should have the use
// client directive removed at that time, and it should be put on the file
// wrapping the entire frontend, you should pass whatever is fetched into that.
// This way you retain SSR fetching and keep the necessary client logic.
//
// <3

export default function Page() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user === null) {
      console.log("JUICED OUT", user)
      router.push('/')
    }
  }, [user, router])

  if (user == null) {
    return null
  }

  return (
    <div>
      <h1 className="text-white">Welcome, {user.firstName}!</h1>
    </div>
  )
}

