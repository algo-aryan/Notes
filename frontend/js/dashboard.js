const docsGrid = document.getElementById('docs-grid');
const newDocBtn = document.getElementById('new-doc-btn');
const logoutBtn = document.getElementById('logout-btn');
const userName = document.getElementById('user-name');

// Fetch current user
async function checkAuth() {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/current-user`, { credentials: 'include' });
    if (!res.ok) {
      window.location.href = 'index.html'; // Redirect to login if not authenticated
      return;
    }
    const data = await res.json();
    userName.textContent = `Hello, ${data.user.name}`;
    loadDocuments();
  } catch (err) {
    window.location.href = 'index.html';
  }
}

// Load user's documents
async function loadDocuments() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/documents`, { credentials: 'include' });
    const docs = await res.json();
    
    docsGrid.innerHTML = '';
    
    if (docs.length === 0) {
      docsGrid.innerHTML = '<p style="color: var(--text-muted); grid-column: 1 / -1;">No documents found. Create one!</p>';
      return;
    }
    
    docs.forEach(doc => {
      const card = document.createElement('a');
      card.className = 'doc-card';
      card.href = `editor.html?id=${doc._id}`;
      
      const title = document.createElement('h3');
      title.textContent = doc.title;
      title.style.margin = '0 0 0.5rem 0';
      
      const date = document.createElement('p');
      date.textContent = new Date(doc.updatedAt).toLocaleDateString();
      date.style.margin = '0';
      date.style.fontSize = '0.875rem';
      date.style.color = 'var(--text-muted)';
      
      card.appendChild(title);
      card.appendChild(date);
      docsGrid.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading documents:', err);
  }
}

// Create new document
newDocBtn.addEventListener('click', async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title: 'Untitled Document' })
    });
    const newDoc = await res.json();
    window.location.href = `editor.html?id=${newDoc._id}`;
  } catch (err) {
    alert('Failed to create document');
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  await fetch(`${BACKEND_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
  window.location.href = 'index.html';
});

// Initialize
checkAuth();
