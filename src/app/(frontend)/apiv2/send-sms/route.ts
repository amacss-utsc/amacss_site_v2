import { sendTransactionalSms } from "@/utilities/notifications/sms"
import { NextResponse } from "next/server"
import twilio from "twilio"

export async function POST(request: Request) {
  // const accountSid = process.env.TWILIO_ACCOUNT_SID
  // const authToken = process.env.TWILIO_AUTH_TOKEN
  // // const apiKey = process.env.TWILIO_API_KEY
  // // const apiSecret = process.env.TWILIO_API_SECRET

  // if (!accountSid || !authToken) {
  //     throw new Error("Missing Twilio Account SID or Auth Token in .env")
  // }

  try {
    const { to, body } = await request.json()
    if (!to || !body) {
      return NextResponse.json(
        { error: "Phone number and message body required." },
        { status: 400 },
      )
    }
    await sendTransactionalSms(to, body)
    return NextResponse.json({
      success: true,
      message: "SMS sent successfully!",
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to send SMS." },
      { status: 500 },
    )
  }

  // const client = twilio(accountSid, authToken)

  // const message = await client.messages.create({
  //     from: "+somevalidnumber",
  //     to: "+somevalidnumber",
  //     body: "sms_order_confirmation", // predefined template b/c Twilio trial
  // });

  // console.log(message.body)
}
