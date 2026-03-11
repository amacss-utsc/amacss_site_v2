"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

interface MarkdownViewerProps {
  markdown: string | null
}

export function MarkdownViewer({ markdown }: MarkdownViewerProps) {
  if (!markdown) {
    return (
      <div className="prose prose-invert w-full px-6 py-8 text-gray-20">
        <p>No content available for this semester.</p>
      </div>
    )
  }

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
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
