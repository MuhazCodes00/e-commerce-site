function renderHeader(rootPath = '') {
  const navLinks = [
    { label: 'All Products',      cat: '' },
    { label: 'Cement & Concrete', cat: 'cement-concrete' },
    { label: 'Steel & Iron',      cat: 'steel-iron' },
    { label: 'Tiles & Flooring',  cat: 'tiles-flooring' },
    { label: 'Timber & Wood',     cat: 'timber-wood' },
    { label: 'Paints',            cat: 'paints' },
    { label: 'Plumbing',          cat: 'plumbing' },
  ];
  const navHTML = navLinks.map(n => {
    const href = n.cat ? `${rootPath}shop.html?category=${n.cat}` : `${rootPath}shop.html`;
    return `<li><a href="${href}">${n.label}</a></li>`;
  }).join('');

  document.getElementById('site-header').innerHTML = `
    <div class="announce-bar">Free delivery on orders above ₦500,000</div>
    <header class="site-header">
      <div class="header-main">
        <a href="${rootPath}index.html" class="logo">
          <div class="logo-mark">MOB</div>
          <div class="logo-text"><strong>M.O.B EKI</strong><span>Ventures</span></div>
        </a>
        <div class="search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Search for cement, steel, tiles...">
        </div>
        <div class="header-actions">
          <a href="${rootPath}login.html" class="header-action-btn" style="font-size:12px;padding:6px 14px;background:rgba(255,255,255,.1);border-radius:var(--radius-pill);border:1px solid rgba(255,255,255,.2)">Sign In</a>
          <a href="${rootPath}register.html" class="btn btn-primary btn-sm" style="padding:8px 18px;font-size:12px">Register</a>
          <a href="${rootPath}account.html" class="header-action-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Account
          </a>
          <a href="${rootPath}cart.html" class="header-action-btn cart-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Cart
            <span class="cart-badge">0</span>
          </a>
        </div>
      </div>
      <nav class="site-nav"><ul>${navHTML}</ul></nav>
    </header>`;

  // 3D tilt on logo
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('mousemove', e => {
      const r = logo.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) / r.width;
      const y = (e.clientY - r.top - r.height/2) / r.height;
      const mark = logo.querySelector('.logo-mark');
      if (mark) mark.style.transform = `perspective(400px) rotateY(${x*20}deg) rotateX(${-y*20}deg) scale(1.1)`;
    });
    logo.addEventListener('mouseleave', () => {
      const mark = logo.querySelector('.logo-mark');
      if (mark) mark.style.transform = '';
    });
  }
}

function renderFooter(rootPath = '') {
  document.getElementById('site-footer').innerHTML = `
    <footer class="site-footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="${rootPath}index.html" class="logo">
            <div class="logo-mark">MOB</div>
            <div class="logo-text"><strong>M.O.B EKI</strong><span>Ventures</span></div>
          </a>
          <p>Supplying premium construction materials for residential, commercial, and industrial projects across Nigeria since 2009.</p>
        </div>
        <div class="footer-col"><h4>Products</h4><ul>
          <li><a href="${rootPath}shop.html?category=cement-concrete">Cement & Concrete</a></li>
          <li><a href="${rootPath}shop.html?category=steel-iron">Steel & Iron</a></li>
          <li><a href="${rootPath}shop.html?category=tiles-flooring">Tiles & Flooring</a></li>
          <li><a href="${rootPath}shop.html?category=timber-wood">Timber & Wood</a></li>
          <li><a href="${rootPath}shop.html?category=paints">Paints & Finishes</a></li>
          <li><a href="${rootPath}shop.html?category=plumbing">Plumbing</a></li>
        </ul></div>
        <div class="footer-col"><h4>Company</h4><ul>
          <li><a href="${rootPath}about.html">About Us</a></li>
          <li><a href="${rootPath}about.html#contact">Contact</a></li>
          <li><a href="${rootPath}admin/index.html" style="font-weight:600;color:var(--blue-light)">Admin Portal 🔑</a></li>
          <li><a href="#">Bulk Orders</a></li>
        </ul></div>
        <div class="footer-col footer-contact"><h4>Contact</h4>
          <p><strong>📍</strong> Plot 23, Industrial Layout, Ikeja, Lagos</p>
          <p><strong>📞</strong> 0803 456 7890</p>
          <p><strong>✉️</strong> info@mobeki.com</p>
          <p style="margin-top:16px;font-size:12px;">Mon – Sat: 8am – 6pm</p>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 M.O.B Eki Ventures. All rights reserved.</span>
        <span>Powered by Paystack & Bank Transfer</span>
      </div>
    </footer>`;
}

function renderTrustBar() {
  const items = [
    { icon: '🚚', label: 'Nationwide Delivery' },
    { icon: '✅', label: 'Certified Quality' },
    { icon: '🎧', label: 'Expert Support' },
    { icon: '⭐', label: 'Trusted by Thousands' },
  ];
  const el = document.getElementById('trust-bar');
  if (el) el.innerHTML = `<div class="trust-bar"><div class="trust-bar-inner">${
    items.map(i => `<div class="trust-item"><div class="trust-item-icon">${i.icon}</div> ${i.label}</div>`).join('')
  }</div></div>`;
}

// ── 3D CARD TILT ──
function init3DCards() {
  document.querySelectorAll('.product-card, .cat-card, .why-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y*10}deg) rotateY(${x*10}deg) translateY(-12px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(init3DCards, 300);
  const observer = new MutationObserver(() => setTimeout(init3DCards, 100));
  observer.observe(document.body, { childList: true, subtree: true });
});
