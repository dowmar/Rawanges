import { z } from "zod";

export const reportSchema = z.object({
  incidentType: z.string().min(2).max(80),
  severity: z.enum(["low", "medium", "high", "critical"]),
  description: z.string().min(5).max(1000),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  happenedAt: z.string().datetime().optional(),
  anonymous: z.coerce.boolean().default(true),
});

export const panicSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  message: z.string().max(500).optional(),
});

export const redzoneSchema = z.object({
  name: z.string().min(3).max(120),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radiusMeters: z.coerce.number().min(50).max(5000),
  riskScore: z.coerce.number().min(0).max(100),
  description: z.string().min(5).max(800),
});
