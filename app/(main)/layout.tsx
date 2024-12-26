import { getMarkdownContent } from '@/lib/markdown';
import { MarkdownRenderer } from '@/components/markdown-renderer';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getMarkdownContent('README.md');

  return (
    <main className="container max-w-4xl mx-auto p-8">
      <article className="prose">
        {content ? (
          <MarkdownRenderer content={content.content} />
        ) : (
          <h1>Bienvenue sur mon blog</h1>
        )}
      </article>
    </main>
  );
}