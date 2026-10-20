// =============================================================
//  LogiFlow data & logic
//  - CITIES: places trucks can be picked up / delivered
//  - GOODS: goods types and their handling surcharge
//  - SEED_TRUCKS: trucks listed by partner companies
//  - Pricing, distance, tracking IDs and saved bookings
//  This is a demo: new trucks and bookings are saved in the
//  visitor's own browser (localStorage), not on a server.
// =============================================================
const LF = (() => {
  const CITIES = {
    Lagos: [6.5244, 3.3792], Ibadan: [7.3775, 3.947], Abeokuta: [7.1475, 3.3619],
    'Benin City': [6.335, 5.6037], Onitsha: [6.1413, 6.8029], Enugu: [6.5244, 7.5086],
    'Port Harcourt': [4.8156, 7.0498], Calabar: [4.9757, 8.3417], Ilorin: [8.4966, 4.5426],
    Abuja: [9.0765, 7.3986], Jos: [9.8965, 8.8583], Kaduna: [10.5105, 7.4165],
    Kano: [12.0022, 8.592], Bauchi: [10.3158, 9.8442], Maiduguri: [11.8311, 13.151],
    Sokoto: [13.0059, 5.2476], Yola: [9.2035, 12.4954],
  };

  const GOODS = [
    { id: 'drugs', name: 'Drugs & pharmaceuticals (wholesale)', short: 'Pharmaceuticals', surcharge: 0.12, note: 'Temperature-controlled, sealed handling', icon: 'pill' },
    { id: 'glass', name: 'Glass & fragile items', short: 'Glass & fragile', surcharge: 0.15, note: 'Extra padding & careful loading', icon: 'glass' },
    { id: 'decor', name: 'Decoration goods', short: 'Decorations', surcharge: 0.05, note: 'Event, home & office décor', icon: 'star' },
    { id: 'solar', name: 'Solar panels & equipment', short: 'Solar goods', surcharge: 0.08, note: 'Panels, inverters & batteries', icon: 'sun' },
    { id: 'food', name: 'Food & beverages', short: 'Food & drinks', surcharge: 0.06, note: 'Packaged and fresh produce', icon: 'box' },
    { id: 'building', name: 'Building materials', short: 'Building materials', surcharge: 0.04, note: 'Cement, rods, tiles & more', icon: 'brick' },
    { id: 'electronics', name: 'Electronics & appliances', short: 'Electronics', surcharge: 0.1, note: 'Insured, shock-protected', icon: 'chip' },
    { id: 'textiles', name: 'Textiles & clothing', short: 'Textiles', surcharge: 0.02, note: 'Bales, cartons & garments', icon: 'shirt' },
    { id: 'general', name: 'General goods', short: 'General goods', surcharge: 0, note: 'Anything else (please describe)', icon: 'box' },
  ];

  // How fast the goods must arrive (surcharge on lease + distance)
  const SPEEDS = [
    { id: 'standard', name: 'Standard (3–5 days)', short: 'Standard', surcharge: 0 },
    { id: 'express', name: 'Express (1–2 days)', short: 'Express', surcharge: 0.15 },
    { id: 'sameday', name: 'Same day (urgent)', short: 'Same day', surcharge: 0.35 },
  ];
  // Nature of the goods (tells the driver how to handle them)
  const NATURES = ['Standard / dry', 'Fragile', 'Perishable', 'Temperature-controlled', 'Hazardous / flammable', 'Heavy / bulky', 'High value'];
  const UNITS = ['cartons', 'pallets', 'pieces', 'bags', 'crates', 'drums', 'rolls'];

  const TRUCK_TYPES = ['Box truck', 'Flatbed', 'Refrigerated', 'Curtain-side', 'Tipper', 'Container (40ft)'];

  const SEED_TRUCKS = [
    { id: 'T-101', owner: 'Sahel Haulage Ltd', type: 'Refrigerated', model: 'Mercedes Actros', capacity: 20, city: 'Lagos', day: 185000, km: 450, available: true, plate: 'LND-482-KJ' },
    { id: 'T-102', owner: 'Northline Transport', type: 'Box truck', model: 'MAN TGM', capacity: 12, city: 'Kano', day: 120000, km: 320, available: true, plate: 'KN-219-AB' },
    { id: 'T-103', owner: 'Delta Freight Co.', type: 'Flatbed', model: 'DAF XF', capacity: 30, city: 'Port Harcourt', day: 210000, km: 520, available: true, plate: 'RV-771-PH' },
    { id: 'T-104', owner: 'Capital Movers', type: 'Curtain-side', model: 'Volvo FH', capacity: 25, city: 'Abuja', day: 195000, km: 480, available: false, plate: 'ABJ-305-FC' },
    { id: 'T-105', owner: 'Borno Express Logistics', type: 'Box truck', model: 'Isuzu NQR', capacity: 5, city: 'Maiduguri', day: 65000, km: 210, available: true, plate: 'BO-118-MG' },
    { id: 'T-106', owner: 'Greenfield Agro Fleet', type: 'Refrigerated', model: 'Hino 500', capacity: 10, city: 'Ibadan', day: 140000, km: 360, available: true, plate: 'OY-640-IB' },
    { id: 'T-107', owner: 'Eastgate Haulers', type: 'Container (40ft)', model: 'Mack Anthem', capacity: 28, city: 'Onitsha', day: 230000, km: 560, available: true, plate: 'AN-902-ON' },
    { id: 'T-108', owner: 'Kaduna Bulk Carriers', type: 'Tipper', model: 'Sinotruk Howo', capacity: 30, city: 'Kaduna', day: 160000, km: 400, available: true, plate: 'KD-557-KA' },
    { id: 'T-109', owner: 'Swift Small Loads', type: 'Box truck', model: 'Toyota Dyna', capacity: 3, city: 'Lagos', day: 45000, km: 160, available: true, plate: 'LND-128-SW' },
  ];

  // Pricing constants
  const INSURANCE = 0.02;   // 2% of transport cost
  const SERVICE_FEE = 0.05; // 5% platform fee
  const KMH = 45;           // average truck speed incl. stops

  // ---------- safe storage ----------
  const store = {
    get(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } },
  };

  const myTrucks = () => store.get('lf_trucks', []);
  const allTrucks = () => [...myTrucks(), ...SEED_TRUCKS];
  const findTruck = (id) => allTrucks().find((t) => t.id === id);
  const addTruck = (t) => { const list = myTrucks(); list.unshift(t); store.set('lf_trucks', list); };

  // ---------- distance (road estimate) ----------
  function distanceKm(a, b) {
    if (!CITIES[a] || !CITIES[b] || a === b) return 0;
    const [la1, lo1] = CITIES[a], [la2, lo2] = CITIES[b];
    const R = 6371, rad = Math.PI / 180;
    const dLa = (la2 - la1) * rad, dLo = (lo2 - lo1) * rad;
    const h = Math.sin(dLa / 2) ** 2 + Math.cos(la1 * rad) * Math.cos(la2 * rad) * Math.sin(dLo / 2) ** 2;
    return Math.round(2 * R * Math.asin(Math.sqrt(h)) * 1.25); // ×1.25 road factor
  }

  // ---------- price quote ----------
  function quote({ truck, days, km, goodsId, speedId }) {
    const g = GOODS.find((x) => x.id === goodsId) || GOODS[GOODS.length - 1];
    const sp = SPEEDS.find((x) => x.id === speedId) || SPEEDS[0];
    const lease = truck ? truck.day * days : 0;
    const distance = truck ? truck.km * km : 0;
    const base = lease + distance;
    const handling = Math.round(base * g.surcharge);
    const speed = Math.round(base * sp.surcharge);
    const insurance = Math.round((base + handling + speed) * INSURANCE);
    const fee = Math.round((base + handling + speed + insurance) * SERVICE_FEE);
    const total = base + handling + speed + insurance + fee;
    const ownerGets = base + handling + speed; // paid to the truck-owning company
    return { lease, distance, handling, handlingRate: g.surcharge, speed, speedRate: sp.surcharge, speedInfo: sp, insurance, fee, total, ownerGets, goods: g };
  }

  const naira = (n) => '₦' + Math.round(n).toLocaleString('en-NG');
  const hoursFor = (km) => Math.max(1, Math.round(km / KMH));

  // ---------- tracking IDs ----------
  function newTrackingId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let s = '';
    for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return 'LPN-' + s;
  }

  // ---------- bookings ----------
  const myBookings = () => store.get('lf_bookings', []);
  const saveBooking = (b) => { const list = myBookings(); list.unshift(b); return store.set('lf_bookings', list); };

  // Demo shipments so anyone can try tracking.
  const DEMO = [
    { id: 'LPN-7Q4K2D', company: 'MedPlus Pharma Wholesale', goodsId: 'drugs', goodsDetail: 'Vaccines & antibiotics (cold chain)', nature: 'Temperature-controlled', qty: 420, unit: 'cartons', weight: 6, speed: 'express', addr: 'Central Medical Stores, Garki', from: 'Lagos', to: 'Abuja', truckId: 'T-101', days: 3, progress: 0.62, purpose: 'Restocking northern distribution hub' },
    { id: 'LPN-3HZ8WM', company: 'BrightHome Glassworks', goodsId: 'glass', goodsDetail: 'Tempered glass sheets', nature: 'Fragile', qty: 60, unit: 'crates', weight: 9, speed: 'standard', from: 'Onitsha', to: 'Port Harcourt', truckId: 'T-107', days: 2, progress: 0.18, purpose: 'Delivery to construction site' },
    { id: 'LPN-9SUN5R', company: 'SunPower Energy NG', goodsId: 'solar', goodsDetail: '120 solar panels + 8 inverters', nature: 'Fragile', qty: 128, unit: 'pieces', weight: 4, speed: 'standard', from: 'Kano', to: 'Maiduguri', truckId: 'T-102', days: 4, progress: 1, purpose: 'Rural electrification project' },
    { id: 'LPN-D3C0R8', company: 'Elegance Events & Décor', goodsId: 'decor', goodsDetail: 'Wedding stage décor & lighting', nature: 'Fragile', qty: 35, unit: 'crates', weight: 3, speed: 'sameday', from: 'Ibadan', to: 'Lagos', truckId: 'T-106', days: 1, progress: 0, purpose: 'Event setup' },
  ];

  function findShipment(rawId) {
    const id = String(rawId || '').trim().toUpperCase();
    if (!id) return null;
    const mine = myBookings().find((b) => b.id === id);
    if (mine) {
      // Simulated progress: departs 2 hours after booking, then moves at KMH.
      const hrs = (Date.now() - mine.createdAt) / 36e5 - 2;
      const total = hoursFor(mine.km);
      return { ...mine, progress: Math.max(0, Math.min(1, hrs / total)) };
    }
    const d = DEMO.find((x) => x.id === id);
    if (!d) return null;
    const truck = findTruck(d.truckId);
    const km = distanceKm(d.from, d.to);
    const q = quote({ truck, days: d.days, km, goodsId: d.goodsId, speedId: d.speed });
    return { ...d, km, total: q.total, createdAt: Date.now() - 864e5, demo: true };
  }

  return { CITIES, GOODS, SPEEDS, NATURES, UNITS, TRUCK_TYPES, allTrucks, findTruck, addTruck, distanceKm, quote, naira, hoursFor, newTrackingId, saveBooking, myBookings, findShipment, DEMO };
})();
