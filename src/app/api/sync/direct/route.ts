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

    // Validate & normalize payload
    const normalizedData = {
      token: body.token || "",
      refreshToken: body.refreshToken || "",
      courseHash: body.courseHash || "0rsk0a0teyqh",
      profile: {
        name: body.profile?.name || "Suhan Ranjan Tripathy",
        email: body.profile?.email || "e25b070843@adypu.edu.in",
        rollNumber: body.profile?.rollNumber || "e25b070843",
        semester: body.profile?.semester || "3",
        department: body.profile?.department || "CS + AIML",
        batch: body.profile?.batch || "NSTP'25-CS+AIML",
        avatarUrl: body.profile?.avatarUrl || "",
        xp: typeof body.profile?.xp === "number" ? body.profile.xp : 4273,
      },
      attendance: (() => {
        const rawAtt = body.attendance || {};
        const subjects = Array.isArray(rawAtt.subjects) ? rawAtt.subjects.map((s: any) => {
          const attended = typeof s.attended === "number" ? s.attended : 0;
          const total = typeof s.total === "number" ? s.total : 0;
          const percentage = total > 0 ? Number(((attended / total) * 100).toFixed(1)) : 0;
          return {
            id: s.id || String(s.code || s.name || "").toLowerCase().replace(/[^a-z0-9]/g, "-"),
            code: s.code || s.name?.slice(0, 4) || "",
            name: s.name || "Subject",
            faculty: s.faculty || "NST Faculty",
            attended,
            total,
            percentage: typeof s.percentage === "number" ? s.percentage : percentage,
          };
        }) : [];

        let attendedCount = typeof rawAtt.attendedCount === "number" ? rawAtt.attendedCount : undefined;
        let totalCount = typeof rawAtt.totalCount === "number" ? rawAtt.totalCount : undefined;

        if (attendedCount === undefined || totalCount === undefined) {
          attendedCount = subjects.reduce((sum: number, s: any) => sum + s.attended, 0);
          totalCount = subjects.reduce((sum: number, s: any) => sum + s.total, 0);
        }

        let overall = typeof rawAtt.overall === "number" ? rawAtt.overall : undefined;
        if (overall === undefined) {
          overall = totalCount > 0 ? Number(((attendedCount / totalCount) * 100).toFixed(1)) : 72.0;
        }

        return {
          overall,
          overallPercentage: overall,
          attendedCount,
          totalCount,
          attendedLectures: attendedCount,
          totalLectures: totalCount,
          subjects,
          lectures: Array.isArray(rawAtt.lectures) ? rawAtt.lectures : [],
        };
      })(),
      assignments: Array.isArray(body.assignments) ? body.assignments : [],
      syncedAt: Date.now(),
    };

    // Ensure directory exists
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Save normalized clean JSON to disk
    fs.writeFileSync(CACHE_FILE, JSON.stringify(normalizedData, null, 2), "utf-8");

    const res = NextResponse.json(
      {
        success: true,
        message: "Data synced successfully to CampusOS!",
        data: normalizedData,
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
