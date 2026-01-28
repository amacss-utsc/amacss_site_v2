import { redirect } from "next/navigation"

export default function Page() {
  redirect(
    "https://docs.google.com/forms/d/e/1FAIpQLSeW26PTMCVZBdmWczPUajaaTYqSC-kpiTwqcqvXGfFQ6fIVCg/viewform?usp=dialog"
  )
}
