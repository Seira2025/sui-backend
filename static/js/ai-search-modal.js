(() => {
  const MODAL_ID = 'ai-search-modal-root';

  const modalTemplate = () => `
    <div id="${MODAL_ID}" class="fixed inset-0 z-[9998] hidden">
      <div class="absolute inset-0 bg-black/70" data-ai-search-close></div>
      <div class="relative max-w-md w-full mx-auto mt-24 bg-white dark:bg-background-dark rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div class="h-1 bg-primary"></div>
        <div class="p-6 space-y-5">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-semibold text-gray-500 uppercase tracking-[0.3em]">AI Search</p>
              <p class="text-base text-gray-600 dark:text-gray-300">Describe the product you're looking for</p>
            </div>
            <button class="text-gray-400 hover:text-primary" data-ai-search-close type="button">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form class="space-y-4" data-ai-search-form>
            <label class="flex flex-col gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              Describe the product
              <textarea rows="4" class="rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base text-gray-800 dark:text-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. A linen summer dress with puff sleeves"></textarea>
            </label>
            <div class="flex gap-3">
              <button type="submit" class="flex-1 inline-flex items-center justify-center rounded-lg h-11 bg-primary text-white font-semibold tracking-wide hover:bg-primary/90 transition">Search</button>
              <button type="button" class="flex-1 inline-flex items-center justify-center rounded-lg h-11 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold tracking-wide hover:border-primary" data-ai-search-close>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>`;

  const ensureModal = () => {
    let modal = document.getElementById(MODAL_ID);
    if (!modal) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = modalTemplate();
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
    if (event.target.matches('[data-ai-search-trigger]')) {
      event.preventDefault();
      toggleModal(true);
    }
  }, true);

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-ai-search-close]')) {
      toggleModal(false);
    }
  });

  document.addEventListener('submit', (event) => {
    if (event.target.matches('[data-ai-search-form]')) {
      event.preventDefault();
      const textarea = event.target.querySelector('textarea');
      if (textarea && textarea.value.trim()) {
        console.info('AI Search query:', textarea.value.trim());
      }
      toggleModal(false);
    }
  });
})();
