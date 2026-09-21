# 액션에어그룹 홈페이지 — 아카데미 메뉴 추가 시안

[actionairgroup.com](https://www.actionairgroup.com)의 디자인 시스템(Pretendard + Noto Sans KR, 골드 액센트 라이트 테마)을 그대로 사용하여
[actionair.co.kr](http://www.actionair.co.kr) 학원 홈페이지의 내용을 **"아카데미" 메뉴**로 통합한 디자인 시안입니다.

> 디자인 시안입니다. 로그인 · 결제 · 상담 접수 등 실제 기능은 동작하지 않습니다.

## 구성

| 파일 | 내용 |
|---|---|
| `index.html` | 메인 페이지 — 상단 내비게이션에 **아카데미 드롭다운** 추가, 히어로 슬라이드 · 아카데미 하이라이트 섹션 추가 |
| `pages/academy.html` | 아카데미 소개 — 교육이념 · 연혁 · 시설 · 오시는 길 · 인재모집 |
| `pages/academy-courses.html` | 교육과정 — 국비지원과정(내일배움카드) · 에어컨기술 창업과정 · 에어컨청소 창업과정 · 단과반 · 커리큘럼 |
| `pages/academy-payment.html` | **학원비 결제** — 과정 선택 → 결제수단(국민내일배움카드 / 신용·체크카드 / 계좌이체) → 수강생 정보 → 결제 요약 카드 |
| `pages/academy-partner.html` | 파트너 모집 · 아카데미 가맹 · 에어컨 시공 · 기업서비스 |
| `pages/academy-community.html` | 공지사항 · FAQ · 1:1 상담신청 · 취업정보 · 갤러리 |
| `css/styles.css` | 원본 사이트 디자인 시스템 (수정 없음) |
| `css/academy.css` | 아카데미 페이지 전용 컴포넌트 (원본 토큰 상속) |
| `js/main.js` | 원본 스크립트 (+ 시안 프리뷰용 `AAG_LIVE_BASE` 1줄 추가) |
| `js/academy.js` | 커리큘럼 토글 · 결제 화면 선택/요약 계산 (실결제 없음) |

## 로컬에서 보기

```bash
npx serve .
```

## 실제 사이트에 병합할 때

1. `css/academy.css`, `js/academy.js`, `pages/academy-*.html`, `images/adademy-front.jpg` 를 복사
2. 각 페이지의 `<nav>` 에 있는 `아카데미` 드롭다운 블록을 기존 내비게이션에 추가
3. 프리뷰용으로 절대경로(`https://www.actionairgroup.com/pages/...`)로 걸어둔 링크를 상대경로로 되돌리고, `window.AAG_LIVE_BASE` 스크립트 줄을 제거
4. `index.html` 의 아카데미 biz-card 링크(`pages/academy.html`)와 하이라이트 섹션 반영
