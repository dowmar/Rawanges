"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PanicEvent, Redzone, Report } from "../../lib/types";

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [redzones, setRedzones] = useState<Redzone[]>([]);
  const [panicEvents, setPanicEvents] = useState<PanicEvent[]>([]);
  const [form, setForm] = useState({ name: "", lat: "", lng: "", radiusMeters: "500", riskScore: "70", description: "" });
  const [message, setMessage] = useState("");

  async function load() {
    const [r, z, p] = await Promise.all([
      fetch("/api/reports").then((x) => x.json()),
      fetch("/api/redzones").then((x) => x.json()),
      fetch("/api/panic").then((x) => x.json()),
    ]);
    setReports(r.reports);
    setRedzones(z.redzones);
    setPanicEvents(p.panicEvents);
  }

  useEffect(() => { void load(); }, []);

  async function setStatus(id: string, status: "verified" | "rejected" | "pending") {
    await fetch("/api/reports", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    await load();
  }

  async function createRedzone(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/redzones", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setMessage(res.ok ? "Redzone dibuat." : "Gagal membuat redzone.");
    if (res.ok) {
      setForm({ name: "", lat: "", lng: "", radiusMeters: "500", riskScore: "70", description: "" });
      await load();
    }
  }

  return (
    <main className="admin">
      <div className="toolbar">
        <Link className="btn secondary" href="/">← Kembali ke Map</Link>
        <button className="btn" onClick={load}>Refresh</button>
      </div>
      <h1>Admin Rawanges</h1>
      <p>Moderasi laporan, pantau panic event, dan tambah redzone. Untuk production wajib tambah auth admin.</p>

      <section className="adminGrid">
        <div className="panel">
          <h2>Moderasi Laporan</h2>
          <div className="list">
            {reports.map((r) => (
              <div className="item" key={r.id}>
                <div className="toolbar" style={{ margin: 0 }}><span className="pill">{r.status}</span><span className="pill">{r.severity}</span></div>
                <b>{r.incidentType}</b>
                <p>{r.description}</p>
                <small>{r.lat}, {r.lng} · {new Date(r.createdAt).toLocaleString("id-ID")}</small>
                <div className="toolbar">
                  <button className="btn" onClick={() => setStatus(r.id, "verified")}>Approve</button>
                  <button className="btn secondary" onClick={() => setStatus(r.id, "pending")}>Pending</button>
                  <button className="btn danger" onClick={() => setStatus(r.id, "rejected")}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>Buat Redzone</h2>
          <form className="form" onSubmit={createRedzone}>
            <input className="input" placeholder="Nama area" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div className="toolbar">
              <input className="input" placeholder="Lat" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
              <input className="input" placeholder="Lng" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
            </div>
            <div className="toolbar">
              <input className="input" placeholder="Radius meter" value={form.radiusMeters} onChange={(e) => setForm({ ...form, radiusMeters: e.target.value })} />
              <input className="input" placeholder="Risk score 0-100" value={form.riskScore} onChange={(e) => setForm({ ...form, riskScore: e.target.value })} />
            </div>
            <textarea className="textarea" placeholder="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button className="btn">Simpan redzone</button>
            {message && <div className="status">{message}</div>}
          </form>

          <h2>Redzone Aktif</h2>
          <div className="list">
            {redzones.map((z) => <div className="item" key={z.id}><b>{z.name}</b><p>{z.description}</p><small>Score {z.riskScore} · radius {z.radiusMeters}m</small></div>)}
          </div>

          <h2>Panic Events</h2>
          <div className="list">
            {panicEvents.map((p) => <div className="item" key={p.id}><b>{p.status}</b><p>{p.message}</p><small>{p.lat}, {p.lng} · {new Date(p.createdAt).toLocaleString("id-ID")}</small></div>)}
            {panicEvents.length === 0 && <div className="status">Belum ada panic event.</div>}
          </div>
        </div>
      </section>
    </main>
  );
}
