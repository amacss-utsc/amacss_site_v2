'use client'

import React, { Suspense } from 'react'
import LoginForm from '@/components/Login'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}

