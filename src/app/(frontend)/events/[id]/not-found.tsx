import Link from "next/link"

export default function EventNotFound() {
  return (
    <main className="flex min-h-full items-center justify-center bg-gray-90 px-7 py-12 text-gray-02 lg:rounded-tl-[32px]">
      <section className="max-w-xl rounded-[28px] bg-gray-80 p-8 text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-blue-10">
          404
        </p>
        <h1 className="text-4xl font-black">Event not found</h1>
        <p className="mt-4 text-lg normal-case text-gray-10">
          This event may have been removed, or the link is incorrect.
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
