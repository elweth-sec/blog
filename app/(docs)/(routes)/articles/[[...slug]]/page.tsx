import { getMarkdownContent } from '@/lib/markdown';
import { getAllPaths } from '@/lib/content';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { notFound } from 'next/navigation';
import path from 'path';

interface PageProps {
  params: {
    slug?: string[];
  };
}

export async function generateStaticParams() {
  const paths = await getAllPaths('articles');
  return [
    { slug: [] }, // Pour /articles
    ...paths.map(segments => ({
      slug: segments.map(segment => 
        // Encoder les segments pour gérer les espaces et caractères spéciaux
        encodeURIComponent(segment)
      )
    }))
  ];
}

export default async function ArticlePage({ params }: PageProps) {
  const slug = params.slug?.map(segment => 
    // Décoder les segments pour la lecture des fichiers
    decodeURIComponent(segment)
  ).join('/') || '';
  
  const basePath = path.join('articles', slug);
  
  // Si on est à la racine des articles
  if (!slug) {
    const content = await getMarkdownContent('articles/README.md');
    if (!content) {
      notFound();
    }
    return <MarkdownRenderer content={content.content} />;
  }
  
  // Essayer de charger le README.md du dossier
  let content = await getMarkdownContent(path.join(basePath, 'README.md'));
  
  // Si pas de README.md, essayer le fichier markdown directement
  if (!content && !slug.endsWith('.md')) {
    content = await getMarkdownContent(`${basePath}.md`);
  }

  if (!content) {
    notFound();
  }

  return <MarkdownRenderer content={content.content} />;
}