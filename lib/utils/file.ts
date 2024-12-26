import path from 'path';

export function getContentPath(filePath: string): string {
  return path.join(process.cwd(), 'content', filePath);
}

export function removeMarkdownExtension(filename: string): string {
  return filename.replace(/\.md$/, '');
}

export function isMarkdownFile(filename: string): boolean {
  return filename.endsWith('.md');
}

export function isSpecialDirectory(dirname: string): boolean {
  return ['articles', 'writeups', 'whoami'].includes(dirname);
}