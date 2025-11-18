"use client"

import { useMemo } from "react"
import { marked } from "marked"
import DOMPurify from "dompurify"

interface MarkdownViewerProps {
  markdown: string | null
}

export function MarkdownViewer({ markdown }: MarkdownViewerProps) {
  const html = useMemo(() => {
    if (!markdown) return "<p>No content available for this semester.</p>"

    const rawHtml = marked.parse(markdown) as string
    const cleanHtml = DOMPurify.sanitize(rawHtml)
    return cleanHtml
  }, [markdown])

  return (
    <div
      className="
        prose
        prose-invert
        w-full
        px-6
        py-8
        text-gray-02

        prose-headings:text-gray-02
        prose-headings:font-semibold

        prose-p:text-gray-20
        prose-li:text-gray-20

        prose-strong:text-gray-02

        prose-a:text-blue-20
        prose-a:no-underline
        prose-a:hover:underline

        prose-code:bg-gray-80
        prose-code:text-gray-02
        prose-code:px-1.5
        prose-code:py-0.5
        prose-code:rounded

        prose-pre:bg-gray-80
        prose-pre:text-gray-02
        prose-pre:p-4
        prose-pre:rounded-lg

        prose-hr:border-gray-70
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
