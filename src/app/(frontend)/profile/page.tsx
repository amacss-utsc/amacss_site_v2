import config from "@payload-config"
import { createSupabaseServerClient } from "@/utilities/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getPayload } from "payload"

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login?redirect=/profile")

  const payload = await getPayload({ config })
  const registrations = await payload.find({
    collection: "registrations",
    where: { supabaseUserId: { equals: user.id } },
    depth: 1,
  })
  const fullName = String(user.user_metadata?.full_name || "")
  const phone = String(user.user_metadata?.phone || "")

  return (
    <main className="min-h-full overflow-y-auto bg-gray-90 px-7 pt-8 text-gray-02 lg:rounded-tl-[32px] lg:px-20 lg:pt-12">
      <div className="mb-12 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-blue-10">
            Your account
          </p>
          <h1 className="text-4xl font-black">{fullName || user.email}</h1>
          <p className="mt-3 normal-case text-gray-10">{user.email}</p>
          {phone && <p className="mt-1 normal-case text-gray-10">{phone}</p>}
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-red-400/50 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400">
          <span aria-hidden="true">•</span> Email verification coming soon
        </div>
      </div>

      <h2 className="mb-6 text-3xl font-bold">Your Registrations</h2>
      {!registrations.docs.length ? (
        <div className="rounded-[24px] bg-gray-80 p-8 normal-case text-gray-10">
          <p className="text-lg">You have not registered for any events yet.</p>
          <Link
            href="/events"
            className="mt-6 inline-block rounded-[16px] bg-blue-30 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-40"
          >
            Browse events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 pb-12 md:grid-cols-2 lg:grid-cols-3">
          {registrations.docs.map((registration) => {
            const event =
              typeof registration.eventId === "object"
                ? registration.eventId
                : null
            if (!event) return null

            return (
              <article
                key={registration.id}
                className="flex flex-col rounded-[28px] border-2 border-transparent bg-gray-80 p-6 shadow-2xl transition-all hover:-translate-y-1 hover:border-blue-30/20"
              >
                <h3 className="mb-4 text-2xl font-semibold normal-case">
                  {event.title}
                </h3>
                <p className="mb-2 text-lg normal-case text-gray-20">
                  {new Date(event.date).toLocaleDateString("en-CA", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  @ {event.startTime} - {event.endTime}
                </p>
                {registration.referralCode && (
                  <p className="font-bold text-blue-30">
                    Referral Code: {registration.referralCode}
                  </p>
                )}
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}
