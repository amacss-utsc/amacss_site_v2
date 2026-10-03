import Link from "next/link"

function safeNextPath(value: unknown) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
    ? value
    : "/reset-password"
}

export default async function RecoveryPage({ searchParams }: any) {
  const params = await searchParams
  const tokenHash = typeof params?.token_hash === "string" ? params.token_hash : ""
  const type = params?.type === "recovery" ? "recovery" : ""
  const next = safeNextPath(params?.next)
  const valid = Boolean(tokenHash && type)

  return (
    <main className="flex min-h-full items-center justify-center overflow-y-auto bg-gray-90 px-7 py-12 text-gray-02 lg:rounded-tl-[32px] lg:px-20">
      <section className="max-w-xl rounded-[28px] bg-gray-80 p-8 text-center shadow-2xl">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-blue-10">AMACSS account</p>
        <h1 className="text-4xl font-black uppercase">Reset your password</h1>
        {valid ? (
          <>
            <p className="mt-4 text-lg normal-case text-gray-10">Continue to choose a new password. This one-time link will be used when you press the button.</p>
            <form action="/auth/callback" method="post">
              <input type="hidden" name="token_hash" value={tokenHash} />
              <input type="hidden" name="type" value={type} />
              <input type="hidden" name="next" value={next} />
              <button type="submit" className="mt-8 rounded-2xl bg-blue-30 px-8 py-4 text-xl font-black uppercase text-white transition-colors hover:bg-blue-40">Continue to reset password</button>
            </form>
          </>
        ) : (
          <>
            <p className="mt-4 text-lg normal-case text-red-400">This reset link is incomplete or invalid.</p>
            <Link href="/forgot-password" className="mt-8 inline-block rounded-2xl bg-blue-30 px-8 py-4 text-xl font-black uppercase text-white">Request another link</Link>
          </>
        )}
      </section>
    </main>
  )
}
