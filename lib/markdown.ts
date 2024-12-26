import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export interface MarkdownContent {
  content: string;
  metadata: {
    title?: string;
    date?: string;
    [key: string]: any;
  };
}

export async function getMarkdownContent(filePath: string): Promise<MarkdownContent | null> {
  try {
    const fullPath = path.join(process.cwd(), 'content', filePath);
    const fileContent = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(fileContent);
    
    return {
      content,
      metadata: data
    };
  } catch (error) {
    console.error(`Error reading markdown file: ${filePath}`, error);
    return null;
  }
}

export async function getDirectoryContent(dirPath: string): Promise<string[]> {
  try {
    const fullPath = path.join(process.cwd(), 'content', dirPath);
    const items = await fs.readdir(fullPath, { withFileTypes: true });
    
    return items
      .filter(item => item.isDirectory() || item.name.endsWith('.md'))
      .map(item => item.name);
  } catch (error) {
    console.error(`Error reading directory: ${dirPath}`, error);
    return [];
  }
}