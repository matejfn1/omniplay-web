document.getElementById('search-input').addEventListener('input', (e) => {
  const query = e.target.value.trim().toLowerCase();
  
  if (!query) {
    renderMatrixTable(allGames);
    return;
  }

  // Search existing database
  let filtered = allGames.filter(g => 
    g.title.toLowerCase().includes(query) || 
    g.id.toLowerCase().includes(query)
  );

  // If a user searches for an unlisted Title ID (e.g., CUSA or BLES), auto-generate a "Nothing" status
  if (filtered.length === 0 && (query.startsWith('bles') || query.startsWith('bcus') || query.startsWith('cusa'))) {
    filtered = [{
      id: query.toUpperCase(),
      title: `Unknown Title (${query.toUpperCase()})`,
      system: query.startsWith('cusa') ? 'PS4' : 'PS3',
      engine: query.startsWith('cusa') ? 'OmniPlay PS4 Core' : 'OmniPlay Native Core',
      status: 'Nothing'
    }];
  }

  renderMatrixTable(filtered);
});