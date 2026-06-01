"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { checkRedzone } from "../lib/geo";
import type { LatLng, Redzone, Report, SafePoint } from "../lib/types";
import { IncidentList } from "../components/IncidentList";
import { PanicButton } from "../components/PanicButton";
import { ReportForm } from "../components/ReportForm";

const SafetyMap = dynamic(() => import("../components/SafetyMap").then((m) => m.SafetyMap), { ssr: false });

type DbPayload = { redzones: Redzone[]; reports: Report[]; safePoints: SafePoint[] };

export default function Home() {
  const [payload, setPayload] = useState<DbPayload>({ redzones: [], reports: [], safePoints: [] });
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [geoMessage, setGeoMessage] = useState("Lokasi belum aktif.");

  useEffect(() => {
    async function load() {
      const [redzones, reports, safePoints] = await Promise.all([
        fetch("/api/redzones").then((r) => r.json()),
        fetch("/api/reports").then((r) => r.json()),
        fetch("/api/safe-points").then((r) => r.json()),
      ]);
      setPayload({ redzones: redzones.redzones, reports: reports.reports, safePoints: safePoints.safePoints });
    }
    void load();
  }, []);

  const risk = useMemo(() => userLocation ? checkRedzone(userLocation, payload.redzones) : null, [payload.redzones, userLocation]);

  function enableLocation() {
    if (!navigator.geolocation) {
      setGeoMessage("Browser tidak support GPS.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoMessage("Lokasi aktif.");
      },
      () => setGeoMessage("Izin lokasi ditolak atau gagal didapat."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <span className="badge">Rawanges MVP · Jakarta Safety Map</span>
          <h1>Pulang lebih waspada, lapor lebih cepat.</h1>
          <p>Map redzone, cek posisi user di area rawan, panic button, safe point, dan laporan komunitas dengan verifikasi admin.</p>
          <div className="toolbar">
            <button className="btn" onClick={enableLocation}>Aktifkan GPS</button>
            <Link className="btn secondary" href="/admin">Buka Admin</Link>
          </div>
        </div>
        <div className="cards">
          <div className="card"><b>{payload.redzones.length}</b><span>Redzone aktif</span></div>
          <div className="card"><b>{payload.reports.length}</b><span>Laporan</span></div>
          <div className="card"><b>{payload.safePoints.length}</b><span>Safe point</span></div>
          <div className="card"><b>{risk?.label ?? "-"}</b><span>Status lokasi</span></div>
        </div>
      </section>

      <section className="main">
        <div className="panel mapWrap">
          <SafetyMap redzones={payload.redzones} reports={payload.reports} safePoints={payload.safePoints} userLocation={userLocation} />
        </div>
        <aside className="panel">
          <h2>Status Area</h2>
          <div className={`status ${risk?.inside ? "danger" : risk?.nearest && risk.nearest.distance < 800 ? "warn" : ""}`}>
            <b>{geoMessage}</b><br />
            {risk ? (
              risk.inside ? `Anda sedang berada di ${risk.zones[0].zone.name}. Risk score ${risk.highestRisk}.` : `Tidak berada di redzone. Redzone terdekat: ${risk.nearest?.zone.name} (${Math.round(risk.nearest?.distance ?? 0)}m).`
            ) : "Aktifkan GPS untuk cek redzone."}
          </div>

          <PanicButton userLocation={userLocation} />

          <h2>Lapor Cepat</h2>
          <ReportForm userLocation={userLocation} onCreated={(report) => setPayload((p) => ({ ...p, reports: [report, ...p.reports] }))} />

          <h2>Laporan Terbaru</h2>
          <IncidentList reports={payload.reports} />
        </aside>
      </section>
    </main>
  );
}
