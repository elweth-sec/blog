const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs').promises;

const REPO_URL = 'https://github.com/elweth-sec/blog/';
const CONTENT_DIR = path.join(process.cwd(), 'content');

async function syncGitHub() {
  try {
    // Ensure content directory exists
    await fs.mkdir(CONTENT_DIR, { recursive: true });

    const git = simpleGit();

    // Check if repo already exists
    const isRepo = await fs.access(path.join(CONTENT_DIR, '.git'))
      .then(() => true)
      .catch(() => false);

    if (!isRepo) {
      console.log('Cloning repository...');
      await git.clone(REPO_URL, CONTENT_DIR);
    } else {
      console.log('Pulling latest changes...');
      await git.cwd(CONTENT_DIR).pull();
    }

    console.log('Successfully synchronized with GitHub');
  } catch (error) {
    console.error('Error synchronizing with GitHub:', error);
    process.exit(1);
  }
}

syncGitHub();