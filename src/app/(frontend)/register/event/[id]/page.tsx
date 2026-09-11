import { redirect } from "next/navigation"
import { ErrDefault, FetchEventById } from "@/app/(frontend)/_data"
import EventRegister from "@/components/EventRegister"
import { getPayload } from "payload"
import config from "@payload-config"
import Link from "next/link"
import { createSupabaseServerClient } from "@/utilities/supabase/server"
import { EVENT_REGISTRATION_OPEN } from "@/utilities/auth"

async function checkExistingRegistration(eventId: string, userId: string) {
  const payload = await getPayload({ config })

  const registrations = await payload.find({
    collection: "registrations",
    where: {
      eventId: {
        equals: eventId,
      },
      supabaseUserId: {
        equals: userId,
      },
    },
  })
  return registrations
}

export default async function Page({ params }: any) {
  const { id } = await params

  if (!EVENT_REGISTRATION_OPEN) {
    return (
      <main className="flex min-h-full items-center justify-center overflow-y-auto bg-gray-90 px-7 py-12 text-gray-02 lg:rounded-tl-[32px] lg:px-20">
        <section className="max-w-xl rounded-[28px] bg-gray-80 p-8 text-center shadow-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-blue-10">
            Coming soon
          </p>
          <h1 className="text-4xl font-black">Event registration is paused</h1>
          <p className="mt-4 text-lg normal-case text-gray-10">
            Email verification will be required before members can register for
            events.
          </p>
          <Link
            href="/events"
            className="mt-8 inline-block rounded-2xl bg-blue-30 px-8 py-4 text-xl font-black uppercase text-white transition-colors hover:bg-blue-40"
          >
            Back to events
          </Link>
        </section>
      </main>
    )
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/register/event/${id}`)}`)
  }

  const existingRegistration = await checkExistingRegistration(id, user.id)
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
