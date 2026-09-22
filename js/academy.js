/* ============================================
   ACTION AIR ACADEMY — 아카데미 메뉴 인터랙션
   · 커리큘럼 펼치기/접기
   · 서브 내비게이션 현재 섹션 표시
   · 학원비 결제 화면 (디자인 시안: 선택 → 요약 계산만, 실결제 없음)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 0. 등장 애니메이션 (아카데미 페이지) ──────
  // main.js 의 GSAP ScrollTrigger 등장 효과는 트리거가 어긋나면 카드가 투명/중간 상태로 남을 수 있다.
  // 아카데미 페이지(.sub-nav 가 있는 페이지)에서는 그 트윈을 제거하고 CSS 전환 + IntersectionObserver 로 대체한다.
  // index.html 처럼 .sub-nav 가 없는 페이지는 원본 동작을 유지하되, 숨겨진 채 남으면 강제 표시한다.
  const ANIMATED = '.feature-item, .card, .price-card, .process-step, .library-item, .news-item, .hww-card, .sns-item, .reveal, .case-banner';
  const animated = Array.from(document.querySelectorAll(ANIMATED));
  const isAcademyPage = !!document.querySelector('.sub-nav');

  if (isAcademyPage && animated.length) {
    if (window.gsap) {
      if (window.ScrollTrigger) {
        ScrollTrigger.getAll().forEach(t => {
          const targets = t.animation && t.animation.targets ? t.animation.targets() : [];
          if (targets.some(el => animated.includes(el))) t.kill(true);
        });
      }
      gsap.killTweensOf(animated);
      gsap.set(animated, { clearProps: 'opacity,transform,visibility,clipPath' });
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      animated.forEach(el => {
        el.classList.remove('visible');
        // 초기 숨김 상태는 전환 없이 즉시 적용 (보임→숨김 깜빡임 방지)
        el.style.transition = 'none';
        el.classList.add('aa-reveal');
        void el.offsetWidth;
        el.style.transition = '';
        const sibs = Array.from(el.parentElement.children).filter(c => c.classList.contains('aa-reveal'));
        el.style.transitionDelay = (sibs.indexOf(el) * 80) + 'ms';
      });
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const el = e.target;
          io.unobserve(el);
          el.classList.add('in', 'visible');
          // 전환이 끝나면 클래스를 걷어내 hover 등 원래 스타일로 복귀
          setTimeout(() => { el.classList.remove('aa-reveal', 'in'); el.style.transitionDelay = ''; }, 900 + parseInt(el.style.transitionDelay || 0, 10));
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -5% 0px' });
      animated.forEach(el => io.observe(el));
    } else {
      animated.forEach(el => el.classList.add('visible'));
    }
  } else if (animated.length) {
    if (window.gsap && window.ScrollTrigger) {
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    }
    const guard = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        guard.unobserve(el);
        setTimeout(() => {
          if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
            if (window.gsap) gsap.set(el, { clearProps: 'opacity,transform,visibility' });
            el.classList.add('visible');
          }
        }, 1500);
      });
    }, { threshold: 0.05 });
    animated.forEach(el => guard.observe(el));
  }

  // ── 1. 커리큘럼 토글 ─────────────────────────
  document.querySelectorAll('.curriculum-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.dataset.target);
      if (!panel) return;
      const open = panel.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.querySelector('.label').textContent = open ? '커리큘럼 접기' : '커리큘럼 보기';
    });
  });

  // ── 2. 서브 내비 (스크롤 위치에 따라 active) ──
  const subLinks = document.querySelectorAll('.sub-nav a[href^="#"]');
  if (subLinks.length) {
    const targets = Array.from(subLinks)
      .map(a => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        subLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    targets.forEach(t => io.observe(t));
  }

  // ── 3. 학원비 결제 시안 ───────────────────────
  const checkout = document.getElementById('checkout');
  if (!checkout) return;

  const won = n => n.toLocaleString('ko-KR') + '원';

  // 과정 데이터 (actionair.co.kr 게시 기준)
  const COURSES = {
    hrd:      { name: '에어컨설치실무 국비지원과정', sub: '8주 주말과정 · 국민내일배움카드', list: 1213280, price: 1213280, hrd: true },
    startup1: { name: '에어컨기술 창업과정 ① 이전/설치', sub: '5일 평일과정', list: 1000000, price: 600000 },
    startup2: { name: '에어컨기술 창업과정 ② ADVANCED 101', sub: '10일 평일과정 · ATC 인증서', list: 3000000, price: 2100000 },
    clean1:   { name: '에어컨청소 창업과정 (기본 10일)', sub: '10일 평일과정', list: 2000000, price: 1200000 },
    clean2:   { name: '에어컨청소 집중과정 (5일)', sub: '5일 평일과정', list: 1000000, price: 600000 },
    short1:   { name: '단과반 · 에어컨 서비스 기술 (2일)', sub: '냉매 + 철거 + AS 진단', list: 600000, price: 400000 },
    short2:   { name: '단과반 · 냉매 서비스 + AS 진단 (1일)', sub: '1일 평일과정', list: 300000, price: 200000 },
    short3:   { name: '단과반 · 에어컨 철거 + AS 진단 (1일)', sub: '1일 평일과정', list: 300000, price: 200000 },
    short4:   { name: '단과반 · 실전 마케팅 특강', sub: '예비창업자 · 초보사업자', list: 1000000, price: 300000 }
  };

  // 국비지원 훈련비 지원율 (국민내일배움카드 안내 기준)
  const HRD_RATES = {
    general: { label: '일반인', rate: 0.45 },
    type1:   { label: '국민취업지원제도 Ⅰ유형 · Ⅱ유형(특정계층)', rate: 0.80 },
    type2:   { label: '국민취업지원제도 Ⅱ유형(청·중장년층)', rate: 0.50 },
    eitc:    { label: '근로장려금(EITC) 수급자', rate: 0.725 }
  };

  const state = { course: 'hrd', method: 'hrdcard', hrdType: 'general' };

  const el = {
    sumCourse:  document.getElementById('sumCourse'),
    sumSub:     document.getElementById('sumSub'),
    sumList:    document.getElementById('sumList'),
    sumDiscRow: document.getElementById('sumDiscountRow'),
    sumDisc:    document.getElementById('sumDiscount'),
    sumHrdRow:  document.getElementById('sumHrdRow'),
    sumHrdLbl:  document.getElementById('sumHrdLabel'),
    sumHrd:     document.getElementById('sumHrd'),
    sumMethod:  document.getElementById('sumMethod'),
    sumTotal:   document.getElementById('sumTotal'),
    sumNote:    document.getElementById('sumNote'),
    hrdTypeBox: document.getElementById('hrdTypeBox'),
    hrdWarn:    document.getElementById('hrdWarn')
  };

  const METHOD_LABEL = {
    hrdcard: '국민내일배움카드',
    card:    '신용 · 체크카드',
    bank:    '계좌이체 (무통장)'
  };

  function render() {
    const c = COURSES[state.course];
    const discount = c.list - c.price;
    const usingHrd = state.method === 'hrdcard';
    let support = 0;
    let total = c.price;

    if (usingHrd && c.hrd) {
      support = Math.round(c.price * HRD_RATES[state.hrdType].rate);
      total = c.price - support;
    }

    el.sumCourse.textContent = c.name;
    el.sumSub.textContent = c.sub;
    el.sumList.textContent = won(c.list);

    el.sumDiscRow.style.display = discount > 0 ? '' : 'none';
    el.sumDisc.textContent = '− ' + won(discount);

    el.sumHrdRow.style.display = (usingHrd && c.hrd) ? '' : 'none';
    el.sumHrdLbl.textContent = '국비지원 (' + Math.round(HRD_RATES[state.hrdType].rate * 100) + '%)';
    el.sumHrd.textContent = '− ' + won(support);

    el.sumMethod.textContent = METHOD_LABEL[state.method];
    el.sumTotal.innerHTML = total.toLocaleString('ko-KR') + '<span>원</span>';

    if (usingHrd && c.hrd) {
      el.sumNote.textContent = '자비부담금 예시입니다. 실제 지원율은 HRD-Net 카드 발급 시 확정된 유형에 따라 달라집니다.';
    } else if (usingHrd && !c.hrd) {
      el.sumNote.textContent = '선택하신 과정은 국비지원 대상이 아닙니다. 다른 결제수단을 선택해 주세요.';
    } else {
      el.sumNote.textContent = '부가세 포함 금액이며, 할부 · 분납은 학원으로 문의해 주세요.';
    }

    // 국비 대상 아님 경고 / 유형 선택 표시
    el.hrdWarn.style.display = (usingHrd && !c.hrd) ? '' : 'none';
    el.hrdTypeBox.style.display = (usingHrd && c.hrd) ? '' : 'none';

    // 결제수단 상세 안내 전환
    document.querySelectorAll('.pay-method-detail').forEach(d => {
      d.classList.toggle('active', d.dataset.method === state.method);
    });
  }

  // 라디오 그룹 → state
  checkout.querySelectorAll('input[name="course"]').forEach(r => {
    r.addEventListener('change', () => { state.course = r.value; render(); });
  });
  checkout.querySelectorAll('input[name="method"]').forEach(r => {
    r.addEventListener('change', () => { state.method = r.value; render(); });
  });
  checkout.querySelectorAll('input[name="hrdType"]').forEach(r => {
    r.addEventListener('change', () => { state.hrdType = r.value; render(); });
  });

  // 약관 전체 동의
  const agreeAll = document.getElementById('agreeAll');
  const agrees = checkout.querySelectorAll('.agree-item');
  if (agreeAll) {
    agreeAll.addEventListener('change', () => agrees.forEach(a => a.checked = agreeAll.checked));
    agrees.forEach(a => a.addEventListener('change', () => {
      agreeAll.checked = Array.from(agrees).every(x => x.checked);
    }));
  }

  // 결제 버튼 → 시안 안내 모달 (실결제 없음)
  const payBtn = document.getElementById('payBtn');
  if (payBtn) {
    payBtn.addEventListener('click', () => {
      const c = COURSES[state.course];
      document.getElementById('mockCourse').textContent = c.name;
      document.getElementById('mockMethod').textContent = METHOD_LABEL[state.method];
      document.getElementById('mockAmount').textContent = el.sumTotal.textContent;
      document.getElementById('mockModal').classList.add('active');
    });
  }

  // URL ?course=xxx 로 진입 시 해당 과정 선택
  const params = new URLSearchParams(location.search);
  const pre = params.get('course');
  if (pre && COURSES[pre]) {
    const r = checkout.querySelector('input[name="course"][value="' + pre + '"]');
    if (r) { r.checked = true; state.course = pre; }
  }

  render();
});
