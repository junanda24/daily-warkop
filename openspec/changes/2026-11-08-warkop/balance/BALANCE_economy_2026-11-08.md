# Balance — Ekonomi WARKOP! — 2026-11-08

**Intent (dari GDD/spec):** upgrade terasa bermakna tiap ~1–2 hari di awal,
melambat setelahnya; pemain lemah game over hari 3–5; pemain menengah
mencapai hari 4+; pemain jago mencapai hari 6+; total 5 hari pertama
≥ Rp 500rb (pangkat "Langganan Tetangga" tercapai).

## Formulas

| Parameter | Formula | Konstanta |
|---|---|---|
| Spawn interval hari N | `max(2,0; 5,5 − 0,6×(N−1))` detik, ÷2 saat Jam Rame | Rush = 25 detik terakhir |
| Kesabaran | Ojol 10 dtk, Mahasiswa 16, Nongkrong 18, Bapak 20 | Kursi Empuk: drain −20%/level |
| Prep | minuman 2,0 dtk; gorengan 1,5; roti 3,0; indomie 3,5; nasgor 4,0 | Kompor: prep ×0,75^level |
| Tip | `harga × 0,5 × sisaSabar × (1 + bonusTipe + bonusUpgrade)` | Ojol +25%; Kipas/TV +15% |
| Kombo | `1 + min(kombo,10) × 0,05` | maks +50%, reset saat walkout |
| Hati | awal 5, −1 per walkout, +1 tiap akhir hari (maks 5) | 0 = game over |

## Economy flow

| Resource | Sources/hari (P50) | Sinks | Net |
|---|---|---|---|
| Uang | ~Rp 220rb (hari 1) → ~Rp 350rb (hari 5) | Toko upgrade (Rp 50rb–500rb/item) | Positif, diserap toko; tidak ada inflasi karena harga menu tetap |

## Simulation

Script: `simulate_economy.mjs` (seeded RNG, model pemain: layani pelanggan
dengan kesabaran tersisa terkecil; reaksi 0,8 dtk; peluang salah pencet
tombol = (1−skill)×0,5; toko dibeli greedy termurah dulu).
Sesi: 1000 per percentile. Batas simulasi: 12 hari.

| Target | P25 (skill 0,55) | P50 (0,75) | P75 (0,90) | Hasil |
|---|---|---|---|---|
| Hari-1 earning ≥ Rp 60rb | median Rp 182rb | Rp 220rb | Rp 234rb | PASS |
| Hari bertahan | median 4 (p10: 3) | median 8 | median 8 | PASS (P25 di 3–5) |
| Total 5 hari pertama ≥ Rp 500rb | median Rp 876rb | Rp 1,36jt | Rp 1,60jt | PASS |
| Total capai Rp 500rb | 94% sesi | 100% | 100% | PASS |
| Game over ≤ hari 3 | 7% sesi | 0% | 0% | PASS (tidak brutal di awal) |

## Tuning log

- **Ronde 1:** spawn 7 dtk, prep 1,0–3,0 dtk, kombo +10% — hasil: P25
  tidak pernah game over dalam 12 hari, earning hari-1 Rp 240rb.
  Terlalu mudah. FAIL.
- **Ronde 2:** spawn 5,5 dtk, prep 1,5–4,0 dtk, kombo +5%, biaya
  upgrade ×2,5 — hasil: P25 median 9 hari. Masih terlalu mudah
  (meja/menu lambat terbuka = tekanan lebih kecil). FAIL.
- **Ronde 3:** kesabaran 10–20 dtk (dari 12–26), spawn −0,6/hari
  (floor 2,0), rush 25 dtk — hasil: P25 median 4 hari, P50/P75
  median 8 hari. Semua target PASS.

## Catatan

- Level 2–3 Kompor Cepat, level 2 Kursi Empuk, dan Meja ke-2 tidak
  dimodelkan di simulasi (hanya level 1 tiap jenis); bentuk kurva
  biayanya sama, efeknya hanya memperpanjang permainan pemain jago.
- Simulasi mengasumsikan pemain optimal (selalu layani yang paling
  tidak sabar). Pemain manusia nyata lebih lambat (cari tombol,
  salah pencet) — kesulitan nyata sedikit lebih tinggi dari simulasi.
