# Proposal — WARKOP! Juragan Kopi

**Tanggal:** 2026-11-08
**Slug:** `warkop`
**Jenis:** Game (HTML5, web artifact static, client-side only)
**Repo:** `junanda24/daily-warkop`

## Apa ini

Game time-management tycoon-lite: kamu juragan warung kopi pinggir jalan.
Pelanggan datang, duduk, pesan kopi tubruk / indomie / gorengan / es teh.
Kamu layani secepat mungkin sebelum kesabaran mereka habis. Uang yang
terkumpul dipakai beli menu baru, meja tambahan, kompor lebih cepat, kursi
empuk — dari warkop gerobak sampai jadi legenda nongkrong.

## Kenapa ide ini mengejutkan

- Warkop adalah institusi Indonesia yang belum pernah jadi game di program
  ini — semua orang pernah nongkrong di warkop, tidak ada yang kepikiran
  menjadikannya game manajemen waktu.
- Harga menu NYATA (riset harga warkop 2026: kopi tubruk Rp 5.000, indomie
  telur Rp 13.000–14.000, gorengan Rp 2.000, es teh Rp 5.000) — bukan angka
  karangan. Pemain yang pernah ke warkop langsung merasa "ini beneran".
- Pelanggan berkarakter: Bang Ojol (buru-buru, tip gede), Bapak-bapak
  (sabar, pesan kopi + rokok), Mahasiswa (indomie tengah malam),
  Anak Nongkrong (gorengan + es teh, betah lama).
- Ada "Jam Rame" (rush hour), kombo layanan, dan pangkat Juragan —
  bukan sekadar klik-klik.

## Kenapa bentuk ini (game, bukan web app / package)

- Mekaniknya hidup dari ketegangan waktu nyata — cuma game yang bisa
  menyampaikan itu. Kalkulator/APK tidak punya tensi.
- Rotasi program: kemarin web app (LULUS SIM!), dua hari lalu game
  (PAK RT!). Game hari ini menjaga variasi, dengan genre yang belum
  pernah dipakai: time-management/tycoon, bukan kuis (TEBAK PLAT,
  TEBAK HARGA) atau arcade tangkap (Gorengan Panas, JUKIR).
- Frontend-only cukup: semua state di localStorage (uang, upgrade,
  high-score, save lanjutan). Tidak ada backend — tidak ada data yang
  butuh server, tidak ada login, tidak ada API berbayar.

## Uji bar scope

- Bukan utilitas satu fungsi. Ini produk game lengkap: 4+ sistem
  saling nyambung (layanan, kesabaran, ekonomi, upgrade, pangkat),
  progresi antar-hari, save persisten, alur end-to-end
  (menu → main → akhir hari → toko → game over → restart).
- Sekelas JUKIR!/TAWAR!/PAK RT!, bukan kata-angka/Berani Resign. Lolos.

## Anti-AI-slop

Copy Bahasa Indonesia natural khas warkop ("Mantap!", "Jangan kabur
dulu, Bang!", "Warkop tutup, besok buka lagi!"), tanpa emoji di label
UI, tanpa lorem ipsum, tanpa placeholder. Semua aset visual digambar
sendiri via CSS/SVG (tidak ada sprite berlisensi, tidak ada karakter
pihak ketiga).

## IP check

Semua aset original/buatan sendiri. Nama menu generik (kopi tubruk,
indomie, gorengan). Tidak ada merek, karakter, atau lagu berlisensi.
Suara dibuat via WebAudio (synth sederhana), bukan sampel.

## Keputusan

Disetujui sendiri sesuai otoritas scheduler (tanpa gate approval).
Lanjut ke Apply.
