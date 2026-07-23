// forty-one Tattoo — main.js (v2)
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Nav scroll state + progress bar ---------- */
  const nav = document.querySelector('.nav');
  const progress = document.querySelector('.progress');
  const totop = document.querySelector('.totop');
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('is-scrolled', y > 30);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    if (totop) totop.classList.toggle('is-visible', y > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (totop) totop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.menu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('is-open');
      burger.classList.remove('is-open');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- Active link ---------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a[data-nav]').forEach(a => {
    if (a.getAttribute('data-nav') === path) a.classList.add('is-active');
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Accordion ---------- */
  document.querySelectorAll('.acc-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.acc-item');
      const panel = item.querySelector('.acc-panel');
      const wasOpen = item.classList.contains('is-open');
      const acc = item.closest('.acc');
      if (acc) acc.querySelectorAll('.acc-item.is-open').forEach(o => {
        if (o !== item) {
          o.classList.remove('is-open');
          o.querySelector('.acc-panel').style.maxHeight = null;
          o.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
        }
      });
      if (wasOpen) {
        item.classList.remove('is-open');
        panel.style.maxHeight = null;
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
  // Deep-link: #anker öffnet passendes Accordion
  if (window.location.hash) {
    const t = document.querySelector(window.location.hash);
    if (t && t.classList.contains('acc-item')) {
      setTimeout(() => t.querySelector('.acc-trigger').click(), 250);
    }
  }

  /* ---------- Legal expand ---------- */
  document.querySelectorAll('.legal-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const box = btn.parentElement.querySelector('.legal-box');
      const ex = box.classList.toggle('is-expanded');
      btn.textContent = ex ? 'Weniger anzeigen' : 'Vollständige AGB lesen';
      const panel = btn.closest('.acc-panel');
      if (panel) panel.style.maxHeight = 'none';
    });
  });

  /* ---------- Gallery filter ---------- */
  const fbtns = document.querySelectorAll('.fbtn[data-filter]');
  const works = document.querySelectorAll('.work[data-cat]');
  const empty = document.querySelector('.empty-note');
  if (fbtns.length && works.length) {
    fbtns.forEach(btn => btn.addEventListener('click', () => {
      fbtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const f = btn.getAttribute('data-filter');
      let vis = 0;
      works.forEach(w => {
        const show = f === 'alle' || w.getAttribute('data-cat') === f;
        w.classList.toggle('is-hidden', !show);
        if (show) vis++;
      });
      if (empty) empty.classList.toggle('is-visible', vis === 0);
    }));
  }

  /* ---------- Lightbox ---------- */
  const lb = document.createElement('div');
  Object.assign(lb.style, {
    position: 'fixed', inset: '0', background: 'rgba(10,10,11,0.96)',
    display: 'none', alignItems: 'center', justifyContent: 'center',
    zIndex: '300', padding: '5vw', cursor: 'zoom-out', backdropFilter: 'blur(8px)'
  });
  lb.innerHTML = '<img alt="" style="max-width:92vw;max-height:88vh;object-fit:contain;"><button aria-label="Schließen" style="position:absolute;top:22px;right:26px;width:46px;height:46px;border-radius:50%;background:none;border:1px solid rgba(237,234,227,0.35);color:#EDEAE3;font-size:16px;cursor:pointer;">✕</button>';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('img');
  const closeLb = () => { lb.style.display = 'none'; document.body.style.overflow = ''; };
  lb.addEventListener('click', closeLb);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
  document.querySelectorAll('.work img, .split-img img').forEach(img => {
    img.closest('.work, .split-img').addEventListener('click', (e) => {
      e.preventDefault();
      lbImg.src = img.src; lbImg.alt = img.alt;
      lb.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  /* ---------- Kontaktformular (Demo) ---------- */
  const form = document.querySelector('#contact-form');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    form.style.display = 'none';
    const s = document.querySelector('.form-success');
    if (s) s.classList.add('is-visible');
  });

});
