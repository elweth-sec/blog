const fs = require('fs').promises;
const path = require('path');

async function hasOnlyReadmeAndImages(dir) {
  const items = await fs.readdir(dir, { withFileTypes: true });
  const nonSpecialDirs = items.filter(item => 
    item.isDirectory() && !['images', 'src'].includes(item.name)
  );
  const markdownFiles = items.filter(item => 
    item.isFile() && item.name.endsWith('.md')
  );
  
  return nonSpecialDirs.length === 0 && markdownFiles.length === 1 && markdownFiles[0].name === 'README.md';
}

function isSpecialDirectory(name) {
  return ['images', 'src'].includes(name) || name.startsWith('.');
}

function isYearDirectory(name) {
  return /^20\d{2}$/.test(name);
}

module.exports = {
  hasOnlyReadmeAndImages,
  isSpecialDirectory,
  isYearDirectory
};