'use client';

import { usePathname } from 'next/navigation';
import type { ImageProps } from './types';

const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/elweth-sec/blog/refs/heads/main/content';

export function MarkdownImage({ src, alt }: ImageProps) {
  const pathname = usePathname();
  
  if (!src) return null;

  const resolveImagePath = (src: string) => {
    if (src.startsWith('http')) return src;
    if (src.startsWith('/')) return src;

    // Construire l'URL GitHub Raw
    const section = pathname.split('/')[1]; // 'writeups' ou 'articles'
    const articlePath = pathname
      .split('/')
      .slice(2) // Ignorer le premier segment (vide) et la section
      .join('/');

    if (!section || !articlePath) return src;

    return `${GITHUB_RAW_URL}/${section}/${articlePath}/${src}`;
  };

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
}