import { getMarkdownContent } from '@/lib/markdown';
import { getAllPaths } from '@/lib/content';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { notFound } from 'next/navigation';
import path from 'path';

interface PageProps {
  params: {
    slug: string[];
  };
}

export async function generateStaticParams() {
  const excludedPaths = ['favicon.ico', 'apple-touch-icon.png', 'apple-touch-icon-precomposed.png'];
  const paths = await getAllPaths('');
  
  return paths
    .filter(segments => !excludedPaths.includes(segments.join('/')))
    .map(segments => ({
      slug: segments,
    }));
}

export default function CatchAllPage({ params }: PageProps) {
  const staticFiles = ['favicon.ico', 'apple-touch-icon.png', 'apple-touch-icon-precomposed.png'];
  if (staticFiles.includes(params.slug.join('/'))) {
    notFound();
  }

  const slug = params.slug.join('/');
  
  let content = getMarkdownContent(path.join(slug, 'README.md'));
  
  if (!content && !slug.endsWith('.md')) {
    content = getMarkdownContent(`${slug}.md`);
  }

  if (!content) {
    notFound();
  }

  return (
    <main className="container max-w-6xl mx-auto p-8">
      <article className="prose">
        <MarkdownRenderer content={content.content} />
      </article>
    </main>
  );
}