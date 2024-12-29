import { getMarkdownContent } from '@/lib/markdown';
import { getAllPaths } from '@/lib/content';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { notFound } from 'next/navigation';
import path from 'path';

type PageProps = {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  const paths = await getAllPaths('writeups');
  return [
    { slug: [] },
    ...paths.map(segments => ({
      slug: segments.map(segment => encodeURIComponent(segment))
    }))
  ];
}

export default async function WriteupPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug?.map(segment => 
    decodeURIComponent(segment)
  ).join('/') || '';
  
  const basePath = path.join('writeups', slug);
  
  if (!slug) {
    const content = await getMarkdownContent('writeups/README.md');
    if (!content) {
      notFound();
    }
    return <MarkdownRenderer content={content.content} />;
  }
  
  let content = await getMarkdownContent(path.join(basePath, 'README.md'));
  
  if (!content && !slug.endsWith('.md')) {
    content = await getMarkdownContent(`${basePath}.md`);
  }

  if (!content) {
    notFound();
  }

  return <MarkdownRenderer content={content.content} />;
}