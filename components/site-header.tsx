'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex-1">
          <Link href="/" className="flex items-center space-x-3 transition-opacity hover:opacity-80">
            <Image
              src="/logo.png"
              alt="Logo"
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="font-bold text-lg">Elweth Blog</span>
          </Link>
        </div>

        <nav className="ml-auto mr-4">
          <ul className="flex items-center space-x-8">
            <li>
              <Link 
                href="/writeups" 
                className={cn(
                  "relative py-4 text-sm font-medium transition-colors hover:text-accent-foreground/80",
                  isActive('/writeups') && "text-primary",
                  "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:transform",
                  isActive('/writeups') ? "after:scale-x-100" : "after:scale-x-0",
                  "after:transition-transform after:duration-200 hover:after:scale-x-100"
                )}
              >
                Writeups
              </Link>
            </li>
            <li>
              <Link 
                href="/articles" 
                className={cn(
                  "relative py-4 text-sm font-medium transition-colors hover:text-accent-foreground/80",
                  isActive('/articles') && "text-primary",
                  "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:transform",
                  isActive('/articles') ? "after:scale-x-100" : "after:scale-x-0",
                  "after:transition-transform after:duration-200 hover:after:scale-x-100"
                )}
              >
                Articles
              </Link>
            </li>
            <li>
              <Link 
                href="/whoami" 
                className={cn(
                  "relative py-4 text-sm font-medium transition-colors hover:text-accent-foreground/80",
                  isActive('/whoami') && "text-primary",
                  "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:transform",
                  isActive('/whoami') ? "after:scale-x-100" : "after:scale-x-0",
                  "after:transition-transform after:duration-200 hover:after:scale-x-100"
                )}
              >
                Whoami
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}