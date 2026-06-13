/* =============================================
   M.O.B EKI VENTURES — ADMIN PANEL CONTROLLER
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  AdminController.init();
});

const AdminController = {
  activeTab: 'overview',
  currentEditingProductId: null,

  init() {
    // 1. Setup Tab Switching
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const tab = item.getAttribute('data-tab');
        AdminController.switchTab(tab);
      });
    });

    // 2. Load Filter Dropdowns
    AdminController.populateCategoryFilters();

    // 3. Load Initial Data
    AdminController.renderAll();

    // 4. Load Settings Values
    AdminController.loadSettingsForm();

    // 5. Listen to Database Updates
    window.addEventListener('mob_catalog_changed', () => {
      console.log('Admin catalog update event received.');
      AdminController.renderOverview();
      AdminController.renderProductsTable();
    });

    window.addEventListener('mob_orders_changed', () => {
      console.log('Admin orders update event received.');
      AdminController.renderOverview();
      AdminController.renderOrdersTable();
    });

    window.addEventListener('mob_settings_changed', () => {
      console.log('Admin settings update event received.');
      AdminController.loadSettingsForm();
    });

    // Setup input search events
    document.getElementById('products-search').addEventListener('input', AdminController.renderProductsTable);
    document.getElementById('products-category-filter').addEventListener('change', AdminController.renderProductsTable);
    document.getElementById('orders-search').addEventListener('input', AdminController.renderOrdersTable);
    document.getElementById('orders-status-filter').addEventListener('change', AdminController.renderOrdersTable);
  },

  // Switch between tabs
  switchTab(tabName) {
    AdminController.activeTab = tabName;

    // Toggle nav active classes
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-tab') === tabName);
    });

    // Toggle view visibility
    document.querySelectorAll('.admin-content-view').forEach(view => {
      view.classList.toggle('active', view.getAttribute('id') === `view-${tabName}`);
    });

    // Set page title
    const titles = {
      overview: 'Dashboard Overview',
      orders: 'Customer Orders Log',
      products: 'Manage Product Catalog',
      settings: 'Configuration Settings'
    };
    document.getElementById('admin-view-title').textContent = titles[tabName] || 'Admin Dashboard';
  },

  // Populate category filters and select options
  populateCategoryFilters() {
    const filterSelect = document.getElementById('products-category-filter');
    const formSelect = document.getElementById('prod-category');

    // Clear and populate
    filterSelect.innerHTML = '<option value="">All Categories</option>';
    formSelect.innerHTML = '';

    CATEGORIES.forEach(cat => {
      // Add option to shop category filter
      const opt1 = document.createElement('option');
      opt1.value = cat.id;
      opt1.textContent = cat.name;
      filterSelect.appendChild(opt1);

      // Add option to Add/Edit product form modal
      const opt2 = document.createElement('option');
      opt2.value = cat.id;
      opt2.textContent = cat.name;
      formSelect.appendChild(opt2);
    });
  },

  // Render everything
  renderAll() {
    AdminController.renderOverview();
    AdminController.renderOrdersTable();
    AdminController.renderProductsTable();
  },

  // Tab 1: Render Overview Dashboard and KPIs
  renderOverview() {
    const orders = DB.getOrders();
    const products = DB.getProducts();

    // 1. Calculate KPI Metrics
    const totalRevenue = orders
      .filter(o => o.status === 'Delivered' || o.status === 'In Transit')
      .reduce((sum, o) => sum + Number(o.total), 0);

    const totalOrders = orders.length;
    const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const activeProducts = products.length;

    // Write KPIs
    document.getElementById('kpi-revenue').textContent = formatNaira(totalRevenue);
    document.getElementById('kpi-orders').textContent = totalOrders;
    document.getElementById('kpi-aov').textContent = formatNaira(aov);
    document.getElementById('kpi-products').textContent = activeProducts;

    // 2. Render Stock Alerts / Warnings
    // Default stock to 25 if undefined
    products.forEach(p => {
      if (p.stock === undefined) p.stock = 25;
    });

    const lowStockProducts = products.filter(p => p.stock < 10);
    const warningsList = document.getElementById('stock-warnings-list');
    warningsList.innerHTML = '';

    if (lowStockProducts.length === 0) {
      warningsList.innerHTML = `
        <div style="padding:20px; text-align:center; color:var(--text-muted); font-size:14px;">
          ✅ All product stock levels are healthy.
        </div>`;
    } else {
      lowStockProducts.forEach(p => {
        warningsList.innerHTML += `
          <div class="warning-item">
            <span class="warning-icon">⚠️</span>
            <div class="warning-info">
              <div class="warning-name">${p.name}</div>
              <div class="warning-desc">Only ${p.stock} ${p.unit}${p.stock !== 1 ? 's' : ''} left in stock!</div>
            </div>
            <button class="action-btn-sm" onclick="openEditProductModal(${p.id})" title="Restock">✏️</button>
          </div>`;
      });
    }

    // 3. Render Recent Order Activity stream
    const activityList = document.getElementById('recent-activity-list');
    activityList.innerHTML = '';

    if (orders.length === 0) {
      activityList.innerHTML = '<div style="padding:10px; color:var(--text-muted); font-size:13px;">No recent order activity.</div>';
    } else {
      orders.slice(0, 5).forEach(o => {
        let dotClass = '';
        if (o.status === 'Delivered') dotClass = 'success';
        else if (o.status === 'Pending') dotClass = 'warning';

        activityList.innerHTML += `
          <div class="activity-item">
            <div class="activity-dot ${dotClass}"></div>
            <div class="activity-content">
              <div class="activity-text">
                Order <strong>${o.id}</strong> placed by <strong>${o.customerName}</strong>
                (${o.status}) - Total: ${formatNaira(o.total)}
              </div>
              <div class="activity-time">${o.date}</div>
            </div>
          </div>`;
      });
    }
  },

  // Tab 2: Render Orders Log Table
  renderOrdersTable() {
    const orders = DB.getOrders();
    const searchVal = document.getElementById('orders-search').value.toLowerCase().trim();
    const statusVal = document.getElementById('orders-status-filter').value;

    // Filter
    let filteredOrders = orders.filter(o => {
      const matchSearch = o.id.toLowerCase().includes(searchVal) || o.customerName.toLowerCase().includes(searchVal);
      const matchStatus = !statusVal || o.status === statusVal;
      return matchSearch && matchStatus;
    });

    document.getElementById('orders-count-text').textContent = `${filteredOrders.length} order${filteredOrders.length !== 1 ? 's' : ''} shown`;

    const tbody = document.getElementById('admin-orders-tbody');
    tbody.innerHTML = '';

    if (filteredOrders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">No matching orders found.</td></tr>';
      return;
    }

    filteredOrders.forEach(o => {
      let itemsSummary = '';
      if (Array.isArray(o.items)) {
        itemsSummary = o.items.map(i => `${i.name} (x${i.qty})`).join(', ');
      } else {
        itemsSummary = 'Details unavailable';
      }

      tbody.innerHTML += `
        <tr>
          <td><strong>${o.id}</strong></td>
          <td style="font-size:13px; color:var(--text-muted);">${o.date}</td>
          <td>
            <div style="font-weight:700;">${o.customerName}</div>
            <div style="font-size:12px; color:var(--text-muted);">${o.phone}</div>
          </td>
          <td>${o.city}, ${o.state}</td>
          <td style="max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${itemsSummary}">${itemsSummary}</td>
          <td style="font-weight:800;">${formatNaira(o.total)}</td>
          <td>
            <select class="table-status-select ${AdminController.getStatusClass(o.status)}" onchange="AdminController.changeOrderStatus('${o.id}', this.value)">
              <option value="Pending" ${o.status==='Pending'?'selected':''}>Pending</option>
              <option value="In Transit" ${o.status==='In Transit'?'selected':''}>In Transit</option>
              <option value="Delivered" ${o.status==='Delivered'?'selected':''}>Delivered</option>
            </select>
          </td>
        </tr>`;
    });
  },

  getStatusClass(status) {
    if (status === 'Delivered') return 'status-delivered';
    if (status === 'In Transit') return 'status-transit';
    return 'status-pending';
  },

  changeOrderStatus(orderId, newStatus) {
    DB.updateOrderStatus(orderId, newStatus);
    showToast(`Order ${orderId} updated to: ${newStatus}`);
  },

  // Tab 3: Render Products Catalog Table
  renderProductsTable() {
    const products = DB.getProducts();
    const searchVal = document.getElementById('products-search').value.toLowerCase().trim();
    const categoryVal = document.getElementById('products-category-filter').value;

    let filteredProducts = products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchVal);
      const matchCategory = !categoryVal || p.category === categoryVal;
      return matchSearch && matchCategory;
    });

    const tbody = document.getElementById('admin-products-tbody');
    tbody.innerHTML = '';

    if (filteredProducts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--text-muted);">No products found in this category.</td></tr>';
      return;
    }

    filteredProducts.forEach(p => {
      const catLabel = CATEGORIES.find(c => c.id === p.category)?.name || p.category;
      if (p.stock === undefined) p.stock = 25;

      tbody.innerHTML += `
        <tr>
          <td><img src="${p.img}" alt="${p.name}" class="admin-table-img"></td>
          <td><strong>${p.name}</strong></td>
          <td><span style="font-size:12px; font-weight:600; color:var(--blue-mid);">${catLabel}</span></td>
          <td style="font-weight:700;">${formatNaira(p.price)}</td>
          <td>
            <span style="font-weight:700; color:${p.stock < 10 ? 'var(--danger)' : 'inherit'}">${p.stock}</span>
          </td>
          <td style="color:var(--text-muted);">${p.unit}</td>
          <td>${p.badge ? `<span class="badge badge-blue" style="font-size:9px">${p.badge}</span>` : '<span style="color:var(--text-muted); font-style:italic;">None</span>'}</td>
          <td>
            <div style="display:flex; gap:6px;">
              <button class="action-btn-sm" onclick="openEditProductModal(${p.id})" title="Edit Product">✏️</button>
              <button class="action-btn-sm delete" onclick="AdminController.deleteProduct(${p.id})" title="Delete Product">🗑️</button>
            </div>
          </td>
        </tr>`;
    });
  },

  deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product? It will be removed from storefront.')) {
      DB.deleteProduct(id);
      showToast('Product deleted successfully');
    }
  },

  // Modal: Add product modal controls
  openProductFormModal(productId = null) {
    AdminController.currentEditingProductId = productId;
    const isEdit = productId !== null;

    document.getElementById('modal-product-title').textContent = isEdit ? 'Edit Product Catalog Details' : 'Add New Product to Shop';

    if (isEdit) {
      const products = DB.getProducts();
      const p = products.find(x => x.id === productId);
      if (p) {
        document.getElementById('prod-id').value = p.id;
        document.getElementById('prod-name').value = p.name;
        document.getElementById('prod-category').value = p.category;
        document.getElementById('prod-price').value = p.price;
        document.getElementById('prod-unit').value = p.unit;
        document.getElementById('prod-badge').value = p.badge || '';
        document.getElementById('prod-stock').value = p.stock !== undefined ? p.stock : 25;
        document.getElementById('prod-img').value = p.img || '';
      }
    } else {
      // Clear Form
      document.getElementById('prod-id').value = '';
      document.getElementById('prod-name').value = '';
      document.getElementById('prod-category').selectedIndex = 0;
      document.getElementById('prod-price').value = '';
      document.getElementById('prod-unit').value = 'bag';
      document.getElementById('prod-badge').value = '';
      document.getElementById('prod-stock').value = '25';
      document.getElementById('prod-img').value = '';
    }

    document.getElementById('product-modal-overlay').classList.add('open');
  },

  submitProductForm() {
    const id = document.getElementById('prod-id').value;
    const name = document.getElementById('prod-name').value.trim();
    const category = document.getElementById('prod-category').value;
    const price = document.getElementById('prod-price').value;
    const unit = document.getElementById('prod-unit').value.trim();
    const badge = document.getElementById('prod-badge').value.trim();
    const stock = document.getElementById('prod-stock').value;
    const img = document.getElementById('prod-img').value.trim();

    if (!name || !price || !unit) {
      showToast('Please fill in Name, Price, and Unit', 'error');
      return;
    }

    const payload = {
      name,
      category,
      price: Number(price),
      unit,
      badge,
      stock: Number(stock),
      img: img || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80'
    };

    if (id) {
      payload.id = Number(id);
    }

    DB.saveProduct(payload);
    AdminController.closeProductModal();
    showToast(id ? 'Product details updated!' : 'New product listed on storefront!');
  },

  closeProductModal() {
    document.getElementById('product-modal-overlay').classList.remove('open');
  },

  // Tab 4: Load Settings Values into input elements
  loadSettingsForm() {
    const settings = DB.getSettings();
    document.getElementById('settings-db-url').value = settings.supabaseUrl || '';
    document.getElementById('settings-db-key').value = settings.supabaseKey || '';
    document.getElementById('settings-dfee').value = settings.DFEE || 25000;
    document.getElementById('settings-free').value = settings.FREE || 500000;
  }
};

// Global hooks for onclick templates
window.openAddProductModal = () => {
  AdminController.openProductFormModal();
};

window.openEditProductModal = (id) => {
  AdminController.openProductFormModal(id);
};

window.closeProductModal = () => {
  AdminController.closeProductModal();
};

window.submitProductForm = () => {
  AdminController.submitProductForm();
};

// Settings tab clicks
window.saveDatabaseSettings = () => {
  const url = document.getElementById('settings-db-url').value.trim();
  const key = document.getElementById('settings-db-key').value.trim();
  
  DB.saveSettings({
    supabaseUrl: url,
    supabaseKey: key
  });
  showToast('Database connection settings saved!');
};

window.saveLogisticsSettings = () => {
  const dfee = document.getElementById('settings-dfee').value;
  const free = document.getElementById('settings-free').value;

  DB.saveSettings({
    DFEE: Number(dfee),
    FREE: Number(free)
  });
  showToast('Delivery thresholds updated successfully!');
};

window.testDatabaseSync = async () => {
  showToast('Syncing database content...');
  await DB.syncFromSupabase();
};
