"use client";

import { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface MarkdownViewerProps {
  markdown: string | null;
}

export function MarkdownViewer({ markdown }: MarkdownViewerProps) {
  const html = useMemo(() => {
    if (!markdown) return "<p>No content available for this semester.</p>";

    const rawHtml = marked.parse(markdown) as string;
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    return cleanHtml;
  }, [markdown]);

  return (
    <div
      className="prose max-w-none px-4 py-6"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
