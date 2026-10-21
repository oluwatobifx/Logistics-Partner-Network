# Logistics Partner Network (Logistics Partner Network)

A concept website for **Logistics Partner Network**, a logistics partner network that connects companies with trusted truck owners.

Designed and built by [Oluwatobi Joel](https://tobi-portfolio-murex.vercel.app).

## What it does

- **Find trucks:** browse trucks offered by small and large partner companies, and filter by city, truck type, capacity and availability.
- **Lease a truck:** enter your company name, purpose, type of goods (drugs wholesale, glass, decorations, solar goods and more), route (Point A to Point B), distance and lease duration. You get an instant price breakdown and a tracking ID.
- **Track a shipment:** enter a tracking ID to see the truck's position on the route, progress, ETA and shipment details.
- **List your truck:** truck owners add their trucks with their own daily and per-km rates.

## Pricing

Total = (daily rate × days) + (per-km rate × distance) + goods handling surcharge + 2% insurance + 5% service fee.
The truck-owning company receives the lease, distance and handling amounts.

## Files

| File | Purpose |
|---|---|
| `index.html` | Home |
| `trucks.html` | Truck marketplace (`/trucks`) |
| `lease.html` | Lease form + live quote (`/lease`) |
| `track.html` | Tracking (`/track`) |
| `list-truck.html` | List a truck (`/list-truck`) |
| `data.js` | Cities, goods types, partner trucks, pricing and tracking logic |
| `app.js` | Page behaviour |
| `styles.css` | All styles (colors and fonts at the top) |

The site is plain HTML, CSS and JavaScript with no build step, and it is fully responsive. It's a demo: new bookings and truck listings are saved in the visitor's browser (localStorage), and truck positions are simulated. Try the tracking IDs `LPN-7Q4K2D`, `LPN-3HZ8WM`, `LPN-9SUN5R` and `LPN-D3C0R8`.
