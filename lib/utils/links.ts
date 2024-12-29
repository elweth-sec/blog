export function transformLink(href: string, pathname: string): string {
    if (!href) return href;
    if (href.startsWith('http')) return href;
    if (href.startsWith('#')) return href;
  
    // Récupérer la section actuelle (articles ou writeups)
    const section = pathname.split('/')[1];
    if (!section) return href;
  
    // Récupérer le chemin actuel complet sans la section
    const currentPath = pathname
      .split('/')
      .slice(2)
      .map(segment => decodeURIComponent(segment));
  
    // Si le lien se termine par README.md, on le retire
    const cleanHref = href.replace(/\/README\.md$/, '');
  
    // Si c'est un chemin relatif, on le combine avec le chemin actuel
    if (!cleanHref.startsWith('/')) {
      // On retire le dernier segment si ce n'est pas un dossier
      const currentSegments = currentPath.slice(0, -1);
      
      // On split le href en segments et on filtre les segments vides
      const hrefSegments = cleanHref.split('/').filter(Boolean);
      
      // Pour chaque '..' on remonte d'un niveau
      while (hrefSegments[0] === '..') {
        currentSegments.pop();
        hrefSegments.shift();
      }
      
      // On combine les segments restants en préservant les espaces
      const finalPath = [...currentSegments, ...hrefSegments]
        .map(segment => segment.replace(/_/g, ' '))
        .join('/');
  
      return `/${section}/${finalPath}`;
    }
  
    // Pour les chemins absolus, on retire juste le /README.md et on remplace les underscores
    return cleanHref.replace(/_/g, ' ');
  }