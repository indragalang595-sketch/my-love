/* ============================================
   HALAMAN 2 — logika halaman utama
   ✏️  Edit bagian KONFIGURASI di bawah untuk
       mengganti pesan, foto, dan alasan.
   ============================================ */

/* ---------- KONFIGURASI (boleh diedit) ---------- */
const CONFIG = {
  // Pesan ucapan (ketikan otomatis). Gunakan \n untuk baris baru.
  pesan:
`Selamat ulang tahun, sayangku Safa Azahra! 🎂💕

Hari ini dunia lebih indah karena kamu lahir ke dunia. Terima kasih sudah jadi orang yang selalu ada, yang bikin aku tersenyum bahkan di hari yang paling berat.

Semoga di umur yang baru ini kamu selalu sehat, bahagia, dilimpahi rezeki, dan semua impianmu satu per satu jadi nyata.

Aku sayang kamu, hari ini dan selamanya. 💗`,

  // Foto galeri: tambah baris baru untuk menambah foto
  // (letakkan file di folder assets/img/)
  galeri: [
    { src: 'assets/img/galeri-kiri.jpg', caption: 'Manis banget 🌸',      rot: -4, pos: '50% 10%' },
    { video: 'assets/video/kenangan.mp4', poster: 'assets/img/video-poster.jpg', caption: 'Kenangan kita 🎬💞', rot: -1 },
    { src: 'assets/img/galeri-kanan.jpg', caption: 'Senyum manismu 💕',    rot:  4, pos: '50% 15%' }
  ],

  // Alasan menyayangimu
  alasan: [
    'Senyummu bikin hariku cerah',
    'Kamu selalu bikin aku merasa tenang',
    'Kamu lucu, manis, dan apa adanya',
    'Bersamamu, semuanya terasa lebih indah',
    'Karena kamu adalah kamu 💞'
  ],

  harapan: 'Semoga semua harapanmu terkabul! ✨',

  // Nomor WhatsApp tujuan pesan (format internasional tanpa + atau 0 di depan)
  whatsapp: '6285868764823'
};

/* ---------- Penjaga PIN: halaman ini hanya bisa dibuka setelah PIN benar ---------- */
(function guard() {
  let ok = false;
  try { ok = sessionStorage.getItem('unlocked') === '1'; } catch (e) { ok = true; }
  if (!ok) window.location.replace('index.html');
})();

/* ---------- Helper ---------- */
const $ = (id) => document.getElementById(id);
const rand = (a, b) => a + Math.random() * (b - a);

/* ============================================
   1. MUSIK LATAR
   ============================================ */
(function music() {
  const audio = $('bgm');
  const btn = $('musicBtn');
  const toast = $('musicToast');
  audio.volume = 0.7;

  // Lanjutkan dari posisi terakhir bila ada
  try {
    const t = parseFloat(sessionStorage.getItem('bgmTime'));
    if (!isNaN(t)) audio.currentTime = t;
  } catch (e) {}

  function ui(playing) {
    btn.classList.toggle('playing', playing);
    btn.classList.toggle('paused', !playing);
    btn.textContent = playing ? '🎵' : '🔇';
  }

  function tryPlay() {
    return audio.play().then(() => { ui(true); toast.classList.remove('show'); return true; })
                       .catch(() => { ui(false); return false; });
  }

  // Coba putar otomatis; bila diblokir browser, mulai pada interaksi pertama
  tryPlay().then((ok) => {
    if (ok) return;
    toast.classList.add('show');
    const start = () => {
      tryPlay().then((ok2) => { if (ok2) cleanup(); });
    };
    const events = ['click', 'touchstart', 'keydown', 'scroll', 'wheel'];
    const cleanup = () => events.forEach((e) => window.removeEventListener(e, start));
    events.forEach((e) => window.addEventListener(e, start, { passive: true }));
  });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) tryPlay(); else { audio.pause(); ui(false); }
  });

  window.addEventListener('pagehide', () => {
    try { sessionStorage.setItem('bgmTime', audio.currentTime); } catch (e) {}
  });
})();

/* ============================================
   2. HATI & BALON MELAYANG
   ============================================ */
(function floaters() {
  const hearts = $('heartsBg');
  const balloons = $('balloons');
  const EMOJIS = ['💖', '💗', '💕', '🌸', '💝', '✨', '🎀', '⭐'];
  const COLORS = ['#ff7eb3', '#ffa6c9', '#ff4d94', '#e9d5ff', '#ffe58f', '#ffd8c2', '#ffc9de'];

  function heart() {
    const el = document.createElement('span');
    el.className = 'float-heart';
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    el.style.left = rand(0, 100) + 'vw';
    el.style.fontSize = rand(14, 34) + 'px';
    const d = rand(6, 12);
    el.style.animationDuration = d + 's';
    hearts.appendChild(el);
    setTimeout(() => el.remove(), d * 1000);
  }
  function balloon() {
    const el = document.createElement('div');
    el.className = 'balloon';
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    el.style.background = `radial-gradient(circle at 35% 30%, #fff8 0, ${c} 45%, ${c} 100%)`;
    el.style.left = rand(2, 92) + 'vw';
    const s = rand(.7, 1.3);
    el.style.width = 54 * s + 'px'; el.style.height = 68 * s + 'px';
    const d = rand(11, 18);
    el.style.animationDuration = d + 's';
    balloons.appendChild(el);
    setTimeout(() => el.remove(), d * 1000);
  }
  for (let i = 0; i < 6; i++) { setTimeout(heart, i * 300); }
  for (let i = 0; i < 4; i++) { setTimeout(balloon, i * 900); }
  setInterval(heart, 800);
  setInterval(balloon, 2600);
})();

/* ============================================
   3. CONFETTI
   ============================================ */
const Confetti = (function () {
  const canvas = $('confetti');
  const ctx = canvas.getContext('2d');
  let W, H, parts = [], running = false;
  const COLORS = ['#ff4d94', '#ff7eb3', '#ffa6c9', '#ffe58f', '#e9d5ff', '#fff', '#ffd8c2', '#b3205f'];

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    W = canvas.width = innerWidth * dpr; H = canvas.height = innerHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(dpr, dpr);
  }
  resize(); addEventListener('resize', resize);

  function burst(x, y, n = 120, spread = 1) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2), v = rand(4, 13) * spread;
      parts.push({
        x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5,
        g: rand(.12, .22), s: rand(6, 12), r: rand(0, 6.28), vr: rand(-.3, .3),
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: Math.random() < .3 ? 'heart' : (Math.random() < .5 ? 'rect' : 'circle'),
        life: rand(110, 190)
      });
    }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  function rain(n = 80) {
    for (let i = 0; i < n; i++) {
      setTimeout(() => burst(rand(0, innerWidth), -10, 1, .3), i * 25);
    }
  }
  function drawHeart(s) {
    ctx.beginPath();
    ctx.moveTo(0, s / 4);
    ctx.bezierCurveTo(0, -s / 3, -s, -s / 3, -s, s / 4);
    ctx.bezierCurveTo(-s, s * .7, 0, s, 0, s * 1.2);
    ctx.bezierCurveTo(0, s, s, s * .7, s, s / 4);
    ctx.bezierCurveTo(s, -s / 3, 0, -s / 3, 0, s / 4);
    ctx.fill();
  }
  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 30);
    for (const p of parts) {
      p.vy += p.g; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.globalAlpha = Math.min(1, p.life / 40);
      ctx.fillStyle = p.c;
      if (p.shape === 'rect') ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      else if (p.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, p.s / 3, 0, 6.28); ctx.fill(); }
      else drawHeart(p.s / 2.4);
      ctx.restore();
    }
    if (parts.length) requestAnimationFrame(tick); else running = false;
  }
  return { burst, rain };
})();

/* ============================================
   4. JUDUL HURUF PER HURUF
   ============================================ */
(function title() {
  const el = $('heroTitle');
  const text = el.textContent;
  el.textContent = '';
  [...text].forEach((ch, i) => {
    const s = document.createElement('span');
    s.className = 'ch' + (ch === ' ' ? ' space' : '');
    s.textContent = ch === ' ' ? ' ' : ch;
    s.style.animationDelay = (0.3 + i * 0.07) + 's, ' + (2 + i * 0.1) + 's';
    el.appendChild(s);
  });
  // Selamat datang: hujan konfeti
  setTimeout(() => Confetti.rain(70), 900);
  setTimeout(() => Confetti.burst(innerWidth / 2, innerHeight * .35, 140), 1500);
})();

/* ============================================
   5. KUE & LILIN
   ============================================ */
(function cake() {
  const cake = $('cake');
  const wish = $('wishText');
  cake.addEventListener('click', () => {
    if (cake.classList.contains('blown')) {
      // Nyalakan kembali
      cake.classList.remove('blown');
      wish.textContent = '';
      return;
    }
    cake.classList.add('blown');
    const r = cake.getBoundingClientRect();
    Confetti.burst(r.left + r.width / 2, r.top + 40, 160);
    wish.textContent = CONFIG.harapan;
  });
})();

/* ============================================
   6. SURAT: efek mengetik saat terlihat
   ============================================ */
function startTyping() {
  const el = $('typed');
  const text = CONFIG.pesan;
  let i = 0;
  (function step() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i++);
      const ch = text[i - 2];
      setTimeout(step, ch === '\n' ? 350 : ('.!?'.includes(ch) ? 220 : 32));
    } else el.classList.add('done');
  })();
}

/* ============================================
   7. GALERI + LIGHTBOX
   ============================================ */
(function gallery() {
  const g = $('gallery');
  const lb = $('lightbox'), lbImg = $('lbImg'), lbCap = $('lbCap');

  const videos = [];
  CONFIG.galeri.forEach((f, i) => {
    const fig = document.createElement('figure');
    fig.className = 'polaroid';
    fig.style.setProperty('--rot', (f.rot || 0) + 'deg');
    fig.style.setProperty('--delay', (-i * 0.9) + 's');
    if (f.zoom) fig.style.setProperty('--zoom', f.zoom);
    if (f.pos) fig.style.setProperty('--pos', f.pos);
    if (f.video) {
      fig.classList.add('wide');
      fig.innerHTML = `<div class="frame"><video src="${f.video}" poster="${f.poster || ''}" muted loop playsinline preload="metadata"></video></div><figcaption>${f.caption}</figcaption>`;
      const v = fig.querySelector('video');
      v.muted = true; v.defaultMuted = true; // video selalu tanpa suara
      videos.push(v);
      fig.addEventListener('click', () => { if (v.paused) v.play().catch(() => {}); else v.pause(); });
      g.appendChild(fig);
      return;
    }
    fig.innerHTML = `<div class="frame"><img src="${f.src}" alt="${f.caption}" loading="lazy"></div><figcaption>${f.caption}</figcaption>`;
    fig.addEventListener('click', () => {
      lbImg.src = f.src; lbCap.textContent = f.caption;
      lb.classList.add('show'); lb.setAttribute('aria-hidden', 'false');
      Confetti.burst(innerWidth / 2, innerHeight / 2, 50, .7);
    });
    g.appendChild(fig);
  });

  // Video diputar otomatis saat terlihat, jeda saat keluar layar
  if (videos.length) {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) en.target.play().catch(() => {}); else en.target.pause();
      });
    }, { threshold: 0.35 });
    videos.forEach((v) => vio.observe(v));
  }

  const close = () => { lb.classList.remove('show'); lb.setAttribute('aria-hidden', 'true'); };
  $('lbClose').addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

/* ============================================
   8. ALASAN
   ============================================ */
(function reasons() {
  const ul = $('reasons');
  const icons = ['💗', '🌷', '🍓', '🎀', '💞'];
  CONFIG.alasan.forEach((t, i) => {
    const li = document.createElement('li');
    li.style.transitionDelay = (i * 0.18) + 's';
    li.innerHTML = `<span>${icons[i % icons.length]}</span>${t}`;
    ul.appendChild(li);
  });
})();

/* ============================================
   9. MUNCUL SAAT SCROLL
   ============================================ */
(function reveal() {
  let typed = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('visible');
      if (en.target.id === 'ucapan' && !typed) { typed = true; startTyping(); }
      if (en.target.id === 'alasan') $('reasons').classList.add('visible');
      if (en.target.classList.contains('finale')) Confetti.rain(50);
      io.unobserve(en.target);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();

/* ============================================
   10. TOMBOL-TOMBOL KEJUTAN
   ============================================ */
(function fun() {
  const heart = $('bigHeart');
  const send = () => {
    const r = heart.getBoundingClientRect();
    Confetti.burst(r.left + r.width / 2, r.top + r.height / 2, 90);
  };
  heart.addEventListener('click', send);
  heart.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') send(); });

  $('partyBtn').addEventListener('click', () => {
    Confetti.rain(120);
    Confetti.burst(innerWidth * .2, innerHeight * .5, 100);
    Confetti.burst(innerWidth * .8, innerHeight * .5, 100);
  });

  // Form pesan -> buka WhatsApp dengan pesan terisi
  $('msgForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('msgName').value.trim();
    const text = $('msgText').value.trim();
    if (!text) return;
    const msg = `Halo! 💕${name ? '\nDari: ' + name : ''}\n\n${text}`;
    Confetti.burst(innerWidth / 2, innerHeight / 2, 100);
    $('msgNote').textContent = 'Membuka WhatsApp... 💗';
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    setTimeout(() => { window.open(url, '_blank', 'noopener'); }, 600);
  });

  // Ketuk di mana saja -> hati kecil
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, a, .polaroid, .lightbox')) return;
    const s = document.createElement('span');
    s.textContent = ['💖', '💗', '✨', '🌸'][Math.floor(Math.random() * 4)];
    s.style.cssText = `position:fixed;left:${e.clientX - 12}px;top:${e.clientY - 12}px;font-size:24px;z-index:70;pointer-events:none;transition:all 1s ease-out;`;
    document.body.appendChild(s);
    requestAnimationFrame(() => { s.style.transform = 'translateY(-70px) scale(1.6)'; s.style.opacity = '0'; });
    setTimeout(() => s.remove(), 1000);
  });
})();
