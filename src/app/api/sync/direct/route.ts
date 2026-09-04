import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "src/lib/newton/data-cache.json");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, *",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const content = fs.readFileSync(CACHE_FILE, "utf-8");
      return NextResponse.json({ success: true, data: JSON.parse(content) }, { headers: corsHeaders });
    }
    return NextResponse.json({ success: false, error: "No cached data found" }, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[DirectSync] Received payload:", {
      name: body.profile?.name,
      overallAttendance: body.attendance?.overall,
      subjectsCount: body.attendance?.subjects?.length,
      assignmentsCount: body.assignments?.length,
    });

    // Ensure directory exists
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Save to disk
    fs.writeFileSync(CACHE_FILE, JSON.stringify(body, null, 2), "utf-8");

    const res = NextResponse.json(
      {
        success: true,
        message: "Data synced successfully to CampusOS!",
        data: body,
      },
      { headers: corsHeaders }
    );

    // Save auth token in cookie if passed
    if (body.token) {
      res.cookies.set("newton_token", body.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync error";
    console.error("[DirectSync] Error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500, headers: corsHeaders });
  }
}
