import { NextResponse } from "next/server";
import { addRedzone, readDb } from "../../../lib/db";
import { redzoneSchema } from "../../../lib/validation";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ redzones: db.redzones });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = redzoneSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const redzone = await addRedzone(parsed.data);
  return NextResponse.json({ redzone }, { status: 201 });
}
