import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "SMS Privacy Policy | AMACSS" }

export default function SmsPrivacyPage() {
  return (
    <main className="min-h-full overflow-y-auto bg-gray-90 px-7 py-12 text-gray-02 lg:rounded-tl-[32px] lg:px-20">
      <article className="mx-auto max-w-3xl rounded-[28px] bg-gray-80 p-7 normal-case shadow-2xl lg:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-10">AMACSS</p>
        <h1 className="mt-2 text-4xl font-black uppercase">SMS Privacy Policy</h1>
        <p className="mt-3 text-sm text-gray-10">Last updated: September 21, 2026</p>

        <div className="mt-8 space-y-6 leading-7 text-gray-05">
          <section>
            <h2 className="text-2xl font-bold text-white">Information we collect</h2>
            <p className="mt-2">When you create an AMACSS member account, we collect the phone number you provide. When you opt in to event text messages, we also record the event, the phone number used, and the date and time of your consent.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white">How we use it</h2>
            <p className="mt-2">We use this information to send the event confirmation and reminder you requested, operate the notification service, troubleshoot delivery, respect opt-out requests, and maintain records of consent.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white">Service providers and disclosure</h2>
            <p className="mt-2">AMACSS uses service providers, including Twilio, to deliver text messages and may disclose information when required by law or needed to protect the service. We do not sell phone numbers. Mobile information and SMS opt-in consent are not shared with third parties or affiliates for their marketing or promotional purposes.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white">Choices and contact</h2>
            <p className="mt-2">You can decline SMS when registering and still complete an event registration. Reply <strong>STOP</strong> to stop future texts. For privacy questions or requests concerning your information, email <a className="text-blue-10 underline" href="mailto:amacss.uoft@gmail.com">amacss.uoft@gmail.com</a>.</p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/sms-terms" className="rounded-xl bg-blue-30 px-5 py-3 font-bold text-white">SMS Terms</Link>
          <Link href="/" className="rounded-xl border border-gray-30 px-5 py-3 font-bold text-white">Back to AMACSS</Link>
        </div>
      </article>
    </main>
  )
}
