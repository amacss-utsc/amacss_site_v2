import { redirect } from "next/navigation"
import { ErrDefault, FetchEventById } from "@/app/(frontend)/_data"
import EventRegister from "@/components/EventRegister"
import { getPayload } from "payload"
import config from "@payload-config"
import Link from "next/link"
import { createSupabaseServerClient } from "@/utilities/supabase/server"
import { EVENT_REGISTRATION_OPEN } from "@/utilities/auth"
import { isRegistrationOpen } from "@/utilities/eventRegistration"
import { getEmailVerification } from "@/utilities/verification"
import { smsIsConfigured } from "@/utilities/notifications/sms"

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

  const { event, error } = await FetchEventById(id)

  // No point asking someone to log in for an event they can't register for.
  if (event && !isRegistrationOpen(event)) {
    return (
      <main className="flex min-h-full items-center justify-center overflow-y-auto bg-gray-90 px-7 py-12 text-gray-02 lg:rounded-tl-[32px] lg:px-20">
        <section className="max-w-xl rounded-[28px] bg-gray-80 p-8 text-center shadow-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-blue-10">
            {event.title}
          </p>
          <h1 className="text-4xl font-black">Registration has closed</h1>
          <p className="mt-4 text-lg normal-case text-gray-10">
            This event is no longer accepting registrations.
          </p>
          <Link
            href="/calendar"
            className="mt-8 inline-block rounded-2xl bg-blue-30 px-8 py-4 text-xl font-black uppercase text-white transition-colors hover:bg-blue-40"
          >
            Back to calendar
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
    const registrationPath = `/register/event/${id}`
    redirect(`/register?redirect=${encodeURIComponent(registrationPath)}`)
  }

  if (!(await getEmailVerification(user))) {
    return (
      <main className="flex min-h-full items-center justify-center overflow-y-auto bg-gray-90 px-7 py-12 text-gray-02 lg:rounded-tl-[32px] lg:px-20">
        <section className="max-w-xl rounded-[28px] bg-gray-80 p-8 text-center shadow-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-blue-10">One more step</p>
          <h1 className="text-4xl font-black">Verify your U of T email</h1>
          <p className="mt-4 text-lg normal-case text-gray-10">You can browse events now. To register, verify the email address on your account with a code.</p>
          <Link href={`/profile?next=${encodeURIComponent(`/register/event/${id}`)}`} className="mt-8 inline-block rounded-2xl bg-blue-30 px-8 py-4 text-xl font-black uppercase text-white transition-colors hover:bg-blue-40">Verify email</Link>
        </section>
      </main>
    )
  }

  const e = ErrDefault(error, event, {})
  if (e.regStyle === "external" && e.registrationLink) {
    let destination: URL | null = null
    try {
      destination = new URL(e.registrationLink)
    } catch {}
    if (destination && (destination.protocol === "https:" || destination.protocol === "http:")) {
      redirect(destination.toString())
    }
  }
  if (e.regStyle !== "internal") {
    return (
      <main className="flex min-h-full items-center justify-center bg-gray-90 px-7 py-12 text-gray-02 lg:rounded-tl-[32px] lg:px-20">
        <section className="rounded-[28px] bg-gray-80 p-8 text-center shadow-2xl">
          <h1 className="text-3xl font-black">Registration is not available for this event</h1>
          <Link href="/events" className="mt-6 inline-block rounded-2xl bg-blue-30 px-6 py-3 font-bold text-white">Back to events</Link>
        </section>
      </main>
    )
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

  return <EventRegister event={e} smsAvailable={smsIsConfigured()} smsTermsUrl={process.env.SMS_TERMS_URL || ""} smsPrivacyUrl={process.env.SMS_PRIVACY_URL || ""} />
}
