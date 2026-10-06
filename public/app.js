(() => {
  const menu = document.querySelector('#site-menu');
  const trigger = document.querySelector('.menu-toggle');
  const closeButton = document.querySelector('.menu-close');
  let returnFocus;

  function openMenu() {
    if (!menu || menu.open) return;
    returnFocus = document.activeElement;
    menu.showModal();
    document.documentElement.classList.add('menu-open');
    trigger.setAttribute('aria-expanded', 'true');
    closeButton.focus();
  }
  function closeMenu(restoreFocus = true) {
    if (!menu?.open) return;
    menu.close();
    document.documentElement.classList.remove('menu-open');
    trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) returnFocus?.focus({ preventScroll: true });
  }
  trigger?.addEventListener('click', openMenu);
  closeButton?.addEventListener('click', () => closeMenu());
  menu?.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
  menu?.addEventListener('close', () => {
    document.documentElement.classList.remove('menu-open');
    trigger?.setAttribute('aria-expanded', 'false');
  });
  menu?.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const elements = [...menu.querySelectorAll('a[href], button:not([disabled])')];
    const first = elements[0];
    const last = elements.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  menu?.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', () => {
      const target = new URL(link.href);
      closeMenu(false);
      if (target.pathname === location.pathname && target.hash) {
        const section = document.getElementById(decodeURIComponent(target.hash.slice(1)));
        if (section) {
          section.setAttribute('tabindex', '-1');
          requestAnimationFrame(() => section.focus({ preventScroll: true }));
          section.addEventListener('blur', () => section.removeAttribute('tabindex'), { once: true });
        }
      }
    });
  });

  // Native scrolling stays available; no scroll hijacking or third-party runtime.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 });
    document.querySelectorAll('.reveal').forEach(element => {
      // Elements remain visible if JS is disabled or an observer cannot be created.
      element.classList.add('can-reveal');
      observer.observe(element);
    });
    reducedMotion.addEventListener('change', event => {
      if (event.matches) {
        observer.disconnect();
        document.querySelectorAll('.can-reveal').forEach(el => el.classList.add('is-visible'));
      }
    });
  }
  const topic = document.querySelector('#contact-topic');
  const email = document.querySelector('#topic-email');
  topic?.addEventListener('change', () => {
    const subject = document.body.dataset.locale === 'en' ? 'Website inquiry' : document.body.dataset.locale === 'es' ? 'Consulta desde el sitio web' : 'Contato pelo site';
    email.href = `mailto:globalk@globalk.com.br?subject=${encodeURIComponent(`${subject} — ${topic.value}`)}`;
  });
})();
