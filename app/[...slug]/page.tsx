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
  // Inclure les chemins statiques nécessaires
  return [
    { slug: ['logo.png'] },
    ...await getAllPaths(''),
  ];
}

export default async function CatchAllPage({ params }: PageProps) {
  // Gérer spécialement le cas du logo
  if (params.slug[0] === 'logo.png') {
    notFound(); // Le logo sera géré par le dossier public
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