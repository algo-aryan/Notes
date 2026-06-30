// Determine if we're on login or register view
let isLogin = true;

const authForm = document.getElementById('auth-form');
const nameGroup = document.getElementById('name-group');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const toggleAuth = document.getElementById('toggle-auth');
const submitBtn = document.getElementById('submit-btn');
const googleBtn = document.getElementById('google-auth-btn');

if (googleBtn) {
  googleBtn.href = `${BACKEND_URL}/auth/google`;
}

if (toggleAuth) {
  toggleAuth.addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    
    if (isLogin) {
      nameGroup.style.display = 'none';
      nameInput.removeAttribute('required');
      submitBtn.textContent = 'Sign In';
      toggleAuth.textContent = 'Need an account? Register';
    } else {
      nameGroup.style.display = 'block';
      nameInput.setAttribute('required', 'true');
      submitBtn.textContent = 'Register';
      toggleAuth.textContent = 'Already have an account? Sign In';
    }
  });
}

if (authForm) {
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = {
      email: emailInput.value,
      password: passwordInput.value,
    };
    
    if (!isLogin) payload.name = nameInput.value;

    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (!isLogin) {
          alert('Registration successful! Please sign in.');
          toggleAuth.click(); // Switch to login
        } else {
          // Login successful, redirect to dashboard
          window.location.href = 'dashboard.html';
        }
      } else {
        alert(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('An error occurred. Please try again.');
    }
  });
}

// Check session on load
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/current-user`, {
      credentials: 'include'
    });
    if (res.ok) {
      // If we are on index page but logged in, redirect to dashboard
      if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        window.location.href = 'dashboard.html';
      }
    }
  } catch (error) {
    // Ignore error, means user is just not logged in
  }
});
