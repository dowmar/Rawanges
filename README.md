# Rawanges

Rawanges adalah MVP fullstack safety map untuk Jakarta: peta redzone, deteksi lokasi user di zona rawan, panic button, laporan kejadian, dan admin moderation.

## Stack

- Next.js App Router + TypeScript
- Leaflet + Mapbox tiles untuk peta (fallback ke OpenStreetMap kalau token belum diset)
- API Routes Next.js sebagai backend
- File JSON local sebagai storage MVP (`data/db.json`)

## Fitur MVP

- Map Jakarta dengan redzone, laporan, dan safe points
- GPS user via browser geolocation
- Deteksi user masuk redzone berdasarkan radius
- Panic button dengan countdown dan simpan event
- Form laporan kejadian
- Admin dashboard untuk approve/reject laporan dan kelola redzone
- API fullstack: `/api/redzones`, `/api/reports`, `/api/panic`, `/api/safe-points`, `/api/risk-check`

## Jalankan lokal

Copy env example lalu isi token Mapbox:

```bash
cp .env.example .env.local
# edit NEXT_PUBLIC_MAPBOX_TOKEN di .env.local
```

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Catatan privasi dan safety

Ini MVP/demo. Untuk production:

- gunakan PostgreSQL + PostGIS/Supabase, bukan file JSON
- tambah auth admin dan rate limit
- jangan tampilkan identitas pelapor
- laporan baru harus pending dulu sebelum jadi redzone
- beri consent jelas untuk live location dan panic event

## Struktur

```text
app/                UI dan API routes
components/         Komponen map dan form
lib/                Validasi, geo helper, storage local
scripts/            Script seed/reset data
```
