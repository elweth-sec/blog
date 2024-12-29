const fs = require('fs').promises;
const path = require('path');
const { hasOnlyReadmeAndImages, isSpecialDirectory, isYearDirectory } = require('../utils/file');
const { sortContentList } = require('../utils/sort');

async function getContentList(dir, basePath = '') {
  const items = await fs.readdir(dir, { withFileTypes: true });
  const contentList = [];
  const years = new Set();
  const directories = [];
  const files = [];

  for (const item of items) {
    if (item.name.startsWith('.')) continue;
    if (isSpecialDirectory(item.name)) continue;

    const fullPath = path.join(dir, item.name);
    const relativePath = basePath ? `${basePath}/${item.name}` : item.name;

    if (item.isDirectory()) {
      if (isYearDirectory(item.name)) {
        years.add(item.name);
      } else {
        const hasReadme = await hasOnlyReadmeAndImages(fullPath);
        directories.push({ 
          name: item.name, 
          fullPath, 
          relativePath,
          isLeafWithReadme: hasReadme 
        });
      }
    } else if (item.name.endsWith('.md')) {
      files.push({
        name: item.name === 'README.md' ? 'Overview' : item.name.replace(/\.md$/, ''),
        type: 'file',
        path: item.name === 'README.md' ? relativePath : relativePath.replace(/\.md$/, ''),
        isReadme: item.name === 'README.md'
      });
    }
  }

  // Traiter les années
  for (const year of Array.from(years).sort().reverse()) {
    const yearPath = path.join(dir, year);
    const children = await getContentList(yearPath, `${basePath}/${year}`);
    contentList.push({
      name: year,
      type: 'directory',
      path: basePath ? `${basePath}/${year}` : year,
      children,
      isLeafWithReadme: await hasOnlyReadmeAndImages(yearPath)
    });
  }

  // Traiter les autres dossiers
  for (const dir of directories) {
    const children = await getContentList(dir.fullPath, dir.relativePath);
    contentList.push({
      name: dir.name,
      type: 'directory',
      path: dir.relativePath,
      children,
      isLeafWithReadme: dir.isLeafWithReadme
    });
  }

  // Ajouter les fichiers
  contentList.push(...files.map(file => ({
    ...file,
    type: 'file' // S'assurer que les fichiers ont le bon type
  })));

  return sortContentList(contentList);
}

module.exports = {
  getContentList
};