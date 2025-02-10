import React, { Suspense } from "react"
import ResetPasswordForm from "@/components/ResetPasswordForm"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
