import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "src/lib/newton/data-cache.json");

export async function GET(req: NextRequest) {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      try {
        const cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
        if (cache.profile) {
          return NextResponse.json({ success: true, data: cache.profile });
        }
      } catch {}
    }

    return NextResponse.json(
      { success: false, error: "Please use direct sync to import Newton School profile." },
      { status: 404 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch profile";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
