WEB ULANG TAHUN UNTUK SAFA AZAHRA
=================================
Cara pakai: ekstrak ZIP, lalu buka index.html di browser (Chrome/Safari/Edge).
Butuh internet hanya untuk font Google (Pacifico & Fredoka).

Struktur:
  index.html        -> Halaman 1: amplop
  main.html         -> Halaman 2: ucapan, foto, animasi
  css/base.css      -> warna & gaya umum
  css/envelope.css  -> gaya halaman amplop
  css/main.css      -> gaya halaman utama
  js/envelope.js    -> logika amplop
  js/main.js        -> logika halaman utama (EDIT bagian CONFIG di atas file untuk ganti pesan/foto/alasan)
  assets/img        -> foto
  assets/video      -> kenangan.mp4 (video galeri, tanpa suara)
  assets/audio      -> backsound.mp3

Tambah foto: taruh di assets/img lalu tambah baris di CONFIG.galeri (js/main.js).
Agar musik jalan otomatis dengan mulus, sebaiknya buka lewat hosting (Netlify/GitHub Pages) atau Live Server.

PIN: amplop dikunci PIN 6 digit (js/envelope.js -> PIN_HASH). Untuk ganti PIN, buka index.html,
ketik di Console browser: hash("safa:PINBARU") lalu tempel hasilnya ke PIN_HASH.
