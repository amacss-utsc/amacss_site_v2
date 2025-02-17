import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ErrDefault, FetchEventById } from "@/app/(frontend)/_data"
import EventRegister from "@/components/EventRegister"
import { getPayload } from "payload"
import config from "@payload-config"
import Link from "next/link"

async function fetchCurrentUser(token: string) {
  const res = await fetch(
    `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/club-member/me`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
      cache: "no-store", // ensure we always get the latest
    },
  )
  if (!res.ok) return null
  return res.json()
}

async function checkExistingRegistration(eventId: string, userId: string) {
  const payload = await getPayload({ config })

  const registrations = await payload.find({
    collection: "registrations",
    where: {
      eventId: {
        equals: eventId,
      },
      userId: {
        equals: userId,
      },
    },
  })
  return registrations
}

export default async function Page({ params }: any) {
  const { id } = await params

  const cookieStore = await cookies()
  const token = cookieStore.get("payload-token")

  if (!token) {
    redirect(`/login?redirect=${encodeURIComponent(`/register/event/${id}`)}`)
  }

  const user = await fetchCurrentUser(token?.value)
  if (!user || !user.user || !user.user.id) {
    redirect(`/login?redirect=${encodeURIComponent(`/register/event/${id}`)}`)
  }

  const existingRegistration = await checkExistingRegistration(id, user.user.id)
  if (existingRegistration?.docs?.length > 0) {
    return (
      <main className="pt-12 min-h-full h-full overflow-y-scroll bg-gray-90 text-gray-02 px-7 lg:px-20 lg:rounded-tl-[32px]">
        <h1 className="text-4xl font-bold mb-4">
          You have already registered for this event!
        </h1>
        <p className="text-xl text-gray-10 mb-6">
          If you need to change your registration details, please email{" "}
          <a
            href="mailto:amacss.uoft@gmail.com"
            className="underline hover:text-blue-30 transition-colors"
          >
            amacss.uoft@gmail.com
          </a>
          .
        </p>
        <Link
          href="/events"
          className="inline-block py-3 px-6 bg-blue-30 hover:bg-blue-40 
                    text-center rounded-[16px] text-white font-bold 
                    transition-colors normal-case"
        >
          Back to Events
        </Link>
      </main>
    )
  }

  const { event, error } = await FetchEventById(id)

  const e = ErrDefault(error, event, {})

  return <EventRegister event={e} />
}
