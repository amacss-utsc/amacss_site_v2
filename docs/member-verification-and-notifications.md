# Member email verification and event notifications

This feature uses an AMACSS-managed six-digit email code. It is **separate** from Supabase Auth's built-in "Confirm email" switch. Keep that switch off for this flow. Existing accounts start unverified, even if Supabase Auth displays them as confirmed.

## Before deployment

1. In Supabase SQL Editor, run `supabase/migrations/20260920000000_member_email_verification.sql`, then `supabase/migrations/20260920000001_event_notification_jobs.sql`. Review the SQL first. The first migration removes the old whole-row member-profile update policy so members cannot set their own `email_verified_at` value. Do not run the older `create_member_profiles` migration again over production.
2. Create a Resend account. In Domains, add a sending domain you control (for example `amacss.org` or a dedicated subdomain). Add the exact DNS records Resend displays at your DNS provider and wait until Resend shows the domain as verified. Create a sending-only API key. Choose a From identity on that verified domain, for example `AMACSS <events@amacss.org>`.
3. In Vercel for the project serving your actual domain, add server-only environment variables `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `EMAIL_VERIFICATION_SECRET`, and `CRON_SECRET`. Generate each secret locally with `openssl rand -hex 32`; use different values. Do not put them in `NEXT_PUBLIC_` variables, source control, chat, or screenshots. The existing `SUPABASE_URL` and secret/service-role `SUPABASE_KEY` may be reused by this code; alternatively set `SUPABASE_SECRET_KEY` to a dedicated Supabase secret key. The public Supabase URL/publishable key must also remain configured. Redeploy after adding variables.
4. Leave Supabase Auth > Sign In / Providers > Confirm email **off** while using this application-level verification flow. This code handles email-verification messages; password-reset emails still use Supabase Auth's configured mail provider and limits. If you later enable Supabase confirmation, coordinate the signup flow first.
5. Test with one U of T account: create account, open Profile, send code, confirm, then register for a test event. Check `member_profiles.email_verified_at`, `event_notification_jobs`, Resend Emails, and the registration row. Test an unverified account separately: it must be denied by the event-registration page **and** POST API.

## Hourly reminder dispatcher

Registration confirmations are sent immediately, and a failed send stays queued for retry. A reminder job is queued for approximately 24 hours before the event's `date` and `startTime` in Toronto time. The event must have `startTime` in a parseable format such as `6:30 PM` or `18:30`; otherwise no reminder is queued. A registration made less than 24 hours before the event gets a confirmation but no reminder. Reminder jobs need an hourly call to `GET https://<your-live-domain>/apiv2/notifications/dispatch` with header `Authorization: Bearer <CRON_SECRET>`.

Supabase Cron can make that hourly call even if the Vercel project is on Hobby (Vercel Hobby Cron itself permits only daily runs). In Supabase, enable Integrations > Cron (`pg_cron`) and `pg_net`. In Vault, create secrets named `amacss_notify_url` with the full HTTPS endpoint URL and `amacss_cron_secret` with the *same* `CRON_SECRET` that is in Vercel. Then run in SQL Editor:

```sql
select cron.schedule(
  'amacss-event-notifications-hourly',
  '0 * * * *',
  $$
    select net.http_get(
      url := (select decrypted_secret from vault.decrypted_secrets where name = 'amacss_notify_url' limit 1),
      headers := jsonb_build_object(
        'Authorization',
        'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'amacss_cron_secret' limit 1)
      )
    );
  $$
);
```

Verify in Supabase Cron job history and Vercel function logs that the request returns 200. Do not add a second copy of the job. The hourly schedule means reminders can arrive up to about an hour after the 24-hour mark. If the event is edited or canceled after registration, review queued jobs; automatic cancellation/rescheduling is not implemented yet.

## Optional Twilio SMS

1. Create a Twilio account and obtain an SMS-capable sender number, then create a Messaging Service and add that number to its Sender Pool. A trial account has recipient and template restrictions, so ordinary attendee notifications need an account capable of sending to those recipients.
2. Have the organization approve the draft pages at `/sms-terms` and `/sms-privacy` before production. They describe the event confirmation/reminder texts, opt-in, STOP/HELP, and message/data rates. Configure STOP/HELP in the Messaging Service. SMS remains hidden until the terms/privacy URLs and all Twilio variables are present.
3. Add server-only Vercel variables `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_MESSAGING_SERVICE_SID`, `SMS_TERMS_URL`, and `SMS_PRIVACY_URL`. Redeploy. Attendees must check the optional SMS consent box on each event registration; an account phone number alone is **not** SMS consent.
4. Test with a consenting account and a valid mobile number. Check Twilio Message Logs and verify STOP opt-out. Non-consenting registrations should create only email jobs. Twilio charges per message/segment; SMS is not covered by Resend's free tier.

## Quotas and operational notes

- Resend's Free plan currently permits 100 emails/day and 3,000/month. The database limits verification requests to three per member per rolling day, one per minute, and 80 verification messages per UTC day, leaving at most 20/day for event messages. Overall application emails are capped at 100/day. If expected traffic exceeds this, use a larger plan or lower sending volume before launch.
- A verification code expires after 10 minutes and allows five guesses. Each code is bound to the signed-in account and its email address. Members do not get event-registration access until `email_verified_at` is set through the server-side code check.
- If the notification service is unavailable, a successful event registration remains valid; the queued job retries up to five times when the dispatcher runs. Check Vercel logs and `event_notification_jobs` for failures. Avoid sending SMS until consent and sender compliance are approved.
- The `member_profiles` table is now read-only to ordinary authenticated users. If you add profile editing later, implement field-specific server-side updates so `email_verified_at` cannot be changed by the browser.
