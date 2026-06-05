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
    const bytes = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));
    const ext = contentType.split("/")[1]?.split("+")[0] ?? "jpg";
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