/**
 * boot.js — Cinematic boot sequence
 * Calls initScrollObserver() and startTour() (utils.js / tour.js)
 * after reveal — both are guaranteed loaded before this file runs.
 */
(function Boot() {
  const screen     = document.getElementById('boot-screen');
  const terminal   = document.getElementById('boot-terminal');
  const framesRow  = document.getElementById('boot-frames-row');
  const faultFlash = document.getElementById('boot-fault-flash');
  const barFill    = document.getElementById('boot-bar-fill');
  const barPct     = document.getElementById('boot-bar-pct');

  const LINES = [
    { t:'> MEMOS OS v2.0 — Memory Management Unit', d:0,    c:'#00c8ff' },
    { t:'> Booting kernel...',                       d:300,  c:'#94a3b8' },
    { t:'  [████████████████] kernel         OK',   d:600,  c:'#00ff88' },
    { t:'> Initializing FIFO page handler... OK',   d:900,  c:'#00ff88' },
    { t:'> Initializing LRU algorithm...     OK',   d:1150, c:'#00ff88' },
    { t:'> Initializing Optimal predictor... OK',   d:1380, c:'#00ff88' },
    { t:'> Initializing Clock handler...     OK',   d:1560, c:'#ffcc00' },
    { t:'> Allocating 3 memory frames...',           d:1600, c:'#ffcc00' },
  ];

  function typeLines() {
    LINES.forEach(l => setTimeout(() => {
      const d = document.createElement('div');
      d.className = 'boot-line'; d.style.color = l.c; d.textContent = l.t;
      terminal.appendChild(d); terminal.scrollTop = terminal.scrollHeight;
    }, l.d));
  }

  function animateFrames() {
    framesRow.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const f = document.createElement('div');
      f.className = 'boot-frame'; f.id = `bf-${i}`;
      f.innerHTML = `<span class="bf-label">F${i+1}</span><span class="bf-val">—</span>`;
      framesRow.appendChild(f);
      setTimeout(() => {
        f.classList.add('active');
        let t = 0;
        const iv = setInterval(() => {
          f.querySelector('.bf-val').textContent = Math.floor(Math.random()*9);
          if (++t > 14) { clearInterval(iv); f.querySelector('.bf-val').textContent = i+1; f.classList.add('loaded'); }
        }, 55);
      }, 1950 + i*260);
    }
  }

  function animateBar() {
    let pct = 0;
    const iv = setInterval(() => {
      pct += 1.1; if (pct >= 100) { pct = 100; clearInterval(iv); }
      barFill.style.width = pct + '%'; barPct.textContent = Math.floor(pct) + '%';
    }, 28);
  }

  function faultSequence() {
    faultFlash.textContent = '⚠ PAGE FAULT DETECTED'; faultFlash.style.color = '#ff3366'; faultFlash.classList.add('active');
    setTimeout(() => faultFlash.classList.remove('active'), 650);
    setTimeout(() => { faultFlash.textContent = '✓ SYSTEM READY'; faultFlash.style.color = '#00ff88'; faultFlash.classList.add('active'); }, 950);
  }

  function reveal() {
    screen.style.transition = 'opacity .7s ease'; screen.style.opacity = '0';
    setTimeout(() => {
      screen.style.display = 'none';
      document.body.classList.add('site-ready');
      if (typeof initScrollObserver === 'function') initScrollObserver();
      if (!localStorage.getItem('memos_tour_done') && typeof startTour === 'function') startTour();
    }, 700);
  }

  function run() {
    typeLines(); animateFrames(); animateBar();
    setTimeout(faultSequence, 2600);
    setTimeout(reveal,        3900);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
