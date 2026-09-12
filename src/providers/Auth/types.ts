export type AuthUser = {
  id: string
  email: string
  fullName: string
  firstName: string
  lastName: string
  phone: string
  emailConfirmed: boolean
}

export type ResetPassword = (args: {
  password: string
  passwordConfirm: string
}) => Promise<void>

export type ForgotPassword = (args: { email: string }) => Promise<void>

export type Create = (args: {
  email: string
  fullName: string
  phone: string
  password: string
}) => Promise<void>

export type Login = (args: {
  email: string
  password: string
}) => Promise<AuthUser>

export type Logout = () => Promise<void>

export interface AuthContext {
  create: Create
  forgotPassword: ForgotPassword
  login: Login
  logout: Logout
  resetPassword: ResetPassword
  user: null | AuthUser
}
