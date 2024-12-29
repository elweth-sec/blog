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
  const paths = await getAllPaths('');
  
  return paths
    .filter(segments => {
      const path = segments.join('/');
      // Exclude static files and special paths
      return ![
        'favicon.ico',
        'apple-touch-icon.png',
        'apple-touch-icon-precomposed.png',
        'logo.png'
      ].includes(path);
    })
    .map(segments => ({
      slug: segments,
    }));
}

export default async function CatchAllPage({ params }: PageProps) {
  const staticFiles = [
    'favicon.ico',
    'apple-touch-icon.png',
    'apple-touch-icon-precomposed.png',
    'logo.png'
  ];
  
  // Return 404 for static files - they will be served from /public
  if (staticFiles.includes(params.slug.join('/'))) {
    notFound();
  }

  const slug = params.slug.join('/');
  
  let content = await getMarkdownContent(path.join(slug, 'README.md'));
  
  if (!content && !slug.endsWith('.md')) {
    content = await getMarkdownContent(`${slug}.md`);
  }

  if (!content) {
    notFound();
  }

  return (
    <main className="container max-w-4xl mx-auto p-8">
      <article className="prose">
        <MarkdownRenderer content={content.content} />
      </article>
    </main>
  );
}