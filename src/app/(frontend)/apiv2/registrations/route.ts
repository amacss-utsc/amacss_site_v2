import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import config from "@payload-config"
import { getPayload } from "payload"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
  {
    fetch: (url, init) =>
      fetch(url, { ...init, duplex: "half" } as RequestInit), // Add duplex option here
  } as any,
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const referralCode = searchParams.get("referralCode")
  const eventId = searchParams.get("eventId")

  console.log("GET /apiv2/registrations", { referralCode, eventId })

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
  try {
    const contentType = req.headers.get("content-type")
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Unsupported content type. Expected multipart/form-data." },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })
    const formData = await req.formData()

    const eventId = formData.get("eventId")
    const userId = formData.get("userId")

    if (!eventId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: eventId or userId." },
        { status: 400 },
      )
    }

    const answers: Array<{
      fieldId: string
      fieldType: string
      answer: string
    }> = []

    for (const [key, value] of formData.entries()) {
      if (key === "eventId" || key === "userId") continue

      if (value instanceof File) {
        const fileBuffer = await value.arrayBuffer() // Convert File to Buffer
        const fileExtension = value.name.split(".").pop()
        const fileName = `${eventId}_${userId}_${Date.now()}.${fileExtension}`

        try {
          const { data, error } = await supabase.storage
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
              await supabase.storage
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
    await payload.create({
      collection: "registrations",
      data: {
        eventId: parseInt(eventId.toString(), 10),
        userId: parseInt(userId.toString(), 10),
        answers,
        submittedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("API Route Error:", error)
    return NextResponse.json(
      { error: "Failed to process the registration." },
      { status: 500 },
    )
  }
}
