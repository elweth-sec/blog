'use client';

import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { CodeBlockProps } from '@/components/markdown/types';

export function CodeBlock({ className, children, inline }: CodeBlockProps) {
  const match = /language-(\w+)/.exec(className || '');
  
  if (inline || !match) {
    return (
      <code className={className}>
        {children}
      </code>
    );
  }

  return (
    <SyntaxHighlighter
      style={vscDarkPlus}
      language={match[1]}
      PreTag="div"
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  );
}