import fs from 'fs/promises';
import path from 'path';

export async function getAllPaths(baseDir: string): Promise<string[][]> {
  const contentDir = path.join(process.cwd(), 'content', baseDir);
  const paths: string[][] = [];

  async function traverse(dir: string, currentPath: string[] = []): Promise<void> {
    try {
      const items = await fs.readdir(dir, { withFileTypes: true });
      const hasReadme = items.some(item => item.name === 'README.md');
      const hasSubDirs = items.some(item => 
        item.isDirectory() && item.name !== 'images'
      );

      // Si le dossier a un README.md, l'ajouter aux chemins
      if (hasReadme && currentPath.length > 0) {
        paths.push(currentPath);
      }

      for (const item of items) {
        if (item.name.startsWith('.')) continue;

        const fullPath = path.join(dir, item.name);
        const relativePath = [...currentPath, item.name];

        if (item.isDirectory() && item.name !== 'images') {
          await traverse(fullPath, relativePath);
        } else if (item.name.endsWith('.md') && item.name !== 'README.md') {
          paths.push([...currentPath, item.name.replace(/\.md$/, '')]);
        }
      }
    } catch (error) {
      console.error(`Error traversing directory ${dir}:`, error);
    }
  }

  try {
    await traverse(contentDir);
  } catch (error) {
    console.error(`Error getting paths for ${baseDir}:`, error);
  }

  return paths;
}