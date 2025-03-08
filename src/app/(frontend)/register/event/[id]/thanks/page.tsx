import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getPayload } from "payload"
import config from "@payload-config"
import Link from "next/link"


export default async function ThankYouPage({ params }: any) {
  const { id: eventId } = await params

  const cookieStore = await cookies()
  const token = cookieStore.get("payload-token")
  if (!token) {
    redirect("/login")
  }

  const user = await fetchCurrentUser(token.value)
  if (!user || !user.user?.id) {
    redirect("/login")
  }

  const payload = await getPayload({ config })
  const registration = await payload.find({
    collection: "registrations",
    where: {
      userId: { equals: user.user.id },
      eventId: { equals: eventId },
    },
    limit: 1,
  })

  let referralCode: string | null = null;
  if (registration?.docs?.length) {
    referralCode = registration.docs[0].referralCode ?? null;
  }

  return (
    <main className="pt-12 min-h-full h-full overflow-y-scroll bg-gray-90 text-gray-02 px-7 lg:px-20 lg:rounded-tl-[32px]">
      <h1 className="text-4xl font-bold mb-4">Thank you for registering!</h1>
      <p className="text-xl text-gray-10 mb-6">
        We look forward to seeing you at the event. If you need to update your
        registration details, please email{" "}
        <a
          href="mailto:amacss.uoft@gmail.com"
          className="underline hover:text-blue-30 transition-colors"
        >
          amacss.uoft@gmail.com
        </a>
        . Please ensure that you have completed the e-transfer to amacss.pro@gmail.com.
      </p>

      {referralCode && (
        <p className="text-xl text-gray-10 mb-6">
          Your referral code is:{" "}
          <span className="font-bold text-blue-20">{referralCode}</span>
        </p>
      )}

      <div className="flex gap-4">
        <Link
          href="/events"
          className="inline-block py-3 px-6 bg-blue-30 hover:bg-blue-40 
            text-center rounded-[16px] text-white font-bold 
            transition-colors normal-case"
        >
          Back to Events
        </Link>
        <Link
          href="/profile"
          className="inline-block py-3 px-6 bg-blue-10 hover:bg-blue-40 
            text-center rounded-[16px] text-white font-bold 
            transition-colors normal-case"
        >
          Your Profile
        </Link>
      </div>
    </main>
  )
}

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
