import sharp from "sharp"
import { randomUUID } from "node:crypto"
import { readUploadForm } from "@/utilities/uploadValidation"
import { NextResponse } from "next/server"
import config from "@payload-config"
import { getPayload, type Payload } from "payload"
import { createSupabaseServerClient } from "@/utilities/supabase/server"
import { EVENT_REGISTRATION_OPEN } from "@/utilities/auth"
import { isRegistrationOpen } from "@/utilities/eventRegistration"
import { getEmailVerification } from "@/utilities/verification"
import { createSupabaseAdminClient } from "@/utilities/supabase/admin"
import {
  eventStartAt,
  processEventNotificationJobs,
} from "@/utilities/notifications/event"

async function validReferral(payload: Payload, code: string, eventId: number) {
  if (code === process.env.INTERNAL_EVENT_REFERRAL_CODE || code === "FIRST")
    return true
  if (!code || code.length > 64) return false
  const result = await payload.find({
    collection: "registrations",
    where: {
      and: [
        { referralCode: { equals: code } },
        { eventId: { equals: eventId } },
      ],
    },
    depth: 0,
    limit: 1,
    select: { referralCode: true },
  })
  return result.docs.length > 0
}

export async function GET(req: Request) {
  if (!EVENT_REGISTRATION_OPEN)
    return NextResponse.json({ valid: false }, { status: 403 })
  const auth = await createSupabaseServerClient()
  const {
    data: { user },
  } = await auth.auth.getUser()
  if (!user) return NextResponse.json({ valid: false }, { status: 401 })
  if (!(await getEmailVerification(user)))
    return NextResponse.json({ valid: false }, { status: 403 })
  const { searchParams } = new URL(req.url)
  const referralCode = searchParams.get("referralCode")
  const eventId = searchParams.get("eventId")

  if (
    !referralCode ||
    !Number.isSafeInteger(Number(eventId)) ||
    Number(eventId) < 1
  ) {
    return NextResponse.json({ valid: false }, { status: 400 })
  }
  try {
    const payload = await getPayload({ config })
    return NextResponse.json({
      valid: await validReferral(payload, referralCode, Number(eventId)),
    })
  } catch (error) {
    console.error("GET /apiv2/registrations error:", error)
    return NextResponse.json(
      { error: "Error fetching registrations" },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  let storageClient: ReturnType<typeof createSupabaseAdminClient> | undefined
  const uploadedPaths: string[] = []
  let registrationSaved = false
  if (!EVENT_REGISTRATION_OPEN) {
    return NextResponse.json(
      { error: "Event registration is not open yet." },
      { status: 403 },
    )
  }

  try {
    const contentType = req.headers.get("content-type")
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Unsupported content type. Expected multipart/form-data." },
        { status: 400 },
      )
    }

    const authClient = await createSupabaseServerClient()
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 },
      )
    }

    if (!(await getEmailVerification(user))) {
      return NextResponse.json(
        { error: "Verify your U of T email before registering." },
        { status: 403 },
      )
    }

    let formData: FormData
    try {
      formData = await readUploadForm(req)
    } catch {
      return NextResponse.json(
        { error: "Invalid upload; maximum request size is 4 MB." },
        { status: 400 },
      )
    }
    const eventId = formData.get("eventId")

    if (!eventId) {
      return NextResponse.json(
        { error: "Missing required field: eventId." },
        { status: 400 },
      )
    }

    const eventNumber = Number(eventId)
    if (!Number.isSafeInteger(eventNumber) || eventNumber < 1) {
      return NextResponse.json({ error: "Invalid event." }, { status: 400 })
    }

    // Checked before any uploads so a closed event never touches storage.
    const payload = await getPayload({ config })
    const event = await payload
      .findByID({ collection: "events", id: eventNumber })
      .catch(() => null)
    if (!event)
      return NextResponse.json({ error: "Event not found." }, { status: 404 })
    if (event.regStyle !== "internal") {
      return NextResponse.json(
        { error: "This event does not use internal registration." },
        { status: 400 },
      )
    }
    if (!isRegistrationOpen(event)) {
      return NextResponse.json(
        { error: "Registration for this event has closed." },
        { status: 403 },
      )
    }
    const startAt = eventStartAt(event)
    if (startAt && startAt.getTime() <= Date.now()) {
      return NextResponse.json(
        { error: "This event has already started." },
        { status: 400 },
      )
    }

    // The register page checks this too, but only the API can stop a direct
    // POST from registering the same member twice.
    const existing = await payload.find({
      collection: "registrations",
      where: {
        and: [
          { eventId: { equals: eventNumber } },
          { supabaseUserId: { equals: user.id } },
        ],
      },
      limit: 1,
    })
    if (existing.docs.length) {
      return NextResponse.json(
        { error: "You are already registered for this event." },
        { status: 409 },
      )
    }

    // Validate every field before any storage writes.
    const fields = event.registrationForm || []
    const images = new Map<string, Buffer>()
    if ([...formData.values()].filter((v) => v instanceof File).length > 3) {
      return NextResponse.json(
        { error: "Upload at most 3 images." },
        { status: 400 },
      )
    }
    const seen = new Set<string>()
    for (const [key, value] of formData.entries()) {
      if (key === "eventId") continue
      const field = fields.find((f) => f.fieldid === key)
      if (!field || seen.has(key))
        return NextResponse.json(
          { error: "Unknown or duplicate form field." },
          { status: 400 },
        )
      seen.add(key)
      if (value === "") continue
      if (
        field.type === "referral" &&
        typeof value === "string" &&
        value &&
        !(await validReferral(payload, value, eventNumber))
      ) {
        return NextResponse.json(
          { error: "Invalid referral code." },
          { status: 400 },
        )
      }
      if (value instanceof File) {
        if (
          field.type !== "image" ||
          !value.size ||
          value.size > 3 * 1024 * 1024 ||
          !["image/jpeg", "image/png", "image/webp"].includes(value.type)
        ) {
          return NextResponse.json(
            { error: "Images must be JPEG, PNG, or WebP, up to 3 MB." },
            { status: 400 },
          )
        }
        try {
          images.set(
            key,
            await sharp(Buffer.from(await value.arrayBuffer()), {
              limitInputPixels: 20_000_000,
            })
              .rotate()
              .webp()
              .toBuffer(),
          )
        } catch {
          return NextResponse.json({ error: "Invalid image." }, { status: 400 })
        }
      } else if (
        field.type === "image" ||
        value.length > 10000 ||
        (field.type === "dropdown" &&
          !field.dropdownOptions?.some((o) => o.option === value))
      ) {
        return NextResponse.json(
          { error: "Invalid form answer." },
          { status: 400 },
        )
      }
    }
    for (const field of fields) {
      const value = formData.get(field.fieldid)
      if (
        field.requiredField &&
        (!value || (typeof value === "string" && !value.trim()))
      ) {
        return NextResponse.json(
          { error: `Missing required field: ${field.name}` },
          { status: 400 },
        )
      }
    }

    storageClient = createSupabaseAdminClient()
    const answers: Array<{
      fieldId: string
      fieldType: string
      answer: string
    }> = []

    for (const [key, value] of formData.entries()) {
      if (
        key === "eventId" ||
        (value === "" &&
          fields.some((f) => f.fieldid === key && f.type === "image"))
      )
        continue

      if (value instanceof File) {
        const fileName = `${eventNumber}_${user.id}_${randomUUID()}.webp`
        const { data, error } = await storageClient.storage
          .from(process.env.S3_BUCKET!)
          .upload(fileName, images.get(key)!, {
            contentType: "image/webp",
            cacheControl: "3600",
            upsert: false,
          })
        if (error) throw error
        uploadedPaths.push(data.path)
        const { data: signed, error: signError } = await storageClient.storage
          .from(process.env.S3_BUCKET!)
          .createSignedUrl(data.path, 60 * 60 * 24)
        if (signError) throw signError
        answers.push({
          fieldId: key,
          fieldType: "image",
          answer: signed.signedUrl,
        })
      } else {
        answers.push({
          fieldId: key,
          fieldType: "text",
          answer: value.toString(),
        })
      }
    }

    // Save the registration entry
    const registration = await payload.create({
      collection: "registrations",
      data: {
        eventId: eventNumber,
        supabaseUserId: user.id,
        email: user.email,
        answers,
        submittedAt: new Date().toISOString(),
      },
    })
    registrationSaved = true
    let notificationsQueued = false
    try {
      const admin = createSupabaseAdminClient()
      const now = new Date()
      const jobs: Array<Record<string, unknown>> = [
        {
          registration_id: registration.id,
          event_id: eventNumber,
          member_id: user.id,
          kind: "confirmation",
          channel: "email",
          due_at: now.toISOString(),
        },
      ]
      if (startAt && startAt.getTime() > now.getTime() + 24 * 60 * 60_000) {
        jobs.push({
          registration_id: registration.id,
          event_id: eventNumber,
          member_id: user.id,
          kind: "reminder",
          channel: "email",
          due_at: new Date(startAt.getTime() - 24 * 60 * 60_000).toISOString(),
        })
      }
      const { error: queueError } = await admin
        .from("event_notification_jobs")
        .insert(jobs)
      if (queueError) throw queueError
      notificationsQueued = true
      await processEventNotificationJobs(registration.id)
    } catch (notificationError) {
      console.error(
        "Event registered but notification queue failed",
        notificationError,
      )
    }

    return NextResponse.json(
      { success: true, notificationsQueued },
      { status: 201 },
    )
  } catch (error) {
    if (!registrationSaved && storageClient && uploadedPaths.length) {
      const { error: cleanupError } = await storageClient.storage
        .from(process.env.S3_BUCKET!)
        .remove(uploadedPaths)
      if (cleanupError) console.error("Upload cleanup failed", cleanupError)
    }
    console.error("API Route Error:", error)
    return NextResponse.json(
      { error: "Failed to process the registration." },
      { status: 500 },
    )
  }
}
