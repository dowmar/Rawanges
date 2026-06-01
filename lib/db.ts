import { promises as fs } from "fs";
import path from "path";
import type { Database, PanicEvent, Redzone, Report } from "./types";

const dbPath = path.join(process.cwd(), "data", "db.json");

const initialDb: Database = {
  redzones: [
    {
      id: "rz-senen",
      name: "Senen - Underpass & Sekitar Stasiun",
      lat: -6.1767,
      lng: 106.8404,
      radiusMeters: 650,
      riskScore: 74,
      description: "Zona kewaspadaan demo berdasarkan skenario laporan komunitas.",
      activeFrom: new Date().toISOString(),
    },
    {
      id: "rz-cakung",
      name: "Cakung - Jalur Industri Malam",
      lat: -6.1837,
      lng: 106.9472,
      radiusMeters: 900,
      riskScore: 82,
      description: "Area demo dengan risiko tinggi saat malam dan jalan sepi.",
      activeFrom: new Date().toISOString(),
    },
    {
      id: "rz-kalideres",
      name: "Kalideres - Akses Terminal",
      lat: -6.1549,
      lng: 106.7052,
      radiusMeters: 750,
      riskScore: 66,
      description: "Area rawan demo untuk validasi fitur redzone alert.",
      activeFrom: new Date().toISOString(),
    }
  ],
  reports: [
    {
      id: "rep-demo-1",
      incidentType: "Orang mencurigakan",
      severity: "medium",
      description: "Demo laporan: aktivitas mencurigakan dekat jalan sepi.",
      lat: -6.1779,
      lng: 106.842,
      happenedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      status: "verified",
      createdAt: new Date().toISOString(),
      anonymous: true,
    }
  ],
  panicEvents: [],
  safePoints: [
    { id: "sp-polsek-senen", name: "Polsek Senen", type: "police", lat: -6.1763, lng: 106.8447, address: "Senen, Jakarta Pusat", open24h: true },
    { id: "sp-rscm", name: "RSCM", type: "hospital", lat: -6.1971, lng: 106.8473, address: "Jl. Diponegoro, Jakarta Pusat", open24h: true },
    { id: "sp-gambir", name: "Stasiun Gambir", type: "transport", lat: -6.1767, lng: 106.8307, address: "Gambir, Jakarta Pusat", open24h: false },
    { id: "sp-spbu-cikini", name: "SPBU Cikini", type: "gas_station", lat: -6.1925, lng: 106.8395, address: "Cikini, Jakarta Pusat", open24h: true },
    { id: "sp-minimarket-senen", name: "Minimarket 24 Jam Senen", type: "minimarket", lat: -6.1749, lng: 106.8391, address: "Senen, Jakarta Pusat", open24h: true }
  ],
};

async function ensureDb() {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, JSON.stringify(initialDb, null, 2));
  }
}

export async function readDb(): Promise<Database> {
  await ensureDb();
  const raw = await fs.readFile(dbPath, "utf8");
  return JSON.parse(raw) as Database;
}

export async function writeDb(db: Database) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

export async function addReport(input: Omit<Report, "id" | "status" | "createdAt">) {
  const db = await readDb();
  const report: Report = { ...input, id: crypto.randomUUID(), status: "pending", createdAt: new Date().toISOString() };
  db.reports.unshift(report);
  await writeDb(db);
  return report;
}

export async function addPanicEvent(input: Omit<PanicEvent, "id" | "createdAt" | "status">) {
  const db = await readDb();
  const event: PanicEvent = { ...input, id: crypto.randomUUID(), status: "triggered", createdAt: new Date().toISOString() };
  db.panicEvents.unshift(event);
  await writeDb(db);
  return event;
}

export async function addRedzone(input: Omit<Redzone, "id" | "activeFrom">) {
  const db = await readDb();
  const redzone: Redzone = { ...input, id: crypto.randomUUID(), activeFrom: new Date().toISOString() };
  db.redzones.unshift(redzone);
  await writeDb(db);
  return redzone;
}
