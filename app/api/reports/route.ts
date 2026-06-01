import { NextResponse } from "next/server";
import { addReport, readDb, writeDb } from "../../../lib/db";
import { reportSchema } from "../../../lib/validation";
import type { ReportStatus } from "../../../lib/types";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ reports: db.reports });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const report = await addReport({ ...parsed.data, happenedAt: parsed.data.happenedAt ?? new Date().toISOString() });
  return NextResponse.json({ report }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json() as { id?: string; status?: ReportStatus };
  if (!body.id || !["pending", "verified", "rejected"].includes(body.status ?? "")) {
    return NextResponse.json({ error: "id dan status valid wajib diisi" }, { status: 400 });
  }
  const db = await readDb();
  const report = db.reports.find((r) => r.id === body.id);
  if (!report) return NextResponse.json({ error: "Report tidak ditemukan" }, { status: 404 });
  report.status = body.status as ReportStatus;
  await writeDb(db);
  return NextResponse.json({ report });
}
