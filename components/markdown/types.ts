import type { ReactNode } from 'react';

export interface CodeBlockProps {
  className?: string;
  children: ReactNode;
  inline?: boolean;
}

export interface ImageProps {
  src?: string;
  alt?: string;
}