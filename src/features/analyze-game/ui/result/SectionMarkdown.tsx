"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownBody } from "../ResultCard.styles";

export function SectionMarkdown({ content }: { content: string }) {
  return (
    <MarkdownBody>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </MarkdownBody>
  );
}
