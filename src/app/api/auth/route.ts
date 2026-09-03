import { NextRequest, NextResponse } from "next/server";
import { authenticateNewton } from "@/lib/newton/scraper";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    console.log("[API] Attempting Newton login for:", email);
    const session = await authenticateNewton(email, password);

    // Store the session token in an HTTP-only cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("newton_session", session.cookies, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    response.cookies.set("newton_session_ts", String(session.timestamp), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Authentication failed";
    console.error("[API] Newton auth error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 401 });
  }
}
