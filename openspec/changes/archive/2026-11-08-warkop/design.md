# Design — WARKOP! Juragan Kopi

## Stack

- **Web artifact static** — satu file HTML + CSS + JS (game HTML5,
  mengikuti ARCHITECTURE.md §5: satu game loop rAF + delta time,
  state machine eksplisit, object pooling untuk partikel).
- **Tanpa framework, tanpa backend.** Semua state di localStorage
  (modul `store` tunggal, envelope berversi + migrasi).
- **Aset visual original:** ikon menu digambar sebagai SVG inline
  (cangkir kopi, mangkuk indomie, gorengan, gelas es teh, roti bakar,
  piring nasi goreng); pelanggan digambar sebagai figur CSS
  (kepala + badan + warna baju berbeda per tipe). Tanpa gambar
  pihak ketiga, tanpa sprite berlisensi.
- **Suara:** WebAudio synth (oscillator + noise), tanpa file audio.
- **Font:** Google Fonts — display "Archivo Black" untuk judul/HUD
  angka, "Plus Jakarta Sans" untuk body/copy.

## Visual direction (local-impeccable, mode Experience)

- Dunia: warkop malam — latar cokelat gelap + kuning lampu bohlam,
  papan nama neon amber "WARKOP!" dengan glow, meja kayu, kursi
  plastik warna-warni, uap kopi.
- Palet (token CSS): `--kopi: #2B1A12` (latar), `--kayu: #7C4A21`,
  `--krem: #FFF3D6`, `--amber: #FFB020`, `--oranye: #FF6B1A`,
  `--hijau: #2FBF71` (uang/sukses), `--merah: #E5484D` (marah).
- Signature elements:
  1. Papan nama neon berdenyut pelan di header.
  2. Meja-meja dengan pelanggan + gelembung pesanan (ikon SVG +
     bar kesabaran warna hijau→merah).
  3. Bar menu bawah seperti etalase warkop: tombol besar dengan
     ikon SVG, nama, harga, dan tombol angka keyboard (1–9).
  4. Hujan koin + popup "+Rp ..." tiap pembayaran; uap mengepul
     dari kopi yang baru disajikan.
- Animasi: GSAP tidak dipakai (game loop sendiri cukup); semua
  animasi via CSS keyframes + transform di loop rAF (partikel,
  shake, float). Transisi antar-state dengan fade/slide 250ms.

## Arsitektur kode (satu file, modul IIFE)

```
STATE (satu objek)      — screen, day, money, hearts, combo, customers[],
                          tables, prepQueue, upgrades, stats, muted
DATA (config murni)     — MENU, CUSTOMER_TYPES, UPGRADES, RANKS, BALANCE
STORE (localStorage)    — save/load envelope {v:1, ...}, high-score
AUDIO (WebAudio synth)  — sfx(type) + mute persisten
LOOP (rAF + dt)         — update(dt): spawn, patience, prep, particles
                          render(): DOM update minimal (cache querySelector)
EVENTS                  — tap menu, tap pelanggan (lihat pesanan),
                          keyboard 1–9 / Space / M, tombol jeda/bisu
```

Aturan ARCHITECTURE.md §5 dipatuhi: satu loop, entity
`update()`/`render()`, state machine eksplisit, pooling partikel
(array reuse, maks 60 partikel), tidak ada logic bisnis di handler
(tipis: baca input → panggil `serveItem()` → render).

## Lima keranjang state

- **Lokal (in-memory):** posisi pelanggan, timer hari, bar kesabaran,
  antrean prep, partikel — hilang saat reload, tidak perlu disimpan.
- **Persisten (localStorage via store):** uang, upgrade, hari, pangkat,
  high-score, muted — satu-satunya state yang disimpan.
- **Lainnya (URL/server/form):** tidak ada.

## Balance (ringkas — laporan lengkap di `balance/`)

- Hari 90 dtk; spawn awal 5,5 dtk → 2,0 dtk (hari 7+); rush hour
  25 dtk terakhir (interval ÷2).
- Kesabaran dasar: Ojol 10 dtk, Mahasiswa 16, Nongkrong 18, Bapak 20.
- Prep: minuman 2,0 dtk; gorengan 1,5 dtk; roti 3,0 dtk;
  indomie 3,5 dtk; nasi goreng 4,0 dtk. Kompor −25%/level.
- Tip maks +50% (proporsional sisa sabar) + bonus tipe/upgrades.
- Kombo +5%/langkah, maks +50%.
- Target (diverifikasi simulasi 1000 sesi/skill percentile, lihat
  `balance/BALANCE_economy_2026-11-08.md`): P25 bertahan median
  4 hari; P50/P75 median 8 hari; hari-1 median Rp 182–234rb;
  total 5 hari pertama median Rp 876rb–1,6jt. Semua target PASS
  setelah 3 ronde tuning.

## Self-healing (standing order)

- Save envelope berversi; bila corrupt/versi lama → migrasi atau
  reset aman ke default + pesan jujur di menu ("Save lama tidak
  terbaca, mulai baru").
- Error boundary: `window.onerror` → tampilkan panel "Warkop
  gangguan, muat ulang" (bukan layar blank).
- Autosave tiap akhir hari + tiap pembelian upgrade.
- Degraded state: bila WebAudio diblokir, game tetap jalan tanpa suara
  (tombol bisu jadi "Suara mati").

## Deploy

- Artifact static → link publik shareable. TIDAK deploy Vercel
  tanpa ACC Junan. Repo GitHub `junanda24/daily-warkop` berisi
  source lengkap hasil export artifact (`src/`) + README + openspec.
