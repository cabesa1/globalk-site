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
  document.querySelectorAll('.needs-tree').forEach(tree => {
    const root = tree.querySelector('.needs-root');
    const svg = tree.querySelector('.needs-branches');
    const links = [...tree.querySelectorAll('.needs-node')];
    const grid = tree.querySelector('.needs-grid');
    const revealed = links.map(() => 0);
    let rootRevealed = 0;
    let geometry = [];
    let originY = 0;
    let scheduled = false;
    function draw() {
      const x = root.offsetLeft + root.offsetWidth / 2;
      const y = root.offsetTop + root.offsetHeight;
      originY = y;
      svg.setAttribute('viewBox', `0 0 ${tree.offsetWidth} ${tree.offsetHeight}`);
      geometry = links.map((link, index) => ({
        x: grid.offsetLeft + link.offsetLeft + (index % 2 === 0 ? link.offsetWidth : 0),
        y: grid.offsetTop + link.offsetTop + link.offsetHeight / 2,
        cardTop: grid.offsetTop + link.offsetTop,
      }));
      svg.replaceChildren(...links.map((link, index) => {
        const { x: targetX, y: targetY } = geometry[index];
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${x} ${y} V ${targetY} H ${targetX}`);
        path.setAttribute('pathLength', '1');
        return path;
      }));
      schedule();
    }
    function update() {
      scheduled = false;
      if (reducedMotion.matches) {
        tree.classList.remove('is-scroll-enhanced');
        return;
      }
      const top = tree.getBoundingClientRect().top;
      const height = window.innerHeight;
      const clamp = value => Math.max(0, Math.min(1, value));
      rootRevealed = Math.max(rootRevealed, clamp((height * .94 - top - root.offsetTop) / (height * .25)));
      tree.style.setProperty('--root-progress', rootRevealed.toFixed(4));
      links.forEach((link, index) => {
        const target = geometry[index];
        if (!target) return;
        const reveal = clamp((height * .9 - top - target.cardTop) / (height * .27));
        revealed[index] = Math.max(revealed[index], reveal);
        const branch = clamp((height * .86 - top - originY) / Math.max(1, target.y - originY));
        link.style.setProperty('--unit-progress', revealed[index].toFixed(4));
        svg.children[index]?.style.setProperty('--branch-progress', branch.toFixed(4));
      });
      tree.classList.add('is-scroll-enhanced');
    }
    function schedule() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    }
    function highlight(index) {
      [...svg.children].forEach((path, i) => path.classList.toggle('is-active', i === index));
    }
    links.forEach((link, index) => {
      link.addEventListener('pointerenter', () => highlight(index));
      link.addEventListener('pointerleave', () => highlight(links.indexOf(document.activeElement)));
      link.addEventListener('focus', () => {
        revealed[index] = 1;
        rootRevealed = 1;
        highlight(index);
        schedule();
      });
      link.addEventListener('blur', () => highlight(-1));
    });
    draw();
    if ('ResizeObserver' in window) new ResizeObserver(draw).observe(tree);
    else window.addEventListener('resize', draw);
    window.addEventListener('scroll', schedule, { passive: true });
    reducedMotion.addEventListener('change', schedule);
    document.fonts?.ready.then(draw);
  });
  document.querySelectorAll('.timeline-shell').forEach(timeline => {
    const items = [...timeline.querySelectorAll('.timeline-item')];
    const dots = items.map(item => item.querySelector('.timeline-dot'));
    if (!dots.length) return;
    const revealed = items.map(() => 0);
    let scheduled = false;
    function update() {
      scheduled = false;
      if (reducedMotion.matches) {
        timeline.classList.remove('is-enhanced');
        items.forEach(item => item.classList.remove('is-active'));
        return;
      }
      const first = items[0].offsetTop + dots[0].offsetTop + dots[0].offsetHeight / 2;
      const last = items.at(-1).offsetTop + dots.at(-1).offsetTop + dots.at(-1).offsetHeight / 2;
      const length = Math.max(last - first, 1);
      const middle = window.innerHeight * .52;
      const top = timeline.getBoundingClientRect().top + first;
      const progress = Math.max(0, Math.min(1, (middle - top) / length));
      const positions = dots.map(dot => dot.getBoundingClientRect().top + dot.offsetHeight / 2);
      timeline.style.setProperty('--track-top', `${first}px`);
      timeline.style.setProperty('--track-height', `${length}px`);
      timeline.style.setProperty('--timeline-progress', `${(progress * 100).toFixed(2)}%`);
      timeline.style.setProperty('--line-progress', progress.toFixed(4));
      timeline.classList.add('is-enhanced');
      items.forEach((item, index) => {
        // Scroll distance drives each frame. Completed reveals stay readable when returning.
        const entry = Math.max(0, Math.min(1, (window.innerHeight * .92 - positions[index]) / (window.innerHeight * .34)));
        revealed[index] = Math.max(revealed[index], entry);
        item.style.setProperty('--entry-progress', revealed[index].toFixed(4));
        item.style.setProperty('--logo-progress', Math.min(1, revealed[index] / .6).toFixed(4));
        item.style.setProperty('--copy-progress', Math.max(0, Math.min(1, (revealed[index] - .15) / .85)).toFixed(4));
        item.classList.toggle('is-active', positions[index] <= middle);
      });
    }
    function schedule() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reducedMotion.addEventListener('change', schedule);
    items.forEach((item, index) => item.addEventListener('focusin', () => {
      revealed[index] = 1;
      schedule();
    }));
    document.fonts?.ready.then(schedule);
    schedule();
  });
  // Scroll scenes use transforms and opacity, without replacing native scrolling.
  {
    const elements = [...new Set([
      ...document.querySelectorAll('.reveal:not(.group-copy)'),
      ...document.querySelectorAll('.group-copy p, .needs-heading, .timeline-intro .display, .statement-strip p, .unit-photo-frame'),
    ])];
    const records = elements.map(element => ({ element, progress: 0, travel: 0, enhanced: false }));
    const scenes = [...document.querySelectorAll('.hero, .unit-hero')];
    let scheduled = false;
    function update() {
      scheduled = false;
      if (reducedMotion.matches) {
        records.forEach(record => {
          record.element.classList.remove('scroll-reveal');
          record.enhanced = false;
        });
        scenes.forEach(scene => scene.classList.remove('scroll-scene'));
        return;
      }
      const height = window.innerHeight;
      const mobile = window.innerWidth < 960;
      const travel = mobile ? 10 : 18;
      const clamp = value => Math.max(0, Math.min(1, value));
      const positions = records.map(record => record.element.getBoundingClientRect().top - (record.enhanced ? (1 - record.progress) * record.travel : 0));
      const scenePositions = scenes.map(scene => scene.getBoundingClientRect());
      records.forEach((record, index) => {
        const progress = clamp((height * .94 - positions[index]) / (height * .36));
        const eased = progress * progress * (3 - 2 * progress);
        record.progress = Math.max(record.progress, eased);
        record.travel = travel;
        record.element.style.setProperty('--reveal-progress', record.progress.toFixed(4));
        record.element.style.setProperty('--reveal-travel', `${travel}px`);
        record.element.classList.add('scroll-reveal');
        record.enhanced = true;
      });
      scenes.forEach((scene, index) => {
        const bounds = scenePositions[index];
        scene.style.setProperty('--scene-progress', clamp(-bounds.top / Math.max(bounds.height * .75, 1)).toFixed(4));
        scene.classList.add('scroll-scene');
      });
    }
    function schedule() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    }
    records.forEach(record => record.element.addEventListener('focusin', () => {
      record.progress = 1;
      schedule();
    }));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule, { once: true });
    reducedMotion.addEventListener('change', schedule);
    document.fonts?.ready.then(schedule);
    schedule();
  }
  // A short entrance for the content already in view when a page opens.
  const entrances = [...document.querySelectorAll('.hero-copy>.eyebrow, .hero-title, .hero-lead, .unit-page-logo, .unit-hero-copy>.eyebrow, .unit-hero-copy>.display, .unit-lead, .unit-audience, .unit-photo-frame')];
  if (!reducedMotion.matches) {
    let order = 0;
    entrances.forEach(element => {
      if (element.getBoundingClientRect().top >= window.innerHeight * .94) return;
      element.style.setProperty('--entrance-delay', `${Math.min(order++ * 55, 220)}ms`);
      element.classList.add('soft-enter');
      element.addEventListener('animationend', event => {
        if (event.target === element) element.classList.remove('soft-enter');
      });
    });
  }
  reducedMotion.addEventListener('change', event => {
    if (event.matches) entrances.forEach(element => element.classList.remove('soft-enter'));
  });
  document.querySelectorAll('.globe').forEach(globe => {
    // Keep the lightweight SVG on smaller screens, where continuous canvas work is costly.
    const desktopMotion = window.matchMedia('(min-width: 960px) and (prefers-reduced-motion: no-preference)');
    if (!desktopMotion.matches) return;
    const canvas = globe.querySelector('canvas');
    const context = canvas?.getContext?.('2d');
    if (!context) return;
    const pointCount = 520;
    const points = Array.from({ length: pointCount }, (_, index) => {
      const y = 1 - index / (pointCount - 1) * 2;
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
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
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
      context.beginPath();
      context.arc(center, center, radius, 0, Math.PI * 2);
      context.fillStyle = '#100909';
      context.fill();
      context.strokeStyle = 'rgba(225,25,32,.35)';
      context.stroke();
      const turn = rotation;
      const sin = Math.sin(turn);
      const cos = Math.cos(turn);
      const tiltSin = Math.sin(.4);
      const tiltCos = Math.cos(.4);
      context.fillStyle = '#eb1f27';
      for (const [x, y, z] of points) {
        const rotatedX = x * cos + z * sin;
        const rotatedZ = z * cos - x * sin;
        const projectedY = y * tiltCos - rotatedZ * tiltSin;
        const depth = y * tiltSin + rotatedZ * tiltCos;
        if (depth < -.05) continue;
        context.globalAlpha = .45 + depth * .5;
        const dotSize = Math.max(1.5, radius * .014);
        context.fillRect(center + rotatedX * radius, center + projectedY * radius, dotSize, dotSize);
      }
      context.globalAlpha = 1;
    };
    const animate = time => {
      if (!visible || document.hidden || !desktopMotion.matches) { frame = null; return; }
      if (time - lastTime >= 80) {
        rotation += Math.min(time - lastTime, 80) * .00012;
        draw();
        lastTime = time;
      }
      frame = requestAnimationFrame(animate);
    };
    const start = () => {
      if (!frame && visible && !document.hidden && desktopMotion.matches) frame = requestAnimationFrame(animate);
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
    desktopMotion.addEventListener('change', event => {
      globe.classList.toggle('is-ready', event.matches);
      if (!event.matches && frame) cancelAnimationFrame(frame);
      frame = null;
      start();
    });
    start();
  });
  const topic = document.querySelector('#contact-topic');
  const email = document.querySelector('#topic-email');
  topic?.addEventListener('change', () => {
    const subject = document.body.dataset.locale === 'en' ? 'Website inquiry' : document.body.dataset.locale === 'es' ? 'Consulta desde el sitio web' : 'Contato pelo site';
    email.href = `mailto:globalk@globalk.com.br?subject=${encodeURIComponent(`${subject} — ${topic.value}`)}`;
  });
})();
