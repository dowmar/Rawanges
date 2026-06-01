import { NextResponse } from "next/server";
import { readDb } from "../../../lib/db";
import { checkRedzone } from "../../../lib/geo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "lat dan lng wajib valid" }, { status: 400 });
  }
  const db = await readDb();
  const result = checkRedzone({ lat, lng }, db.redzones);
  return NextResponse.json({
    inside: result.inside,
    label: result.label,
    highestRisk: result.highestRisk,
    zones: result.zones.map((x) => ({ ...x.zone, distance: Math.round(x.distance) })),
    nearest: result.nearest ? { ...result.nearest.zone, distance: Math.round(result.nearest.distance) } : null,
  });
}
