"use client";

import { useCampusStore } from "@/store/campusStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  GraduationCap,
  Building2,
  Calendar,
  ShieldCheck,
  RefreshCw,
  LogOut,
  Zap,
  Bookmark,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBookmarkletCode, getConsoleScriptCode } from "@/lib/newton/extractor-script";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, setProfile, attendance, lastSyncedAt, isSyncing, syncAll, logout } = useCampusStore();
  const [copiedBookmarklet, setCopiedBookmarklet] = useState(false);
  const [copiedConsole, setCopiedConsole] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookmarklet" | "console">("bookmarklet");

  useEffect(() => {
    if (!profile?.name) {
      setProfile({
        name: "Suhan Ranjan Tripathy",
        email: "e25b070843@adypu.edu.in",
        rollNumber: "e25b070843",
        semester: "3",
        department: "CS + AIML",
        batch: "NSTP'25-CS+AIML",
        avatarUrl: "",
        xp: 4273,
      });
    }
    syncAll();
  }, []);

  const studentName = profile?.name || "Suhan Ranjan Tripathy";
  const studentEmail = profile?.email || "e25b070843@adypu.edu.in";
  const batch = profile?.batch || "NSTP'25-CS+AIML";
  const rollNumber = profile?.rollNumber || "e25b070843";
  const semester = profile?.semester || "3";
  const studentXp = profile?.xp || 4273;

  const bookmarkletHref = getBookmarkletCode();
  const consoleScript = getConsoleScriptCode();

  const handleCopyBookmarklet = () => {
    navigator.clipboard.writeText(bookmarkletHref);
    setCopiedBookmarklet(true);
    setTimeout(() => setCopiedBookmarklet(false), 2500);
  };

  const handleCopyConsole = () => {
    navigator.clipboard.writeText(consoleScript);
    setCopiedConsole(true);
    setTimeout(() => setCopiedConsole(false), 2500);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "ST";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Profile</h1>
          <p className="text-muted-foreground text-sm">
            Academic credentials, Newton School portal integration & sync center.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={syncAll}
            disabled={isSyncing}
            className="flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm font-semibold hover:bg-muted transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Refresh Sync"}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-red-600/10 text-red-400 border border-red-500/20 px-3.5 py-2 text-sm font-semibold hover:bg-red-600/20 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <Card className="glass border-white/10 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary/30 via-indigo-500/20 to-purple-500/30" />
        <CardContent className="relative pt-0 pb-8 px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-12 gap-4">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#00a389] text-3xl font-bold text-white shadow-2xl ring-4 ring-background">
                {getInitials(studentName)}
              </div>
              <div className="space-y-1 mb-1">
                <h2 className="text-2xl font-bold">{studentName}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    {batch}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Roll: {rollNumber}</span>
                  <Badge variant="secondary" className="text-xs font-mono">
                    ⚡ {studentXp} XP
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3 pt-6 border-t border-border/40">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Student Email</p>
                <p className="text-sm font-semibold">{studentEmail}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Course Program</p>
                <p className="text-sm font-semibold">B.Tech Computer Science (AIML)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Institution</p>
                <p className="text-sm font-semibold">Newton School of Technology</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Academic Year</p>
                <p className="text-sm font-semibold">Semester {semester} (2026)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Sync Status</p>
                <p className="text-sm font-semibold text-emerald-400">Newton School Connected</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Last Sync Timestamp</p>
                <p className="text-sm font-semibold">
                  {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : "Just now"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Newton School Live Sync Center */}
      <Card className="glass border-emerald-500/20 bg-emerald-500/[0.02] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  Newton School 1-Click Sync
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                    Google SSO Compatible
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Sync accurate real-time attendance (72%), subjects & assignment deadlines directly from your logged-in browser session.
                </CardDescription>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-background/50 p-1 self-start sm:self-auto">
              <button
                onClick={() => setActiveTab("bookmarklet")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "bookmarklet"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Bookmark className="h-3.5 w-3.5" />
                Bookmarklet (1-Click)
              </button>
              <button
                onClick={() => setActiveTab("console")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "console"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                Console Script
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          {activeTab === "bookmarklet" ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                    <span>⚡ Drag to Your Bookmarks Bar:</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Click & hold the green button and drag it to your browser's bookmarks bar (Cmd+Shift+B / Ctrl+Shift+B).
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={bookmarkletHref}
                    onClick={(e) => {
                      // Prevent navigating if clicked directly in CampusOS
                      e.preventDefault();
                      alert("Drag this button to your browser bookmarks bar, or click 'Copy Code' to save it manually!");
                    }}
                    draggable
                    title="Drag to your bookmarks bar"
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-emerald-500 active:scale-95 transition-all cursor-grab active:cursor-grabbing border border-emerald-400/30"
                  >
                    <Zap className="h-4 w-4" />
                    Sync to CampusOS
                  </a>

                  <button
                    onClick={handleCopyBookmarklet}
                    className="flex items-center gap-1.5 rounded-xl border border-border bg-background/80 px-3 py-2.5 text-xs font-semibold hover:bg-muted transition-all"
                  >
                    {copiedBookmarklet ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Instructions Steps */}
              <div className="grid gap-3 sm:grid-cols-3 pt-2">
                <div className="rounded-xl border border-border/40 bg-card/40 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-[11px]">1</span>
                    Drag Bookmarklet
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Drag the green button above into your bookmarks bar. (Ensure your bookmarks bar is visible).
                  </p>
                </div>

                <div className="rounded-xl border border-border/40 bg-card/40 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-[11px]">2</span>
                    Open Newton School
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Navigate to <a href="https://my.newtonschool.co" target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">my.newtonschool.co <ExternalLink className="h-2.5 w-2.5" /></a> where you are logged in.
                  </p>
                </div>

                <div className="rounded-xl border border-border/40 bg-card/40 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-[11px]">3</span>
                    Click to Sync
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Click the bookmarklet! A sleek green toast appears and CampusOS updates instantly with real data.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-border/50 bg-background/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Terminal className="h-4 w-4 text-primary" />
                    <span>Run in Newton School Developer Tools Console (F12)</span>
                  </div>
                  <button
                    onClick={handleCopyConsole}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow"
                  >
                    {copiedConsole ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Copied Script!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Console Script</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative rounded-lg bg-black/80 p-3 font-mono text-[11px] text-muted-foreground overflow-x-auto max-h-36">
                  <pre className="text-emerald-400">
                    {consoleScript.slice(0, 400)}...
                  </pre>
                </div>

                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>
                    Open <strong className="text-foreground">my.newtonschool.co</strong>, press <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px]">F12</kbd> (or <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px]">Cmd+Option+I</kbd>), paste this script into the <strong>Console</strong> tab, and press Enter.
                  </span>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
