(() => {
  const MODAL_ID = 'simon-modal-root';
  const OVERLAY_ATTR = 'data-simon-overlay';

  const template = () => `
    <div id="${MODAL_ID}" class="fixed inset-0 z-[10000] hidden">
      <div class="absolute inset-0 bg-black/70" ${OVERLAY_ATTR}></div>
      <div class="relative w-full max-w-5xl mx-auto mt-12 sm:mt-16 bg-white dark:bg-background-dark rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div class="grid lg:grid-cols-[1.1fr_0.9fr] bg-white">
          <div class="p-8 sm:p-10 space-y-6">
            <div class="space-y-2">
              <div class="text-[12px] font-semibold tracking-[0.4em] uppercase text-[#ff007f]">Seira+</div>
              <h2 class="text-3xl font-black text-[#111618]">Cash. Points. Perks.</h2>
              <p class="text-sm text-gray-600 leading-relaxed">Join Seira+™ for extra rewards, cashback perks, and members-only experiences. Enter your email to get started.</p>
            </div>
            <form class="space-y-4">
              <label class="flex flex-col gap-2 text-sm font-semibold text-gray-700">
                Email Address
                <input type="email" placeholder="name@example.com" class="rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffce00]" />
              </label>
              <button type="button" class="w-full inline-flex items-center justify-center rounded-xl h-12 bg-black text-white font-semibold tracking-wide">Next</button>
            </form>
            <p class="text-xs text-gray-500 leading-relaxed">By joining Seira+ you agree to the Rewards Program Terms. No purchase necessary. Giveaway ends 11/13/25.</p>
          </div>
          <div class="relative bg-gradient-to-br from-[#1f2127] via-[#1f2127] to-[#1f2127] text-white">
            <div class="absolute inset-x-0 top-0 bg-[#ffe100] text-black text-center text-sm font-bold tracking-wide py-3">$250 Shopping Spree Giveaway</div>
            <div class="h-full flex flex-col justify-end pt-16 pb-10 px-8">
              <div class="space-y-3">
                <p class="text-xs uppercase tracking-[0.4em] text-[#ffe100]">Seira+</p>
                <p class="text-lg font-semibold">Access exclusive perks, VIP offers, and insider experiences.</p>
              </div>
              <div class="mt-10 flex items-center gap-4 text-[#ffe100] text-sm">
                <span class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ffe100]">$</span>
                <span>Earn points on every visit and redeem them for luxe rewards.</span>
              </div>
            </div>
          </div>
        </div>
        <button class="absolute top-4 right-4 text-gray-400 hover:text-primary" type="button" data-simon-close>
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>`;

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
    if (event.target.closest('[data-simon-trigger]')) {
      event.preventDefault();
      toggleModal(true);
      return;
    }
    if (event.target.closest('[data-simon-close]') || event.target.hasAttribute(OVERLAY_ATTR)) {
      toggleModal(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      toggleModal(false);
    }
  });
})();
