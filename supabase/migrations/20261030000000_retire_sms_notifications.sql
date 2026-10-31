-- Keep historical notification and consent records, but retire pending SMS jobs.
-- The application now queues and sends email notifications only.
update public.event_notification_jobs
set skipped_at = now(), claimed_until = null
where channel = 'sms'
  and sent_at is null
  and skipped_at is null;
