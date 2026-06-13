/* =============================================
   M.O.B EKI VENTURES — SHARED SCRIPTS
   ============================================= */

// ── CART STATE ──────────────────────────────
const Cart = {
  get() {
    try { return JSON.parse(localStorage.getItem('mob_cart') || '[]'); }
    catch { return []; }
  },
  save(items) {
    localStorage.setItem('mob_cart', JSON.stringify(items));
    Cart.updateBadge();
  },
  add(product) {
    const items = Cart.get();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += (product.qty || 1);
    } else {
      items.push({ ...product, qty: product.qty || 1 });
    }
    Cart.save(items);
    showToast(`${product.name} added to cart`);
  },
  remove(id) {
    const items = Cart.get().filter(i => i.id !== id);
    Cart.save(items);
  },
  updateQty(id, qty) {
    const items = Cart.get();
    const item = items.find(i => i.id === id);
    if (item) { item.qty = Math.max(1, qty); Cart.save(items); }
  },
  total() {
    return Cart.get().reduce((sum, i) => sum + i.price * i.qty, 0);
  },
  count() {
    return Cart.get().reduce((sum, i) => sum + i.qty, 0);
  },
  updateBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      const count = Cart.count();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }
};

// ── TOAST ───────────────────────────────────
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">✓</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── FORMAT CURRENCY ─────────────────────────
function formatNaira(amount) {
  return '₦' + Number(amount).toLocaleString('en-NG');
}

// ── SEARCH ──────────────────────────────────
function initSearch() {
  const input = document.querySelector('.search-bar input');
  if (!input) return;
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && input.value.trim()) {
      const q = encodeURIComponent(input.value.trim());
      const base = window.location.pathname.includes('/user/') ? '' : 'user/';
      window.location.href = `${base}shop.html?search=${q}`;
    }
  });
}

// ── ACTIVE NAV ──────────────────────────────
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.site-nav a').forEach(a => {
    a.classList.remove('active');
  });
  const page = path.split('/').pop();
  const catMap = {
    'shop.html': 'ALL PRODUCTS',
  };
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('category');
  if (cat) {
    document.querySelectorAll('.site-nav a').forEach(a => {
      if (a.textContent.toLowerCase().includes(cat.toLowerCase().replace(/-/g,' '))) {
        a.classList.add('active');
      }
    });
  } else if (page === 'shop.html') {
    const allLink = document.querySelector('.site-nav a');
    if (allLink) allLink.classList.add('active');
  }
}

// ── INIT ON LOAD ────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
  initSearch();
  setActiveNav();
});

// ── DYNAMIC PRODUCTS & SETTINGS DATABASE ──────────────────────

const DEFAULT_PRODUCTS = [
  { id: 1,  name: 'Dangote 42.5R Cement',            category: 'cement-concrete',  price: 9500,  unit: 'bag',     badge: 'Best Seller', rating: 4.5, reviews: 312, img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80' },
  { id: 2,  name: 'BUA Cement 32.5N',                 category: 'cement-concrete',  price: 8900,  unit: 'bag',     badge: 'In Stock',    rating: 4.0, reviews: 187, img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80' },
  { id: 3,  name: '10mm Reinforcement Steel Rods',    category: 'steel-iron',       price: 4800,  unit: 'length',  badge: 'In Stock',    rating: 4.0, reviews: 203, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80' },
  { id: 4,  name: '16mm Steel Rods',                  category: 'steel-iron',       price: 7200,  unit: 'length',  badge: '',            rating: 4.5, reviews: 98,  img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&q=80' },
  { id: 5,  name: 'Iron Sheets (26 Gauge)',            category: 'steel-iron',       price: 6500,  unit: 'sheet',   badge: 'Best Seller', rating: 4.5, reviews: 156, img: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=500&q=80' },
  { id: 6,  name: 'Granite Floor Tiles 60×60',        category: 'tiles-flooring',   price: 3200,  unit: 'sqm',     badge: 'New Arrival', rating: 4.5, reviews: 74,  img: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=500&q=80' },
  { id: 7,  name: 'Porcelain Wall Tiles 30×60',       category: 'tiles-flooring',   price: 2400,  unit: 'sqm',     badge: 'In Stock',    rating: 4.0, reviews: 112, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80' },
  { id: 8,  name: 'Terrazzo Floor Tiles',             category: 'tiles-flooring',   price: 1800,  unit: 'sqm',     badge: '',            rating: 3.5, reviews: 45,  img: 'https://images.unsplash.com/photo-1558618047-f4e90d3b0db8?w=500&q=80' },
  { id: 9,  name: 'Hardwood Timber Planks',           category: 'timber-wood',      price: 12000, unit: 'bundle',  badge: 'New Arrival', rating: 4.5, reviews: 61,  img: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=500&q=80' },
  { id: 10, name: 'Dulux Weathershield Paint 4L',     category: 'paints',           price: 14500, unit: 'tin',     badge: 'Best Seller', rating: 5.0, reviews: 229, img: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&q=80' },
  { id: 11, name: 'PVC Pipes 1/2 inch (Bundle)',      category: 'plumbing',         price: 3800,  unit: 'bundle',  badge: 'In Stock',    rating: 4.0, reviews: 88,  img: 'https://images.unsplash.com/photo-1581094651181-35942459ef62?w=500&q=80' },
  { id: 12, name: 'Gate Valves (Set of 5)',            category: 'plumbing',         price: 5500,  unit: 'set',     badge: '',            rating: 4.0, reviews: 42,  img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80' },
];

const DEFAULT_CATEGORIES = [
  { id: 'cement-concrete', name: 'Cement & Concrete', icon: '🏗️', count: 48 },
  { id: 'steel-iron',      name: 'Steel & Iron',      icon: '⚙️', count: 34 },
  { id: 'tiles-flooring',  name: 'Tiles & Flooring',  icon: '🔲', count: 120 },
  { id: 'timber-wood',     name: 'Timber & Wood',     icon: '🪵', count: 62 },
  { id: 'paints',          name: 'Paints & Finishes',  icon: '🎨', count: 85 },
  { id: 'plumbing',        name: 'Plumbing',           icon: '🔧', count: 96 },
];

// Initialize dynamic global variables
let PRODUCTS = [];
let CATEGORIES = [];
let MOB_SETTINGS = {
  FREE: 500000,
  DFEE: 25000,
  firebaseApiKey: '',
  firebaseProjectId: '',
  firebaseAppId: ''
};

// Firebase app & database references
let firebaseApp = null;
let firestoreDb = null;

// The unified DB manager
const DB = {
  init() {
    // 1. Load Settings
    try {
      const savedSettings = localStorage.getItem('mob_settings');
      if (savedSettings) {
        MOB_SETTINGS = { ...MOB_SETTINGS, ...JSON.parse(savedSettings) };
      } else {
        localStorage.setItem('mob_settings', JSON.stringify(MOB_SETTINGS));
      }
    } catch (e) { console.error('Error loading settings', e); }

    // 2. Load Products
    try {
      const savedProducts = localStorage.getItem('mob_products');
      if (savedProducts) {
        PRODUCTS = JSON.parse(savedProducts);
      } else {
        PRODUCTS = [...DEFAULT_PRODUCTS];
        localStorage.setItem('mob_products', JSON.stringify(PRODUCTS));
      }
    } catch (e) {
      PRODUCTS = [...DEFAULT_PRODUCTS];
    }

    // 3. Load Categories
    try {
      const savedCats = localStorage.getItem('mob_categories');
      if (savedCats) {
        CATEGORIES = JSON.parse(savedCats);
      } else {
        CATEGORIES = [...DEFAULT_CATEGORIES];
        localStorage.setItem('mob_categories', JSON.stringify(CATEGORIES));
      }
    } catch (e) {
      CATEGORIES = [...DEFAULT_CATEGORIES];
    }

    // 4. Inject and Load Firebase SDK if configured
    if (MOB_SETTINGS.firebaseApiKey && MOB_SETTINGS.firebaseProjectId) {
      DB.loadFirebaseSDK();
    }

    // 5. Load Orders
    try {
      const savedOrders = localStorage.getItem('mob_orders');
      if (!savedOrders) {
        const defaultOrders = [
          { id:'MOB-2026-4820', date:'May 28, 2026', customerName:'Emeka Okafor', phone:'0803 456 7890', email:'emeka.okafor@example.com', address:'15 Adeola Odeku Street, Victoria Island, Lagos', state:'Lagos', city:'Victoria Island', total:28500, status:'Delivered', items:[{ id:1, name:'Dangote 42.5R Cement', price:9500, qty:3, unit:'bag', img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80' }] },
          { id:'MOB-2026-4715', date:'May 10, 2026', customerName:'Emeka Okafor', phone:'0803 456 7890', email:'emeka.okafor@example.com', address:'15 Adeola Odeku Street, Victoria Island, Lagos', state:'Lagos', city:'Victoria Island', total:9500, status:'Delivered', items:[{ id:1, name:'Dangote 42.5R Cement', price:9500, qty:1, unit:'bag', img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80' }] },
          { id:'MOB-2026-4601', date:'April 22, 2026', customerName:'Emeka Okafor', phone:'0803 456 7890', email:'emeka.okafor@example.com', address:'15 Adeola Odeku Street, Victoria Island, Lagos', state:'Lagos', city:'Victoria Island', total:87000, status:'Delivered', items:[{ id:10, name:'Dulux Weathershield Paint 4L', price:14500, qty:6, unit:'tin', img:'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&q=80' }] },
          { id:'MOB-2026-4821', date:'June 2, 2026', customerName:'Emeka Okafor', phone:'0803 456 7890', email:'emeka.okafor@example.com', address:'15 Adeola Odeku Street, Victoria Island, Lagos', state:'Lagos', city:'Victoria Island', total:14300, status:'In Transit', items:[{ id:3, name:'10mm Reinforcement Steel Rods', price:4800, qty:2, unit:'length', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80' }] },
        ];
        localStorage.setItem('mob_orders', JSON.stringify(defaultOrders));
      }
    } catch (e) {
      console.error('Error loading default orders', e);
    }
  },

  loadFirebaseSDK() {
    if (window.firebase) {
      DB.initFirebaseClient();
      return;
    }
    // Load Firebase App module
    const scriptApp = document.createElement('script');
    scriptApp.src = 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js';
    scriptApp.async = true;
    scriptApp.onload = () => {
      // Load Firestore module
      const scriptStore = document.createElement('script');
      scriptStore.src = 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js';
      scriptStore.async = true;
      scriptStore.onload = () => {
        DB.initFirebaseClient();
      };
      document.head.appendChild(scriptStore);
    };
    document.head.appendChild(scriptApp);
  },

  initFirebaseClient() {
    if (!window.firebase || !MOB_SETTINGS.firebaseApiKey || !MOB_SETTINGS.firebaseProjectId) return;
    try {
      const firebaseConfig = {
        apiKey: MOB_SETTINGS.firebaseApiKey,
        authDomain: `${MOB_SETTINGS.firebaseProjectId}.firebaseapp.com`,
        projectId: MOB_SETTINGS.firebaseProjectId,
        storageBucket: `${MOB_SETTINGS.firebaseProjectId}.appspot.com`,
        appId: MOB_SETTINGS.firebaseAppId || ''
      };
      
      if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(firebaseConfig);
      } else {
        firebaseApp = firebase.app();
      }
      firestoreDb = firebase.firestore();
      console.log('Firebase Firestore initialized successfully!');
      DB.syncFromFirebase();
    } catch (e) {
      console.error('Failed to create Firebase client', e);
    }
  },

  // Products CRUD
  getProducts() {
    return PRODUCTS;
  },

  async saveProduct(p) {
    const isNew = !p.id;
    if (isNew) {
      p.id = PRODUCTS.length ? Math.max(...PRODUCTS.map(x => x.id)) + 1 : 1;
      p.rating = p.rating || 4.0;
      p.reviews = p.reviews || 0;
      p.stock = p.stock !== undefined ? p.stock : 25;
      PRODUCTS.push(p);
    } else {
      const idx = PRODUCTS.findIndex(x => x.id === p.id);
      if (idx !== -1) PRODUCTS[idx] = { ...PRODUCTS[idx], ...p };
    }

    localStorage.setItem('mob_products', JSON.stringify(PRODUCTS));

    // Update categories count dynamically
    DB.updateCategoryCounts();

    if (firestoreDb) {
      try {
        await firestoreDb.collection('mob_products').doc(String(p.id)).set({
          id: p.id,
          name: p.name,
          category: p.category,
          price: Number(p.price),
          unit: p.unit,
          badge: p.badge || '',
          rating: Number(p.rating || 4.0),
          reviews: Number(p.reviews || 0),
          stock: Number(p.stock !== undefined ? p.stock : 25),
          img: p.img || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80'
        });
      } catch (e) {
        console.error('Error saving to Firebase', e);
      }
    }
    window.dispatchEvent(new CustomEvent('mob_catalog_changed'));
  },

  async deleteProduct(id) {
    PRODUCTS = PRODUCTS.filter(p => p.id !== id);
    localStorage.setItem('mob_products', JSON.stringify(PRODUCTS));

    // Update categories count
    DB.updateCategoryCounts();

    if (firestoreDb) {
      try {
        await firestoreDb.collection('mob_products').doc(String(id)).delete();
      } catch (e) {
        console.error('Error deleting from Firebase', e);
      }
    }
    window.dispatchEvent(new CustomEvent('mob_catalog_changed'));
  },

  updateCategoryCounts() {
    CATEGORIES.forEach(cat => {
      cat.count = PRODUCTS.filter(p => p.category === cat.id).length;
    });
    localStorage.setItem('mob_categories', JSON.stringify(CATEGORIES));
  },

  // Orders CRUD
  getOrders() {
    try {
      return JSON.parse(localStorage.getItem('mob_orders') || '[]');
    } catch {
      return [];
    }
  },

  async saveOrder(order) {
    const orders = DB.getOrders();
    orders.unshift(order); // Newest first
    localStorage.setItem('mob_orders', JSON.stringify(orders));

    if (firestoreDb) {
      try {
        await firestoreDb.collection('mob_orders').doc(order.id).set({
          id: order.id,
          created_at: order.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          customer_name: order.customerName,
          phone: order.phone,
          email: order.email,
          address: order.address,
          state: order.state,
          city: order.city,
          total_price: Number(order.total),
          status: order.status,
          items: order.items // Firestore supports nested arrays/objects directly
        });
      } catch (e) {
        console.error('Error saving order to Firebase', e);
      }
    }
    window.dispatchEvent(new CustomEvent('mob_orders_changed'));
  },

  async updateOrderStatus(id, status) {
    const orders = DB.getOrders();
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      localStorage.setItem('mob_orders', JSON.stringify(orders));

      if (firestoreDb) {
        try {
          await firestoreDb.collection('mob_orders').doc(id).update({ status: status });
        } catch (e) {
          console.error('Error updating status on Firebase', e);
        }
      }
      window.dispatchEvent(new CustomEvent('mob_orders_changed'));
    }
  },

  // Settings
  getSettings() {
    return MOB_SETTINGS;
  },

  async saveSettings(settings) {
    MOB_SETTINGS = { ...MOB_SETTINGS, ...settings };
    localStorage.setItem('mob_settings', JSON.stringify(MOB_SETTINGS));

    if (settings.firebaseApiKey || settings.firebaseProjectId) {
      DB.loadFirebaseSDK();
    }

    if (firestoreDb) {
      try {
        await firestoreDb.collection('mob_settings').doc('config').set({
          FREE: Number(MOB_SETTINGS.FREE),
          DFEE: Number(MOB_SETTINGS.DFEE)
        }, { merge: true });
      } catch (e) {
        console.error('Error saving settings on Firebase', e);
      }
    }
    window.dispatchEvent(new CustomEvent('mob_settings_changed'));
  },

  // Syncing with Firebase database
  async syncFromFirebase() {
    if (!firestoreDb) return;

    try {
      // 1. Sync Products
      const prodSnap = await firestoreDb.collection('mob_products').orderBy('id').get();
      if (!prodSnap.empty) {
        const dbProducts = [];
        prodSnap.forEach(doc => {
          dbProducts.push(doc.data());
        });
        PRODUCTS = dbProducts;
        localStorage.setItem('mob_products', JSON.stringify(PRODUCTS));
        DB.updateCategoryCounts();
        window.dispatchEvent(new CustomEvent('mob_catalog_changed'));
      } else {
        // Seed Firestore if empty
        console.log('Seeding products to Firebase...');
        for (const p of PRODUCTS) {
          if (p.stock === undefined) p.stock = 25;
          await firestoreDb.collection('mob_products').doc(String(p.id)).set(p);
        }
      }

      // 2. Sync Orders
      const ordSnap = await firestoreDb.collection('mob_orders').get();
      if (!ordSnap.empty) {
        const dbOrders = [];
        ordSnap.forEach(doc => {
          const o = doc.data();
          dbOrders.push({
            id: o.id,
            date: o.created_at,
            customerName: o.customer_name,
            phone: o.phone,
            email: o.email,
            address: o.address,
            state: o.state,
            city: o.city,
            total: o.total_price,
            status: o.status,
            items: o.items
          });
        });
        // Sort descending by date (or ID if date strings aren't perfect)
        dbOrders.sort((a,b) => b.id.localeCompare(a.id));
        localStorage.setItem('mob_orders', JSON.stringify(dbOrders));
        window.dispatchEvent(new CustomEvent('mob_orders_changed'));
      }

      // 3. Sync Settings
      const setDoc = await firestoreDb.collection('mob_settings').doc('config').get();
      if (setDoc.exists) {
        const data = setDoc.data();
        if (data.FREE !== undefined) MOB_SETTINGS.FREE = Number(data.FREE);
        if (data.DFEE !== undefined) MOB_SETTINGS.DFEE = Number(data.DFEE);
        localStorage.setItem('mob_settings', JSON.stringify(MOB_SETTINGS));
        window.dispatchEvent(new CustomEvent('mob_settings_changed'));
      }

      console.log('Database synced with Firebase Firestore!');
    } catch (e) {
      console.error('Error syncing data with Firebase', e);
    }
  }
};

// Initialize DB Immediately on script load
DB.init();

