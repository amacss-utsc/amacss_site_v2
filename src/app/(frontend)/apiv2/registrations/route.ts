import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import config from "@payload-config"
import { getPayload } from "payload"
import { createSupabaseServerClient } from "@/utilities/supabase/server"
import { EVENT_REGISTRATION_OPEN } from "@/utilities/auth"
import { getEmailVerification } from "@/utilities/verification"
import { createSupabaseAdminClient } from "@/utilities/supabase/admin"
import {
  eventStartAt,
  processEventNotificationJobs,
} from "@/utilities/notifications/event"
import {
  normalizeSmsPhone,
  smsIsConfigured,
} from "@/utilities/notifications/sms"

function createSupabaseStorageClient() {
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY
  if (!process.env.SUPABASE_URL || !key) {
    throw new Error("Supabase Storage is not configured.")
  }

  return createClient(process.env.SUPABASE_URL, key, {
    fetch: (url, init) =>
      fetch(url, { ...init, duplex: "half" } as RequestInit),
  } as any)
}

export async function GET(req: Request) {
  if (!EVENT_REGISTRATION_OPEN)
    return NextResponse.json({ docs: [] }, { status: 403 })
  const auth = await createSupabaseServerClient()
  const {
    data: { user },
  } = await auth.auth.getUser()
  if (!user) return NextResponse.json({ docs: [] }, { status: 401 })
  if (!(await getEmailVerification(user)))
    return NextResponse.json({ docs: [] }, { status: 403 })
  const { searchParams } = new URL(req.url)
  const referralCode = searchParams.get("referralCode")
  const eventId = searchParams.get("eventId")

  if (!referralCode || !eventId) {
    return NextResponse.json({ docs: [] }, { status: 200 })
  }

  if (
    referralCode === process.env.INTERNAL_EVENT_REFERRAL_CODE ||
    referralCode === "FIRST"
  ) {
    return NextResponse.json({ docs: ["yay"] }, { status: 200 })
  }

  try {
    const payload = await getPayload({ config })

    const data = await payload.find({
      collection: "registrations",
      where: {
        referralCode: { equals: referralCode },
        eventId: { equals: eventId },
      },
      depth: 1,
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("GET /apiv2/registrations error:", error)
    return NextResponse.json(
      { error: "Error fetching registrations" },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
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

    const formData = await req.formData()
    const authClient = await createSupabaseServerClient()
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser()

    const eventId = formData.get("eventId")

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

    const payload = await getPayload({ config })
    const event = await payload.findByID({
      collection: "events",
      id: eventNumber,
    })
    if (!event)
      return NextResponse.json({ error: "Event not found." }, { status: 404 })
    if (event.regStyle !== "internal") {
      return NextResponse.json(
        { error: "This event does not use internal registration." },
        { status: 400 },
      )
    }
    const startAt = eventStartAt(event)
    if (startAt && startAt.getTime() <= Date.now()) {
      return NextResponse.json(
        { error: "This event has already started." },
        { status: 400 },
      )
    }
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

    const storageClient = createSupabaseStorageClient()
    const smsOptIn = formData.get("smsOptIn") === "yes" && smsIsConfigured()
    let smsPhone: string | null = null
    if (smsOptIn) {
      const admin = createSupabaseAdminClient()
      const { data: profile, error: profileError } = await admin
        .from("member_profiles")
        .select("phone")
        .eq("id", user.id)
        .single()
      if (profileError) throw profileError
      smsPhone = normalizeSmsPhone(profile.phone)
      if (!smsPhone) {
        return NextResponse.json(
          {
            error:
              "Your account phone number cannot receive SMS. Please update it or leave SMS unchecked.",
          },
          { status: 400 },
        )
      }
    }

    const answers: Array<{
      fieldId: string
      fieldType: string
      answer: string
    }> = []

    for (const [key, value] of formData.entries()) {
      if (key === "eventId" || key === "userId" || key === "smsOptIn") continue

      if (value instanceof File) {
        const fileBuffer = await value.arrayBuffer() // Convert File to Buffer
        const fileExtension = value.name.split(".").pop()
        const fileName = `${eventId}_${user.id}_${Date.now()}.${fileExtension}`

        try {
          const { data, error } = await storageClient.storage
            .from(process.env.S3_BUCKET!)
            .upload(fileName, Buffer.from(fileBuffer), {
              contentType: value.type,
              cacheControl: "3600",
              upsert: false,
            })

          if (error) {
            console.error(`Failed to upload file for field: ${key}`, error)
            answers.push({
              fieldId: key,
              fieldType: "image",
              answer: "no-img", // Placeholder for failed upload
            })
          } else {
            // Generate a signed URL for the file
            const { data: signedUrlData, error: signedUrlError } =
              await storageClient.storage
                .from(process.env.S3_BUCKET!)
                .createSignedUrl(data.path, 60 * 60 * 24) // Signed URL valid for 24 hours

            if (signedUrlError) {
              console.error(
                `Failed to generate signed URL for field: ${key}`,
                signedUrlError,
              )
              answers.push({
                fieldId: key,
                fieldType: "image",
                answer: "no-img", // Placeholder for failed upload
              })
            } else {
              answers.push({
                fieldId: key,
                fieldType: "image",
                answer: signedUrlData.signedUrl, // Use the signed URL
              })
            }
          }
        } catch (uploadError) {
          console.error(`Failed to upload file for field: ${key}`, uploadError)
          answers.push({
            fieldId: key,
            fieldType: "image",
            answer: "no-img",
          })
        }
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
        answers,
        submittedAt: new Date().toISOString(),
      },
    })
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
      if (smsOptIn && smsPhone) {
        const consentedAt = now.toISOString()
        jobs.push({
          registration_id: registration.id,
          event_id: eventNumber,
          member_id: user.id,
          kind: "confirmation",
          channel: "sms",
          due_at: now.toISOString(),
          consented_at: consentedAt,
          consented_phone: smsPhone,
        })
        if (startAt && startAt.getTime() > now.getTime() + 24 * 60 * 60_000) {
          jobs.push({
            registration_id: registration.id,
            event_id: eventNumber,
            member_id: user.id,
            kind: "reminder",
            channel: "sms",
            due_at: new Date(
              startAt.getTime() - 24 * 60 * 60_000,
            ).toISOString(),
            consented_at: consentedAt,
            consented_phone: smsPhone,
          })
        }
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
    console.error("API Route Error:", error)
    return NextResponse.json(
      { error: "Failed to process the registration." },
      { status: 500 },
    )
  }
}
