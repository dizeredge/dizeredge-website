const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
if (menuButton && navigation) {
  const closeMenu = () => { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.textContent = 'Menu ☰'; };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'Close ×' : 'Menu ☰';
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menuButton.focus(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 1000) closeMenu(); });
}

const filters = document.querySelectorAll('[data-filter]');
const products = document.querySelectorAll('[data-category]');
function filterProducts(category) {
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  let count = 0;
  products.forEach(product => { product.hidden = category !== 'all' && product.dataset.category !== category; if (!product.hidden) count++; });
  const status = document.querySelector('#filter-status');
  if (status) status.textContent = `${count} product${count === 1 ? '' : 's'} shown`;
}
filters.forEach(button => button.addEventListener('click', () => filterProducts(button.dataset.filter)));
function revealHashTarget() {
  if (!products.length || !location.hash) return;
  const target = document.getElementById(location.hash.slice(1));
  if (target && target.matches('[data-category]')) { filterProducts('all'); target.scrollIntoView(); }
}
window.addEventListener('hashchange', revealHashTarget);
revealHashTarget();

const form = document.querySelector('#inquiry-form');
if (form) {
  form.querySelector('button[type="submit"]').disabled = false;
  const params = new URLSearchParams(location.search);
  const interest = form.elements.namedItem('interest');
  const selection = params.get('interest');
  if (selection && [...interest.options].some(option => option.value === selection)) interest.value = selection;
  let inquiryText = '';
  form.addEventListener('submit', event => {
    event.preventDefault();
    for (const name of ['name', 'company', 'message']) {
      const field = form.elements.namedItem(name);
      field.value = field.value.trim();
    }
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    inquiryText = ['DIZEREDGE — VERIFICATION INQUIRY', '', `Name: ${data.get('name').trim()}`, `Work email: ${data.get('email').trim()}`, `Company: ${data.get('company').trim()}`, `Area of interest: ${data.get('interest')}`, `Estimated monthly volume: ${data.get('volume') || 'To be discussed'}`, '', 'Use case', data.get('message').trim(), '', 'Requested next step: Discuss workflow, product availability, integration requirements, and commercial options.'].join('\n');
    document.querySelector('#inquiry-preview').textContent = inquiryText;
    const result = document.querySelector('#inquiry-result');
    result.hidden = false;
    document.querySelector('#inquiry-status').textContent = 'Inquiry prepared locally. No information has been sent.';
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  document.querySelector('#copy-inquiry').addEventListener('click', async () => {
    const status = document.querySelector('#inquiry-status');
    try {
      await navigator.clipboard.writeText(inquiryText);
      status.textContent = 'Inquiry copied to your clipboard.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('#inquiry-preview'));
      const selection = window.getSelection();
      selection.removeAllRanges(); selection.addRange(range);
      status.textContent = 'Text selected. Use your device’s Copy command, or download the inquiry.';
    }
  });
  document.querySelector('#download-inquiry').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([inquiryText], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'DizerEdge-verification-inquiry.txt'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    document.querySelector('#inquiry-status').textContent = 'Inquiry downloaded. No information has been sent.';
  });
}
