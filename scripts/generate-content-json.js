const fs = require('fs').promises;
const path = require('path');
const { getContentList } = require('./content/tree');

async function generateContentJson() {
  const sections = ['articles', 'writeups'];

  for (const section of sections) {
    const contentDir = path.join(process.cwd(), 'content', section);
    try {
      await fs.access(contentDir);
      const content = await getContentList(contentDir);
      await fs.writeFile(
        path.join(process.cwd(), 'content', section, 'content.json'),
        JSON.stringify(content, null, 2)
      );
      console.log(`Generated content.json for ${section}`);
    } catch (error) {
      console.error(`Error processing ${section}:`, error);
      // Créer un content.json vide si le dossier n'existe pas
      await fs.mkdir(contentDir, { recursive: true });
      await fs.writeFile(
        path.join(process.cwd(), 'content', section, 'content.json'),
        JSON.stringify([], null, 2)
      );
    }
  }
}

generateContentJson().catch(console.error);