const root = document.documentElement;
const themeButton = document.querySelector('[data-theme-toggle]');
const menuButton = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');
const header = document.querySelector('[data-header]');

const savedTheme = localStorage.getItem('theme');
root.dataset.theme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

const updateThemeLabel = () => {
  if (!themeButton) return;
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  themeButton.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
};
updateThemeLabel();

themeButton?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('theme', next);
  updateThemeLabel();
});

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  mobileNav?.classList.toggle('open', open);
});

mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileNav?.classList.contains('open')) {
    menuButton?.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    menuButton?.focus();
  }
});

const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 12);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const starCount = document.querySelector('[data-github-stars]');
if (starCount) {
  fetch('https://api.github.com/repos/mscheong01/krotoDC', {
    headers: { Accept: 'application/vnd.github+json' },
  })
    .then((response) => {
      if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
      return response.json();
    })
    .then((repository) => {
      starCount.textContent = new Intl.NumberFormat('en-US').format(repository.stargazers_count);
    })
    .catch(() => {
      starCount.textContent = '—';
      starCount.closest('.project-stat')?.setAttribute('title', 'Star count is temporarily unavailable');
    });
}
