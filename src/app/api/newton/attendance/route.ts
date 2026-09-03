import { NextRequest, NextResponse } from "next/server";

const NEWTON_BASE_URL = "https://my.newtonschool.co";

/**
 * Tries multiple possible Newton API endpoint patterns for attendance data.
 * We discover the real endpoint by trying all candidates with the user's token.
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("newton_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated. Please log in first." },
        { status: 401 }
      );
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    };

    // Try all known/likely Newton attendance API patterns
    const candidates = [
      `${NEWTON_BASE_URL}/api/attendance`,
      `${NEWTON_BASE_URL}/api/v1/attendance`,
      `${NEWTON_BASE_URL}/api/v2/attendance`,
      `${NEWTON_BASE_URL}/api/student/attendance`,
      `${NEWTON_BASE_URL}/api/students/attendance`,
      `${NEWTON_BASE_URL}/api/course/attendance`,
    ];

    for (const url of candidates) {
      try {
        const res = await fetch(url, { headers });
        if (res.ok) {
          const data = await res.json();
          console.log("[Newton] Attendance found at:", url);
          return NextResponse.json({ success: true, data, source: url });
        }
      } catch {
        // try next
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Could not find attendance data. The token may be expired or Newton's API endpoint is different.",
      },
      { status: 404 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch attendance";
    console.error("[API] Attendance error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
