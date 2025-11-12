(() => {
  const MODAL_ID = 'shop-modal-root';
  const OVERLAY_ATTR = 'data-shop-overlay';

  const template = () => `
    <div id="${MODAL_ID}" class="fixed inset-0 z-[9999] hidden">
      <div class="absolute inset-0 bg-black/60" ${OVERLAY_ATTR}></div>
      <div class="relative max-w-5xl w-full mx-auto mt-20 sm:mt-24 bg-white dark:bg-background-dark rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">Shop Guide</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">Browse trending categories and brands</p>
          </div>
          <button class="text-gray-400 hover:text-primary" type="button" data-shop-close>
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="p-6 bg-white dark:bg-background-dark overflow-x-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 text-sm text-[#111618] dark:text-white min-w-[900px]">
            ${column('Women\'s Most Popular', ['Coach Outlet', 'Vera Bradley', 'Clarks', 'Michael Kors', 'Burberry'], 'All Best Sellers')}
            ${column('Men\'s Most Popular', ['Nike', 'New Balance', 'Nautica', 'adidas', 'Dickies'], "All Men's Best Sellers")}
            ${column('Designer Favorites', ['Hugo Boss', 'Ferragamo', 'Philipp Plein', "Tod's", 'Tommy Hilfiger'], 'All Designers')}
            ${column('Collections', ['In Season', 'New Arrivals', 'Trending Today', 'Outlet', 'Clearance'], 'All Collections')}
            ${column('Shop by Category', ['Clothing', 'Shoes', 'Handbags', 'Jewelry', 'Beauty', 'Home'])}
            ${column('Discover More', ['Women', 'Men', 'Luxe', 'Daily Drops', "Editor's Picks", 'Sale'])}
          </div>
        </div>
      </div>
    </div>`;

  function column(heading, items, footer) {
    const list = items.map((item) => `<li class="leading-relaxed">${item}</li>`).join('');
    const footerLink = footer ? `<button class="text-primary text-xs font-semibold uppercase tracking-[0.3em] mt-3" data-shop-close>${footer}</button>` : '';
    return `
      <div>
        <p class="font-bold text-base mb-3">${heading}</p>
        <ul class="space-y-1 text-[15px]">${list}</ul>
        ${footerLink}
      </div>`;
  }

  const ensureModal = () => {
    let modal = document.getElementById(MODAL_ID);
    if (!modal) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = template();
      modal = wrapper.firstElementChild;
      document.body.appendChild(modal);
    }
    return modal;
  };

  const toggleModal = (shouldShow) => {
    const modal = ensureModal();
    modal.classList.toggle('hidden', !shouldShow);
    document.body.classList.toggle('overflow-hidden', shouldShow);
  };

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-shop-trigger]');
    if (trigger) {
      event.preventDefault();
      toggleModal(true);
      return;
    }

    if (event.target.closest('[data-shop-close]') || event.target.hasAttribute(OVERLAY_ATTR)) {
      toggleModal(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      toggleModal(false);
    }
  });
})();
