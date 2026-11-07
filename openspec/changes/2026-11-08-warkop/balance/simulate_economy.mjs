// Simulasi ekonomi WARKOP! — 1000 sesi per percentile skill.
// Model: pemain melayani pesanan dengan peluang sukses per skill;
// pelanggan yang tidak terlayani tepat waktu = walkout (-1 hati).
// Hati awal 5, +1 tiap akhir hari (maks 5). Game over di 0 hati.
// Upgrade dibeli otomatis (greedy termurah dulu) di akhir hari.
// Harga & waktu dari spec; spawn interval & rush hour dari spec.

const MENU = [
  { id: 'kopi', price: 5000, prep: 2.0, unlock: 0 },
  { id: 'teh', price: 5000, prep: 2.0, unlock: 0 },
  { id: 'gorengan', price: 2000, prep: 1.5, unlock: 50000 },
  { id: 'esteh', price: 5000, prep: 2.0, unlock: 375000 },
  { id: 'kopisusu', price: 7000, prep: 2.2, unlock: 100000 },
  { id: 'indomie', price: 10000, prep: 3.5, unlock: 375000 },
  { id: 'indomietelur', price: 13000, prep: 3.5, unlock: 225000 },
  { id: 'rotibakar', price: 15000, prep: 3.0, unlock: 300000 },
  { id: 'nasigoreng', price: 15000, prep: 4.0, unlock: 375000 },
];

const TYPES = [
  { name: 'ojol', patience: 10, tipBonus: 0.25, items: 1, w: 0.25 },
  { name: 'bapak', patience: 20, tipBonus: 0, items: 2, w: 0.25 },
  { name: 'mahasiswa', patience: 16, tipBonus: 0, items: 1, w: 0.25 },
  { name: 'nongkrong', patience: 18, tipBonus: 0, items: 2, w: 0.25 },
];

const UPGRADES = [
  { id: 'gorengan', cost: 50000, kind: 'menu' },
  { id: 'esteh', cost: 60000, kind: 'menu' },
  { id: 'kopisusu', cost: 100000, kind: 'menu' },
  { id: 'meja1', cost: 200000, kind: 'table' },
  { id: 'indomie', cost: 150000, kind: 'menu' },
  { id: 'kompor1', cost: 175000, kind: 'stove' },
  { id: 'indomietelur', cost: 225000, kind: 'menu' },
  { id: 'kursi1', cost: 150000, kind: 'chair' },
  { id: 'kipas', cost: 125000, kind: 'tip' },
  { id: 'rotibakar', cost: 300000, kind: 'menu' },
  { id: 'nasigoreng', cost: 375000, kind: 'menu' },
  { id: 'meja2', cost: 375000, kind: 'table' },
  { id: 'tv', cost: 250000, kind: 'tip' },
];

const DAY_LEN = 90;
const RUSH_AT = 65; // 20 detik terakhir
const SEED0 = 20261108;

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickType(rng) {
  let r = rng(); let acc = 0;
  for (const t of TYPES) { acc += t.w; if (r <= acc) return t; }
  return TYPES[0];
}

function simulateSession(skill, seed) {
  const rng = mulberry32(seed);
  let money = 0; let totalEarned = 0; let hearts = 5; let day = 1;
  let combo = 0;
  const owned = new Set(['kopi', 'teh']);
  let tables = 3; let stove = 0; let chair = 0; let tipBonus = 0;
  const dayEarnings = [];

  while (hearts > 0 && day <= 12) {
    // --- satu hari ---
    let t = 0; let nextSpawn = 2;
    let dayEarn = 0;
    const active = []; // {patience, items:[menuId], served}
    let serving = null; // {doneAt}
    let busyUntil = 0;
    while (t < DAY_LEN) {
      const dt = 0.2; t += dt;
      const interval = Math.max(2.0, 5.5 - 0.6 * (day - 1)) / (t >= RUSH_AT ? 2 : 1);
      if (t >= nextSpawn && active.length < tables) {
        nextSpawn = t + interval * (0.8 + rng() * 0.4);
        const type = pickType(rng);
        const pool = MENU.filter((m) => owned.has(m.id));
        const nItems = type.items === 2 && rng() < 0.6 ? 2 : 1;
        const items = [];
        for (let i = 0; i < nItems; i++) items.push(pool[Math.floor(rng() * pool.length)].id);
        active.push({ patience: type.patience * (1 + chair * 0.2), type, items, served: 0 });
      }
      // layani: pemain menyelesaikan 1 item tiap "service tick" bila ada pelanggan
      if (t >= busyUntil && active.length) {
        // pilih pelanggan dengan kesabaran tersisa paling kecil
        active.sort((a, b) => a.patience - b.patience);
        const c = active[0];
        // salah pencet tombol menu: buang waktu reaksi, tidak ada yang terlayani
        if (rng() < (1 - skill) * 0.5) { busyUntil = t + 0.8; }
        else if (rng() < skill) {
          const menu = MENU.find((m) => m.id === c.items[c.served]);
          const prep = menu.prep * Math.pow(0.75, stove);
          busyUntil = t + prep + 0.8; // + reaksi pemain
          c.served++;
          const patienceFrac = Math.max(0.1, c.patience / c.type.patience);
          const tip = menu.price * 0.5 * patienceFrac * (1 + c.type.tipBonus + tipBonus);
          const comboMult = 1 + Math.min(combo, 10) * 0.05;
          const pay = Math.round((menu.price + tip) * comboMult);
          dayEarn += pay; totalEarned += pay; money += pay;
          combo++;
          if (c.served >= c.items.length) active.splice(0, 1);
        } else {
          // pemain gagal menangani tepat waktu: pelanggan ini dibiarkan
          busyUntil = t + 1.0;
        }
      }
      // kesabaran berkurang
      for (let i = active.length - 1; i >= 0; i--) {
        active[i].patience -= dt;
        if (active[i].patience <= 0) {
          active.splice(i, 1);
          hearts--; combo = 0;
          if (hearts <= 0) break;
        }
      }
      if (hearts <= 0) break;
    }
    dayEarnings.push(dayEarn);
    if (hearts <= 0) break;
    hearts = Math.min(5, hearts + 1);
    // --- toko akhir hari: beli termurah yang terjangkau, prioritas menu ---
    const shop = [...UPGRADES].filter((u) => !owned.has(u.id) && money >= u.cost)
      .sort((a, b) => a.cost - b.cost);
    for (const u of shop) {
      if (money < u.cost) continue;
      money -= u.cost; owned.add(u.id);
      if (u.kind === 'table') tables++;
      if (u.kind === 'stove') stove++;
      if (u.kind === 'chair') chair++;
      if (u.kind === 'tip') tipBonus += 0.15;
    }
    day++;
  }
  return { daysSurvived: day - 1, totalEarned, dayEarnings, gameOverDay: hearts <= 0 ? day : null };
}

function pct(arr, p) {
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(p * s.length))];
}

const SKILLS = { P25: 0.55, P50: 0.75, P75: 0.9 };
for (const [label, skill] of Object.entries(SKILLS)) {
  const N = 1000; const res = [];
  for (let i = 0; i < N; i++) res.push(simulateSession(skill, SEED0 + i * 7919 + Math.round(skill * 1000)));
  const d1 = res.map((r) => r.dayEarnings[0] || 0);
  const days = res.map((r) => r.daysSurvived);
  const tot = res.map((r) => r.totalEarned);
  const tot5 = res.map((r) => r.dayEarnings.slice(0, 5).reduce((a, b) => a + b, 0));
  console.log(`--- ${label} (skill=${skill}) n=${N} ---`);
  console.log(`hari-1 earning: median Rp ${pct(d1, 0.5).toLocaleString('id-ID')} | p10 Rp ${pct(d1, 0.1).toLocaleString('id-ID')} | p90 Rp ${pct(d1, 0.9).toLocaleString('id-ID')}`);
  console.log(`hari bertahan: median ${pct(days, 0.5)} | p10 ${pct(days, 0.1)} | p90 ${pct(days, 0.9)} | game-over<=hari3: ${(res.filter((r) => r.gameOverDay && r.gameOverDay <= 3).length / N * 100).toFixed(0)}%`);
  console.log(`total earning: median Rp ${pct(tot, 0.5).toLocaleString('id-ID')} | capai 500rb: ${(tot.filter((v) => v >= 500000).length / N * 100).toFixed(0)}% | capai 1jt: ${(tot.filter((v) => v >= 1000000).length / N * 100).toFixed(0)}%`);
  console.log(`total 5 hari pertama: median Rp ${pct(tot5, 0.5).toLocaleString('id-ID')} | >=500rb: ${(tot5.filter((v) => v >= 500000).length / N * 100).toFixed(0)}%`);
}
