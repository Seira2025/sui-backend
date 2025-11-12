(() => {
  const STORAGE_KEY = 'wishlistItems';

  const extractImageUrl = (styleString = '') => {
    const match = styleString.match(/url\((['"]?)(.*?)\1\)/i);
    return match ? match[2] : '';
  };

  const slugify = (text = '') => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'seira-product';
  };

  const buildProductPayload = (card) => {
    if (!card) return null;
    const textBlocks = card.querySelectorAll('div > p');
    const rawName = (card.dataset.productTitle || card.dataset.wishlistTitle || card.querySelector('[data-product-title]')?.textContent || textBlocks[0]?.textContent || 'Seira Exclusive').trim();
    const rawPrice = (card.dataset.productPrice || card.dataset.wishlistPrice || card.querySelector('[data-product-price]')?.textContent || textBlocks[1]?.textContent || '').trim();
    let heroImage = card.dataset.productImage || card.dataset.wishlistImage || card.querySelector('img')?.getAttribute('src');
    if (!heroImage) {
      const styledEl = card.querySelector('[style*="background-image"]');
      if (styledEl) {
        heroImage = styledEl.dataset?.productImage || extractImageUrl(styledEl.getAttribute('style') || '');
      }
    }
    const link = card.dataset.productLink || card.querySelector('a[href]')?.getAttribute('href') || '/pages/product';
    const productId = card.dataset.productId || slugify(rawName);
    return {
      id: productId,
      title: rawName,
      price: rawPrice,
      image: heroImage || '',
      link,
    };
  };

  const readItems = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Unable to read wishlist items', error);
      return [];
    }
  };

  const writeItems = (items) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn('Unable to store wishlist items', error);
    }
    document.dispatchEvent(new CustomEvent('wishlist:updated', { detail: items }));
  };

  const toggleItem = (item) => {
    if (!item || !item.id) return;
    const items = readItems();
    const existingIndex = items.findIndex((entry) => entry.id === item.id);
    if (existingIndex >= 0) {
      items.splice(existingIndex, 1);
    } else {
      items.push(item);
    }
    writeItems(items);
  };

  const ensureCardMetadata = (card) => {
    if (!card) return null;
    if (card.dataset.wishlistId && card.dataset.wishlistTitle) {
      return {
        id: card.dataset.wishlistId,
        title: card.dataset.wishlistTitle,
        price: card.dataset.wishlistPrice || '',
        image: card.dataset.wishlistImage || '',
        link: card.dataset.wishlistLink || card.dataset.productLink || '/pages/product',
      };
    }
    const payload = buildProductPayload(card);
    if (!payload) return null;
    card.dataset.wishlistId = payload.id;
    card.dataset.wishlistTitle = payload.title;
    card.dataset.wishlistPrice = payload.price;
    card.dataset.wishlistImage = payload.image;
    card.dataset.wishlistLink = payload.link;
    return payload;
  };

  const attachButtonsToCards = () => {
    document.querySelectorAll('.product-card').forEach((card) => {
      ensureCardMetadata(card);
      if (card.dataset.wishlistPrepared) return;
      card.dataset.wishlistPrepared = 'true';
      card.classList.add('relative');
      if (card.querySelector('[data-wishlist-toggle]')) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('data-wishlist-toggle', 'card');
      btn.setAttribute('aria-pressed', 'false');
      btn.className = 'absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-stone-500 shadow-md hover:text-primary transition';
      btn.innerHTML = '<span class="material-symbols-outlined text-base">favorite_border</span>';
      card.appendChild(btn);
    });
  };

  const getItemFromButton = (button) => {
    if (!button) return null;
    if (button.dataset.wishlistSource === 'detail' && window.SeiraCurrentProduct) {
      const current = window.SeiraCurrentProduct;
      const id = current.id || slugify(current.title || 'seira-product');
      return {
        id,
        title: current.title || 'Seira Exclusive',
        price: current.price || '',
        image: current.image || current.gallery?.[0] || '',
        link: window.location.pathname,
      };
    }
    const card = button.closest('.product-card');
    return ensureCardMetadata(card);
  };

  const updateButtonStates = () => {
    const saved = readItems();
    const ids = new Set(saved.map((item) => item.id));
    document.querySelectorAll('[data-wishlist-toggle]').forEach((btn) => {
      const item = getItemFromButton(btn);
      const active = item && ids.has(item.id);
      btn.classList.toggle('bg-primary/90', active);
      btn.classList.toggle('bg-white/90', !active);
      btn.classList.toggle('text-white', active);
      btn.classList.toggle('text-stone-500', !active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.textContent = active ? 'favorite' : 'favorite_border';
        icon.style.fontVariationSettings = active ? "'FILL' 1" : "'FILL' 0";
      }
      if (item) {
        btn.dataset.wishlistId = item.id;
      }
    });
  };

  const renderWishlistCountIndicators = (itemsParam) => {
    const items = Array.isArray(itemsParam) ? itemsParam : readItems();
    const total = items.length;
    document.querySelectorAll('[data-wishlist-count]').forEach((node) => {
      node.textContent = String(total);
    });
    document.querySelectorAll('[data-wishlist-count-text]').forEach((node) => {
      const template = node.dataset.wishlistCountTemplate;
      if (template) {
        node.textContent = template.replace('{count}', total);
        return;
      }
      const label = total === 1 ? '1 item saved' : `${total} items saved`;
      node.textContent = label;
    });
  };

  const renderWishlistSection = (itemsParam) => {
    const grid = document.querySelector('[data-wishlist-grid]');
    const emptyState = document.querySelector('[data-wishlist-empty]');
    const items = Array.isArray(itemsParam) ? itemsParam : readItems();
    renderWishlistCountIndicators(items);
    if (!grid) return;
    grid.innerHTML = '';
    if (!items.length) {
      grid.classList.add('hidden');
      emptyState?.classList.remove('hidden');
      return;
    }
    emptyState?.classList.add('hidden');
    grid.classList.remove('hidden');
    items.forEach((item) => {
      const article = document.createElement('article');
      article.className = 'rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark overflow-hidden flex flex-col cursor-pointer transition hover:-translate-y-1 hover:shadow-lg';
      const linkTarget = item.link || '/pages/product';
      article.dataset.wishlistLink = linkTarget;
      article.innerHTML = `
        <div class="aspect-[3/4] bg-cover bg-center" style="background-image:url('${item.image || 'https://via.placeholder.com/400x600?text=Seira'}');"></div>
        <div class="p-4 flex flex-col gap-2">
          <p class="text-base font-semibold text-[#111618] dark:text-white">${item.title}</p>
          <p class="text-sm text-primary font-bold">${item.price || ''}</p>
          <div class="flex gap-3">
            <a class="flex-1 inline-flex items-center justify-center rounded-full border border-primary text-primary text-sm font-semibold py-2 hover:bg-primary/5 transition" href="${linkTarget}" target="_blank" rel="noopener noreferrer" data-wishlist-view>View</a>
            <button class="inline-flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 px-4 text-sm font-semibold" data-wishlist-remove="${item.id}">Remove</button>
          </div>
        </div>`;
      article.addEventListener('click', (event) => {
        if (event.target.closest('[data-wishlist-toggle]') || event.target.closest('[data-wishlist-remove]') || event.target.closest('[data-wishlist-view]')) {
          return;
        }
        window.open(article.dataset.wishlistLink, '_blank', 'noopener');
      });
      grid.appendChild(article);
    });
  };

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-wishlist-toggle]');
    if (toggle) {
      event.preventDefault();
      const item = getItemFromButton(toggle);
      toggle.setAttribute('aria-pressed', toggle.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      if (item) {
        toggleItem(item);
      }
      event.stopPropagation();
      return;
    }
    const viewBtn = event.target.closest('[data-wishlist-view]');
    if (viewBtn) {
      event.preventDefault();
      const href = viewBtn.getAttribute('href');
      if (href) {
        window.open(href, '_blank', 'noopener');
      }
      return;
    }
    const removeBtn = event.target.closest('[data-wishlist-remove]');
    if (removeBtn) {
      const id = removeBtn.dataset.wishlistRemove;
      const next = readItems().filter((entry) => entry.id !== id);
      writeItems(next);
      event.stopPropagation();
    }
  });

  document.addEventListener('wishlist:updated', (event) => {
    const items = Array.isArray(event?.detail) ? event.detail : readItems();
    attachButtonsToCards();
    renderWishlistSection(items);
    updateButtonStates();
  });

  document.addEventListener('DOMContentLoaded', () => {
    const items = readItems();
    attachButtonsToCards();
    renderWishlistSection(items);
    updateButtonStates();
  });
})();
