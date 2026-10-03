import "server-only"
import config from "@payload-config"
import { getPayload } from "payload"
import { createSupabaseAdminClient } from "@/utilities/supabase/admin"
import { escapeHtml, sendTransactionalEmail } from "./email"
import { isUofTEmail } from "@/utilities/auth"
import { normalizeSmsPhone, sendTransactionalSms } from "./sms"
import type { Event } from "@/payload-types"

export function eventStartAt(
  event: Pick<Event, "date" | "startTime">,
): Date | null {
  const datePart = event.date.slice(0, 10)
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart)
  const time = event.startTime?.trim()
  const timeMatch = time && /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i.exec(time)
  if (!dateMatch || !timeMatch) return null
  let hour = Number(timeMatch[1])
  const minute = Number(timeMatch[2] || 0)
  if (minute > 59 || hour > 23) return null
  if (timeMatch[3]) {
    if (hour < 1 || hour > 12) return null
    hour = (hour % 12) + (timeMatch[3].toUpperCase() === "PM" ? 12 : 0)
  }
  const year = Number(dateMatch[1])
  const month = Number(dateMatch[2])
  const day = Number(dateMatch[3])
  const approximate = new Date(Date.UTC(year, month - 1, day, 12))
  const zone = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Toronto",
    timeZoneName: "shortOffset",
  })
    .formatToParts(approximate)
    .find((part) => part.type === "timeZoneName")?.value
  const offset = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(zone || "")
  if (!offset) return null
  const offsetMinutes =
    (offset[1] === "+" ? 1 : -1) *
    (Number(offset[2]) * 60 + Number(offset[3] || 0))
  return new Date(
    Date.UTC(year, month - 1, day, hour, minute) - offsetMinutes * 60_000,
  )
}

export function eventDateLabel(event: Pick<Event, "date" | "startTime">) {
  const start = eventStartAt(event)
  if (!start) return event.date.slice(0, 10)
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(start)
}

type NotificationJob = {
  id: number
  registration_id: number
  event_id: number
  member_id: string
  kind: "confirmation" | "reminder"
  channel: "email" | "sms"
  consented_at: string | null
  consented_phone: string | null
}

export async function processEventNotificationJobs(registrationId?: number) {
  const admin = createSupabaseAdminClient()
  const { data, error } = await admin.rpc("claim_event_notification_jobs", {
    p_limit: 20,
    p_registration_id: registrationId ?? null,
  })
  if (error) throw error
  const jobs = (data || []) as NotificationJob[]
  const payload = await getPayload({ config })
  let sent = 0
  for (const job of jobs) {
    try {
      const [profileResult, registration] = await Promise.all([
        admin
          .from("member_profiles")
          .select("email,phone,email_verified_at")
          .eq("id", job.member_id)
          .single(),
        payload.findByID({
          collection: "registrations",
          id: job.registration_id,
        }),
      ])
      const profile = profileResult.data
      if (profileResult.error) throw profileResult.error
      if (
        !registration ||
        registration.supabaseUserId !== job.member_id ||
        Number(
          typeof registration.eventId === "object"
            ? registration.eventId.id
            : registration.eventId,
        ) !== job.event_id ||
        !profile?.email_verified_at ||
        !isUofTEmail(profile.email)
      ) {
        await admin
          .from("event_notification_jobs")
          .update({ skipped_at: new Date().toISOString() })
          .eq("id", job.id)
        continue
      }
      const event = await payload.findByID({
        collection: "events",
        id: job.event_id,
      })
      const start = eventStartAt(event)
      if (
        job.kind === "reminder" &&
        (!start || start.getTime() <= Date.now())
      ) {
        await admin
          .from("event_notification_jobs")
          .update({ skipped_at: new Date().toISOString() })
          .eq("id", job.id)
        continue
      }
      const date = eventDateLabel(event)
      const subject =
        job.kind === "confirmation"
          ? `You're registered for ${event.title}`
          : `Reminder: ${event.title} is tomorrow`
      const siteUrl = (
        process.env.NEXT_PUBLIC_SERVER_URL || "https://amacss.org"
      ).replace(/\/$/, "")
      const message =
        job.kind === "confirmation"
          ? `You're registered for ${event.title} on ${date} (Toronto time). View your registration at ${siteUrl}/profile.`
          : `Reminder: ${event.title} starts on ${date} (Toronto time). See you there!`

      if (job.channel === "email") {
        if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
          throw new Error("Resend is not configured.")
        }
        const quota = await admin.rpc("reserve_member_notification_email")
        if (quota.error) throw quota.error
        if (!quota.data) {
          await admin
            .from("event_notification_jobs")
            .update({
              claimed_until: new Date(
                Date.now() + 24 * 60 * 60_000,
              ).toISOString(),
              attempts: 0,
            })
            .eq("id", job.id)
          continue
        }
        await sendTransactionalEmail({
          to: profile.email,
          subject,
          text: message,
          html: `<p>${escapeHtml(message)}</p>`,
          idempotencyKey: `event-${job.id}`,
        })
      } else {
        if (
          !job.consented_at ||
          !job.consented_phone ||
          !profile.phone ||
          normalizeSmsPhone(profile.phone) !== job.consented_phone
        ) {
          await admin
            .from("event_notification_jobs")
            .update({ skipped_at: new Date().toISOString() })
            .eq("id", job.id)
          continue
        }
        await sendTransactionalSms(
          job.consented_phone,
          `AMACSS: ${message} Reply STOP to opt out.`,
        )
      }
      const { error: updateError } = await admin
        .from("event_notification_jobs")
        .update({ sent_at: new Date().toISOString(), claimed_until: null })
        .eq("id", job.id)
      if (updateError) throw updateError
      sent++
    } catch (error) {
      console.error("Event notification failed", job.id, error)
      await admin
        .from("event_notification_jobs")
        .update({ claimed_until: null })
        .eq("id", job.id)
    }
  }
  return { claimed: jobs.length, sent }
}
