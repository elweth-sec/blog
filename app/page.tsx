import { getMarkdownContent } from '@/lib/markdown';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { notFound } from 'next/navigation';

export default async function HomePage() {
  const content = await getMarkdownContent('README.md');

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