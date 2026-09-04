"use client";

import { useCampusStore } from "@/store/campusStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, TrendingUp, Calendar, AlertTriangle, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

export default function AttendancePage() {
  const { attendance, isSyncing, syncAll } = useCampusStore();
  const [targetGoal, setTargetGoal] = useState<number>(75);

  useEffect(() => {
    syncAll();
  }, []);

  const overall = attendance?.overall ?? 72.0;
  const attendedCount = 59;
  const totalCount = 82;

  // Calculate needed classes for target goal
  // (attended + x) / (total + x) >= goal / 100
  // attended + x >= (goal * total + goal * x) / 100
  // 100 * attended + 100 * x >= goal * total + goal * x
  // (100 - goal) * x >= goal * total - 100 * attended
  const neededClasses = Math.max(
    0,
    Math.ceil((targetGoal * totalCount - 100 * attendedCount) / (100 - targetGoal))
  );

  // Calculate safe bouncable classes:
  // (attended) / (total + y) >= goal / 100
  // 100 * attended >= goal * total + goal * y
  // goal * y <= 100 * attended - goal * total
  const skippableClasses = Math.max(
    0,
    Math.floor((100 * attendedCount - targetGoal * totalCount) / targetGoal)
  );

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Intelligence</h1>
          <p className="text-muted-foreground text-sm">
            Live attendance tracking and projection synced from Newton School.
          </p>
        </div>
        <button
          onClick={syncAll}
          disabled={isSyncing}
          className="self-start md:self-auto flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {isSyncing ? "Syncing..." : "Sync Fresh Data"}
        </button>
      </div>

      {/* Warning banner if below 75% */}
      {overall < 75 ? (
        <div className="flex items-start gap-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          <AlertTriangle className="h-6 w-6 shrink-0 text-red-400 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-red-200">Attendance Alert: Below 75% Threshold</h4>
            <p className="text-sm text-red-300/90 leading-relaxed">
              Your overall attendance is currently at <strong className="text-red-100">{overall.toFixed(1)}%</strong> ({attendedCount}/{totalCount} lectures).
              You must attend the next <strong className="text-white bg-red-600/60 px-1.5 py-0.5 rounded font-mono font-bold">{neededClasses} consecutive lectures</strong> without missing any to get back above the safe 75% mark.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300">
          <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-400 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-emerald-200">Attendance Safe</h4>
            <p className="text-sm text-emerald-300/90">
              You are currently maintaining <strong className="text-emerald-100">{overall.toFixed(1)}%</strong> attendance. You can safely miss up to <strong className="text-white font-bold">{skippableClasses} classes</strong> while remaining above 75%.
            </p>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>Overall Attendance</CardDescription>
            <CardTitle className={`text-4xl font-extrabold ${overall >= 75 ? "text-emerald-400" : "text-amber-400"}`}>
              {overall.toFixed(1)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{attendedCount} attended of {totalCount} total</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>Lectures Attended</CardDescription>
            <CardTitle className="text-4xl font-extrabold text-primary">
              {attendedCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Present in class</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>Missed / Absent</CardDescription>
            <CardTitle className="text-4xl font-extrabold text-red-400">
              {totalCount - attendedCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Unattended sessions</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>To Reach {targetGoal}%</CardDescription>
            <CardTitle className="text-4xl font-extrabold text-purple-400">
              +{neededClasses}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Consecutive classes needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Breakdown & Bunk Calculator */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Subjects List */}
        <Card className="col-span-4 glass border-white/10">
          <CardHeader>
            <CardTitle className="text-xl">Subject Breakdown</CardTitle>
            <CardDescription>Detailed attendance performance per course module</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {attendance?.subjects?.map((subj) => (
              <div
                key={subj.id}
                className="space-y-2 rounded-xl border border-white/5 bg-background/40 p-4 transition-all hover:bg-white/[0.02]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{subj.name}</h3>
                    <p className="text-xs text-muted-foreground">{subj.faculty || "NST Faculty"}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-bold ${
                        subj.percentage >= 75 ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {subj.percentage.toFixed(1)}%
                    </span>
                    <p className="text-xs text-muted-foreground font-mono">
                      {subj.attended}/{subj.total} attended
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      subj.percentage >= 75
                        ? "bg-emerald-500"
                        : subj.percentage >= 65
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, subj.percentage))}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bunk / Goal Planner */}
        <Card className="col-span-3 glass border-white/10">
          <CardHeader>
            <CardTitle className="text-xl">Bunk & Target Planner</CardTitle>
            <CardDescription>Simulate future attendance and required classes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Select Desired Goal
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[75, 80, 85].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setTargetGoal(goal)}
                    className={`rounded-lg py-2 text-xs font-bold transition-all ${
                      targetGoal === goal
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "border border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/60"
                    }`}
                  >
                    {goal}% Goal
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <TrendingUp className="h-4 w-4" />
                Target Analysis: {targetGoal}%
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                To reach <strong className="text-foreground">{targetGoal}%</strong> attendance, you must attend the next{" "}
                <strong className="text-primary font-bold">{neededClasses} classes</strong> in a row without any absence.
              </p>
              <div className="pt-2 border-t border-border/30 flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">Projected Attendance:</span>
                <span className="font-bold text-foreground">
                  {((attendedCount + neededClasses) / (totalCount + neededClasses) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-background/30 p-4 space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Recent Lecture History
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/20">
                  <span className="truncate max-w-[180px]">LU Decomposition, Rank</span>
                  <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/30">Missed</Badge>
                </div>
                <div className="flex justify-between py-1 border-b border-border/20">
                  <span className="truncate max-w-[180px]">HAVING Clause, SQL Logic</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">Attended</Badge>
                </div>
                <div className="flex justify-between py-1 border-b border-border/20">
                  <span className="truncate max-w-[180px]">Express Router, REST APIs</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">Attended</Badge>
                </div>
                <div className="flex justify-between py-1">
                  <span className="truncate max-w-[180px]">Backtracking & Recursion</span>
                  <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/30">Missed</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
