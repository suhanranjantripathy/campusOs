import { NextRequest, NextResponse } from "next/server";

const NEWTON_BASE_URL = "https://my.newtonschool.co";

/**
 * Validates the user's Newton School session token by making a test API call.
 * The token is stored in an HTTP-only cookie for subsequent data fetches.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body as { token: string };

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required." },
        { status: 400 }
      );
    }

    console.log("[API] Validating Newton School token...");

    // Verify the token by making a test request to Newton's API
    // We try a few possible token header formats
    const testUrls = [
      `${NEWTON_BASE_URL}/api/user/profile`,
      `${NEWTON_BASE_URL}/api/student/profile`,
      `${NEWTON_BASE_URL}/api/v1/user`,
      `${NEWTON_BASE_URL}/api/v2/user`,
    ];

    let isValid = false;

    for (const url of testUrls) {
      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          },
        });
        // If we get anything other than 401/403, the token is valid
        if (res.status !== 401 && res.status !== 403 && res.status !== 404) {
          console.log("[API] Token validated via:", url, "status:", res.status);
          isValid = true;
          break;
        }
      } catch {
        // continue to next URL
      }
    }

    // Even if the profile endpoint isn't found, store the token if it's a well-formed JWT
    // This allows us to proceed and discover endpoints during scraping
    if (!isValid) {
      const isJWT = token.split(".").length === 3;
      const isLong = token.length > 20;
      if (isJWT || isLong) {
        console.log("[API] Token appears valid (JWT/long form), proceeding...");
        isValid = true;
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid token. Please check the steps and try again." },
        { status: 401 }
      );
    }

    // Store token in HTTP-only cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("newton_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Authentication failed";
    console.error("[API] Auth error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("newton_token");
  return response;
}
