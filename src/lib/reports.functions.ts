import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { callAIChat } from "./ai-gateway.server";
import { detectAuthority } from "./authority-map";

const analyzeSchema = z.object({
  imageBase64: z.string().min(10).max(15_000_000),
});

export const analyzeImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => analyzeSchema.parse(d))
  .handler(async ({ data }) => {
    const content = await callAIChat({
      model: "google/gemini-2.5-flash",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a civic-issue vision analyst. Given a photo, output strict JSON with keys: issue_type (short label like 'Pothole', 'Garbage Dump', 'Broken Streetlight', 'Sewage Overflow', 'Stray Animals', 'Encroachment', 'Water Logging', 'Illegal Parking'), severity ('low' | 'medium' | 'high'), description (2-3 sentence factual description). Respond with ONLY valid JSON, no markdown.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this civic issue photo and return JSON." },
            { type: "image_url", image_url: { url: data.imageBase64 } },
          ],
        },
      ],
    });
    try {
      const cleaned = content.replace(/^```json\s*|\s*```$/g, "").trim();
      const parsed = JSON.parse(cleaned) as {
        issue_type: string;
        severity: "low" | "medium" | "high";
        description: string;
      };
      const auth = detectAuthority(parsed.issue_type, parsed.description);
      return { ...parsed, authority: auth };
    } catch {
      throw new Error("AI returned an invalid response. Please try again.");
    }
  });

const complaintSchema = z.object({
  issueType: z.string().min(2).max(200),
  description: z.string().min(2).max(2000),
  address: z.string().max(500).optional(),
  authority: z.string().min(2).max(200),
  language: z.enum(["en", "hi", "te"]).default("en"),
});

export const generateComplaint = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => complaintSchema.parse(d))
  .handler(async ({ data }) => {
    const langName = data.language === "hi" ? "Hindi" : data.language === "te" ? "Telugu" : "English";
    const content = await callAIChat({
      model: "google/gemini-2.5-flash",
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You write professional civic complaint letters in ${langName}. Respond with strict JSON: { "subject": string, "body": string }. The body should be 4-6 short paragraphs, polite but firm, address the authority by name, describe the issue with location, request specific action and timeline. No markdown.`,
        },
        {
          role: "user",
          content: `Issue Type: ${data.issueType}\nDescription: ${data.description}\nLocation: ${data.address ?? "Coordinates provided"}\nAuthority: ${data.authority}\n\nWrite the complaint.`,
        },
      ],
    });
    try {
      const cleaned = content.replace(/^```json\s*|\s*```$/g, "").trim();
      return JSON.parse(cleaned) as { subject: string; body: string };
    } catch {
      throw new Error("AI returned an invalid response. Please try again.");
    }
  });

const submitSchema = z.object({
  imageBase64: z.string().min(10),
  imageContentType: z.string().min(3).max(100),
  issueType: z.string().min(2).max(200),
  severity: z.enum(["low", "medium", "high"]),
  description: z.string().min(2).max(2000),
  authority: z.string().min(2).max(200),
  authorityContact: z.string().max(200).optional(),
  subject: z.string().min(2).max(300),
  complaintBody: z.string().min(2).max(8000),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().max(500).optional(),
});

export const submitReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => submitSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // decode data URL
    const m = /^data:([^;]+);base64,(.+)$/.exec(data.imageBase64);
    if (!m) throw new Error("Invalid image data");
    const contentType = m[1];
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!ALLOWED_TYPES.includes(contentType)) {
      throw new Error("Unsupported image type. Please upload a JPEG, PNG, GIF, or WebP image.");
    }
    const bytes = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));
    const extMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
    };
    const ext = extMap[contentType];
    const path = `${context.userId}/${crypto.randomUUID()}.${ext}`;
    const up = await supabaseAdmin.storage
      .from("report-images")
      .upload(path, bytes, { contentType, upsert: false });
    if (up.error) throw new Error(up.error.message);
    const { data: pub } = supabaseAdmin.storage.from("report-images").getPublicUrl(path);

    const ins = await context.supabase
      .from("reports")
      .insert({
        user_id: context.userId,
        image_url: pub.publicUrl,
        issue_type: data.issueType,
        severity: data.severity,
        description: data.description,
        authority: data.authority,
        authority_contact: data.authorityContact ?? null,
        subject: data.subject,
        complaint_body: data.complaintBody,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address ?? null,
      })
      .select("id")
      .single();
    if (ins.error) throw new Error(ins.error.message);
    return { id: ins.data.id };
  });

export const listMyReports = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const r = await context.supabase
      .from("reports")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (r.error) throw new Error(r.error.message);
    return r.data;
  });

export const myStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const r = await context.supabase.from("reports").select("status", { count: "exact" }).eq("user_id", context.userId);
    if (r.error) throw new Error(r.error.message);
    const rows = r.data ?? [];
    return {
      total: rows.length,
      pending: rows.filter((x) => x.status === "submitted" || x.status === "under_review").length,
      assigned: rows.filter((x) => x.status === "assigned").length,
      resolved: rows.filter((x) => x.status === "resolved").length,
    };
  });

export const listCommunityReports = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const r = await supabaseAdmin
    .from("reports")
    .select("id,image_url,issue_type,severity,description,authority,latitude,longitude,address,status,support_count,created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  if (r.error) throw new Error(r.error.message);
  return r.data;
});

export const toggleSupport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ reportId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const exists = await context.supabase
      .from("community_support")
      .select("id")
      .eq("report_id", data.reportId)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (exists.data) {
      const del = await context.supabase.from("community_support").delete().eq("id", exists.data.id);
      if (del.error) throw new Error(del.error.message);
      return { supported: false };
    }
    const ins = await context.supabase
      .from("community_support")
      .insert({ report_id: data.reportId, user_id: context.userId });
    if (ins.error) throw new Error(ins.error.message);
    return { supported: true };
  });

const similarSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  issueType: z.string().min(1).max(200),
  severity: z.enum(["low", "medium", "high"]),
  radiusMeters: z.number().min(100).max(5000).default(1000),
});

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export const findSimilarAndScore = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => similarSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Bounding box ~ radius
    const dLat = data.radiusMeters / 111_000;
    const dLng = data.radiusMeters / (111_000 * Math.cos((data.latitude * Math.PI) / 180));
    const r = await supabaseAdmin
      .from("reports")
      .select("id,issue_type,severity,latitude,longitude,support_count,created_at")
      .gte("latitude", data.latitude - dLat)
      .lte("latitude", data.latitude + dLat)
      .gte("longitude", data.longitude - dLng)
      .lte("longitude", data.longitude + dLng)
      .limit(500);
    if (r.error) throw new Error(r.error.message);
    const rows = (r.data ?? []).map((row) => ({
      ...row,
      distance: haversine(data.latitude, data.longitude, row.latitude, row.longitude),
    }));
    const within = rows.filter((row) => row.distance <= data.radiusMeters);
    const typeMatch = within.filter(
      (row) => row.issue_type.toLowerCase() === data.issueType.toLowerCase(),
    );
    const nearest = typeMatch.length
      ? typeMatch.reduce((a, b) => (a.distance < b.distance ? a : b))
      : null;
    const nearbyAll = within.length;

    // Impact score (0-100)
    const sevScore = data.severity === "high" ? 40 : data.severity === "medium" ? 26 : 14;
    const nearbyScore = Math.min(30, typeMatch.length * 3 + Math.floor(nearbyAll / 3));
    // Population density proxy: more reports in a 5km box = denser area
    const density = rows.length;
    const densityScore = Math.min(15, Math.floor(density / 4));
    const typeWeight: Record<string, number> = {
      pothole: 15,
      "water logging": 15,
      sewage: 15,
      "sewage overflow": 15,
      "broken streetlight": 12,
      "garbage dump": 12,
      "stray animals": 10,
      encroachment: 10,
      "illegal parking": 8,
    };
    const typeScore = typeWeight[data.issueType.toLowerCase()] ?? 10;
    const impactScore = Math.min(100, sevScore + nearbyScore + densityScore + typeScore);
    const riskLabel =
      impactScore >= 75 ? "High Risk" : impactScore >= 50 ? "Medium Risk" : "Low Risk";
    // Affected citizens estimate
    const base = data.severity === "high" ? 300 : data.severity === "medium" ? 120 : 40;
    const affected = base + nearbyAll * 35 + density * 5;
    const affectedLabel =
      affected >= 1000 ? "1000+" : affected >= 500 ? "500+" : affected >= 200 ? "200+" : `${Math.max(20, Math.round(affected / 10) * 10)}+`;

    return {
      similarCount: typeMatch.length,
      nearbyAll,
      nearestMeters: nearest ? Math.round(nearest.distance) : null,
      impactScore,
      riskLabel,
      affectedLabel,
      factors: {
        severity: sevScore,
        nearby: nearbyScore,
        density: densityScore,
        issueType: typeScore,
      },
    };
  });