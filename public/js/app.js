const API = '/api';

/* ---------- Helpers ---------- */
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function formatPrice(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

/* ---------- Logged-in user (stored in the browser) ---------- */
function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

/* ---------- API calls ---------- */
async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const user = getUser();
  if (user && user.token) headers.Authorization = `Bearer ${user.token}`;

  const res = await fetch(API + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

/* ---------- Cart (stored in the browser) ---------- */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find((i) => i.productId === product._id);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, product.stock);
    existing.stock = product.stock;
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      qty: Math.min(qty, product.stock),
    });
  }
  saveCart(cart);
}

function updateCartQty(productId, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.productId === productId);
  if (!item) return;
  item.qty = Math.max(1, Math.min(qty, item.stock));
  saveCart(cart);
}

function removeFromCart(productId) {
  saveCart(getCart().filter((i) => i.productId !== productId));
}

function clearCart() {
  saveCart([]);
}

function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function cartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

/* ---------- Navbar ---------- */
function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = cartCount();
}

function renderNavbar() {
  const mount = document.getElementById('navbar');
  if (!mount) return;
  const user = getUser();

  const userLinks = user
    ? `<a href="orders.html">My Orders</a>
       <span>Hi, ${escapeHtml(user.name)}</span>
       <a href="#" id="logout-link">Logout</a>`
    : `<a href="login.html">Login</a>
       <a href="register.html">Register</a>`;

  mount.innerHTML = `
    <nav class="navbar">
      <div class="inner">
        <a href="index.html" class="logo">ShopEasy</a>
        <div class="nav-links">
          <a href="index.html">Home</a>
          <a href="cart.html">Cart<span class="cart-badge" id="cart-count">${cartCount()}</span></a>
          ${userLinks}
        </div>
      </div>
    </nav>`;

  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
}

document.addEventListener('DOMContentLoaded', renderNavbar);