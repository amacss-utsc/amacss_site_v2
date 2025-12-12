import React from "react"
import { Title } from "@/components/FrontPage/Title"
import { ReviewSeminars } from "@/components/FrontPage/ReviewSeminars"
import { Gala } from "@/components/FrontPage/Gala"
import { Colloquium } from "@/components/FrontPage/Colloquium"
import { Lounge } from "@/components/FrontPage/Lounge"
import { PageWrapper } from "@/components/FrontPage/PageWrapper"

export default function Page() {
  return (
    <PageWrapper>
      <Title />
      <ReviewSeminars />
      <Gala />
      <Colloquium />
      <Lounge />
    </PageWrapper>
  )
}
