import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import type { Registration, Event } from '@/payload-types'

async function fetchCurrentUser(token: string) {
    const res = await fetch(
      `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/club-member/me`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
        cache: "no-store",
      },
    )
    if (!res.ok) return null
    return res.json()
  }

export default async function ProfilePage() {
  const cookieStore = await cookies()
    const token = cookieStore.get("payload-token")

    if (!token) {
        redirect('/login?redirect=/profile')
    }
  
    const user = await fetchCurrentUser(token?.value)
    if (!user || !user.user || !user.user.id) {
        redirect('/login?redirect=/profile')
    }
  if (!token) {
    redirect('/login?redirect=/profile')
  }

  const payload = await getPayload({ config })

  const userId = user.user.id

  const registrations = (await payload.find({
    collection: 'registrations',
    where: {
      userId: {
        equals: userId,
      },
    },
    depth: 1,
  }))

  if (!registrations?.docs?.length) {
    return (
      <main className="pt-6 min-h-full h-full overflow-y-scroll bg-gray-90 text-gray-02 px-7 lg:px-20 lg:rounded-tl-[32px]">
        <h1 className="text-4xl font-bold mb-8">Your Registrations</h1>
        <div className="text-center py-12 text-gray-40 text-xl">
          You have not registered for any events yet.
        </div>
        <Link
          href="/events"
          className="inline-block py-3 px-6 bg-blue-30 hover:bg-blue-40 
            text-center rounded-[16px] text-white font-bold 
            transition-colors normal-case mt-4"
        >
          Back to Events
        </Link>
      </main>
    )
  }

  return (
    <main className="pt-6 min-h-full h-full overflow-y-scroll bg-gray-90 text-gray-02 px-7 lg:px-20 lg:rounded-tl-[32px]">
      <h1 className="text-4xl font-bold mb-8">Registrations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {registrations.docs.map((reg) => {
          const event = typeof reg.eventId === 'object' ? reg.eventId : null
          if (!event) return null

          return (
            <article
              key={reg.id}
              className="flex flex-col bg-gray-80 rounded-[32px] p-6 
                shadow-2xl hover:shadow-3xl transition-all duration-300 
                hover:-translate-y-1 border-2 border-transparent 
                hover:border-blue-30/20 group"
            >
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-4 normal-case 
                          group-hover:text-blue-30 transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-20 text-lg mb-2 normal-case">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  @ {event.startTime} - {event.endTime}
                </p>
                {reg.referralCode && (
                  <p className="text-blue-30 font-bold">
                    Referral Code: {reg.referralCode}
                  </p>
                )}
              </div>
              {/* <div className="mt-auto pt-4">
                <Link
                  href={`/events/${event.id}`}
                  className="inline-block w-full py-3 px-6 bg-blue-30 hover:bg-blue-40 
                    text-center rounded-[16px] text-white font-bold 
                    transition-colors normal-case group-hover:scale-[1.02] 
                    transform-gpu"
                >
                  View Event
                </Link>
              </div> */}
            </article>
          )
        })}
      </div>
      {/* <div className="mt-10">
        <Link
          href="/events"
          className="inline-block py-3 px-6 bg-blue-30 hover:bg-blue-40 
            text-center rounded-[16px] text-white font-bold 
            transition-colors normal-case"
        >
          Back to Events
        </Link>
      </div> */}
    </main>
  )
}
