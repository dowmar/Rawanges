import { NextResponse } from "next/server";
import { addPanicEvent, readDb } from "../../../lib/db";
import { panicSchema } from "../../../lib/validation";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ panicEvents: db.panicEvents });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = panicSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const panicEvent = await addPanicEvent(parsed.data);
  return NextResponse.json({ panicEvent }, { status: 201 });
}
