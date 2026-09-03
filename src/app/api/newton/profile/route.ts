import { NextRequest, NextResponse } from "next/server";

const NEWTON_BASE_URL = "https://my.newtonschool.co";

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

    const candidates = [
      `${NEWTON_BASE_URL}/api/user/profile`,
      `${NEWTON_BASE_URL}/api/user`,
      `${NEWTON_BASE_URL}/api/v1/user`,
      `${NEWTON_BASE_URL}/api/v2/user`,
      `${NEWTON_BASE_URL}/api/student/profile`,
      `${NEWTON_BASE_URL}/api/student`,
      `${NEWTON_BASE_URL}/api/profile`,
    ];

    for (const url of candidates) {
      try {
        const res = await fetch(url, { headers });
        if (res.ok) {
          const data = await res.json();
          console.log("[Newton] Profile found at:", url);
          return NextResponse.json({ success: true, data, source: url });
        }
      } catch {
        // try next
      }
    }

    return NextResponse.json(
      { success: false, error: "Could not find profile data." },
      { status: 404 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch profile";
    console.error("[API] Profile error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
