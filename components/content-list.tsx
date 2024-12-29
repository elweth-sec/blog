'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScrollTextIcon, FolderIcon, ChevronDownIcon, ChevronRightIcon, BookIcon } from 'lucide-react';  // Utilisation de BookIcon pour les fichiers
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

  const toggleFolder = (path: string, isLeaf: boolean) => {
    if (isLeaf) return;
    
    setExpandedState(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const renderItem = (item: ContentItem, level = 0) => {
    const isExpanded = expandedState[item.path];
    const currentPath = `/${section}/${item.path}`;
    const isActive = pathname === currentPath;

    if (item.type === 'directory') {
      const isLeafFolder = Boolean(item.isLeafWithReadme);
      
      return (
        <div key={item.path}>
          <div
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors",
              isActive && "bg-accent",
              !isLeafFolder && "hover:bg-accent/50 cursor-pointer"
            )}
            onClick={() => toggleFolder(item.path, isLeafFolder)}
          >
            {!isLeafFolder && (
              <span className="w-4 h-4 flex items-center justify-center">
                {isExpanded ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}
              </span>
            )}
            <FolderIcon size={16} className="text-blue-500 shrink-0" />
            <Link 
              href={currentPath}
              className="flex-1 truncate hover:text-accent-foreground/80"
              onClick={(e) => {
                if (!isLeafFolder) e.preventDefault();
              }}
            >
              {item.name}
            </Link>
          </div>
          {isExpanded && item.children && item.children.length > 0 && (
            <div className="ml-8">
              {item.children.map(child => renderItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    if (item.isReadme) return null;

    // Utilisation de BookIcon pour les fichiers
    const Icon = BookIcon;  
    const iconColor = 'text-gray-400';  // Couleur pour les fichiers (gris)

    return (
      <Link
        key={item.path}
        href={currentPath}
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors hover:bg-accent/50",
          isActive && "bg-accent"
        )}
      >
        <Icon size={16} className={cn("shrink-0", iconColor)} />
        <span className="truncate">{item.name}</span>
      </Link>
    );
  };

  if (!items.length) {
    return null;
  }

  return (
    <nav className="space-y-1">
      {items.map(item => renderItem(item))}
    </nav>
  );
}
