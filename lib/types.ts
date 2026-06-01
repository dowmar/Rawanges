export type Severity = "low" | "medium" | "high" | "critical";
export type ReportStatus = "pending" | "verified" | "rejected";

export type LatLng = { lat: number; lng: number };

export type Redzone = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  riskScore: number;
  description: string;
  activeFrom: string;
  activeUntil?: string;
};

export type Report = {
  id: string;
  incidentType: string;
  severity: Severity;
  description: string;
  lat: number;
  lng: number;
  happenedAt: string;
  status: ReportStatus;
  createdAt: string;
  anonymous: boolean;
};

export type PanicEvent = {
  id: string;
  lat: number;
  lng: number;
  message?: string;
  createdAt: string;
  status: "triggered" | "cancelled" | "resolved";
};

export type SafePoint = {
  id: string;
  name: string;
  type: "police" | "hospital" | "gas_station" | "minimarket" | "transport";
  lat: number;
  lng: number;
  address: string;
  open24h: boolean;
};

export type Database = {
  redzones: Redzone[];
  reports: Report[];
  panicEvents: PanicEvent[];
  safePoints: SafePoint[];
};
