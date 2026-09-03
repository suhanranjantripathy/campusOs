import { NextRequest, NextResponse } from "next/server";
import { scrapeAttendance } from "@/lib/newton/scraper";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("newton_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: "Not authenticated. Please log in first." },
        { status: 401 }
      );
    }

    const session = {
      cookies: sessionCookie,
      timestamp: Number(req.cookies.get("newton_session_ts")?.value || Date.now()),
    };

    console.log("[API] Scraping attendance data...");
    const data = await scrapeAttendance(session);

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch attendance";
    console.error("[API] Attendance scrape error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
