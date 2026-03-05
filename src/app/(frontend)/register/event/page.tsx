import { redirect } from "next/navigation"

export default function Page() {
  redirect(process.env.NEXT_PUBLIC_GALA_URL as string)
}
