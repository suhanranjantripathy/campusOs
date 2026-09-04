import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "src/lib/newton/data-cache.json");

export async function GET(req: NextRequest) {
  try {
    // 1. Check direct sync cache first
    if (fs.existsSync(CACHE_FILE)) {
      try {
        const cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
        if (cache.attendance) {
          return NextResponse.json({ success: true, data: cache.attendance });
        }
      } catch {}
    }

    const token = req.cookies.get("newton_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated. Please sync your data." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Please use direct sync to import Newton School attendance." },
      { status: 404 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch attendance";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
