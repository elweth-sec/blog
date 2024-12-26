'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import { usePathname } from 'next/navigation';
import path from 'path';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const pathname = usePathname();
  const pathParts = pathname.split('/').filter(Boolean);
  const section = pathParts[0]; // 'articles' ou 'writeups'
  const articlePath = pathParts.slice(1).join('/');

  const resolveImagePath = (src: string) => {
    if (src.startsWith('http')) return src;
    if (src.startsWith('/')) return src;

    // Construire le chemin complet vers l'image
    const imagePath = path.join('/content', section, articlePath, src);
    return imagePath;
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        img({ src, alt }) {
          if (!src) return null;
          const imagePath = resolveImagePath(src);
          
          return (
            <span className="relative block w-full my-4">
              <img
                src={imagePath}
                alt={alt || ''}
                className="max-w-full h-auto mx-auto rounded-lg border border-border"
                loading="lazy"
                onError={(e) => {
                  console.error('Image loading error:', imagePath);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </span>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}