"use client";

import L from "leaflet";
import { useEffect } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { LatLng, Redzone, Report, SafePoint } from "../lib/types";
import { jakartaCenter, riskLabel } from "../lib/geo";

function MapRecenter({ userLocation }: { userLocation: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (userLocation) map.setView([userLocation.lat, userLocation.lng], 14);
  }, [map, userLocation]);
  return null;
}

function icon(color: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="width:18px;height:18px;border-radius:999px;background:${color};border:3px solid white;box-shadow:0 2px 12px rgba(0,0,0,.45)"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

export function SafetyMap({
  redzones,
  reports,
  safePoints,
  userLocation,
}: {
  redzones: Redzone[];
  reports: Report[];
  safePoints: SafePoint[];
  userLocation: LatLng | null;
}) {
  const center = userLocation ?? jakartaCenter();

  return (
    <MapContainer className="map" center={[center.lat, center.lng]} zoom={12} scrollWheelZoom>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapRecenter userLocation={userLocation} />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={icon("#2b75ff")}>
          <Popup>Lokasi Anda saat ini</Popup>
        </Marker>
      )}

      {redzones.map((zone) => (
        <Circle
          key={zone.id}
          center={[zone.lat, zone.lng]}
          radius={zone.radiusMeters}
          pathOptions={{
            color: zone.riskScore >= 81 ? "#ef4444" : zone.riskScore >= 61 ? "#f97316" : "#f59e0b",
            fillColor: zone.riskScore >= 81 ? "#ef4444" : zone.riskScore >= 61 ? "#f97316" : "#f59e0b",
            fillOpacity: 0.22,
            weight: 2,
          }}
        >
          <Popup>
            <b>{zone.name}</b><br />
            {riskLabel(zone.riskScore)} · score {zone.riskScore}<br />
            Radius {zone.radiusMeters}m<br />
            {zone.description}
          </Popup>
        </Circle>
      ))}

      {reports.map((report) => (
        <Marker key={report.id} position={[report.lat, report.lng]} icon={icon(report.status === "verified" ? "#f97316" : "#94a3b8")}>
          <Popup>
            <b>{report.incidentType}</b><br />
            Status: {report.status}<br />
            Severity: {report.severity}<br />
            {report.description}
          </Popup>
        </Marker>
      ))}

      {safePoints.map((point) => (
        <Marker key={point.id} position={[point.lat, point.lng]} icon={icon("#22c55e")}>
          <Popup>
            <b>{point.name}</b><br />
            {point.type} · {point.open24h ? "24 jam" : "cek jam operasional"}<br />
            {point.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
