"use client";

import { useCampusStore } from "@/store/campusStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, BookOpen, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function CalendarPage() {
  const { assignments } = useCampusStore();
  const [selectedDate, setSelectedDate] = useState("Sep 5");

  const scheduleEvents = [
    {
      time: "10:10 AM",
      title: "LIMIT, SQL Functions, Aggregate Functions",
      type: "Assignment Due",
      subject: "Database Engineering",
      badge: "Due Today",
      badgeColor: "border-red-500/40 text-red-400 bg-red-500/10",
    },
    {
      time: "11:30 AM - 1:00 PM",
      title: "Express Router, REST API(s), Resource Based URLs",
      type: "Lecture",
      subject: "Backend Engineering",
      badge: "Mandatory",
      badgeColor: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
    },
    {
      time: "2:00 PM - 3:30 PM",
      title: "Matrix Systems, Linear Independence of Euclidean Vectors",
      type: "Lecture",
      subject: "Applied Linear Algebra",
      badge: "Mandatory",
      badgeColor: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
    },
    {
      time: "11:59 PM",
      title: "Express JS Route Handlers & Middleware",
      type: "Assignment Due",
      subject: "Backend Engineering",
      badge: "Upcoming",
      badgeColor: "border-amber-500/40 text-amber-400 bg-amber-500/10",
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Schedule & Calendar</h1>
          <p className="text-muted-foreground text-sm">
            Live schedule of NST lectures, assignment deadlines, and exam milestones.
          </p>
        </div>
      </div>

      {/* Week overview strip */}
      <div className="grid grid-cols-7 gap-2">
        {["Sep 1 (Mon)", "Sep 2 (Tue)", "Sep 3 (Wed)", "Sep 4 (Thu)", "Sep 5 (Fri)", "Sep 6 (Sat)", "Sep 7 (Sun)"].map((day) => {
          const isToday = day.startsWith("Sep 5");
          return (
            <button
              key={day}
              onClick={() => setSelectedDate(day.split(" ")[0])}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center ${
                isToday
                  ? "border-primary bg-primary/10 shadow-md shadow-primary/10 font-bold"
                  : "border-white/5 bg-background/40 hover:bg-white/[0.02]"
              }`}
            >
              <span className="text-xs text-muted-foreground">{day.split(" ")[1].replace("(", "").replace(")", "")}</span>
              <span className="text-lg mt-0.5">{day.split(" ")[0].replace("Sep ", "")}</span>
              {isToday && <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1" />}
            </button>
          );
        })}
      </div>

      {/* Schedule list */}
      <Card className="glass border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Agenda for {selectedDate}, 2026</CardTitle>
              <CardDescription>Scheduled lectures and assignment submission windows</CardDescription>
            </div>
            <Badge variant="outline" className="border-primary/40 text-primary">
              4 Events Scheduled
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {scheduleEvents.map((evt, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-white/5 bg-background/30 hover:bg-white/[0.02] transition-all"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{evt.title}</span>
                    <Badge variant="outline" className={`text-[10px] ${evt.badgeColor}`}>
                      {evt.badge}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {evt.subject} • {evt.type}
                  </p>
                </div>
              </div>
              <div className="font-mono text-xs font-semibold text-foreground/80 sm:text-right">
                {evt.time}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
