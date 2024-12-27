'use client';

import { ContentList } from '@/components/content-list';
import { useState, useCallback, useRef, useEffect } from 'react';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const startResizing = useCallback((e: React.MouseEvent) => {
    isResizing.current = true;
    startX.current = e.pageX;
    startWidth.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [sidebarWidth]);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = startWidth.current + (e.pageX - startX.current);
    setSidebarWidth(Math.min(Math.max(200, newWidth), 600));
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResizing);
    return () => {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <aside 
        style={{ width: `${sidebarWidth}px` }}
        className="sticky top-14 h-[calc(100vh-3.5rem)] bg-accent/40 border-r border-border shrink-0"
      >
        <div className="h-full overflow-y-auto p-6">
          <ContentList />
        </div>
      </aside>

      <div
        className="w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-colors"
        onMouseDown={startResizing}
      />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-16 py-8">
          <article className="prose max-w-none">
            {children}
          </article>
        </div>
      </main>
    </div>
  );
}