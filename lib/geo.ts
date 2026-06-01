import type { LatLng, Redzone } from "./types";

const EARTH_RADIUS_M = 6371000;

export function distanceMeters(a: LatLng, b: LatLng) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function riskLabel(score: number) {
  if (score >= 81) return "Sangat Rawan";
  if (score >= 61) return "Rawan";
  if (score >= 31) return "Waspada";
  return "Normal";
}

export function checkRedzone(user: LatLng, redzones: Redzone[]) {
  const hits = redzones
    .map((zone) => ({ zone, distance: distanceMeters(user, { lat: zone.lat, lng: zone.lng }) }))
    .filter((x) => x.distance <= x.zone.radiusMeters)
    .sort((a, b) => b.zone.riskScore - a.zone.riskScore);

  const nearest = redzones
    .map((zone) => ({ zone, distance: distanceMeters(user, { lat: zone.lat, lng: zone.lng }) }))
    .sort((a, b) => a.distance - b.distance)[0];

  return {
    inside: hits.length > 0,
    zones: hits,
    nearest,
    highestRisk: hits[0]?.zone.riskScore ?? 0,
    label: riskLabel(hits[0]?.zone.riskScore ?? 0),
  };
}

export function jakartaCenter(): LatLng {
  return { lat: -6.2088, lng: 106.8456 };
}
