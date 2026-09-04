"use client";

import { useCampusStore } from "@/store/campusStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, AlertCircle, Calendar, BookOpen, ExternalLink, Filter } from "lucide-react";
import { useState, useEffect } from "react";

export default function AssignmentsPage() {
  const { assignments, isSyncing, syncAll } = useCampusStore();
  const [filter, setFilter] = useState<"all" | "todo" | "in_progress" | "completed">("all");

  useEffect(() => {
    syncAll();
  }, []);

  const filteredAssignments = assignments.filter((a) => {
    if (filter === "all") return true;
    return a.status === filter;
  });

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignment Tracker</h1>
          <p className="text-muted-foreground text-sm">
            Newton School tasks, homework, and in-class problem sets synced automatically.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={syncAll}
            disabled={isSyncing}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {isSyncing ? "Syncing..." : "Sync Fresh Tasks"}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>Total Tasks</CardDescription>
            <CardTitle className="text-3xl font-bold">{assignments.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Active in course pipeline</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>Pending / Due Soon</CardDescription>
            <CardTitle className="text-3xl font-bold text-amber-400">
              {assignments.filter((a) => a.status === "todo").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Need submission</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl font-bold text-primary">
              {assignments.filter((a) => a.status === "in_progress").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Currently working on</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl font-bold text-emerald-400">
              {assignments.filter((a) => a.status === "completed").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Evaluated & passed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border/40 pb-3">
        {(["all", "todo", "in_progress", "completed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-md px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
              filter === tab
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Task Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredAssignments.map((task) => (
          <Card
            key={task.id}
            className="glass border-white/10 hover:border-primary/40 transition-all shadow-md group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <Badge
                  variant="outline"
                  className={
                    task.priority === "high"
                      ? "border-red-500/40 bg-red-500/10 text-red-400"
                      : task.priority === "medium"
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                      : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  }
                >
                  {task.priority.toUpperCase()} PRIORITY
                </Badge>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {task.dueDate}
                </span>
              </div>
              <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors mt-2">
                {task.title}
              </CardTitle>
              <CardDescription className="text-xs font-medium text-foreground/80">
                {task.subject}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {task.description}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-[11px] font-mono capitalize px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  Status: {task.status.replace("_", " ")}
                </span>
                <a
                  href="https://my.newtonschool.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Solve on Newton <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
