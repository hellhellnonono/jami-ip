// Replay the who-quote flip-in each time slide 3 becomes visible
  (function(){
    const quote = document.querySelector('.who-quote');
    if (!quote) return;
    const section = quote.closest('section');
    if (!section) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio > 0.4) {
          quote.classList.remove('animate');
          // restart animation
          void quote.offsetWidth;
          quote.classList.add('animate');
        }
        // do NOT remove animate when leaving — text stays visible
      });
    }, { threshold: [0, 0.4, 0.8] });
    io.observe(section);

    // Click-to-flip: re-play flip on individual spans
    quote.querySelectorAll('.flip').forEach(el => {
      el.addEventListener('click', () => {
        el.classList.remove('tap');
        void el.offsetWidth;
        el.classList.add('tap');
      });
    });
  })();

  // Interactive anatomy rows — click to expand description + slightly scale matching part on Jamie
  (function(){
    const box = document.querySelector('.anatomy-img-box');
    document.querySelectorAll('.anatomy-row').forEach(row => {
      row.addEventListener('click', () => {
        const isOpen = row.classList.toggle('open');
        const target = row.dataset.target;
        if (!box) return;
        const mark = box.querySelector('.mark[data-mark="' + target + '"]');
        if (mark) mark.classList.toggle('on', isOpen);
      });
    });

    // Spin-in: re-run animation each time slide 5 enters the viewport
    if (box) {
      const section = box.closest('section');
      if (section) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach(e => {
            if (e.isIntersecting && e.intersectionRatio > 0.4) {
              box.classList.remove('spin');
              void box.offsetWidth;
              box.classList.add('spin');
            }
          });
        }, { threshold: [0, 0.4, 0.8] });
        io.observe(section);
      }
    }
  })();

  // Click interactions on mood card images (slide 7)
  //  - b1 cheering Jamie → waves hand
  //  - b2 出遊 Jamie      → hop + travel confetti
  //  - b3 探索 Jamie      → eyes widen / lean in toward magnifier
  //  - others              → simple wave
  (function(){
    document.querySelectorAll('.mood-card').forEach(card => {
      const img = card.querySelector('.img-wrap img');
      const wrap = card.querySelector('.img-wrap');
      if (!img || !wrap) return;
      let animClass = 'wave';
      if (card.classList.contains('b2')) animClass = 'travel';
      else if (card.classList.contains('b3')) animClass = 'discover';
      else if (card.classList.contains('b4')) animClass = 'dream';
      img.addEventListener('click', () => {
        img.classList.remove('wave', 'discover', 'travel', 'dream');
        wrap.classList.remove('hi');
        void img.offsetWidth;
        img.classList.add(animClass);
        wrap.classList.add('hi');
      });
    });
  })();

  // "Drained by work" click effect on slide 8 image
  (function(){
    const wrap = document.querySelector('.work-img-wrap');
    if (!wrap) return;
    const img = wrap.querySelector('img');
    img.addEventListener('click', () => {
      img.classList.remove('drained');
      wrap.classList.remove('drained-go');
      void img.offsetWidth;
      img.classList.add('drained');
      wrap.classList.add('drained-go');
    });
  })();

  // Phone buzz/shake on slide 9 app cell
  (function(){
    const cell = document.querySelector('.app-cell.big');
    if (!cell) return;
    const img = cell.querySelector('img');
    cell.addEventListener('click', () => {
      img.classList.remove('buzz');
      cell.classList.remove('buzzing');
      void img.offsetWidth;
      img.classList.add('buzz');
      cell.classList.add('buzzing');
    });
  })();

  // Inject a "return to cover" star icon on every slide except the cover (slide 1)
  (function(){
    const slides = document.querySelectorAll('main.onepage > section');
    slides.forEach((section, i) => {
      if (i === 0) return; // cover is already home
      const slide = section.querySelector('.slide');
      if (!slide) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'home-star';
      btn.title = '回首頁';
      btn.setAttribute('aria-label', '回首頁');
      btn.innerHTML = '<img src="assets/characters/wawa-home.png" alt="回首頁">';
      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      slide.appendChild(btn);
    });
  })();





  /* Scale every .stage to viewport width, set page heights, drive scroll-spy. */
  (function(){
    const STAGE_W = 1920, STAGE_H = 1080;
    const stages = document.querySelectorAll('.stage');
    const pages  = document.querySelectorAll('.page');
    const MOBILE_BP = 768;
    function fit(){
      const w = document.documentElement.clientWidth;
      if (w <= MOBILE_BP) {
        // 手機版：交給 responsive.css 的流動排版，不做縮放
        stages.forEach(st => { st.style.transform = ''; });
        pages.forEach(p => { p.style.height = ''; });
        return;
      }
      const s = w / STAGE_W;
      stages.forEach(st => { st.style.transform = 'scale(' + s + ')'; });
      pages.forEach(p => { p.style.height = (STAGE_H * s) + 'px'; });
    }
    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', fit);
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

    // Scroll-spy: highlight the nav link for the nearest mapped section
    const mapIds = ['sec-01', 'sec-07', 'sec-08', 'sec-09'];
    const links = document.querySelectorAll('.site-links a');
    function spy(){
      const y = window.scrollY + window.innerHeight * 0.35;
      let best = 0;
      mapIds.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) best = i;
      });
      links.forEach((a, i) => a.classList.toggle('active', i === best));
    }
    window.addEventListener('scroll', spy, { passive: true });
    spy();
  })();

  // 手機版浮動「回到最上面」星星按鈕 — 隨捲動顯示，桌機由 CSS 隱藏
  (function(){
    const brandImg = document.querySelector('.site-brand .brand-dot img');
    const src = brandImg
      ? brandImg.getAttribute('src').replace('jamie-hello-d3.png', 'wawa-home.png')
      : 'assets/characters/wawa-home.png';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'home-fab';
    btn.title = '回到最上面';
    btn.setAttribute('aria-label', '回到最上面');
    btn.innerHTML = '<img src="' + src + '" alt="">';
    document.body.appendChild(btn);
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    function toggleFab(){
      btn.classList.toggle('show', window.scrollY > 240);
    }
    window.addEventListener('scroll', toggleFab, { passive: true });
    toggleFab();
  })();
