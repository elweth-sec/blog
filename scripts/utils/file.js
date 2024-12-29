const fs = require('fs').promises;
const path = require('path');

async function hasOnlyReadmeAndImages(dir) {
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });
    
    // Filtrer les éléments qui ne sont pas des dossiers spéciaux ou des fichiers cachés
    const relevantItems = items.filter(item => 
      !item.name.startsWith('.') && 
      !(item.isDirectory() && ['images', 'src'].includes(item.name))
    );
    
    // Vérifier s'il n'y a qu'un seul fichier et que c'est un README.md
    return relevantItems.length === 1 && 
           relevantItems[0].isFile() && 
           relevantItems[0].name === 'README.md';
  } catch (error) {
    console.error(`Error checking directory ${dir}:`, error);
    return false;
  }
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