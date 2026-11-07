# WARKOP! — Juragan Kopi

Game manajemen waktu berbahasa Indonesia: kamu juragan warung kopi
pinggir jalan. Pelanggan datang, duduk, pesan kopi tubruk, indomie,
gorengan, es teh. Layani secepat mungkin sebelum kesabaran mereka
habis, kumpulkan rupiah, beli upgrade, dan bertahan selama mungkin
sampai jadi **Legenda Nongkrong**.

> Program "1 Hari 1 Project" — 8 November 2026.
> Mainkan lewat artifact (kartu di chat) atau buka `src/index.html`
> langsung di browser.

## Kenapa ide ini dipilih

Warkop adalah institusi Indonesia yang semua orang kenal — tapi belum
pernah ada yang menjadikannya game manajemen waktu. Efek kejutnya:
harga menu di game ini **nyata** (riset harga warkop 2026: kopi tubruk
Rp 5.000, indomie telur Rp 13.000, gorengan Rp 2.000), pelanggannya
berkarakter (Bang Ojol yang buru-buru, Bapak-bapak yang sabar,
Mahasiswa tengah malam, Anak Nongkrong yang betah), dan ada "Jam
Rame" — rush hour 25 detik terakhir tiap hari yang bikin panik.

## Cara main

1. Tekan **Buka Warkop** — hari 1 dimulai (90 detik).
2. Pelanggan duduk di meja dengan gelembung pesanan (ikon + nama)
   dan bar kesabaran yang terus berkurang.
3. Tekan tombol menu yang cocok dengan pesanan (atau tombol
   keyboard **1–9**). Pesanan disiapkan (prep time), lalu otomatis
   terantar.
4. Pelanggan yang lengkap pesanannya membayar: harga + tip
   (sampai +50%, tergantung sisa kesabaran). Layanan beruntun
   tanpa pelanggan marah menaikkan kombo (+5% per kombo, maks +50%).
5. Kalau kesabaran habis duluan, pelanggan pergi marah dan kamu
   kehilangan 1 hati. Hati habis = warkop tutup (game over).
6. Akhir hari: belanja upgrade di toko, lalu lanjut hari berikut
   (makin hari makin ramai).

### Kontrol

| Input | Fungsi |
|---|---|
| Tap / klik tombol menu | Sajikan item ke pelanggan yang paling tidak sabar |
| Keyboard `1`–`9` | Sajikan item menu 1–9 |
| `Spasi` | Jeda / lanjut |
| `M` | Bisu / nyalakan suara |

## Fitur

- **9 menu** dengan harga warkop asli 2026 dan ikon SVG gambar sendiri:
  Kopi Tubruk, Teh Manis Panas, Gorengan, Es Teh Manis, Kopi Susu,
  Indomie Goreng, Indomie Telur, Roti Bakar, Nasi Goreng.
- **4 tipe pelanggan** dengan perilaku beda: Bang Ojol (sabar 10 dtk,
  tip +25%), Bapak-bapak (20 dtk), Mahasiswa (16 dtk, suka indomie),
  Anak Nongkrong (18 dtk, pesan 2 item).
- **Jam Rame!** — 25 detik terakhir tiap hari, pelanggan datang
  2× lebih cepat.
- **Toko akhir hari**: buka menu baru, Meja Tambahan (maks 5 meja),
  Kompor Cepat (prep −25%/level), Kursi Empuk (sabar −20%/level),
  Kipas Angin & TV Warkop (tip +15% masing-masing).
- **5 pangkat Juragan** berdasarkan total pendapatan: Warkop Baru
  Buka → Langganan Tetangga → Warkop Rame → Juragan Warkop →
  Legenda Nongkrong.
- **Save otomatis** (localStorage, envelope berversi): uang, upgrade,
  hari, dan pangkat tersimpan; tombol **Lanjutkan** meneruskan
  permainan. High-score (uang terbanyak + hari terjauh) tampil di menu.
- **Game feel**: partikel koin, teks "+Rp ..." melayang, uap kopi,
  goyangan layar saat pelanggan marah, popup "Mantap!" di kombo 5/10.
- **Suara synth WebAudio** (ding, koin, buzz) — tanpa file audio,
  dengan tombol bisu yang persisten.
- **Self-healing**: save korup direset aman dengan pesan jujur;
  error halaman menampilkan panel "Warkop gangguan, muat ulang"
  (bukan layar blank); game tetap jalan walau WebAudio diblokir.

## Menjalankan dari source

Tidak perlu build — ini satu file HTML statis:

```bash
# cara 1: buka langsung
open src/index.html        # macOS
xdg-open src/index.html    # Linux

# cara 2: server lokal (opsional)
npx serve src
# atau
python3 -m http.server --directory src 8000
```

Lalu buka `http://localhost:8000` di browser HP/desktop.

## Tech stack

- HTML5 + CSS + JavaScript murni (satu file, tanpa framework,
  tanpa backend, tanpa dependensi runtime)
- Google Fonts: Archivo Black (judul/angka) + Plus Jakarta Sans (body)
- WebAudio API untuk efek suara (synth, tanpa file audio)
- localStorage untuk save + high-score

## Struktur folder

```
.
├── README.md
├── src/
│   └── index.html          # game lengkap (satu file, hasil export artifact)
└── openspec/
    └── changes/
        └── archive/
            └── 2026-11-08-warkop/
                ├── proposal.md
                ├── design.md
                ├── tasks.md
                ├── specs/warkop/spec.md
                └── balance/
                    ├── simulate_economy.mjs   # simulasi 1000 sesi × 3 percentile
                    └── BALANCE_economy_2026-11-08.md
```

## Catatan / temuan saat build

- **Balance disimulasikan, bukan dikira-kira.** Tiga ronde tuning
  dengan 1000 sesi simulasi per percentile skill: ronde 1 terlalu
  mudah (pemain lemah tidak pernah kalah), ronde 2 masih mudah,
  ronde 3 lolos semua target — pemain lemah bertahan median 4 hari,
  pemain menengah/jago median 8 hari. Detail di
  `openspec/changes/archive/2026-11-08-warkop/balance/`.
- **Harga menu dari riset nyata** (daftar harga warkop 2026), bukan
  angka karangan. Harga upgrade di-tune dari simulasi, bukan dari
  harga dunia nyata.
- **Satu bug ketemu saat verifikasi**: pembelian di toko sempat
  menimpa save menjadi "Hari 1". Sudah diperbaiki dan diverifikasi
  ulang — menu kini menampilkan "Lanjutkan — Hari 2 · Rp 237.550"
  dengan benar.
- **Tidak di-drive lewat probe** (tapi ada di kode): pintasan keyboard
  1–9/Spasi/M dan auto-pause saat tab disembunyikan; penanganan save
  korup (validasi envelope versi 1).
- **Yang sengaja tidak dibuat**: mode multiplayer / leaderboard
  online (butuh backend + login — di luar scope game santai ini),
  musik latar (cukup SFX agar tidak mengganggu), dan gambar foto
  asli (semua aset digambar sendiri sebagai SVG/CSS agar 100%
  original dan tanpa isu lisensi).

## Rilis

- **Tanggal:** 2026-11-08
- **Repo:** https://github.com/junanda24/daily-warkop
- **Mainkan:** lewat kartu artifact di chat (game web statis)
- **Lisensi:** MIT
