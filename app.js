const page = document.getElementById('page');
const form = document.getElementById('form');
const input = document.getElementById('url');
const result = document.getElementById('result');
const reset = document.getElementById('reset');

const SHRINK = 0.62;      // each click keeps 62% of the current width
const MIN_WIDTH = 90;     // px; the page can't vanish completely
const ALPHABET = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function slug(n = 5) {
  return Array.from({ length: n }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');
}

function normalize(value) {
  const text = value.trim();
  if (!text) return null;
  try {
    return new URL(/^[a-z]+:\/\//i.test(text) ? text : 'https://' + text);
  } catch {
    return null;
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const url = normalize(input.value);
  result.classList.toggle('error', !url);

  if (!url) {
    result.textContent = 'Enter a valid URL, like example.com/some/page.';
    return;
  }

  // shrink the page horizontally
  const current = page.getBoundingClientRect().width;
  const next = Math.max(MIN_WIDTH, Math.round(current * SHRINK));
  // pin the current width with no transition, otherwise it animates from 100% first
  page.style.transition = 'none';
  page.style.maxWidth = 'none';
  page.style.width = current + 'px';
  void page.offsetWidth;
  page.style.transition = '';
  page.style.width = next + 'px';

  const short = 'shr.tn/' + slug();
  result.replaceChildren('Shortened: ', Object.assign(document.createElement('code'), { textContent: short }));
  reset.hidden = false;
});

reset.addEventListener('click', () => {
  const target = Math.min(window.innerWidth, 1100);
  page.style.width = target + 'px';
  page.addEventListener('transitionend', () => {
    page.style.width = '';
    page.style.maxWidth = '';
  }, { once: true });
  result.textContent = '';
  reset.hidden = true;
  input.focus();
});
