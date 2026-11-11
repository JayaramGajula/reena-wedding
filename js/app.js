/* ──────────────────────────────────────────────────────────────────────────
   Builds the page from WEDDING data and runs every animation.
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  const W = window.WEDDING, ART = window.ART;
  const root = document.documentElement;
  root.classList.add('js');

  /* always start fresh at the top: ignore the remembered scroll position and any #section in the address */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  toTop();
  addEventListener('load', toTop);
  addEventListener('pageshow', e => { if (e.persisted) toTop(); });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const couple = `${W.bride} & ${W.groom}`;
  const get = k => k.split('.').reduce((o, p) => (o == null ? o : o[p]), W);
  const TZ = 'Asia/Kolkata';
  const fmtDate = iso => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', timeZone: TZ }).format(new Date(iso));
  const mapsUrl = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);

  /* ── build ─────────────────────────────────────────────────────────────── */
  document.body.insertAdjacentHTML('afterbegin', ART.defs);

  const computed = { couple, mono: `${W.bride[0]}·${W.groom[0]}` };
  $$('[data-f]').forEach(el => {
    const k = el.dataset.f, v = k in computed ? computed[k] : get(k);
    if (v == null) return;
    if (k === 'couple') el.innerHTML = `${esc(W.bride)}<span class="amp">&amp;</span>${esc(W.groom)}`;
    else el.textContent = v;
  });
  $$('img[data-src]').forEach(img => { img.src = get(img.dataset.src); });

  $$('[data-pair]').forEach(p => { p.innerHTML = `<div class="bw bride">${ART.bride()}</div><div class="bw groom">${ART.groom()}</div>`; });
  $$('[data-diya]').forEach(d => { d.innerHTML = ART.diya(); });
  $$('[data-divider]').forEach(d => { d.innerHTML = ART.divider(); });
  $('#gateMuggu').innerHTML = ART.lotus();
  function toranam() {
    $$('[data-toranam]').forEach(t => {
      const n = Math.ceil(t.offsetWidth / 22) + 2;
      let h = '';
      for (let i = 0; i < n; i++) h += `<span class="t" style="animation-delay:${(-(i * .37) % 4).toFixed(2)}s">${i % 4 === 2 ? ART.marigold() : ART.mango(i)}</span>`;
      t.innerHTML = h;
    });
  }
  toranam();


  /* the wedding journey: painted moments on alternating sides of a gold line */
  if ($('#jr')) $('#jr').innerHTML = (W.journey || []).map((m, i) => `<li class="jr-item${i % 2 ? ' flip' : ''}">
    <div class="jr-art rv">${m.art ? ART.papercut(m.art) : ART.scene(m.scene)}</div>
    <div class="jr-text rv"><p class="te">${esc(m.te)}</p><h3>${esc(m.title)}</h3><span class="jr-rule" aria-hidden="true"></span><p>${esc(m.text)}</p></div>
  </li>`).join('');

  /* faint temple watermarks behind the sections, and hanging vines along their top edges */
  $$('.sec, .foot').forEach(sec => {
    sec.insertAdjacentHTML('afterbegin', `<div class="wm" aria-hidden="true">${ART.templeWatermark()}</div>`);
    if (!sec.querySelector('[data-toranam]')) sec.insertAdjacentHTML('afterbegin', `<div class="vines" aria-hidden="true">${ART.vines()}</div>`);
  });

  /* the card: the back of the cover shows the left page of the inside */
  $('.face-back').style.backgroundImage = `url("${W.card.inside}")`;

  /* celebrations: frameless illustration on one side, details on the other, alternating */
  const fmtDay = iso => new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: TZ }).format(new Date(iso));
  $('#evGrid').innerHTML = W.events.map((e, i) => `<li class="jr-item${i % 2 ? ' flip' : ''}">
    <div class="jr-art rv">${e.vig ? ART.vignette(e.vig) : ART.scene(e.scene || 'mandapam')}</div>
    <div class="jr-text rv">
      ${e.te ? `<p class="te">${esc(e.te)}</p>` : ''}
      <h3>${esc(e.name)}</h3><span class="jr-rule" aria-hidden="true"></span>
      <p class="d">${esc(e.desc)}</p>
      <dl class="ev-meta"><div><dt>Date</dt><dd>${fmtDay(e.start)}</dd></div><div><dt>Time</dt><dd>${esc(e.when)}</dd></div></dl>
      ${e.place ? `<p class="ev-place">${esc(e.place === W.venue.name ? `${W.venue.name}, ${W.venue.address}` : e.place)}</p>` : ''}
      <div class="ev-acts"><button class="btn" type="button" data-cal="${i}">Add to calendar</button>${e.dir || e.place ? `<a class="ev-map" href="${e.dir || mapsUrl(e.map || W.venue.mapQuery)}" target="_blank" rel="noopener">📍 View map</a>` : ''}</div>
    </div></li>`).join('');

  $('#mapLink').href = mapsUrl(W.venue.mapQuery);
  $('#dirTop').href = mapsUrl(W.venue.mapQuery);

  /* ── talambralu: turmeric rice that flies, falls, bounces and fades ─────── */
  /* a rose petal: a soft teardrop, flipped by `turn` (-1..1) to look like it tumbles */
  const PETAL_COL = ['#c8102e', '#d92b45', '#b3122e', '#e8475f', '#a50f2a', '#f06a7c', '#d6324c'];
  function drawPetal(ctx, l, c, turn) {
    const w = l * .62 * (.25 + Math.abs(turn) * .75);
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(0, -l);
    ctx.bezierCurveTo(w, -l * .7, w * 1.05, l * .55, 0, l);
    ctx.bezierCurveTo(-w * 1.05, l * .55, -w, -l * .7, 0, -l);
    ctx.fill();
    ctx.fillStyle = turn > 0 ? 'rgba(255,255,255,.22)' : 'rgba(60,0,10,.22)';
    ctx.beginPath(); ctx.ellipse(-w * .25, -l * .2, w * .28, l * .5, 0, 0, 6.283); ctx.fill();
  }

  const Rice = (function () {
    const cv = $('#rice');
    const ctx = !reduce && cv.getContext && cv.getContext('2d');
    if (!ctx) { cv.remove(); return { burst() {}, rain() {}, petalBurst() {}, petalRain() {} }; }
    const COL = ['#e8a317', '#f4bd3a', '#f7d46e', '#dc9a12', '#efc24a', '#f7d46e', '#b3122e', '#fffbe8'];
    const P = [];
    let w = 0, h = 0, dpr = 1, running = false, last = 0;
    function fit() { dpr = Math.min(2, devicePixelRatio || 1); w = innerWidth; h = innerHeight; cv.width = w * dpr; cv.height = h * dpr; }
    fit(); addEventListener('resize', fit);
    function add(x, y, vx, vy) {
      P.push({ x, y, vx, vy, a: Math.random() * 6.28, va: (Math.random() - .5) * .35, len: (coarse ? 3.2 : 4) + Math.random() * 2.2, c: COL[Math.random() * COL.length | 0], hits: 0, life: 1 });
    }
    function addPetal(x, y, vx, vy) {
      P.push({ petal: true, x, y, vx, vy, a: Math.random() * 6.28, va: (Math.random() - .5) * .08, len: (coarse ? 6 : 7.5) + Math.random() * 4,
        c: PETAL_COL[Math.random() * PETAL_COL.length | 0], ph: Math.random() * 6.28, life: 1, hits: 0 });
    }
    function go() {
      if (P.length > 700) P.splice(0, P.length - 700);
      if (!running) { running = true; last = 0; requestAnimationFrame(frame); }
    }
    function frame(t) {
      if (document.hidden) P.length = 0;
      const k = last ? Math.min(2.2, (t - last) / 16.7) : 1; last = t;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i];
        if (p.petal) {                 // petals drift and flutter instead of dropping
          p.ph += .05 * k;
          p.vy = Math.min(p.vy + .06 * k, 1.6); p.vx = p.vx * Math.pow(.97, k) + Math.sin(p.ph) * .06 * k;
          p.x += p.vx * k; p.y += p.vy * k; p.a += p.va * k;
          if (p.y > h + 20 || p.x < -40 || p.x > w + 40) { P.splice(i, 1); continue; }
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.translate(p.x, p.y); ctx.rotate(p.a);
          drawPetal(ctx, p.len, p.c, Math.cos(p.ph * 1.3));
          continue;
        }
        p.vy += .17 * k; p.vx *= Math.pow(.99, k); p.x += p.vx * k; p.y += p.vy * k; p.a += p.va * k;
        if (p.y > h - 3 && p.vy > 0) {
          if (p.hits < 2) { p.y = h - 3; p.vy *= -.3; p.vx *= .55; p.va *= .5; p.hits++; } else p.life -= .05 * k;
        }
        if (p.hits) p.life -= .007 * k;
        if (p.life <= 0 || p.x < -30 || p.x > w + 30) { P.splice(i, 1); continue; }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.translate(p.x, p.y); ctx.rotate(p.a);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx.fillStyle = 'rgba(90,50,0,.25)'; ctx.beginPath(); ctx.ellipse(.6, .9, p.len * .4, p.len, 0, 0, 6.283); ctx.fill();
        ctx.fillStyle = p.c; ctx.beginPath(); ctx.ellipse(0, 0, p.len * .4, p.len, 0, 0, 6.283); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.42)'; ctx.beginPath(); ctx.ellipse(-p.len * .1, -p.len * .35, p.len * .11, p.len * .32, 0, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (P.length) requestAnimationFrame(frame);
      else { running = false; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); }
    }
    return {
      burst(x, y, n) { for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (Math.random() - .5) * 1.7, s = 5 + Math.random() * 7; add(x, y, Math.cos(a) * s, Math.sin(a) * s); } go(); },
      rain(n) { for (let i = 0; i < n; i++) add(Math.random() * w, -10 - Math.random() * h * .6, (Math.random() - .5) * 1.2, 1 + Math.random() * 2.5); go(); },
      petalBurst(x, y, n) { for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (Math.random() - .5) * 2, s = 3 + Math.random() * 6; addPetal(x, y, Math.cos(a) * s, Math.sin(a) * s); } go(); },
      petalRain(n) { for (let i = 0; i < n; i++) addPetal(Math.random() * w, -20 - Math.random() * h * .8, (Math.random() - .5) * 1, .5 + Math.random()); go(); }
    };
  })();

  /* the welcome couple throw rice from their hands */
  function toss(bw, n) {
    if (reduce || !bw) return;
    bw.classList.remove('toss'); void bw.offsetWidth; bw.classList.add('toss');
    setTimeout(() => {
      const hand = bw.querySelector('[data-hand]');
      if (!hand) return;
      const r = hand.getBoundingClientRect();
      Rice.burst(r.left + r.width / 2, r.top, n || (coarse ? 24 : 44));
    }, 360);
    setTimeout(() => bw.classList.remove('toss'), 1000);
  }
  function walk(list, ms) { list.forEach(b => b.classList.add('walking')); setTimeout(() => list.forEach(b => b.classList.remove('walking')), ms); }

  /* ── welcome: draw the muggu, walk in, open the doorway ─────────────────── */
  const gate = $('#gate'), gatePair = $('.gate-pair'), side = $('#sideWalk');
  /* ── background music: starts with "Step inside", the drum button pauses/plays ── */
  const Music = (function () {
    const audio = $('#bgm'), box = $('#music'), btn = $('#musicBtn'), tip = $('#musicTip');
    const KEY = 'bgm-off';
    let tipT = 0, fadeT = 0, wantOff = false;
    // the off choice lasts only for this visit — every new visit starts with music on
    try { wantOff = sessionStorage.getItem(KEY) === '1'; localStorage.removeItem(KEY); } catch (e) { /* storage unavailable */ }
    function say(text) { tip.textContent = text; tip.classList.add('show'); clearTimeout(tipT); tipT = setTimeout(() => tip.classList.remove('show'), 2200); }
    function show(playing) {
      box.classList.toggle('playing', playing);
      btn.setAttribute('aria-pressed', String(!playing));
      btn.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
    }
    function fadeTo(v, done) {
      clearInterval(fadeT);
      fadeT = setInterval(() => {
        const d = v - audio.volume;
        if (Math.abs(d) < .04) { audio.volume = v; clearInterval(fadeT); if (done) done(); }
        else audio.volume = Math.min(1, Math.max(0, audio.volume + Math.sign(d) * .04));
      }, 60);
    }
    function play(announce) {
      audio.volume = 0;
      const p = audio.play();
      const ok = () => { show(true); fadeTo(.55); if (announce) say('Music playing'); };
      if (p && p.then) p.then(ok).catch(() => { show(false); if (announce) say('Tap to play music'); });
      else ok();
    }
    function pause(announce) { show(false); fadeTo(0, () => audio.pause()); if (announce) say('Music paused'); }
    btn.addEventListener('click', () => {
      if (audio.paused || !box.classList.contains('playing')) { wantOff = false; play(true); }
      else { wantOff = true; pause(true); }
      try { sessionStorage.setItem(KEY, wantOff ? '1' : '0'); } catch (e) { /* ignore */ }
    });
    // pause while the tab is hidden, resume when back
    document.addEventListener('visibilitychange', () => {
      if (box.hidden || wantOff) return;
      if (document.hidden) audio.pause(); else if (box.classList.contains('playing')) audio.play().catch(() => show(false));
    });
    // if the browser blocked the start (no tap yet), begin on the guest's first tap anywhere
    const firstTap = e => {
      if (box.hidden || wantOff || box.classList.contains('playing')) { if (box.classList.contains('playing') || wantOff) stopWaiting(); return; }
      if (e.target.closest && e.target.closest('#musicBtn')) return;
      play(false);
    };
    const EVENTS = ['pointerdown', 'touchend', 'keydown'];
    const stopWaiting = () => EVENTS.forEach(ev => document.removeEventListener(ev, firstTap, true));
    return {
      start() {
        box.hidden = false;
        if (wantOff) { show(false); return; }
        play(false);
        EVENTS.forEach(ev => document.addEventListener(ev, firstTap, true));   // keep trying until it plays
      }
    };
  })();

  let opened = false;
  function afterOpen() { setTimeout(() => side.classList.add('on'), reduce ? 0 : 900); }
  function openGate() {
    if (opened) return; opened = true;
    Music.start();   // inside the tap on "Step inside", so the browser allows the music to begin
    gate.classList.add('drawing', 'dyed');
    $$('.bw', gatePair).forEach((b, i) => setTimeout(() => toss(b, coarse ? 30 : 60), i * 180));
    setTimeout(() => {
      toTop();
      gate.classList.add('open');
      root.classList.remove('locked');
      setTimeout(() => { Rice.petalRain(coarse ? 50 : 90); Rice.rain(coarse ? 50 : 90); }, 450);
      afterOpen();
    }, reduce ? 0 : 750);
    setTimeout(() => gate.classList.add('gone'), reduce ? 0 : 2700);
  }
  if (reduce) {
    gate.classList.add('drawing', 'dyed', 'gone'); gatePair.classList.add('in'); opened = true; afterOpen(); Music.start();
  } else {
    root.classList.add('locked');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      gate.classList.add('drawing');
      setTimeout(() => { gatePair.classList.add('in'); walk($$('.bw', gatePair), 2600); }, 300);
    }));
    setTimeout(() => gate.classList.add('dyed'), 1800);
    $('#enter').addEventListener('click', e => { e.stopPropagation(); openGate(); });
    gate.addEventListener('click', openGate);
    addEventListener('keydown', e => { if (!opened && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openGate(); } });
    // no auto-open: the guest's tap on "Step inside" is what lets the music start
    $('#enter').focus({ preventScroll: true });
  }

  /* hero: tap anywhere, or the button, to shower rice */
  $('#hero').addEventListener('click', e => {
    if (e.target.closest('a,button,.cu')) return;
    Rice.burst(e.clientX, e.clientY, coarse ? 36 : 64);
  });
  $('#shower').addEventListener('click', e => {
    const r = e.currentTarget.getBoundingClientRect();
    Rice.petalBurst(r.left + r.width / 2, r.top, coarse ? 40 : 70);
    Rice.burst(r.left + r.width / 2, r.top, coarse ? 30 : 50);
  });
  if (reduce) $('#shower').remove();

  /* ── rose petals drifting down over the hero, all the time ──────────────── */
  (function heroPetals() {
    const cv = $('#petals');
    const ctx = !reduce && cv.getContext && cv.getContext('2d');
    if (!ctx) { cv.remove(); return; }
    const hero = $('#hero'), P = [];
    const MAX = coarse ? 26 : 48;
    let w = 0, h = 0, dpr = 1, last = 0, raf = 0, visible = true;
    function fit() { dpr = Math.min(2, devicePixelRatio || 1); w = hero.offsetWidth; h = hero.offsetHeight; cv.width = w * dpr; cv.height = h * dpr; }
    fit(); addEventListener('resize', fit);
    function spawn(anywhere) {
      const depth = Math.random();                          // far petals are smaller, slower and softer
      P.push({ x: Math.random() * w, y: anywhere ? Math.random() * h : -20, vy: .35 + depth * .9, vx: (Math.random() - .5) * .4,
        l: 4 + depth * 8, a: Math.random() * 6.28, va: (Math.random() - .5) * .03, ph: Math.random() * 6.28, sp: .015 + Math.random() * .03,
        c: PETAL_COL[Math.random() * PETAL_COL.length | 0], o: .45 + depth * .55 });
    }
    for (let i = 0; i < MAX; i++) spawn(true);
    function frame(t) {
      const k = last ? Math.min(2.5, (t - last) / 16.7) : 1; last = t;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i];
        p.ph += p.sp * k; p.y += p.vy * k; p.x += (p.vx + Math.sin(p.ph) * .5) * k; p.a += p.va * k;
        if (p.y > h + 20) { P.splice(i, 1); continue; }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.translate(p.x, p.y); ctx.rotate(p.a);
        ctx.globalAlpha = p.o;
        drawPetal(ctx, p.l, p.c, Math.cos(p.ph * 1.4));
      }
      ctx.globalAlpha = 1;
      while (P.length < MAX) spawn(false);
      raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
    }
    raf = requestAnimationFrame(frame);
    const wake = () => { if (visible && !document.hidden && !raf) { last = 0; raf = requestAnimationFrame(frame); } };
    document.addEventListener('visibilitychange', wake);
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; wake(); }).observe(hero);
  })();

  /* ── the couple walking down the right side ─────────────────────────────── */
  const swPair = $('#swPair');
  swPair.innerHTML = `<div>${ART.bride()}</div><div class="groom">${ART.groom()}</div>` +
    '<svg class="sw-heart" viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21C5 15.5 1 12 1 7a5.5 5.5 0 0 1 11-1.4A5.5 5.5 0 0 1 23 7c0 5-4 8.5-11 14z" fill="#e0405a" stroke="#fff" stroke-width="1.4"/></svg>';
  function toggleHold() {
    const on = !swPair.classList.contains('holding');
    swPair.classList.toggle('holding', on);
    swPair.setAttribute('aria-pressed', String(on));
    if (on) {
      const heart = $('.sw-heart', swPair);   // replay the heart each time
      heart.style.animation = 'none'; void heart.getBoundingClientRect(); heart.style.animation = '';
    }
  }
  swPair.addEventListener('click', toggleHold);
  swPair.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleHold(); } });
  const track = document.createElement('div');
  track.className = 'sw-track';
  side.prepend(track);
  let prints = [];
  function layoutPrints() {
    prints.forEach(p => p.remove()); prints = [];
    const H = innerHeight, w = side.offsetWidth, n = Math.max(8, Math.round(H / 46));
    for (let i = 0; i < n; i++) {
      const left = i % 2 === 0, y = 70 + (H - 110) * i / (n - 1);
      const el = document.createElement('span');
      el.className = 'fp';
      el.style.left = (w / 2 + (left ? -7 : 7)).toFixed(1) + 'px';
      el.style.top = y.toFixed(1) + 'px';
      el.style.setProperty('--r', (180 + (left ? -8 : 8)) + 'deg');
      el.innerHTML = ART.foot(left);
      track.appendChild(el); prints.push(el);
    }
  }
  let walkTimer;
  function placeWalkers() {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const p = Math.min(1, Math.max(0, scrollY / max));
    const pairH = swPair.offsetHeight || side.offsetWidth;
    const top = 64, bottom = innerHeight - pairH - 92;   // stop above the music button
    const y = top + p * Math.max(0, bottom - top);
    swPair.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    const feetY = y + pairH;
    prints.forEach(fp => fp.classList.toggle('on', parseFloat(fp.style.top) < feetY - 14));
  }
  function stepOnScroll() {
    if (reduce) return;
    side.classList.add('walking');
    clearTimeout(walkTimer);
    walkTimer = setTimeout(() => side.classList.remove('walking'), 260);
  }

  /* ── one smoothed scroll loop: hero drift, top bar, walkers ─────────────── */
  const nav = $('#nav'), hero = $('#hero'), heroArt = $('#heroArt'), heroCopy = $('.hero-copy');
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  let queued = false;
  function paint() {
    queued = false;
    const hr = hero.getBoundingClientRect();
    const hy = Math.min(1, Math.max(0, -hr.top / Math.max(1, hr.height)));
    if (!reduce) {
      heroArt.style.transform = `translate3d(0, ${(hy * 16).toFixed(2)}%, 0)`;
      heroCopy.style.opacity = (1 - smooth(.05, .55, hy)).toFixed(3);
      heroCopy.style.transform = `translate3d(0, ${(hy * -50).toFixed(1)}px, 0)`;
    }
    nav.classList.toggle('solid', hr.bottom < 80);
    placeWalkers();
  }
  const kick = () => { if (!queued) { queued = true; requestAnimationFrame(paint); } };
  addEventListener('scroll', () => { kick(); stepOnScroll(); }, { passive: true });
  let rz;
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { toranam(); layoutPrints(); kick(); }, 150); });
  addEventListener('load', kick);
  layoutPrints(); paint();

  /* ── reveal on view: sections, the card opening, muggu ───────── */
  const show = el => el.classList.add('in');
  const watched = $$('.rv, [data-divider]');
  if (!('IntersectionObserver' in window) || reduce) watched.forEach(show);
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); show(e.target); } }), { rootMargin: '0px 0px -20% 0px' });
    watched.forEach(el => io.observe(el));
  }

  /* ── countdown to the muhurtham ─────────────────────────────────────────── */
  const target = new Date(W.muhurtham).getTime(), cells = $$('#count b');
  function tick() {
    const d = target - Date.now();
    if (d <= 0) { $('#countLabel').textContent = 'The muhurtham has arrived'; cells.forEach(c => { c.textContent = '00'; }); return; }
    const parts = [Math.floor(d / 864e5), Math.floor(d / 36e5) % 24, Math.floor(d / 6e4) % 60, Math.floor(d / 1e3) % 60];
    parts.forEach((v, i) => { const s = String(v).padStart(2, '0'); if (cells[i].textContent !== s) cells[i].textContent = s; });
  }
  tick(); setInterval(tick, 1000);

  /* ── calendar (.ics) ────────────────────────────────────────────────────── */
  const icsDate = iso => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const icsText = s => String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
  function downloadIcs(list, name) {
    const now = icsDate(new Date().toISOString());
    const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Pelli//Wedding//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
    list.forEach(e => L.push('BEGIN:VEVENT', `UID:${icsDate(e.start)}-${e.name.replace(/\W+/g, '')}@pelli`, `DTSTAMP:${now}`,
      `DTSTART:${icsDate(e.start)}`, `DTEND:${icsDate(e.end)}`, `SUMMARY:${icsText(e.name + ' · ' + couple)}`,
      ...(e.place ? [`LOCATION:${icsText(e.place === W.venue.name ? W.venue.name + ', ' + W.venue.address : e.place)}`] : []),
      `DESCRIPTION:${icsText(e.desc)}`, 'END:VEVENT'));
    L.push('END:VCALENDAR');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([L.join('\r\n')], { type: 'text/calendar;charset=utf-8' }));
    a.download = name.replace(/[^\w-]+/g, '-') + '.ics';
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  }
  $('#evGrid').addEventListener('click', e => { const b = e.target.closest('[data-cal]'); if (b) downloadIcs([W.events[+b.dataset.cal]], W.events[+b.dataset.cal].name); });
  $('#saveAll').addEventListener('click', () => downloadIcs([W.events.find(e => e.start === W.muhurtham) || W.events[0]], `${W.bride}-${W.groom}-wedding`));

  /* ── lightbox: the card ─────────────────────────────────────────────────── */
  const lb = $('#lb');
  const sets = {
    c: [{ html: `<img src="${W.card.inside}" alt="Inside of the wedding card">`, cap: 'Wedding invitation', kind: 'photo' },
        { html: `<img src="${W.card.front}" alt="Front of the wedding card">`, cap: 'The card', kind: 'photo' }]
  };
  let set = sets.c, gi = 0, lastFocus = null;
  function showItem(i) {
    gi = (i + set.length) % set.length;
    const art = $('.lb-art', lb);
    art.className = 'lb-art ' + set[gi].kind;
    art.innerHTML = set[gi].html;
    $('figcaption', lb).textContent = set[gi].cap;
  }
  function openLb(which, i) { set = sets[which]; lastFocus = document.activeElement; showItem(i); lb.hidden = false; requestAnimationFrame(() => lb.classList.add('on')); root.classList.add('locked'); $('.lb-x', lb).focus(); }
  function closeLb() { lb.classList.remove('on'); root.classList.remove('locked'); setTimeout(() => { lb.hidden = true; }, 300); if (lastFocus) lastFocus.focus(); }
  $$('[data-img]').forEach(b => b.addEventListener('click', () => openLb('c', +b.dataset.img)));

  /* ── "Open Card": a full-screen view where the front cover swings open ──── */
  const modal = $('#cardModal'), book = $('#lekha'), turn = $('#cmTurn');
  let modalFocus = null, openT = 0;
  function setBook(open) {
    clearTimeout(openT);
    book.classList.remove('done');
    book.classList.toggle('open', open);
    turn.textContent = open ? 'Close the card' : 'Open the card';
    if (open) openT = setTimeout(() => book.classList.add('done'), reduce ? 0 : 2000);
  }
  function openCard() {
    modalFocus = document.activeElement;
    setBook(false);
    modal.hidden = false;
    root.classList.add('locked');
    requestAnimationFrame(() => modal.classList.add('on'));
    setTimeout(() => setBook(true), reduce ? 0 : 650);   // let it appear closed, then open it
    $('.cm-x', modal).focus();
  }
  function closeCard() {
    modal.classList.remove('on');
    root.classList.remove('locked');
    setTimeout(() => { modal.hidden = true; setBook(false); }, 350);
    if (modalFocus) modalFocus.focus();
  }
  $$('[data-opencard]').forEach(b => b.addEventListener('click', openCard));
  $('.cm-x', modal).addEventListener('click', closeCard);
  turn.addEventListener('click', () => setBook(!book.classList.contains('open')));
  book.addEventListener('click', () => setBook(!book.classList.contains('open')));
  modal.addEventListener('click', e => { if (e.target === modal) closeCard(); });
  addEventListener('keydown', e => { if (!modal.hidden && e.key === 'Escape') closeCard(); });
  $('.lb-x', lb).addEventListener('click', closeLb);
  $('.lb-prev', lb).addEventListener('click', () => showItem(gi - 1));
  $('.lb-next', lb).addEventListener('click', () => showItem(gi + 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') showItem(gi - 1);
    if (e.key === 'ArrowRight') showItem(gi + 1);
  });
  let sx = null;
  lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) showItem(gi + (dx < 0 ? 1 : -1)); sx = null; });

  /* ── share the invitation ──────────────────────────────────────────────────
     "Share invitation" opens the phone's own share sheet (WhatsApp, Instagram, SMS…)
     with the message and link; the link then shows the poster preview.
     Where that isn't available (most desktops) it falls back to WhatsApp. */
  (function share() {
    const S = W.share; if (!S || !$('#share')) return;
    const note = $('#shareNote');
    const waUrl = 'https://wa.me/?text=' + encodeURIComponent(S.message);
    $('#shareWa').href = waUrl;
    let noteT = 0;
    const say = t => { note.textContent = t; clearTimeout(noteT); noteT = setTimeout(() => { note.textContent = ''; }, 3500); };
    async function copy() {
      try { await navigator.clipboard.writeText(S.message); say('Message copied — paste it anywhere to share ❤️'); }
      catch (e) {
        const ta = document.createElement('textarea'); ta.value = S.message; ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); say('Message copied — paste it anywhere to share ❤️'); } catch (e2) { say('Could not copy — please use WhatsApp instead'); }
        ta.remove();
      }
    }
    // on phones, share the HD poster itself as a photo with the message as its caption (crisp in chats);
    // the file is fetched ahead of time so the share sheet opens straight from the tap
    let posterFile = null;
    const loadPoster = () => {
      if (posterFile || !window.File || !navigator.canShare) return;
      fetch('assets/poster-hd.jpg').then(r => r.ok ? r.blob() : null).then(b => {
        if (!b) return;
        const file = new File([b], 'Reena-Deekshith-Wedding-Invitation.jpg', { type: 'image/jpeg' });
        if (navigator.canShare({ files: [file], text: S.message })) posterFile = file;
      }).catch(() => {});
    };
    if ('IntersectionObserver' in window) {
      const po = new IntersectionObserver(es => { if (es[0].isIntersecting) { po.disconnect(); loadPoster(); } }, { rootMargin: '600px' });
      po.observe($('#share'));
    } else loadPoster();

    $('#shareNow').addEventListener('click', async () => {
      if (!navigator.share) { window.open(waUrl, '_blank', 'noopener'); return; }
      try {
        if (posterFile) await navigator.share({ files: [posterFile], title: S.title, text: S.message });
        else await navigator.share({ title: S.title, text: S.message });
      } catch (e) {
        if (e && e.name === 'AbortError') return;          // they closed the share sheet
        try { await navigator.share({ title: S.title, text: S.message }); }   // some apps refuse files — send text + link
        catch (e2) { if (e2 && e2.name !== 'AbortError') window.open(waUrl, '_blank', 'noopener'); }
      }
    });
    $('#shareCopy').addEventListener('click', copy);
  })();

  /* ── map (loads only when near) ─────────────────────────────────────────── */
  const mapBox = $('#map');
  const loadMap = () => { if (mapBox.firstChild) return; mapBox.innerHTML = `<iframe title="Map to ${esc(W.venue.name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${encodeURIComponent(W.venue.mapQuery)}&z=15&output=embed"></iframe>`; };
  if ('IntersectionObserver' in window) { const mo = new IntersectionObserver(es => { if (es[0].isIntersecting) { mo.disconnect(); loadMap(); } }, { rootMargin: '400px' }); mo.observe(mapBox); } else loadMap();
})();
