import Link from "next/link"

export default function Page() {
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
        .
      </p>
      <Link
        href="/events"
        className="inline-block py-3 px-6 bg-blue-30 hover:bg-blue-40 
          text-center rounded-[16px] text-white font-bold transition-colors normal-case"
      >
        Back to Events
      </Link>
    </main>
  )
}
