import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ErrDefault, FetchEventById } from "@/app/(frontend)/_data"
import EventRegister from "@/components/EventRegister"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params

  const cookieStore = await cookies()
  const token = cookieStore.get("payload-token")

  if (!token) {
    redirect("/login")
  }

  const { event, error } = await FetchEventById(id)

  const e = ErrDefault(error, event, {})

  return <EventRegister event={e} />
}

