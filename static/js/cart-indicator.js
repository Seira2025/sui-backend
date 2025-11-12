(() => {
  const CART_COUNT_KEY = 'cartCount';
  const CART_ITEMS_KEY = 'cartItems';

  const parsePriceValue = (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (!value) return 0;
    const match = String(value).replace(/[^0-9.]/g, '');
    const parsed = parseFloat(match);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const normalizeItem = (item = {}) => {
    const quantity = Number(item.quantity) > 0 ? Math.floor(Number(item.quantity)) : 1;
    const id = item.id || `item-${Date.now()}`;
    const size = item.size || item.selectedSize || '';
    const variant = item.variant || (size ? `size-${size}` : '');
    const key = item.key || [id, variant].filter(Boolean).join('__') || id;
    return {
      id,
      key,
      variant,
      size,
      title: item.title || 'Seira Exclusive',
      priceText: item.priceText || item.price || '$0.00',
      priceValue: parsePriceValue(item.priceValue ?? item.price),
      description: item.description || '',
      image: item.image || '',
      gallery: Array.isArray(item.gallery) ? item.gallery : [],
      quantity,
    };
  };

  const readItems = () => {
    try {
      const raw = window.localStorage?.getItem(CART_ITEMS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(normalizeItem);
    } catch {
      return [];
    }
  };

  const writeItems = (items) => {
    try {
      window.localStorage?.setItem(CART_ITEMS_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn('Unable to persist cart items', error);
    }
    syncCount(items);
    return items;
  };

  const getItems = () => readItems();

  const getCountFromItems = (items) =>
    (items || []).reduce((sum, item) => sum + (Number(item.quantity) > 0 ? Number(item.quantity) : 0), 0);

  const renderCount = (count) => {
    document.querySelectorAll('[data-cart-count]').forEach((badge) => {
      badge.textContent = String(count);
    });
  };

  const syncCount = (items) => {
    const count = getCountFromItems(items);
    try {
      window.localStorage?.setItem(CART_COUNT_KEY, String(count));
    } catch (error) {
      console.warn('Unable to persist cart count', error);
    }
    renderCount(count);
    return count;
  };

  const refresh = () => {
    const items = readItems();
    if (items.length) {
      syncCount(items);
      return;
    }
    // Fallback to legacy count
    const legacyCount = Number(window.localStorage?.getItem(CART_COUNT_KEY));
    renderCount(Number.isFinite(legacyCount) ? legacyCount : 0);
  };

  const setCount = (value) => {
    const count = Number(value);
    if (!Number.isFinite(count)) return;
    try {
      window.localStorage?.setItem(CART_COUNT_KEY, String(count));
    } catch (error) {
      console.warn('Unable to persist cart count', error);
    }
    renderCount(count);
  };

  const removeItem = (key) => {
    if (!key) return;
    const nextItems = readItems().filter((item) => item.key !== key);
    writeItems(nextItems);
  };

  const updateItemQuantity = (key, quantity) => {
    if (!key) return;
    const items = readItems();
    const target = items.find((item) => item.key === key);
    if (!target) return;
    const nextQuantity = Math.floor(Number(quantity));
    if (!Number.isFinite(nextQuantity) || nextQuantity <= 0) {
      removeItem(key);
      return;
    }
    target.quantity = nextQuantity;
    writeItems(items);
  };

  const addItem = (item = {}) => {
    const items = readItems();
    const normalized = normalizeItem(item);
    const existing = items.find((entry) => entry.key === normalized.key);
    if (existing) {
      existing.quantity += normalized.quantity;
    } else {
      items.push(normalized);
    }
    writeItems(items);
    return items;
  };

  const clearItems = () => {
    writeItems([]);
  };

  window.SeiraCartIndicator = {
    setCount,
    refresh,
    getItems,
    addItem,
    removeItem,
    updateItemQuantity,
    clearItems,
    parsePriceValue,
  };

  refresh();
})();
