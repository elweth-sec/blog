'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScrollTextIcon, FolderIcon, ChevronDownIcon, ChevronRightIcon, BookIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentItem {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: ContentItem[];
  isReadme?: boolean;
  isLeafWithReadme?: boolean;
}

async function getStaticContent(section: string): Promise<ContentItem[]> {
  try {
    const response = await import(`@/content/${section}/content.json`);
    return response.default;
  } catch {
    return [];
  }
}

export function ContentList() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [expandedState, setExpandedState] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const section = pathname.split('/')[1] as 'articles' | 'writeups';

  useEffect(() => {
    if (!section || !['articles', 'writeups'].includes(section)) {
      setItems([]);
      return;
    }

    getStaticContent(section).then(content => {
      setItems(content);
      
      const pathParts = pathname.split('/').slice(2);
      if (pathParts.length > 0) {
        const newExpandedState: Record<string, boolean> = {};
        let currentPath = '';
        
        pathParts.forEach(part => {
          currentPath = currentPath ? `${currentPath}/${part}` : part;
          newExpandedState[currentPath] = true;
        });
        
        setExpandedState(prev => ({
          ...prev,
          ...newExpandedState
        }));
      }
    });
  }, [section, pathname]);

  const toggleFolder = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    setExpandedState(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const renderItem = (item: ContentItem, level = 0) => {
    const isExpanded = expandedState[item.path];
    const currentPath = `/${section}/${item.path}`;
    const isActive = pathname === currentPath;
    const marginClass = level === 0 ? "" : "ml-4";

    if (item.type === 'directory') {
      const isLeafFolder = Boolean(item.isLeafWithReadme);
      
      if (isLeafFolder) {
        return (
          <Link
            key={item.path}
            href={currentPath}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors hover:bg-accent/50",
              level === 0 ? "ml-5" : "ml-9",
              isActive && "bg-accent"
            )}
          >
            <BookIcon size={16} className="text-red-400 shrink-0" />
            <span className="truncate">{item.name}</span>
          </Link>
        );
      }

      return (
        <div key={item.path} className={marginClass}>
          <div className="flex items-center">
            <button
              onClick={(e) => toggleFolder(e, item.path)}
              className="p-1 hover:bg-accent/30 rounded-md"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                {isExpanded ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}
              </span>
            </button>
            <Link 
              href={currentPath}
              className={cn(
                "flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors hover:bg-accent/50",
                isActive && "bg-accent"
              )}
            >
              <FolderIcon size={16} className="text-yellow-500 shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          </div>
          {isExpanded && item.children && item.children.length > 0 && (
            <div className="ml-4">
              {item.children.map(child => renderItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    if (item.isReadme) return null;

    return (
      <Link
        key={item.path}
        href={currentPath}
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors hover:bg-accent/50",
          level === 0 ? "ml-5" : "ml-9",
          isActive && "bg-accent"
        )}
      >
        <BookIcon size={16} className="text-red-400 shrink-0" />
        <span className="truncate">{item.name}</span>
      </Link>
    );
  };

  if (!items.length) {
    return null;
  }

  return (
    <nav className="space-y-1">
      {items.map(item => renderItem(item, 0))}
    </nav>
  );
}