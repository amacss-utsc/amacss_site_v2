"use client"

import { useDocumentInfo, useField } from "@payloadcms/ui"
import { QRCodeSVG } from "qrcode.react"
import { useEffect, useRef, useState } from "react"
import {
  buildCheckInPath,
  isAttendanceCode,
} from "@/utilities/eventCheckInLink"

export default function EventCheckInQR({ path }: { path: string }) {
  const { id } = useDocumentInfo()
  const { value } = useField<string>({ path })
  const [origin, setOrigin] = useState("")
  const [copyMessage, setCopyMessage] = useState("")
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => setOrigin(window.location.origin), [])

  const eventId = typeof id === "number" ? id : Number(id)
  const url =
    origin &&
    Number.isSafeInteger(eventId) &&
    eventId > 0 &&
    isAttendanceCode(value)
      ? `${origin}${buildCheckInPath({ eventId, code: value })}`
      : ""

  if (!url) {
    return (
      <p style={{ marginTop: 8 }}>
        Save the event with both check-in times to generate its QR code.
      </p>
    )
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopyMessage("Link copied.")
    } catch {
      setCopyMessage("Select the link below to copy it.")
    }
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <button type="button" onClick={() => dialog.current?.showModal()}>
          Display check-in QR
        </button>
        <button type="button" onClick={copyLink}>
          Copy check-in link
        </button>
      </div>
      <p aria-live="polite" style={{ marginTop: 8 }}>
        {copyMessage}
      </p>
      <input
        aria-label="Event check-in link"
        readOnly
        value={url}
        onFocus={(event) => event.currentTarget.select()}
        style={{ width: "100%" }}
      />
      <dialog
        ref={dialog}
        aria-label="Event check-in QR code"
        style={{
          border: 0,
          borderRadius: 16,
          maxWidth: "calc(100vw - 32px)",
          padding: 32,
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: 24, marginBottom: 16 }}>Scan to check in</h2>
        <QRCodeSVG
          value={url}
          size={420}
          level="M"
          style={{ height: "auto", maxWidth: "100%", width: 420 }}
        />
        <p style={{ marginTop: 16 }}>
          Students can scan this QR code once check-in opens.
        </p>
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          style={{ marginTop: 16 }}
        >
          Close
        </button>
      </dialog>
    </div>
  )
}
