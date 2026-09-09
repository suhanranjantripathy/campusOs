"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  BookOpen,
  Clock,
  Target,
  CheckCircle2,
  BrainCircuit,
  RefreshCw,
} from "lucide-react";
import { useCampusStore } from "@/store/campusStore";
import { useMilestonesStore } from "@/store/milestoneStore";
import { MILESTONE_TRACKS } from "@/data/milestonesData";

export default function DashboardPage() {
  const router = useRouter();
  const {
    isAuthenticated,
    profile,
    attendance,
    assignments,
    isSyncing,
    lastSyncedAt,
    syncAll,
  } = useCampusStore();

  const { activeTrackId, getTrackCompletion, getCurrentMilestoneForTrack } = useMilestonesStore();

  // ── Mounted guard: prevents hydration mismatches from localStorage-persisted
  // Zustand state and time-based values that differ between SSR and client. ──
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    syncAll();
  }, []);

  // All values below are safe to compute on both server and client because
  // they are either stable or hidden behind the `mounted` flag in JSX.
  const activeTrackObj = MILESTONE_TRACKS.find((t) => t.id === activeTrackId) || MILESTONE_TRACKS[0];
  const { percentage: milestonePercentage, completedCount: milestoneCompletedCount } = getTrackCompletion(activeTrackId);
  const currentMilestoneCode = getCurrentMilestoneForTrack(activeTrackId);

  const pendingAssignments = assignments.filter((a) => a.status !== "completed");
  const overallAttendance = attendance?.overall ?? null;
  const studentName = profile?.name || "Suhan Ranjan Tripathy";
  const firstName = studentName.split(" ")[0];

  // Time-based values — computed lazily after mount only
  const greeting = mounted
    ? (() => { const h = new Date().getHours(); return h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening"; })()
    : "Hello";

  const lastSynced = mounted && lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {greeting},{" "}
            {isSyncing ? (
              <Skeleton className="inline-block h-8 w-32 align-middle" />
            ) : (
              firstName
            )}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {profile?.semester ? `Semester ${profile.semester}` : "Newton School"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lastSynced && (
            <p className="text-xs text-muted-foreground">Synced at {lastSynced}</p>
          )}
          <button
            onClick={syncAll}
            disabled={isSyncing}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync Now"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isSyncing || overallAttendance === null ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div
                className={`text-2xl font-bold ${
                  overallAttendance >= 75 ? "text-green-400" : "text-red-400"
                }`}
              >
                {overallAttendance.toFixed(1)}%
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {overallAttendance !== null && overallAttendance < 75
                ? "⚠️ Below 75% threshold"
                : "On track"}
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <BookOpen className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {isSyncing ? (
              <Skeleton className="h-8 w-8" />
            ) : (
              <div className="text-2xl font-bold">{pendingAssignments.length}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {pendingAssignments.length === 0
                ? "All caught up!"
                : `${pendingAssignments.length} remaining`}
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <CalendarDays className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Midsems</div>
            <p className="text-xs text-muted-foreground mt-1">Check calendar for dates</p>
          </CardContent>
        </Card>

        <Card
          className="glass cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => router.push("/milestones")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Milestone Progress</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <span>{mounted ? currentMilestoneCode : "—"}</span>
              <span className="text-sm font-medium text-muted-foreground">
                ({mounted ? milestonePercentage : 0}%)
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {activeTrackObj.name} · {mounted ? milestoneCompletedCount : 0}/5 Cleared
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Attendance Subjects */}
        <Card className="col-span-4 glass">
          <CardHeader>
            <CardTitle>Subject Attendance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isSyncing ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))
            ) : attendance?.subjects && attendance.subjects.length > 0 ? (
              attendance.subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="flex items-center justify-between rounded-md border border-border/50 bg-background/50 p-3"
                >
                  <div>
                    <p className="text-sm font-semibold">{subject.name}</p>
                    {subject.faculty && (
                      <p className="text-xs text-muted-foreground">{subject.faculty}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-bold ${
                        subject.percentage >= 75 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {subject.percentage.toFixed(1)}%
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {subject.attended}/{subject.total}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Sync your data to see attendance
              </p>
            )}
          </CardContent>
        </Card>

        {/* Pending Assignments + Insights */}
        <Card className="col-span-3 glass">
          <CardHeader>
            <CardTitle>Pending Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isSyncing ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))
            ) : pendingAssignments.length > 0 ? (
              pendingAssignments.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start gap-3 rounded-md border border-border/50 bg-background/50 p-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.subject}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      a.priority === "high"
                        ? "border-red-500/40 text-red-400"
                        : a.priority === "medium"
                        ? "border-yellow-500/40 text-yellow-400"
                        : "border-green-500/40 text-green-400"
                    }
                  >
                    {a.priority}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No pending assignments 🎉
              </p>
            )}

            {/* AI Suggestion */}
            <div className="flex items-start space-x-3 rounded-md border border-primary/20 bg-primary/5 p-3 mt-4">
              <BrainCircuit className="mt-0.5 h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium">AI Suggestion</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {attendance?.subjects?.some((s) => s.percentage < 75)
                    ? "You have subjects below 75%. Prioritize attending those classes."
                    : "Great attendance! Focus on completing pending assignments."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
