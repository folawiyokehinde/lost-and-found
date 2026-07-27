// ── FOUND ITEMS DATA ──
const allItems = [
  { emoji:'📱', name:'iPhone 13 Pro', cat:'Electronics', loc:'Main Library, Floor 1', date:'May 20, 2024' },
  { emoji:'🎧', name:'Sony WH-1000XM5', cat:'Electronics', loc:'Student Center', date:'May 19, 2024' },
  { emoji:'👛', name:'Black Leather Wallet', cat:'Bags & Wallets', loc:'Cafeteria', date:'May 18, 2024' },
  { emoji:'🔑', name:'Car Keys (Toyota)', cat:'Keys', loc:'Parking Lot B', date:'May 17, 2024' },
  { emoji:'🎒', name:'Green Backpack', cat:'Bags & Wallets', loc:'Lecture Hall B3', date:'May 16, 2024' },
  { emoji:'📚', name:'Calculus Textbook', cat:'Books', loc:'Science Block, Room 4', date:'May 15, 2024' },
  { emoji:'⌚', name:'Apple Watch Series 8', cat:'Electronics', loc:'Sports Centre', date:'May 14, 2024' },
  { emoji:'🧣', name:'Blue Scarf', cat:'Clothing', loc:'Admin Block Lobby', date:'May 13, 2024' },
  { emoji:'💻', name:'Dell Laptop (14″)', cat:'Electronics', loc:'Computer Lab 2', date:'May 12, 2024' },
  { emoji:'🕶️', name:'Ray-Ban Sunglasses', cat:'Other', loc:'Campus Canteen', date:'May 11, 2024' },
];

function renderCards(items) {
  const grid = document.getElementById('found-grid');
  if (!grid) return; // guard: this page may not have the found-items grid
  document.getElementById('item-count').textContent = items.length;
  grid.innerHTML = items.map(item => `
    <div class="found-card">
      <div class="found-card-img">${item.emoji}<span class="item-badge">Found</span></div>
      <div class="found-card-body">
        <h4>${item.name}</h4>
        <div class="found-meta">📍 ${item.loc}</div>
        <div class="found-meta">📅 ${item.date}</div>
        <div class="found-contact-btn" onclick="showPage('contact')">💬 Contact Finder</div>
      </div>
    </div>
  `).join('');
}

function filterCards(q) {
  const filtered = allItems.filter(i =>
    i.name.toLowerCase().includes(q.toLowerCase()) ||
    i.loc.toLowerCase().includes(q.toLowerCase())
  );
  renderCards(filtered);
}

function filterByCategory(cat) {
  const filtered = cat ? allItems.filter(i => i.cat.includes(cat)) : allItems;
  renderCards(filtered);
}

// ── PAGE ROUTING ──
function showPage(id) {
  const target = document.getElementById('page-' + id);
  if (!target) return; // this "page" div doesn't exist on the current physical file — nothing to do
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  target.classList.add('active');
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'found') renderCards(allItems);
}

// ── AUTH TAB SWITCHER ──
function switchTab(tab) {
  ['login','signup'].forEach(t => {
    document.getElementById('tab-' + t).classList.toggle('active', t === tab);
    document.getElementById('panel-' + t).classList.toggle('active', t === tab);
  });
  document.getElementById('login-err').classList.remove('show');
  document.getElementById('signup-err').classList.remove('show');
}

// ── PASSWORD TOGGLE ──
function togglePwd(id, eye) {
  const inp = document.getElementById(id);
  const isText = inp.type === 'text';
  inp.type = isText ? 'password' : 'text';
  eye.textContent = isText ? '👁' : '🙈';
}

// ── PASSWORD STRENGTH ──
function checkStrength(val) {
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const colors = ['#ef4444','#f97316','#eab308','#22c55e'];
  const labels = ['Weak','Fair','Good','Strong'];
  [1,2,3,4].forEach(i => {
    document.getElementById('sb'+i).style.background = i <= score ? colors[score-1] : 'var(--border)';
  });
  const lbl = document.getElementById('sb-label');
  lbl.textContent = val.length ? (labels[score-1] || '') : '';
  lbl.style.color = score > 0 ? colors[score-1] : 'var(--muted)';
}

// ── SHOW ERROR / SUCCESS ──
function showToast(id, msg, isError) {
  const el = document.getElementById(id);
  if (msg) document.getElementById(id + '-msg').textContent = msg;
  el.classList.remove('toast-success','toast-error');
  el.classList.add(isError ? 'toast-error' : 'toast-success');
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 4000);
}

// ── LOGIN ──
function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pwd   = document.getElementById('login-pwd').value;
  if (!email || !pwd) { showToast('login-err','Please enter your email and password.',true); return; }
  if (!email.includes('@')) { showToast('login-err','Please enter a valid university email.',true); return; }

  const name = email.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g, c => c.toUpperCase());

  // Save the name BEFORE navigating so the next page can pick it up.
  sessionStorage.setItem('cf_user', name);
  window.location.href = "../index.html";
}

// ── SIGN UP ──
function doSignup() {
  const first = document.getElementById('su-first').value.trim();
  const last  = document.getElementById('su-last').value.trim();
  const email = document.getElementById('su-email').value.trim();
  const pwd   = document.getElementById('su-pwd').value;
  const terms = document.getElementById('terms').checked;
  if (!first || !last || !email || !pwd) { showToast('signup-err','Please fill in all fields.',true); return; }
  if (!email.includes('@')) { showToast('signup-err','Please enter a valid university email.',true); return; }
  if (pwd.length < 8) { showToast('signup-err','Password must be at least 8 characters.',true); return; }
  if (!terms) { showToast('signup-err','Please accept the Terms to continue.',true); return; }

  const name = `${first} ${last}`;

  // This was the missing piece: signup never persisted the name or navigated,
  // so the nav update only ever applied (briefly) to the signup page itself.
  sessionStorage.setItem('cf_user', name);
  window.location.href = "../index.html";
}

function loginSuccess(name) {
  const authArea  = document.getElementById('nav-auth-area');
  const userArea  = document.getElementById('nav-user-area');
  const userNameEl = document.getElementById('nav-user-name');
  const avatarEl   = document.getElementById('nav-avatar-initials');

  // Guard every lookup — this function can run on pages that don't have
  // the full nav markup, and a missing element should never break the rest.
  if (authArea) authArea.style.display = 'none';
  if (userArea) userArea.style.display = 'flex';
  if (userNameEl) userNameEl.textContent = name.split(' ')[0];
  if (avatarEl) {
    avatarEl.textContent = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  // Only try to show the home "page" if this file actually has one.
  if (document.getElementById('page-home')) {
    showPage('home');
  }
}

function logOut() {
  const authArea = document.getElementById('nav-auth-area');
  const userArea = document.getElementById('nav-user-area');
  if (authArea) authArea.style.display = 'flex';
  if (userArea) userArea.style.display = 'none';
  sessionStorage.removeItem('cf_user');
  if (document.getElementById('page-home')) {
    showPage('home');
  }
}

// ── FORM TOASTS ──
function submitReport() {
  const t = document.getElementById('report-toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4000);
}
function submitContact() {
  const t = document.getElementById('contact-toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4000);
}

// ── FAQ ──
function toggleFaq(el) {
  el.classList.toggle('open');
  el.nextElementSibling.classList.toggle('open');
}

// ── INIT ──
renderCards(allItems);

// Restore login state on every page load (home, found, report, contact, etc.)
const savedUser = sessionStorage.getItem('cf_user');
if (savedUser) {
  loginSuccess(savedUser);
}