import type { Metadata } from "next"
import { getServerSideURL } from "./getURL"

const defaultOpenGraph: Metadata["openGraph"] = {
  type: "website",
  description:
    "The official website for AMACSS. The AMACSS team works to enhance the educational, recreational, social and cultural environment of UTSC.",
  images: [
    {
      url: `${getServerSideURL()}/AMACSS-logo.png`,
    },
  ],
  siteName: "AMACSS",
  title: "Association of Mathematical and Computer Science Students",
}

export const mergeOpenGraph = (
  og?: Metadata["openGraph"],
): Metadata["openGraph"] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
