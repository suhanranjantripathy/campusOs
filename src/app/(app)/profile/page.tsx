"use client";

import { useCampusStore } from "@/store/campusStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, GraduationCap, Building2, Calendar, ShieldCheck, RefreshCw, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, setProfile, attendance, lastSyncedAt, isSyncing, syncAll, logout } = useCampusStore();

  useEffect(() => {
    if (profile?.name === "Sanghamitra Sarangi" || !profile?.name) {
      setProfile({
        name: "Suhan Ranjan Tripathy",
        email: profile?.email || "e25b070843@adypu.edu.in",
        rollNumber: profile?.rollNumber || "e25b070843",
        semester: "3",
        department: "CS + AIML",
        batch: profile?.batch || "NSTP'25-CS+AIML",
        avatarUrl: profile?.avatarUrl || "",
      });
    }
    syncAll();
  }, []);

  const studentName =
    profile?.name && profile.name !== "Sanghamitra Sarangi"
      ? profile.name
      : "Suhan Ranjan Tripathy";
  const studentEmail = profile?.email || "e25b070843@adypu.edu.in";
  const batch = profile?.batch || "NSTP'25-CS+AIML";
  const rollNumber = profile?.rollNumber || "e25b070843";
  const semester = profile?.semester || "3";

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
            Academic credentials and Newton School sync status.
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
    </div>
  );
}
