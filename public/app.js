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
  document.querySelectorAll('.timeline-accordion details').forEach(details => {
    const panel = details.querySelector('.timeline-panel');
    details.addEventListener('toggle', () => {
      if (!details.open || reducedMotion.matches || !panel?.animate) return;
      panel.animate(
        [{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 180, easing: 'ease-out' }
      );
    });
  });
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
  document.querySelectorAll('.globe').forEach(globe => {
    const canvas = globe.querySelector('canvas');
    const context = canvas?.getContext?.('2d');
    if (!context) return;
    const points = Array.from({ length: 1200 }, (_, index) => {
      const y = 1 - index / 1199 * 2;
      const ring = Math.sqrt(1 - y * y);
      const angle = Math.PI * (3 - Math.sqrt(5)) * index;
      return [Math.cos(angle) * ring, y, Math.sin(angle) * ring];
    });
    let size = 0;
    let rotation = 0;
    let visible = true;
    let frame;
    let lastTime = 0;
    const resize = () => {
      size = globe.clientWidth;
      if (!size) return;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * scale);
      canvas.height = Math.round(size * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      draw();
    };
    const orbit = (radiusX, radiusY, angle, alpha) => {
      context.save();
      context.translate(size / 2, size / 2);
      context.rotate(angle);
      context.beginPath();
      context.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
      context.strokeStyle = `rgba(225,25,32,${alpha})`;
      context.lineWidth = 1;
      context.stroke();
      context.restore();
    };
    const draw = () => {
      if (!size) return;
      context.clearRect(0, 0, size, size);
      const center = size / 2;
      const radius = size * .335;
      orbit(radius * 1.34, radius * .42, -.5, .36);
      orbit(radius * 1.29, radius * .6, .9, .2);
      const sphere = context.createRadialGradient(center - radius * .35, center - radius * .3, radius * .1, center, center, radius);
      sphere.addColorStop(0, '#1b0c0d');
      sphere.addColorStop(1, '#0b0909');
      context.beginPath();
      context.arc(center, center, radius, 0, Math.PI * 2);
      context.fillStyle = sphere;
      context.fill();
      context.strokeStyle = 'rgba(225,25,32,.35)';
      context.stroke();
      const turn = rotation;
      const sin = Math.sin(turn);
      const cos = Math.cos(turn);
      const tiltSin = Math.sin(.4);
      const tiltCos = Math.cos(.4);
      for (const [x, y, z] of points) {
        const rotatedX = x * cos + z * sin;
        const rotatedZ = z * cos - x * sin;
        const projectedY = y * tiltCos - rotatedZ * tiltSin;
        const depth = y * tiltSin + rotatedZ * tiltCos;
        if (depth < -.05) continue;
        context.beginPath();
        context.arc(center + rotatedX * radius, center + projectedY * radius, Math.max(1, radius * .009 * (1 + depth * .3)), 0, Math.PI * 2);
        context.fillStyle = `rgba(235,31,39,${.38 + depth * .58})`;
        context.fill();
      }
    };
    const animate = time => {
      if (!visible || document.hidden || reducedMotion.matches) { frame = null; return; }
      if (time - lastTime >= 40) {
        rotation += Math.min(time - lastTime, 80) * .00012;
        draw();
        lastTime = time;
      }
      frame = requestAnimationFrame(animate);
    };
    const start = () => {
      if (!frame && visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(animate);
    };
    globe.classList.add('is-ready');
    resize();
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(globe);
    else window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) start();
    }).observe(globe);
    document.addEventListener('visibilitychange', start);
    reducedMotion.addEventListener('change', event => { if (event.matches && frame) cancelAnimationFrame(frame); frame = null; start(); });
    start();
  });
  const topic = document.querySelector('#contact-topic');
  const email = document.querySelector('#topic-email');
  topic?.addEventListener('change', () => {
    const subject = document.body.dataset.locale === 'en' ? 'Website inquiry' : document.body.dataset.locale === 'es' ? 'Consulta desde el sitio web' : 'Contato pelo site';
    email.href = `mailto:globalk@globalk.com.br?subject=${encodeURIComponent(`${subject} — ${topic.value}`)}`;
  });
})();
