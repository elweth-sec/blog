import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface ContentItem {
  name: string;
  type: 'file' | 'directory';
  path: string;
}

async function getContentList(section: string): Promise<ContentItem[]> {
  try {
    const contentDir = path.join(process.cwd(), 'content', section);
    const items = await fs.readdir(contentDir, { withFileTypes: true });
    const contentList: ContentItem[] = [];

    for (const item of items) {
      if (item.name.startsWith('.')) continue;

      if (item.isFile() && item.name.endsWith('.md') && item.name !== 'README.md') {
        contentList.push({
          name: item.name.replace(/\.md$/, ''),
          type: 'file',
          path: item.name.replace(/\.md$/, '')
        });
      } else if (item.isDirectory()) {
        const readmePath = path.join(contentDir, item.name, 'README.md');
        try {
          await fs.access(readmePath);
          contentList.push({
            name: item.name,
            type: 'directory',
            path: item.name
          });
        } catch {
          // Pas de README.md, on ignore ce dossier
        }
      }
    }

    return contentList.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'directory' ? -1 : 1;
    });
  } catch (error) {
    console.error(`Error reading content directory:`, error);
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') || '';
    
    if (!['articles', 'writeups'].includes(section)) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
    }

    const contentList = await getContentList(section);
    return NextResponse.json(contentList);
  } catch (error) {
    console.error('Error getting content list:', error);
    return NextResponse.json([], { status: 200 });
  }
}