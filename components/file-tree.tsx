'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderIcon, FileIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeItem {
  name: string;
  type: 'file' | 'directory';
  children?: TreeItem[];
}

export function FileTree() {
  const [tree, setTree] = useState<TreeItem[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  const section = pathname.split('/')[1]; // 'articles' ou 'writeups'

  useEffect(() => {
    if (!section || !['articles', 'writeups'].includes(section)) {
      setTree([]);
      return;
    }

    fetch(`/api/tree?section=${section}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTree(data);
        } else {
          console.error('Invalid tree data:', data);
          setTree([]);
        }
      })
      .catch(error => {
        console.error('Error fetching tree:', error);
        setTree([]);
      });
  }, [section]);

  const toggleExpand = (path: string) => {
    const newExpanded = new Set(expanded);
    if (expanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpanded(newExpanded);
  };

  const renderTreeItem = (item: TreeItem, path: string = '') => {
    const fullPath = path ? `${path}/${item.name}` : item.name;
    const isExpanded = expanded.has(fullPath);
    const href = `/${section}/${fullPath}`;

    if (item.type === 'directory') {
      return (
        <div key={fullPath}>
          <button
            onClick={() => toggleExpand(fullPath)}
            className="flex items-center gap-2 w-full hover:bg-accent/50 p-1 rounded"
          >
            {isExpanded ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}
            <FolderIcon size={16} className="text-blue-500" />
            <span>{item.name}</span>
          </button>
          {isExpanded && item.children && (
            <div className="ml-4">
              {item.children.map(child => renderTreeItem(child, fullPath))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={fullPath}
        href={href}
        className={cn(
          "flex items-center gap-2 hover:bg-accent/50 p-1 rounded ml-6",
          item.name === 'README.md' && 'font-medium'
        )}
      >
        <FileIcon size={16} className="text-gray-500" />
        <span>{item.name}</span>
      </Link>
    );
  };

  if (!tree.length) {
    return null;
  }

  return (
    <div className="text-sm">
      {tree.map(item => renderTreeItem(item))}
    </div>
  );
}