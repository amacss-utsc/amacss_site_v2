'use client'
import React, { Suspense } from 'react'
import RegisterForm from '@/components/Register'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
