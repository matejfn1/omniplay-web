let allGames = [];

async function loadDatabase() {
  try {
    const response = await fetch('./api/games.json');
    allGames = await response.json();
    
    updateRPCS3Stats(allGames);
    renderRPCS3Table(allGames);
  } catch (err) {
    console.error('Error fetching matrix:', err);
  }
}

function updateRPCS3Stats(games) {
  document.getElementById('stat-total').textContent = games.length;
  document.getElementById('stat-playable').textContent = games.filter(g => g.status === 'Playable').length;
  document.getElementById('stat-ingame').textContent = games.filter(g => g.status === 'Ingame').length;
  document.getElementById('stat-nothing').textContent = games.filter(g => g.status === 'Nothing').length;
}

function renderRPCS3Table(games) {
  const tableBody = document.getElementById('compatibility-table-body');
  
  if (games.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">No matching titles found.</td></tr>`;
    return;
  }

  tableBody.innerHTML = games.map(game => `
    <tr>
      <td><img src="${game.icon || 'https://via.placeholder.com/46?text=PS'}" class="game-icon" alt="icon"></td>
      <td><strong>${game.title}</strong></td>
      <td><code>${game.id}</code></td>
      <td>${game.system}</td>
      <td><span class="status-badge ${game.status.toLowerCase()}">${game.status}</span></td>
    </tr>
  `).join('');
}

document.getElementById('search-input').addEventListener('input', (e) => {
  const query = e.target.value.trim().toLowerCase();
  
  if (!query) {
    renderRPCS3Table(allGames);
    return;
  }

  let filtered = allGames.filter(g => 
    g.title.toLowerCase().includes(query) || 
    g.id.toLowerCase().includes(query)
  );

  if (filtered.length === 0 && (query.startsWith('bles') || query.startsWith('bcus') || query.startsWith('cusa'))) {
    filtered = [{
      icon: 'https://via.placeholder.com/46?text=PS',
      id: query.toUpperCase(),
      title: `Unlisted Title (${query.toUpperCase()})`,
      system: query.startsWith('cusa') ? 'PS4' : 'PS3',
      status: 'Nothing'
    }];
  }

  renderRPCS3Table(filtered);
});

document.addEventListener('DOMContentLoaded', loadDatabase);