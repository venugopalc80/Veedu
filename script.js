const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const header = document.querySelector('.site-header');

const setMenu = (open) => {
  if (!nav || !toggle) return;
  nav.classList.toggle('open', open);
  toggle.classList.toggle('active', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('menu-open', open);
};

toggle?.addEventListener('click', () => setMenu(!nav?.classList.contains('open')));
document.querySelectorAll('.nav a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 40);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

// Launch-ready menu navigator. It intentionally uses no invented dishes or prices.
const menuSection = document.querySelector('#menu');
if (menuSection) {
  const menuNavigator = document.createElement('div');
  menuNavigator.className = 'menu-navigator';
  menuNavigator.setAttribute('aria-label', 'Cuisine categories');
  menuNavigator.innerHTML = `
    <div class="menu-tabs" role="tablist" aria-label="VEEDU menu categories">
      <button class="menu-tab is-active" type="button" role="tab" aria-selected="true" data-menu-tab="kerala">Kerala Table</button>
      <button class="menu-tab" type="button" role="tab" aria-selected="false" data-menu-tab="coast">Malabar Coast</button>
      <button class="menu-tab" type="button" role="tab" aria-selected="false" data-menu-tab="drinks">Drinks</button>
    </div>
    <div class="menu-panel" role="tabpanel" tabindex="0">
      <p class="menu-panel-kicker">01 / Kerala Table</p>
      <h3>Rooted in the warmth of home.</h3>
      <p>Expect the character of Kerala to guide the menu — generous, aromatic and made for the table. Final dishes, allergens and prices will be published here when the VEEDU menu is confirmed.</p>
      <span class="menu-panel-status">Menu details coming soon</span>
    </div>`;
  const note = menuSection.querySelector('.demo-note');
  note ? note.before(menuNavigator) : menuSection.append(menuNavigator);

  const content = {
    kerala: ['01 / Kerala Table', 'Rooted in the warmth of home.', 'Expect the character of Kerala to guide the menu — generous, aromatic and made for the table. Final dishes, allergens and prices will be published here when the VEEDU menu is confirmed.'],
    coast: ['02 / Malabar Coast', 'Flavours shaped by land and sea.', 'A focus on the coastal spirit of Malabar, with the depth of coconut, spice, smoke and slow-cooked flavour. Final dishes and dietary information will be published after menu approval.'],
    drinks: ['03 / Drinks', 'A modern pour to match the table.', 'The drinks list will be added here once confirmed, including non-alcoholic options, pairings and any signature VEEDU serves.']
  };
  const tabs = [...menuNavigator.querySelectorAll('.menu-tab')];
  const panel = menuNavigator.querySelector('.menu-panel');
  const renderTab = (key) => {
    const [kicker, title, copy] = content[key];
    panel.innerHTML = `<p class="menu-panel-kicker">${kicker}</p><h3>${title}</h3><p>${copy}</p><span class="menu-panel-status">Menu details coming soon</span>`;
    tabs.forEach((tab) => {
      const active = tab.dataset.menuTab === key;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => renderTab(tab.dataset.menuTab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length;
      tabs[next].focus();
      renderTab(tabs[next].dataset.menuTab);
    });
  });
}

const revealItems = document.querySelectorAll('.intro, .values, .menu-preview, .chef, .gallery, .experience, .social-cta, .reserve');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealItems.forEach((item) => item.classList.add('reveal'));
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
}

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
if ('IntersectionObserver' in window && sections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));
}
