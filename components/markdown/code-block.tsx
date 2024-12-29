'use client';

import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import type { CodeBlockProps } from '@/components/markdown/types';

export function CodeBlock({ className, children, inline }: CodeBlockProps) {
  const match = /language-(\w+)/.exec(className || '');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(String(children));
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Réinitialiser le bouton après 2 secondes
      } catch (err) {
        console.error('Failed to copy code:', err);
        alert('Failed to copy the code.');
      }
    } else {
      alert('Clipboard API not supported or accessible.');
    }
  };

  if (inline || !match) {
    return (
      <code className={className}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-600 transition"
      >
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        className="rounded-md"
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
}
