// Get document ID from URL
const urlParams = new URLSearchParams(window.location.search);
const documentId = urlParams.get('id');

if (!documentId) {
  window.location.href = 'dashboard.html';
}

const statusEl = document.getElementById('status');
const titleInput = document.getElementById('doc-title');
const saveBtn = document.getElementById('save-btn');

// Initialize Quill Editor
const quill = new Quill('#editor-container', {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'code-block'],
      ['clean']
    ]
  }
});

quill.disable();
quill.setText('Loading document...');

// Connect to Socket.IO Server
const socket = io(BACKEND_URL);

socket.on('connect', () => {
  statusEl.textContent = 'Connected';
  socket.emit('get-document', documentId);
});

// Load document data from server
socket.on('load-document', (documentData) => {
  quill.setContents(documentData);
  quill.enable();
  
  // Also fetch the document title from API
  fetch(`${BACKEND_URL}/api/documents/${documentId}`, { credentials: 'include' })
    .then(res => res.json())
    .then(doc => {
      if (doc) titleInput.value = doc.title;
    });
});

// Listen for local text changes and broadcast Deltas to socket
quill.on('text-change', (delta, oldDelta, source) => {
  if (source !== 'user') return;
  socket.emit('send-changes', delta);
});

// Receive Deltas from other users and apply them
socket.on('receive-changes', (delta) => {
  quill.updateContents(delta);
});

// Auto-save document every 2 seconds if changed
let saveTimeout;
quill.on('text-change', (delta, oldDelta, source) => {
  if (source !== 'user') return;
  
  clearTimeout(saveTimeout);
  statusEl.textContent = 'Saving...';
  
  saveTimeout = setTimeout(() => {
    socket.emit('save-document', quill.getContents());
    statusEl.textContent = 'Saved';
    setTimeout(() => { statusEl.textContent = 'Connected'; }, 1000);
  }, 2000);
});

// Manual save button
saveBtn.addEventListener('click', () => {
  socket.emit('save-document', quill.getContents());
  statusEl.textContent = 'Saved';
});
