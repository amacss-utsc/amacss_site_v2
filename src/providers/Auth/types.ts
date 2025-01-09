import type { Permissions } from "payload"
import type { ClubMember } from "@/payload-types"

export type ResetPassword = (args: {
  password: string
  passwordConfirm: string
  token: string
}) => Promise<ClubMember>

export type ForgotPassword = (args: { email: string }) => Promise<ClubMember>

export type Create = (args: {
  email: string
  firstName: string
  lastName: string
  password: string
}) => Promise<ClubMember>

export type Login = (args: {
  email: string
  password: string
}) => Promise<ClubMember>

export type Logout = () => Promise<void>

export interface AuthContext {
  create: Create
  forgotPassword: ForgotPassword
  login: Login
  logout: Logout
  permissions?: null | Permissions
  resetPassword: ResetPassword
  setPermissions: (permissions: null | Permissions) => void
  setUser: (user: null | ClubMember) => void
  user?: null | ClubMember
}
