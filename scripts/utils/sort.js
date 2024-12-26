function sortContentList(contentList) {
    return contentList.sort((a, b) => {
      // README toujours en premier
      if (a.type === 'file' && a.isReadme) return -1;
      if (b.type === 'file' && b.isReadme) return 1;
      
      // Années en premier
      if (a.type === 'directory' && /^20\d{2}$/.test(a.name)) {
        if (b.type === 'directory' && /^20\d{2}$/.test(b.name)) {
          return b.name.localeCompare(a.name); // Tri décroissant des années
        }
        return -1;
      }
      if (b.type === 'directory' && /^20\d{2}$/.test(b.name)) return 1;
      
      // Autres dossiers ensuite
      if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
      
      // Tri alphabétique par défaut
      return a.name.localeCompare(b.name);
    });
  }
  
  module.exports = {
    sortContentList
  };