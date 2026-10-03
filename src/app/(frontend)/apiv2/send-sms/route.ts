import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const apiKey = process.env.TWILIO_API_KEY
const apiSecret = process.env.TWILIO_API_SECRET

if (!accountSid || !apiKey || !apiSecret) {
  throw new Error("Missing Twilio API Key, Secret, or Account SID in .env")
}

const client = twilio(apiKey, apiSecret, { accountSid })

export async function POST(request: Request) {
  const message = await client.messages.create({
    body: "This is the ship that made the Kessel Run in fourteen parsecs?",
    from: "+15017122661",
    to: "+16476367399",
  })

  console.log(message.body)
}
