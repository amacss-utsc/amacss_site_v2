import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "SMS Terms | AMACSS" }

export default function SmsTermsPage() {
  return (
    <main className="min-h-full overflow-y-auto bg-gray-90 px-7 py-12 text-gray-02 lg:rounded-tl-[32px] lg:px-20">
      <article className="mx-auto max-w-3xl rounded-[28px] bg-gray-80 p-7 normal-case shadow-2xl lg:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-10">AMACSS</p>
        <h1 className="mt-2 text-4xl font-black uppercase">SMS Terms</h1>
        <p className="mt-3 text-sm text-gray-10">Last updated: September 21, 2026</p>

        <div className="mt-8 space-y-6 leading-7 text-gray-05">
          <section>
            <h2 className="text-2xl font-bold text-white">Program description</h2>
            <p className="mt-2">The Association of Mathematical and Computer Science Students (AMACSS) offers optional transactional text messages for event registrations. If you opt in while registering, AMACSS may send a registration confirmation and a reminder approximately 24 hours before that event.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white">Consent and frequency</h2>
            <p className="mt-2">SMS consent is optional and is not a condition of creating an account or registering for an event. Message frequency varies and is generally no more than two messages for each event registration. Standard message and data rates may apply.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white">Opt out and help</h2>
            <p className="mt-2">Reply <strong>STOP</strong> to opt out of future AMACSS text messages. Reply <strong>HELP</strong> for help. After opting out, you may receive one final message confirming the opt-out. Supported carriers are not liable for delayed or undelivered messages.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white">Contact</h2>
            <p className="mt-2">For assistance, email <a className="text-blue-10 underline" href="mailto:amacss.uoft@gmail.com">amacss.uoft@gmail.com</a>.</p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/sms-privacy" className="rounded-xl bg-blue-30 px-5 py-3 font-bold text-white">SMS Privacy Policy</Link>
          <Link href="/" className="rounded-xl border border-gray-30 px-5 py-3 font-bold text-white">Back to AMACSS</Link>
        </div>
      </article>
    </main>
  )
}
