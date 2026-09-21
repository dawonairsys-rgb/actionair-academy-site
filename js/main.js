/* ============================================
   ACTION AIR GROUP — Premium Animation Engine
   GSAP + ScrollTrigger + Custom Effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. GSAP & ScrollTrigger Setup ───────────
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero text entrance
    gsap.from('.hero-badge', { opacity: 0, y: 20, duration: 0.8, delay: 0.3 });
    gsap.from('.hero h1', { opacity: 0, y: 40, duration: 1, delay: 0.5 });
    gsap.from('.hero-desc', { opacity: 0, y: 30, duration: 0.8, delay: 0.7 });
    gsap.from('.hero-actions', { opacity: 0, y: 20, duration: 0.8, delay: 0.9 });

    // Section reveals
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    // Stagger card animations
    gsap.utils.toArray('.card-stagger').forEach(container => {
      const cards = container.querySelectorAll('.card, .feature-item, .price-card, .process-step');
      gsap.from(cards, {
        scrollTrigger: {
          trigger: container,
          start: 'top 80%'
        },
        opacity: 0,
        y: 60,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out'
      });
    });

    // Stats counter
    gsap.utils.toArray('.stat-number').forEach(el => {
      // Skip non-numeric stats (e.g. "A+++", "R290", "-25℃")
      if (el.hasAttribute('data-static')) return;
      const raw = el.dataset.count || el.textContent;
      const target = parseInt(raw, 10);
      if (isNaN(target) || target <= 0) return;
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 90%'
        },
        innerText: 0,
        duration: 2,
        snap: { innerText: 1 },
        ease: 'power2.out',
        onUpdate: function() {
          el.textContent = prefix + Math.ceil(this.targets()[0].innerText) + suffix;
        },
        onComplete: function() {
          el.textContent = prefix + target + suffix;
        }
      });
    });

    // Parallax hero background
    const heroBg = document.querySelector('.hero-bg img');
    if (heroBg) {
      gsap.to(heroBg, {
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        },
        y: 150,
        scale: 1.1,
        ease: 'none'
      });
    }

    // Image banner parallax
    gsap.utils.toArray('.img-banner img').forEach(img => {
      gsap.fromTo(img,
        { y: -30 },
        {
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          },
          y: 30,
          ease: 'none'
        }
      );
    });

    // Split section image reveal
    gsap.utils.toArray('.split-img').forEach(img => {
      gsap.from(img, {
        scrollTrigger: {
          trigger: img,
          start: 'top 80%'
        },
        clipPath: 'inset(10% 10% 10% 10%)',
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      });
    });
  }

  // ── 2. Navigation ───────────────────────────
  const nav = document.getElementById('nav');
  const floatingCta = document.getElementById('floatingCta');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 60);
    if (floatingCta) floatingCta.classList.toggle('visible', y > 500);
  }, { passive: true });

  // ── 그룹소개 네비게이션 드롭다운 자동 구성 ──
  // "그룹소개" 링크를 감싸서 하위 페이지(그룹 네트워크 등) 메뉴로 확장
  // 모든 페이지에 나타나는 공통 네비게이션이므로 JS로 일괄 처리
  (function setupAboutDropdown() {
    const menu = document.getElementById('navMenu');
    if (!menu) return;
    // 이미 드롭다운으로 래핑된 경우 스킵
    if (menu.querySelector('.nav-dropdown')) return;

    // "그룹소개" 링크를 찾음 (about.html 을 href로 갖는 .nav-link)
    const aboutLink = Array.from(menu.querySelectorAll('a.nav-link')).find(a => {
      const href = a.getAttribute('href') || '';
      return href.endsWith('about.html') || href.endsWith('/about.html');
    });
    if (!aboutLink) return;

    // 현재 페이지 위치에 따라 하위 페이지 경로 계산
    const path = window.location.pathname || '';
    const inPagesDir = path.indexOf('/pages/') !== -1;
    // 시안 프리뷰용: window.AAG_LIVE_BASE 가 지정되면 운영 사이트의 하위 페이지로 연결
    // (실제 사이트에 병합할 때는 이 변수를 제거하면 기존 동작으로 복귀)
    const base = window.AAG_LIVE_BASE || (inPagesDir ? '' : 'pages/');
    const currentFile = path.split('/').pop() || '';

    // 드롭다운 구조로 래핑
    const dropdown = document.createElement('div');
    dropdown.className = 'nav-dropdown';

    // 기존 aboutLink를 드롭다운의 트리거로 유지 (캐럿 추가)
    const caret = document.createElement('span');
    caret.className = 'nav-link-caret';
    caret.textContent = '▾';
    aboutLink.appendChild(caret);

    // 하위 메뉴 생성 — 제목 + 한 줄 설명 (아이콘 없음, 미니멀)
    const subItems = [
      { href: base + 'about.html',     label: '그룹소개',      file: 'about.html',     desc: '연혁·비전·파트너십' },
      { href: base + 'locations.html', label: '그룹 네트워크', file: 'locations.html', desc: '본사·아카데미·유통지점' },
      { href: base + 'bi.html',        label: 'BI 가이드라인', file: 'bi.html',        desc: '로고·컬러·디자인 시스템' },
      { href: base + 'character.html', label: '캐릭터 소개',   file: 'character.html', desc: '다원이 & 액션이' }
    ];
    const subMenu = document.createElement('div');
    subMenu.className = 'nav-dropdown-menu';

    subItems.forEach(item => {
      const a = document.createElement('a');
      a.href = item.href;
      a.className = 'nav-dropdown-item';
      if (currentFile === item.file) a.classList.add('active');
      a.innerHTML =
        '<span class="nav-dd-text">' +
          '<span class="nav-dd-label">' + item.label + '</span>' +
          '<span class="nav-dd-desc">' + item.desc + '</span>' +
        '</span>' +
        '<span class="nav-dd-arrow">&rarr;</span>';
      subMenu.appendChild(a);
    });

    // aboutLink를 드롭다운 컨테이너 내부로 이동
    menu.insertBefore(dropdown, aboutLink);
    dropdown.appendChild(aboutLink);
    dropdown.appendChild(subMenu);
  })();

  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navContainer = document.querySelector('.nav .container');
  const navAuth = navContainer ? navContainer.querySelector('.nav-auth') : null;
  const mobileMQ = window.matchMedia('(max-width: 768px)');

  // Move the drawer OUT of .nav (backdrop-filter on nav breaks fixed positioning
  // of descendants on some browsers) and relocate .nav-auth depending on viewport.
  function placeNavMenu() {
    if (!navMenu) return;
    if (mobileMQ.matches) {
      // Drawer → body direct child so position:fixed is viewport-relative
      if (navMenu.parentElement !== document.body) {
        document.body.appendChild(navMenu);
      }
      if (navAuth && navAuth.parentElement !== navMenu) {
        navMenu.appendChild(navAuth);
      }
    } else {
      // Restore into nav .container on desktop
      if (navContainer && navMenu.parentElement !== navContainer) {
        const hb = navContainer.querySelector('.nav-hamburger');
        if (hb) navContainer.insertBefore(navMenu, hb);
        else navContainer.appendChild(navMenu);
      }
      if (navAuth && navContainer && navAuth.parentElement !== navContainer) {
        const hb = navContainer.querySelector('.nav-hamburger');
        if (hb) navContainer.insertBefore(navAuth, hb);
        else navContainer.appendChild(navAuth);
      }
    }
  }

  placeNavMenu();
  mobileMQ.addEventListener('change', placeNavMenu);

  function closeMobileMenu() {
    if (!navMenu || !hamburger) return;
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const willOpen = !navMenu.classList.contains('open');
      hamburger.classList.toggle('open', willOpen);
      navMenu.classList.toggle('open', willOpen);
      document.body.classList.toggle('menu-open', willOpen);
      document.body.style.overflow = willOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    // Close drawer when a link or auth button is tapped
    navMenu.addEventListener('click', e => {
      const el = e.target.closest('a.nav-link, a.nav-cta, a.nav-admin-link, button.nav-auth-btn, button.nav-cart-btn');
      if (el) closeMobileMenu();
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) closeMobileMenu();
    });

    // Close if viewport grows beyond mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) closeMobileMenu();
    });
  }

  // ── 3. FAQ Accordion ────────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── 4. Smooth Scroll for Anchor Links ───────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── 5. Card Tilt Effect ─────────────────────
  document.querySelectorAll('.card-tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── 6. Image Error Fallback ─────────────────
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      const fallback = img.dataset.fallback;
      if (fallback && img.src !== fallback) img.src = fallback;
    });
  });

  // Logo fallback
  document.querySelectorAll('.nav-logo-img').forEach(img => {
    img.addEventListener('error', () => img.classList.add('error'));
  });

  // ── 7. Form Handling ────────────────────────
  document.querySelectorAll('form[data-ajax]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const modal = document.getElementById(form.dataset.modal);
      if (modal) modal.classList.add('active');
    });
  });

  // Modal close
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal-overlay').classList.remove('active');
    });
  });

  // ── 8. Tab System ───────────────────────────
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const container = tabGroup.closest('.section') || document;
        container.querySelectorAll('[data-tab-content]').forEach(c => {
          c.style.display = c.dataset.tabContent === target ? '' : 'none';
        });
      });
    });
  });

  // ── 9. Cursor Glow (Desktop) ────────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: 400px; height: 400px; border-radius: 50%;
      background: radial-gradient(circle, rgba(200,169,126,0.04) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
      opacity: 0;
    `;
    document.body.appendChild(glow);

    let glowTimeout;
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      glow.style.opacity = '1';
      clearTimeout(glowTimeout);
      glowTimeout = setTimeout(() => glow.style.opacity = '0', 2000);
    }, { passive: true });
  }

  // ── 10. Intersection Observer Fallback ──────
  if (typeof gsap === 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ── 11. Hero Slider ─────────────────────────
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const slider = document.querySelector('.hero-slider');

  if (slides.length > 1) {
    let current = 0;
    let autoplay;

    function goToSlide(idx) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = idx;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    function nextSlide() {
      goToSlide((current + 1) % slides.length);
    }

    function prevSlide() {
      goToSlide((current - 1 + slides.length) % slides.length);
    }

    function startAutoplay() {
      autoplay = setInterval(nextSlide, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplay);
      startAutoplay();
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(autoplay);
        goToSlide(i);
        startAutoplay();
      });
    });

    // ── 모바일 터치 스와이프 (좌/우) ─────
    if (slider) {
      const SWIPE_THRESHOLD = 50;   // 최소 가로 이동 거리(px)
      const VERTICAL_LIMIT = 80;    // 세로 이동이 이보다 크면 스크롤로 간주
      let startX = 0;
      let startY = 0;
      let tracking = false;

      slider.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        tracking = true;
      }, { passive: true });

      slider.addEventListener('touchmove', (e) => {
        if (!tracking) return;
        const dy = Math.abs(e.touches[0].clientY - startY);
        if (dy > VERTICAL_LIMIT) tracking = false; // 세로 스크롤 의도 → 스와이프 취소
      }, { passive: true });

      slider.addEventListener('touchend', (e) => {
        if (!tracking) return;
        tracking = false;
        const dx = e.changedTouches[0].clientX - startX;
        const dy = Math.abs(e.changedTouches[0].clientY - startY);
        if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < dy) return;

        if (dx < 0) nextSlide();
        else prevSlide();
        resetAutoplay();
      }, { passive: true });

      slider.addEventListener('touchcancel', () => {
        tracking = false;
      }, { passive: true });
    }

    startAutoplay();
  }

  // ── 12. Promo Banner Close ──────────────────
  const promoBanner = document.getElementById('promoBanner');
  const promoClose = document.getElementById('promoClose');

  if (promoBanner && promoClose) {
    if (sessionStorage.getItem('promoClosed')) {
      promoBanner.classList.add('hidden');
    }
    promoClose.addEventListener('click', () => {
      promoBanner.classList.add('hidden');
      sessionStorage.setItem('promoClosed', '1');
    });
  }

  // ── 13. Stagger for new sections ────────────
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // How We Work cards
    gsap.utils.toArray('.hww-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 85%' },
        opacity: 0, y: 60, duration: 0.7, delay: i * 0.15,
        ease: 'power3.out'
      });
    });

    // Library items
    gsap.utils.toArray('.library-item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 90%' },
        opacity: 0, x: -20, duration: 0.5, delay: i * 0.06,
        ease: 'power2.out'
      });
    });

    // SNS grid
    gsap.utils.toArray('.sns-item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 90%' },
        opacity: 0, scale: 0.9, duration: 0.5, delay: i * 0.08,
        ease: 'power2.out'
      });
    });

    // News items
    gsap.utils.toArray('.news-item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 92%' },
        opacity: 0, y: 20, duration: 0.5, delay: i * 0.1,
        ease: 'power2.out'
      });
    });

    // Brand story
    const storyImg = document.querySelector('.brand-story-img');
    if (storyImg) {
      gsap.from(storyImg, {
        scrollTrigger: { trigger: storyImg, start: 'top 80%' },
        clipPath: 'inset(10% 10% 10% 10%)', opacity: 0,
        duration: 1.2, ease: 'power3.out'
      });
    }

    // Case banner
    const caseBanner = document.querySelector('.case-banner');
    if (caseBanner) {
      gsap.from(caseBanner, {
        scrollTrigger: { trigger: caseBanner, start: 'top 80%' },
        opacity: 0, y: 40, duration: 1, ease: 'power3.out'
      });
    }

    // Equipment cards (NZ15C facilities)
    gsap.utils.toArray('.equip-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 88%' },
        opacity: 0, y: 50, duration: 0.7, delay: i * 0.1,
        ease: 'power3.out'
      });
    });

    // Flow step icons
    gsap.utils.toArray('.flow-step').forEach((step, i) => {
      gsap.from(step, {
        scrollTrigger: { trigger: step, start: 'top 90%' },
        opacity: 0, y: 30, duration: 0.5, delay: i * 0.08,
        ease: 'power2.out'
      });
    });

    // Facilities intro stats
    gsap.utils.toArray('.facilities-intro-stat').forEach((stat, i) => {
      gsap.from(stat, {
        scrollTrigger: { trigger: stat, start: 'top 92%' },
        opacity: 0, scale: 0.9, duration: 0.5, delay: i * 0.1,
        ease: 'power2.out'
      });
    });
  }

});
