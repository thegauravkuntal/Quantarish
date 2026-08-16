(function () {
  'use strict';

  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

  /* ---------- Navbar scroll state ---------- */
  var nav = document.querySelector('.navbar');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var menuClose = document.getElementById('menuClose');
  var menu = document.getElementById('mobileMenu');
  var overlay = document.getElementById('menuOverlay');

  function openMenu() {
    if (menu) menu.classList.remove('translate-x-full');
    if (overlay) overlay.classList.remove('hidden');
    if (overlay) overlay.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (menu) menu.classList.add('translate-x-full');
    if (overlay) { overlay.classList.add('hidden'); overlay.classList.remove('flex'); }
    document.body.style.overflow = '';
  }
  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1800;
    var start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ================================================================
     PREMIUM 3D + MOTION LAYER  (UI-only, no content changes)
     ================================================================ */

  /* ---------- Preloader ---------- */
  if (!rm) {
    var pre = document.createElement('div');
    pre.id = 'preloader';
    pre.innerHTML = '<div class="pre-ring"><img class="pre-logo" src="/imgs/logo.jpg" alt="Quantaris Group" /></div>';
    document.body.appendChild(pre);
    document.body.style.overflow = 'hidden';
    var preDone = false;
    function hidePre() {
      if (preDone) return;
      preDone = true;
      pre.classList.add('hide');
      document.body.style.overflow = '';
      setTimeout(function () { if (pre.parentNode) pre.parentNode.removeChild(pre); }, 700);
    }
    window.addEventListener('load', hidePre);
    setTimeout(hidePre, 1400);
  }

  /* ---------- Cinematic page transitions ---------- */
  if (!rm) {
    var curtain = document.createElement('div');
    curtain.id = 'page-transition';
    document.body.appendChild(curtain);
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest('a') : null;
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || a.target === '_blank') return;
      if (/^[a-z]+:/i.test(href)) return;
      if (href.indexOf('http') === 0 || href.indexOf('//') === 0) return;
      e.preventDefault();
      curtain.classList.add('active');
      setTimeout(function () { window.location.href = href; }, 400);
    });
  }

  /* ---------- Scroll progress bar ---------- */
  var prog = document.createElement('div');
  prog.id = 'scroll-progress';
  document.body.appendChild(prog);
  var docEl = document.documentElement;
  function updProg() {
    var h = docEl.scrollHeight - window.innerHeight;
    prog.style.transform = 'scaleX(' + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ')';
  }
  window.addEventListener('scroll', updProg, { passive: true });
  updProg();

  /* ---------- Cursor glow ---------- */
  if (fine && !rm) {
    var glow = document.createElement('div');
    glow.id = 'cursor-glow';
    document.body.appendChild(glow);
    var cgx = window.innerWidth / 2, cgy = window.innerHeight / 2, tgx = cgx, tgy = cgy;
    document.addEventListener('mousemove', function (e) { cgx = e.clientX; cgy = e.clientY; }, { passive: true });
    (function glowLoop() {
      tgx += (cgx - tgx) * 0.12;
      tgy += (cgy - tgy) * 0.12;
      glow.style.transform = 'translate3d(' + tgx.toFixed(1) + 'px,' + tgy.toFixed(1) + 'px,0)';
      requestAnimationFrame(glowLoop);
    })();
    document.addEventListener('mousemove', function () { glow.classList.add('on'); }, { once: true });
  }

  /* ---------- Aurora ambient background ---------- */
  if (!rm) {
    var aurora = document.createElement('div');
    aurora.className = 'aurora';
    document.body.insertBefore(aurora, document.body.firstChild);
  }

  /* ---------- Video-universe starfield (homepage only) ---------- */
  var pagePath = window.location.pathname || '';
  var isHome = pagePath === '/' || pagePath === '' ||
    /index\.html$/i.test(pagePath) || !/\.[a-z0-9]{2,5}$/i.test(pagePath);
  if (isHome) {
    var uni = document.createElement('canvas');
    uni.id = 'universe';
    document.body.appendChild(uni);
    var uctx = uni.getContext('2d');
    var stars = [], UW = 0, UH = 0;
    var coarse2 = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    function sizeUni() {
      UW = window.innerWidth; UH = window.innerHeight;
      var d = Math.min(window.devicePixelRatio || 1, 2);
      uni.width = UW * d; uni.height = UH * d;
      uctx.setTransform(d, 0, 0, d, 0, 0);
      stars = [];
      var n = Math.min(coarse2 ? 55 : 140, Math.round((UW * UH) / 11000));
      for (var i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * UW,
          y: Math.random() * UH,
          r: 0.4 + Math.random() * 1.1,
          a: 0.22 + Math.random() * 0.6,
          sp: 0.4 + Math.random() * 1.8,
          ph: Math.random() * Math.PI * 2,
          v: 0.02 + Math.random() * 0.1,
          dp: 0.15 + Math.random() * 0.85
        });
      }
    }
    sizeUni();
    window.addEventListener('resize', sizeUni);

    var umx = 0, umy = 0;
    if (window.matchMedia('(pointer: fine)').matches) {
      document.addEventListener('mousemove', function (e) {
        umx = e.clientX / UW - 0.5;
        umy = e.clientY / UH - 0.5;
      }, { passive: true });
    }

    var shooting = { active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0 };
    var nextShot = 2200 + Math.random() * 4000;

    function drawUniverse(t) {
      uctx.clearRect(0, 0, UW, UH);
      var i, s;
      for (i = 0; i < stars.length; i++) {
        s = stars[i];
        s.x += s.v;
        if (s.x > UW + 2) s.x = -2;
        if (s.x < -2) s.x = UW + 2;
        var tw = 0.55 + 0.45 * Math.sin(t * s.sp + s.ph);
        var px = s.x - umx * 16 * s.dp;
        var py = s.y - umy * 12 * s.dp;
        uctx.beginPath();
        uctx.arc(px, py, s.r, 0, Math.PI * 2);
        uctx.fillStyle = 'rgba(124, 176, 247, ' + (s.a * tw).toFixed(3) + ')';
        uctx.fill();
      }
      nextShot -= 16.7;
      if (!shooting.active && nextShot <= 0) {
        shooting.active = true;
        shooting.x = UW * 0.2 + Math.random() * UW * 0.6;
        shooting.y = UH * 0.05 + Math.random() * UH * 0.2;
        shooting.vx = -(3 + Math.random() * 3);
        shooting.vy = 2 + Math.random() * 2.5;
        shooting.life = 0;
        nextShot = 3200 + Math.random() * 5000;
      }
      if (shooting.active) {
        shooting.x += shooting.vx;
        shooting.y += shooting.vy;
        shooting.life++;
        var tail = 14;
        var g = uctx.createLinearGradient(shooting.x, shooting.y, shooting.x - shooting.vx * tail, shooting.y - shooting.vy * tail);
        g.addColorStop(0, 'rgba(190, 218, 255, 0.9)');
        g.addColorStop(1, 'rgba(22, 127, 219, 0)');
        uctx.strokeStyle = g;
        uctx.lineWidth = 1.6;
        uctx.lineCap = 'round';
        uctx.beginPath();
        uctx.moveTo(shooting.x, shooting.y);
        uctx.lineTo(shooting.x - shooting.vx * tail, shooting.y - shooting.vy * tail);
        uctx.stroke();
        if (shooting.life > 70) shooting.active = false;
      }
    }

    if (rm) { drawUniverse(0); }
    else {
      (function uniLoop(t) { drawUniverse(t || 0); requestAnimationFrame(uniLoop); })();
    }
  }

  /* ---------- Hero cinematic zoom-out on scroll (homepage) ---------- */
  if (isHome && !rm) {
    var heroSec = document.querySelector('h1');
    if (heroSec) heroSec = heroSec.closest('section');
    if (heroSec) {
      function heroZoom() {
        var h = heroSec.offsetHeight || 1;
        var p = Math.min(window.scrollY / h, 1);
        heroSec.style.transform = 'scale(' + (1 - p * 0.05).toFixed(3) + ')';
        heroSec.style.opacity = (1 - p * 0.55).toFixed(3);
      }
      window.addEventListener('scroll', heroZoom, { passive: true });
      heroZoom();
    }
  }

  /* ---------- Hero background video (homepage) ---------- */
  if (isHome && !rm) {
    var heroSec2 = document.querySelector('h1');
    if (heroSec2) heroSec2 = heroSec2.closest('section');
    if (heroSec2) {
      var vidWrap = document.createElement('div');
      vidWrap.className = 'hero-video-bg';
      vidWrap.innerHTML =
        '<div class="hero-video-overlay"></div>' +
        '<video muted loop playsinline preload="auto" aria-hidden="true" tabindex="-1" disablepictureinpicture disableremoteplayback>' +
        '<source src="/imgs/172528-847499874.mp4" type="video/mp4" />' +
        '<source src="imgs/172528-847499874.mp4" type="video/mp4" /></video>';
      heroSec2.insertBefore(vidWrap, heroSec2.firstChild);
      var heroVideo = vidWrap.querySelector('video');
      var srcs = heroVideo.querySelectorAll('source');
      var si = 0;
      function tryPlay() {
        var pr = heroVideo.play();
        if (pr && pr.catch) pr.catch(function () {});
      }
      heroVideo.addEventListener('canplay', function () {
        vidWrap.classList.add('ready');
        tryPlay();
      }, { once: true });
      heroVideo.addEventListener('error', function () {
        si++;
        if (si < srcs.length) {
          heroVideo.src = srcs[si].getAttribute('src');
          heroVideo.load();
        }
      }, true);
      if (heroVideo.readyState >= 2) vidWrap.classList.add('ready');
      tryPlay();
      var kickStart = function () { tryPlay(); };
      document.addEventListener('click', kickStart, { once: true });
      document.addEventListener('touchstart', kickStart, { once: true });
      document.addEventListener('keydown', kickStart, { once: true });
    }
  }

  /* ---------- Hero typewriter (homepage) ---------- */
  if (isHome) {
    var typer = document.getElementById('heroTyper');
    if (typer) {
      var typeLines = [
        'Transform Your Business with Intelligent AI',
        'Smarter Strategy. Powerful Technology. Real Growth.',
        'Building the Future of Business with AI'
      ];
      var heroCaret = document.getElementById('heroCaret');
      if (rm) {
        typer.innerHTML = typeLines.join('<br>');
        if (heroCaret) heroCaret.style.display = 'none';
      } else {
        var tLi = 0, tPos = 0, tDel = false, tTimer = null;
        (function typeStep() {
          var line = typeLines[tLi];
          if (!tDel) {
            tPos++;
            typer.textContent = line.slice(0, tPos);
            if (tPos >= line.length) {
              tDel = true;
              tTimer = setTimeout(typeStep, 2200);
            } else {
              tTimer = setTimeout(typeStep, 55);
            }
          } else {
            tPos--;
            typer.textContent = line.slice(0, tPos);
            if (tPos <= 0) {
              tDel = false;
              tLi = (tLi + 1) % typeLines.length;
              tTimer = setTimeout(typeStep, 600);
            } else {
              tTimer = setTimeout(typeStep, 28);
            }
          }
        })();
      }
    }
  }

  /* ---------- Blue cursor trail (fine pointers) ---------- */
  if (fine && !rm) {
    var trail = document.createElement('canvas');
    trail.id = 'cursor-trail';
    document.body.appendChild(trail);
    var tctx = trail.getContext('2d');
    var TW = 0, TH = 0;
    function sizeTrail() {
      TW = window.innerWidth; TH = window.innerHeight;
      var d = Math.min(window.devicePixelRatio || 1, 2);
      trail.width = TW * d; trail.height = TH * d;
      tctx.setTransform(d, 0, 0, d, 0, 0);
    }
    sizeTrail();
    window.addEventListener('resize', sizeTrail);

    var parts = [];
    var palette = ['22,127,219', '77,148,239', '124,176,247', '94,167,242', '234,243,254'];
    function spawn(x, y) {
      var n = 2 + Math.floor(Math.random() * 2);
      for (var i = 0; i < n && parts.length < 170; i++) {
        var ang = Math.random() * Math.PI * 2;
        var spd = 0.4 + Math.random() * 1.6;
        parts.push({
          x: x, y: y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          r: 1.2 + Math.random() * 2.6,
          life: 0,
          max: 32 + Math.random() * 30,
          c: palette[(Math.random() * palette.length) | 0]
        });
      }
    }
    document.addEventListener('mousemove', function (e) { spawn(e.clientX, e.clientY); }, { passive: true });
    (function trailLoop() {
      tctx.clearRect(0, 0, TW, TH);
      tctx.globalCompositeOperation = 'lighter';
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.life++;
        if (p.life >= p.max) { parts.splice(i, 1); continue; }
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.96; p.vy *= 0.96;
        var k = 1 - p.life / p.max;
        tctx.beginPath();
        tctx.arc(p.x, p.y, p.r * k + 0.3, 0, Math.PI * 2);
        tctx.fillStyle = 'rgba(' + p.c + ',' + (k * 0.5).toFixed(3) + ')';
        tctx.fill();
      }
      tctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(trailLoop);
    })();
  }

  /* ---------- bg-glow parallax (mouse + scroll depth) ---------- */
  var bgGlow = document.querySelector('.bg-glow');
  if (bgGlow && !rm) {
    var mx = 0, my = 0, px = 0, py = 0;
    if (fine) {
      document.addEventListener('mousemove', function (e) {
        mx = e.clientX / window.innerWidth - 0.5;
        my = e.clientY / window.innerHeight - 0.5;
      }, { passive: true });
    }
    (function bgLoop() {
      px += (mx - px) * 0.05;
      py += (my - py) * 0.05;
      bgGlow.style.transform =
        'scale(1.08) translate3d(' + (px * 22).toFixed(1) + 'px,' + (py * 18 - window.scrollY * 0.006).toFixed(1) + 'px,0)';
      requestAnimationFrame(bgLoop);
    })();
  }

  /* ---------- Word-by-word heading reveals ---------- */
  function splitHeading(el) {
    var nodes = [];
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue && node.nodeValue.trim()) nodes.push(node);
    }
    if (!nodes.length) return;
    var idx = 0;
    nodes.forEach(function (tn) {
      var frag = document.createDocumentFragment();
      tn.nodeValue.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
        var w = document.createElement('span');
        w.className = 'wv-word';
        w.style.setProperty('--i', idx++);
        var inner = document.createElement('span');
        inner.className = 'wv-inner';
        inner.textContent = part;
        w.appendChild(inner);
        frag.appendChild(w);
      });
      tn.parentNode.replaceChild(frag, tn);
    });
    el.classList.add('words-animated');
  }

  var headings = document.querySelectorAll('h1, h2');
  if (headings.length) {
    headings.forEach(splitHeading);
    var wsEls = document.querySelectorAll('.words-animated');
    if ('IntersectionObserver' in window && wsEls.length) {
      var wo = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('ws-in');
            wo.unobserve(en.target);
          }
        });
      }, { threshold: 0.1 });
      wsEls.forEach(function (el) { wo.observe(el); });
      setTimeout(function () {
        document.querySelectorAll('.words-animated:not(.ws-in)').forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight * 1.15 && r.bottom > -60) el.classList.add('ws-in');
        });
      }, 1200);
      setTimeout(function () {
        document.querySelectorAll('.words-animated:not(.ws-in)').forEach(function (el) {
          el.classList.add('ws-in');
        });
      }, 6000);
    } else {
      wsEls.forEach(function (el) { el.classList.add('ws-in'); });
    }
  }

  /* ---------- 3D tilt cards ---------- */
  if (fine && !rm) {
    document.querySelectorAll('.card').forEach(function (card) {
      if (card.querySelector('form, iframe, video, canvas')) return;
      if (card.closest('#mobileMenu')) return;
      card.classList.add('tilt-card');
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var rx = (e.clientX - r.left) / r.width - 0.5;
        var ry = (e.clientY - r.top) / r.height - 0.5;
        var strength = Math.min(1, 420 / Math.max(r.width, 320));
        card.style.setProperty('--mx', (rx * 100 + 50) + '%');
        card.style.setProperty('--my', (ry * 100 + 50) + '%');
        card.style.transform =
          'perspective(900px) rotateY(' + (rx * 9 * strength).toFixed(2) + 'deg) rotateX(' +
          (-ry * 8 * strength).toFixed(2) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------- Back to top ---------- */
  var toTop = document.createElement('button');
  toTop.id = 'backToTop';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
  document.body.appendChild(toTop);
  window.addEventListener('scroll', function () {
    toTop.classList.toggle('show', window.scrollY > 650);
  }, { passive: true });
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: rm ? 'auto' : 'smooth' });
  });
})();
