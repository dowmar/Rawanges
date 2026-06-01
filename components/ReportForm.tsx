"use client";

import { useState } from "react";
import type { LatLng, Report } from "../lib/types";

const incidentTypes = ["Begal", "Jambret", "Orang mencurigakan", "Tawuran", "Jalan gelap/sepi", "Pemalakan", "Lainnya"];

export function ReportForm({ userLocation, onCreated }: { userLocation: LatLng | null; onCreated: (report: Report) => void }) {
  const [incidentType, setIncidentType] = useState("Begal");
  const [severity, setSeverity] = useState("high");
  const [description, setDescription] = useState("");
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const lat = userLocation?.lat ?? Number(manualLat);
    const lng = userLocation?.lng ?? Number(manualLng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setMessage("Aktifkan lokasi atau isi koordinat manual dulu.");
      return;
    }
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ incidentType, severity, description, lat, lng, anonymous: true }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMessage(json.error ?? "Gagal mengirim laporan.");
      return;
    }
    setDescription("");
    onCreated(json.report);
    setMessage("Laporan masuk sebagai pending verification.");
  }

  return (
    <form className="form" onSubmit={submit}>
      <label>Jenis kejadian
        <select className="select" value={incidentType} onChange={(e) => setIncidentType(e.target.value)}>
          {incidentTypes.map((x) => <option key={x}>{x}</option>)}
        </select>
      </label>
      <label>Severity
        <select className="select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="low">Low - mencurigakan</option>
          <option value="medium">Medium - rawan</option>
          <option value="high">High - begal/jambret</option>
          <option value="critical">Critical - sedang terjadi</option>
        </select>
      </label>
      {!userLocation && (
        <div className="toolbar">
          <input className="input" placeholder="Latitude" value={manualLat} onChange={(e) => setManualLat(e.target.value)} />
          <input className="input" placeholder="Longitude" value={manualLng} onChange={(e) => setManualLng(e.target.value)} />
        </div>
      )}
      <label>Deskripsi singkat
        <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Contoh: dua orang mencurigakan mengikuti pengendara motor..." required />
      </label>
      <button className="btn" disabled={loading}>{loading ? "Mengirim..." : "Kirim laporan"}</button>
      {message && <div className="status">{message}</div>}
    </form>
  );
}
