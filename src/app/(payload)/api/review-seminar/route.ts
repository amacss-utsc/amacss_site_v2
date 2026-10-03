import { NextResponse } from "next/server"

export async function POST(): Promise<Response> {
  return NextResponse.json({ message: "hello world" })
}
