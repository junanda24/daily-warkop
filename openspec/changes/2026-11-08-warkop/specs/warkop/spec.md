# Spec — WARKOP! Juragan Kopi

## Kemampuan: `warkop`

Game time-management: layani pelanggan warkop, kumpulkan uang, beli
upgrade, bertahan selama mungkin.

### Persyaratan

#### Layar & state machine

- SHALL: Game punya state machine eksplisit
  `MENU → PLAYING → DAY_END → PLAYING → GAME_OVER`, plus `PAUSED`
  (tombol jeda + auto-pause saat tab disembunyikan).
  - WHEN pemain membuka game THEN tampil layar MENU (judul, tombol
    "Buka Warkop", tombol "Lanjutkan" bila ada save, high-score, cara main).
  - WHEN pemain menekan "Buka Warkop" THEN state PLAYING, hari 1 dimulai.
  - WHEN timer hari habis THEN state DAY_END (ringkasan + toko upgrade).
  - WHEN hati (reputasi) mencapai 0 THEN state GAME_OVER (skor akhir,
    tombol "Buka Lagi" dan "Menu Utama").

#### Core loop layanan

- SHALL: Pelanggan muncul di meja kosong dengan gelembung pesanan
  (1–2 item dari menu yang sudah terbuka) dan bar kesabaran yang
  berkurang seiring waktu.
  - WHEN pelanggan duduk THEN pesanan terlihat jelas (ikon + nama item).
  - WHEN pemain menekan tombol menu yang cocok dengan item pesanan
    THEN item masuk masa "disiapkan" (prep time), lalu otomatis
    terantar ke pelanggan.
  - WHEN semua item pesanan terantar THEN pelanggan membayar
    (harga + tip berdasarkan sisa kesabaran) dan pergi dengan senang.
  - WHEN bar kesabaran habis sebelum pesanan lengkap THEN pelanggan
    pergi marah, hati berkurang 1, kombo reset.
- SHALL: Pesanan 2 item harus dilayani satu per satu; pemain tidak
  bisa mengantar item yang tidak dipesan.
- SHALL: Tombol menu yang terkunci tidak bisa ditekan dan menunjukkan
  harga buka kuncinya (beli di toko akhir hari).

#### Ekonomi & tip

- SHALL: Harga menu mengikuti riset harga warkop 2026:
  Kopi Tubruk Rp 5.000, Teh Manis Panas Rp 5.000, Es Teh Manis
  Rp 5.000, Gorengan Rp 2.000, Kopi Susu Rp 7.000, Indomie Goreng
  Rp 10.000, Indomie Telur Rp 13.000, Roti Bakar Rp 15.000,
  Nasi Goreng Rp 15.000.
- SHALL: Tip = hingga +50% dari harga item, proporsional dengan sisa
  kesabaran saat item terantar.
- SHALL: Kombo beruntun (layanan sukses tanpa pelanggan marah)
  menaikkan pengali pendapatan: +5% per kombo, maks +50% (kombo 10).
  Kombo tampil di HUD dan reset saat ada pelanggan marah.

#### Hari, rush hour, dan kesulitan

- SHALL: Satu hari berdurasi 90 detik (timer terlihat di HUD).
- SHALL: Interval kedatangan pelanggan hari ke-N =
  `max(2,0 detik; 5,5 − 0,6 × (N−1) detik)`; di "Jam Rame"
  (25 detik terakhir tiap hari) interval dibagi 2.
- SHALL: Pelanggan punya tipe dengan perilaku berbeda:
  - Bang Ojol: sabar singkat (10 dtk), tip +25%, pesan 1 item.
  - Bapak-bapak: sabar panjang (20 dtk), pesan kopi/teh + gorengan.
  - Mahasiswa: sabar sedang (16 dtk), suka indomie.
  - Anak Nongkrong: sabar panjang (18 dtk), pesan 2 item.
- SHALL: Di akhir hari, hati bertambah 1 (maks 5). Hati awal 5.

#### Toko upgrade (akhir hari)

- SHALL: Uang hari itu + tabungan bisa dibelanjakan di toko akhir hari:
  - Buka menu: Gorengan Rp 50rb, Es Teh Rp 60rb, Kopi Susu Rp 100rb,
    Indomie Goreng Rp 150rb, Indomie Telur Rp 225rb, Roti Bakar Rp 300rb,
    Nasi Goreng Rp 375rb.
  - Meja Tambahan (+1 meja, maks 5): Rp 200rb, lalu Rp 375rb.
  - Kompor Cepat (prep −25% per level, maks 3): Rp 175rb / 325rb / 500rb.
  - Kursi Empuk (kesabaran −20% per level, maks 2): Rp 150rb / 300rb.
  - Kipas Angin (tip +15%): Rp 125rb. TV Warkop (tip +15%): Rp 250rb.
- SHALL: Item yang tidak terjangkau tampil terkunci dengan harga;
  pembelian langsung mengurangi uang dan efeknya aktif hari berikut.

#### Pangkat & skor

- SHALL: Pangkat berdasarkan total pendapatan kumulatif:
  < Rp 250rb "Warkop Baru Buka", Rp 750rb "Langganan Tetangga",
  Rp 1,5jt "Warkop Rame", Rp 3jt "Juragan Warkop", Rp 6jt
  "Legenda Nongkrong". Pangkat tampil di HUD dan layar akhir.
- SHALL: High-score (uang terbanyak 1x main + hari terjauh) tersimpan
  di localStorage dan tampil di menu utama.
- SHALL: Progres (uang, upgrade, hari, pangkat) tersimpan otomatis
  di localStorage (save envelope berversi); tombol "Lanjutkan"
  memulainya dari hari berikutnya.

#### Kontrol, rasa, dan suara

- SHALL: Kontrol sentuh (tap) utama; keyboard 1–9 memilih item menu,
  Spasi = jeda, M = bisu.
- SHALL: Game feel: partikel koin saat pembayaran, uap mengepul di
  atas kopi yang disajikan, popup teks "+Rp 7.500" dan "Mantap!",
  goyangan layar kecil saat pelanggan marah, animasi pelanggan
  masuk/keluar.
- SHALL: Suara via WebAudio (ding saat terantar, koin saat bayar,
  buzz saat pelanggan marah, musik latar? TIDAK — cukup SFX),
  dengan tombol bisu yang persisten.
- SHALL: Tidak ada softlock: bila semua meja kosong dan tidak ada
  pelanggan dalam antrean, pelanggan baru tetap muncul sesuai interval.

#### Teknis & kualitas

- SHALL: Satu game loop `requestAnimationFrame` + delta time;
  entity punya `update()`/`render()`; state machine eksplisit;
  skor/high-score di localStorage; semua data (menu, upgrade,
  pelanggan) data-driven di config, bukan hardcode di logika.
- SHALL: Mobile-first, lebar maks ~480px, tombol menu minimal 48px,
  tidak ada scroll horizontal, tidak ada teks placeholder.
- SHALL: Tidak ada error console; semua tombol berfungsi; semua
  label Bahasa Indonesia natural; tanpa emoji di label UI.
