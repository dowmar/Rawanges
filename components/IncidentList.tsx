import type { Report } from "../lib/types";

export function IncidentList({ reports }: { reports: Report[] }) {
  return (
    <div className="list">
      {reports.slice(0, 8).map((r) => (
        <div className="item" key={r.id}>
          <div className="toolbar" style={{ margin: 0 }}>
            <span className={`pill ${r.severity === "high" || r.severity === "critical" ? "high" : r.severity === "medium" ? "med" : ""}`}>{r.severity}</span>
            <span className="pill">{r.status}</span>
          </div>
          <b>{r.incidentType}</b>
          <p>{r.description}</p>
          <small>{new Date(r.happenedAt).toLocaleString("id-ID")} · {r.lat.toFixed(4)}, {r.lng.toFixed(4)}</small>
        </div>
      ))}
      {reports.length === 0 && <div className="status">Belum ada laporan.</div>}
    </div>
  );
}
