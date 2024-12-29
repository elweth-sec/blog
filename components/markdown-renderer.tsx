'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock, MarkdownImage, MarkdownLink } from '@/components/markdown';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code: CodeBlock as any,
        img: MarkdownImage as any,
        a: MarkdownLink as any
      }}
    >
      {content}
    </ReactMarkdown>
  );
}