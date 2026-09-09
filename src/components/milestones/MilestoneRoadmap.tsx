"use client";

import React from "react";
import { MilestoneItem, MilestoneProgressState } from "@/types/milestones";
import { CheckCircle2, Clock, CircleDot, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MilestoneRoadmapProps {
  milestones: MilestoneItem[];
  activeMilestoneId: string;
  trackProgress: Record<string, MilestoneProgressState>;
  onSelectMilestone: (id: string) => void;
}

export function MilestoneRoadmap({
  milestones,
  activeMilestoneId,
  trackProgress,
  onSelectMilestone,
}: MilestoneRoadmapProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Milestone Progression Roadmap
        </h3>
        <span className="text-xs text-muted-foreground">
          Click any level to view criteria & submit evidence
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 relative">
        {milestones.map((milestone, idx) => {
          const isSelected = activeMilestoneId === milestone.id;
          const statusState = trackProgress[milestone.code] || { status: "not_started" };
          const status = statusState.status;
          const isCompleted = status === "completed";
          const isInProgress = status === "in_progress";

          return (
            <button
              key={milestone.id}
              onClick={() => onSelectMilestone(milestone.id)}
              className={cn(
                "group relative p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer",
                isSelected
                  ? "bg-card border-primary shadow-md shadow-primary/10 ring-2 ring-primary/40"
                  : isCompleted
                  ? "bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/60"
                  : isInProgress
                  ? "bg-amber-500/5 border-amber-500/30 hover:border-amber-500/60"
                  : "bg-card/40 border-border/60 hover:border-border hover:bg-card/70"
              )}
            >
              {/* Connector arrow indicator (for desktop) */}
              {idx < milestones.length - 1 && (
                <div className="hidden sm:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={cn(
                      "text-xs font-black px-2 py-0.5 rounded-md",
                      isCompleted
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : isInProgress
                        ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {milestone.code}
                  </span>

                  <div className="flex items-center">
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Cleared
                      </span>
                    ) : isInProgress ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                        <Clock className="w-3.5 h-3.5" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <CircleDot className="w-3.5 h-3.5 opacity-40" />
                        Locked
                      </span>
                    )}
                  </div>
                </div>

                <h4
                  className={cn(
                    "text-sm font-bold tracking-tight line-clamp-1",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {milestone.title}
                </h4>

                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 min-h-[32px]">
                  {milestone.canYouSayYes || milestone.gate.threshold || "Standard gate"}
                </p>
              </div>

              {/* Threshold badge */}
              <div className="mt-3 pt-2 border-t border-border/40">
                <span className="text-[10px] font-medium text-muted-foreground block truncate">
                  Gate: {milestone.gate.threshold || "Assessment"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
