'use client';

import Link from 'next/link';
import { transformLink } from '@/lib/utils/links';
import { usePathname } from 'next/navigation';

interface MarkdownLinkProps {
  href?: string;
  children: React.ReactNode;
}

export function MarkdownLink({ href, children }: MarkdownLinkProps) {
  const pathname = usePathname();
  const transformedHref = transformLink(href || '', pathname);
  
  if (transformedHref.startsWith('http')) {
    return (
      <a href={transformedHref} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return <Link href={transformedHref}>{children}</Link>;
}