/* ============================================
   HALAMAN 1 — logika amplop + kunci PIN
   ============================================ */
(function () {
  'use strict';

  /* --- PIN: disimpan dalam bentuk hash, bukan teks biasa ---
     Untuk mengganti PIN: ubah nilai di bawah dengan hash PIN baru
     (jalankan hash("safa:PINBARU") di console). */
  const PIN_LENGTH = 6;
  const PIN_HASH = 'd7h2790i8g';
  const MAX_TRIES_BEFORE_NOTICE = 2;

  function hash(str, seed) {
    seed = seed || 7;
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }
  window.hash = hash;

  const $ = (id) => document.getElementById(id);
  const envelope = $('envelope');
  const fade = $('pageFade');
  const heartsBg = $('heartsBg');
  const overlay = $('pinOverlay');
  const card = $('pinCard');
  const dots = $('pinDots');
  const msg = $('pinMsg');
  const toast = $('toastWrong');
  const EMOJIS = ['💖', '💗', '💕', '🌸', '💝', '✨', '🎀'];

  /* ---------- Hati melayang di latar ---------- */
  function spawnHeart() {
    const el = document.createElement('span');
    el.className = 'float-heart';
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = 14 + Math.random() * 26 + 'px';
    const dur = 6 + Math.random() * 6;
    el.style.animationDuration = dur + 's';
    heartsBg.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000);
  }
  for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 250);
  setInterval(spawnHeart, 700);

  /* ---------- Buka amplop lalu pindah halaman ---------- */
  let opened = false;
  function openEnvelope() {
    if (opened) return;
    opened = true;
    envelope.classList.add('opened');
    try {
      sessionStorage.setItem('fromEnvelope', '1');
      sessionStorage.setItem('unlocked', '1');
    } catch (e) {}
    for (let i = 0; i < 14; i++) setTimeout(spawnHeart, i * 60);
    setTimeout(() => fade.classList.add('show'), 2300);
    setTimeout(() => { window.location.href = 'main.html'; }, 3100);
  }

  /* ---------- Kunci PIN ---------- */
  let entered = '';
  let wrongCount = 0;
  let busy = false;

  function renderDots(state) {
    [...dots.children].forEach((d, i) => d.classList.toggle('filled', i < entered.length));
    dots.classList.remove('error', 'ok');
    if (state) dots.classList.add(state);
  }

  function showPin() {
    if (opened) return;
    entered = ''; busy = false;
    msg.textContent = ''; msg.className = 'pin-msg';
    renderDots();
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
  }
  function hidePin() {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
  }

  function check() {
    busy = true;
    if (hash('safa:' + entered) === PIN_HASH) {
      renderDots('ok');
      msg.textContent = 'PIN benar! Selamat membuka 💖';
      msg.className = 'pin-msg ok';
      setTimeout(() => { hidePin(); openEnvelope(); }, 700);
      return;
    }
    wrongCount++;
    renderDots('error');
    card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
    if (navigator.vibrate) navigator.vibrate(200);

    if (wrongCount >= MAX_TRIES_BEFORE_NOTICE) {
      wrongCount = 0;               // beri kesempatan lagi
      msg.textContent = 'PIN salah 😢';
      setTimeout(() => toast.classList.add('show'), 450);
    } else {
      msg.textContent = 'PIN salah, coba lagi ya 🥺';
    }
    setTimeout(() => {
      entered = ''; busy = false; renderDots();
    }, 700);
  }

  function press(k) {
    if (busy || !overlay.classList.contains('show') || toast.classList.contains('show')) return;
    if (k === 'clear') { entered = ''; }
    else if (k === 'back') { entered = entered.slice(0, -1); }
    else if (/^\d$/.test(k) && entered.length < PIN_LENGTH) { entered += k; }
    else return;
    msg.textContent = ''; msg.className = 'pin-msg';
    renderDots();
    if (entered.length === PIN_LENGTH) setTimeout(check, 180);
  }

  $('keypad').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-k]');
    if (b) press(b.dataset.k);
  });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('show')) return;
    if (e.key === 'Escape') { if (toast.classList.contains('show')) toast.classList.remove('show'); else hidePin(); }
    else if (e.key === 'Backspace') press('back');
    else if (/^\d$/.test(e.key)) press(e.key);
  });

  $('pinClose').addEventListener('click', hidePin);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) hidePin(); });
  $('toastOk').addEventListener('click', () => { toast.classList.remove('show'); });

  // Klik amplop -> minta PIN dulu
  envelope.addEventListener('click', showPin);
})();
