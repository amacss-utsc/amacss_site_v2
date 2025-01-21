import React from 'react'

import { StateProvider } from './State'
import { AuthProvider } from './Auth'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <AuthProvider>
      <StateProvider>
        {children}
      </StateProvider>
    </AuthProvider>
  )
}

