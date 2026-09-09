"use client";

import React from "react";
import { TrackFramework, MilestoneProgressState } from "@/types/milestones";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Trophy, ShieldCheck, Flame, ArrowRight } from "lucide-react";

interface MilestoneProgressOverviewProps {
  activeTrack: TrackFramework;
  trackProgress: Record<string, MilestoneProgressState>;
  percentage: number;
  completedCount: number;
  totalCount: number;
  currentMilestoneCode: string;
  onSelectMilestoneCode: (code: string) => void;
}

export function MilestoneProgressOverview({
  activeTrack,
  trackProgress,
  percentage,
  completedCount,
  totalCount,
  currentMilestoneCode,
  onSelectMilestoneCode,
}: MilestoneProgressOverviewProps) {
  // Find current milestone details
  const currentMilestone = activeTrack.milestones.find((m) => m.code === currentMilestoneCode);
  const nextMilestoneToClear =
    activeTrack.milestones.find((m) => trackProgress[m.code]?.status !== "completed") ||
    activeTrack.milestones[activeTrack.milestones.length - 1];

  // Count total practices & evidences checked
  let totalPracticesChecked = 0;
  let totalEvidenceProvided = 0;

  Object.values(trackProgress || {}).forEach((item) => {
    totalPracticesChecked += item?.completedPracticeItems?.length || 0;
    totalEvidenceProvided += (item?.completedEvidenceItems?.length || 0) + Object.keys(item?.evidenceLinks || {}).length;
  });

  return (
    <div className="w-full">
      <Card className="glass overflow-hidden border-border/60 relative">
        {/* Background glow decoration */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Track Info */}
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5">
                  {activeTrack.badge}
                </Badge>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">Framework 2025–2026</span>
                {percentage === 100 && (
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    Track Cleared
                  </Badge>
                )}
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {activeTrack.name}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activeTrack.description}
              </p>

              {/* Progress bar */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-primary" />
                    Curriculum Completion
                  </span>
                  <span className="font-bold text-primary">{percentage}% Complete</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0 lg:w-96">
              <div className="p-3.5 rounded-xl bg-background/60 border border-border/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                  <span>Cleared</span>
                </div>
                <div className="text-xl font-bold text-foreground">
                  {completedCount} <span className="text-xs font-normal text-muted-foreground">/ {totalCount}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Gates cleared</p>
              </div>

              <div className="p-3.5 rounded-xl bg-background/60 border border-border/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span>Active Level</span>
                </div>
                <div className="text-xl font-bold text-foreground">
                  {currentMilestone ? currentMilestone.code : "M1"}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                  {currentMilestone?.title || "Foundation"}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-background/60 border border-border/50 backdrop-blur-sm col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Evidence</span>
                </div>
                <div className="text-xl font-bold text-foreground">
                  {totalPracticesChecked}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{totalEvidenceProvided} proofs linked</p>
              </div>

              {/* Next Gate callout */}
              <div className="col-span-2 sm:col-span-3 p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {nextMilestoneToClear.code}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-foreground truncate">
                      Next Gate: {nextMilestoneToClear.gate.threshold || nextMilestoneToClear.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {nextMilestoneToClear.title} — {nextMilestoneToClear.canYouSayYes || "Target clearance"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onSelectMilestoneCode(nextMilestoneToClear.code)}
                  className="shrink-0 ml-2 p-1 text-primary hover:text-primary/80 transition-colors"
                  title="Jump to milestone"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
