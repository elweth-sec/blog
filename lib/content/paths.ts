import fs from 'fs/promises';
import path from 'path';
import { getContentPath, isMarkdownFile, removeMarkdownExtension } from '../utils/file';

export async function getAllPaths(baseDir: string): Promise<string[][]> {
  const contentDir = getContentPath(baseDir);
  const paths: string[][] = [];

  async function traverse(dir: string, currentPath: string[] = []): Promise<void> {
    try {
      const items = await fs.readdir(dir, { withFileTypes: true });

      for (const item of items) {
        if (item.name.startsWith('.')) continue;

        const fullPath = path.join(dir, item.name);
        const relativePath = [...currentPath, item.name];

        if (item.isDirectory()) {
          // Ne pas inclure les dossiers spéciaux dans les chemins
          if (baseDir === item.name || currentPath.length > 0) {
            paths.push(relativePath);
          }
          await traverse(fullPath, relativePath);
        } else if (isMarkdownFile(item.name) && item.name !== 'README.md') {
          paths.push([...currentPath, removeMarkdownExtension(item.name)]);
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