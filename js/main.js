/* ============================================================
   EQUILIBRIUM CALPE — main.js
   UI, WhatsApp helpers, galería/lightbox, animaciones
   ============================================================ */

'use strict';

/* ── CONFIGURACIÓN ──────────────────────────────────────────*/
const WA_NUMBER = '34665761094';

/* ── UTILIDADES WHATSAPP ────────────────────────────────────*/

function generarLinkWhatsApp(mensaje) {
  return `https://api.whatsapp.com/send?phone=${WA_NUMBER}&text=${encodeURIComponent(mensaje)}`;
}

function linkWAGeneral() {
  return generarLinkWhatsApp(
    'Hola Juan Manuel, me gustaría obtener más información sobre Equilibrium Calpe.'
  );
}

function linkWABonos() {
  return generarLinkWhatsApp(
    'Hola Juan Manuel, me gustaría información sobre los bonos regalo de Equilibrium.'
  );
}

function linkWAQuiron() {
  return generarLinkWhatsApp(
    'Hola Juan Manuel, me interesa conocer las formaciones de Quirón. ¿Podrías darme información?'
  );
}

/* ── INICIALIZACIÓN ─────────────────────────────────────────*/

document.addEventListener('DOMContentLoaded', () => {

  /* --- Logo: texto fallback si falla la imagen --- */
  document.querySelectorAll('img[data-logo-fallback]').forEach((img) => {
    const showFallback = () => {
      img.hidden = true;
      const fallback = img.nextElementSibling;
      if (fallback?.classList.contains('logo-fallback')) {
        fallback.classList.add('is-visible');
        fallback.removeAttribute('aria-hidden');
      }
    };
    if (img.complete && img.naturalWidth === 0) showFallback();
    else img.addEventListener('error', showFallback, { once: true });
  });

  /* --- Banner promo: cerrar y ajustar header --- */
  const promoBanner      = document.getElementById('promoBanner');
  const promoBannerClose = document.getElementById('promoBannerClose');

  if (promoBanner && promoBannerClose) {
    promoBannerClose.addEventListener('click', () => {
      promoBanner.classList.add('is-dismissed');
      document.body.classList.remove('has-promo-banner');
    });
  }

  /* --- Header: fondo al hacer scroll --- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Menú hamburguesa --- */
  const toggle  = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (toggle && mainNav) {
    toggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Cerrar al pulsar un enlace del menú
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Cerrar con Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  /* --- WhatsApp: asignar hrefs dinámicos --- */
  const floatBtn = document.getElementById('whatsappFloat');
  if (floatBtn) floatBtn.href = linkWAGeneral();

  const heroWA = document.getElementById('heroWhatsApp');
  if (heroWA) heroWA.href = linkWAGeneral();

  const bonoWA = document.getElementById('bonoWhatsApp');
  if (bonoWA) bonoWA.href = linkWABonos();

  const quironWA = document.getElementById('quironWhatsApp');
  if (quironWA) quironWA.href = linkWAQuiron();

  /* --- Galería / Lightbox --- */
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = document.getElementById('lightboxImg');
  const lbCaption    = document.getElementById('lightboxCaption');
  const lbClose      = document.getElementById('lightboxClose');
  const lbBackdrop   = document.getElementById('lightboxBackdrop');
  const lbPrev       = document.getElementById('lightboxPrev');
  const lbNext       = document.getElementById('lightboxNext');
  const galeriaItems = Array.from(document.querySelectorAll('.galeria-item'));
  let currentIndex   = 0;

  function abrirLightbox(index) {
    if (!lightbox || !lbImg) return;
    currentIndex = index;
    const item = galeriaItems[index];
    const img  = item.querySelector('img');
    lbImg.src  = item.dataset.src || (img ? img.src : '');
    lbImg.alt  = item.dataset.caption || (img ? img.alt : '');
    if (lbCaption) lbCaption.textContent = item.dataset.caption || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose?.focus();
  }

  function cerrarLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
    galeriaItems[currentIndex]?.focus();
  }

  function navLightbox(dir) {
    currentIndex = (currentIndex + dir + galeriaItems.length) % galeriaItems.length;
    abrirLightbox(currentIndex);
  }

  galeriaItems.forEach((item, i) => {
    item.addEventListener('click', () => abrirLightbox(i));
  });

  lbClose?.addEventListener('click',    cerrarLightbox);
  lbBackdrop?.addEventListener('click', cerrarLightbox);
  lbPrev?.addEventListener('click', () => navLightbox(-1));
  lbNext?.addEventListener('click', () => navLightbox(1));

  document.addEventListener('keydown', e => {
    if (lightbox && !lightbox.hidden) {
      if (e.key === 'Escape')     cerrarLightbox();
      if (e.key === 'ArrowLeft')  navLightbox(-1);
      if (e.key === 'ArrowRight') navLightbox(1);
    }
  });

  /* --- Animaciones de scroll (IntersectionObserver) --- */
  const animEls = document.querySelectorAll(
    '.animate-fade-up, .animate-fade-left, .animate-fade-right'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    animEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: mostrar todo sin animación
    animEls.forEach(el => el.classList.add('visible'));
  }

  /* --- Smooth scroll para anclas del menú --- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const headerH = document.querySelector('.site-header')?.offsetHeight || 0;
      const promoBanner = document.getElementById('promoBanner');
      const bannerH = (promoBanner && !promoBanner.classList.contains('is-dismissed'))
        ? (promoBanner.offsetHeight || 0)
        : 0;
      const y = target.getBoundingClientRect().top + window.scrollY - headerH - bannerH - 8;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* --- Nav link activo al hacer scroll --- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActiveNav = () => {
    const scrollY = window.scrollY + 140;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });
});
