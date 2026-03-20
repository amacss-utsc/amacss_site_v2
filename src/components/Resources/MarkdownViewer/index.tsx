"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

const GITHUB_OWNER = "amacss-utsc"
const GITHUB_REPO = "courses"
const GITHUB_REF = "main"

function resolveRelativeUrl(
  url: string,
  basePath: string,
  mode: "blob" | "raw",
): string {
  if (!url) return url
  // Leave absolute URLs, fragments, mailto, and tel as-is
  if (/^(https?:|#|mailto:|tel:)/i.test(url)) return url

  const base =
    mode === "blob"
      ? `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/blob/${GITHUB_REF}/${basePath}/`
      : `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_REF}/${basePath}/`

  try {
    return new URL(url, base).href
  } catch {
    return url
  }
}

interface MarkdownViewerProps {
  markdown: string | null
  basePath: string
}

export function MarkdownViewer({ markdown, basePath }: MarkdownViewerProps) {
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
        components={{
          a({ href, children, ...props }) {
            const resolved = resolveRelativeUrl(href ?? "", basePath, "raw")
            const isExternal = resolved.startsWith("http")
            return (
              <a
                href={resolved}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                {...props}
              >
                {children}
              </a>
            )
          },
          img({ src, alt, ...props }) {
            const resolved = resolveRelativeUrl(src ?? "", basePath, "raw")
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={resolved} alt={alt ?? ""} {...props} />
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
