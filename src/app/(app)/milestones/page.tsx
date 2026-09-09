"use client";

import React, { useSyncExternalStore } from "react";
import { MILESTONE_TRACKS } from "@/data/milestonesData";
import { useMilestonesStore } from "@/store/milestoneStore";
import { TrackSelector } from "@/components/milestones/TrackSelector";
import { MilestoneProgressOverview } from "@/components/milestones/MilestoneProgressOverview";
import { MilestoneRoadmap } from "@/components/milestones/MilestoneRoadmap";
import { MilestoneDetailCard } from "@/components/milestones/MilestoneDetailCard";
import { Skeleton } from "@/components/ui/skeleton";
import { TrackId } from "@/types/milestones";
import { Sparkles, RotateCcw } from "lucide-react";

const emptySubscribe = () => () => {};

export default function MilestonesPage() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const {
    activeTrackId,
    activeMilestoneId,
    activeAimlSubTrack,
    progress,
    setActiveTrackId,
    setActiveMilestoneId,
    setActiveAimlSubTrack,
    setMilestoneStatus,
    togglePracticeItem,
    toggleEvidenceItem,
    setEvidenceLink,
    getTrackCompletion,
    getCurrentMilestoneForTrack,
  } = useMilestonesStore();

  const activeTrack =
    MILESTONE_TRACKS.find((t) => t.id === activeTrackId) || MILESTONE_TRACKS[0];

  const activeMilestone =
    activeTrack.milestones.find((m) => m.id === activeMilestoneId) ||
    activeTrack.milestones[0];

  const currentTrackProgress = progress[activeTrack.id] || {};
  const { completedCount, totalCount, percentage } = getTrackCompletion(activeTrack.id);
  const currentMilestoneCode = getCurrentMilestoneForTrack(activeTrack.id);

  const handleSelectMilestoneCode = (code: string) => {
    const target = activeTrack.milestones.find((m) => m.code === code);
    if (target) {
      setActiveMilestoneId(target.id);
    }
  };

  const handleResetTrack = () => {
    if (
      confirm(
        `Are you sure you want to reset all recorded progress for the ${activeTrack.name} track?`
      )
    ) {
      ["M1", "M2", "M3", "M4", "M5"].forEach((code) => {
        setMilestoneStatus(activeTrack.id, code, "not_started");
      });
    }
  };

  if (!isMounted) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 sm:p-8 pt-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-primary/10 text-primary">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Competency Matrix & Verification
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Milestone Framework Tracker
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            5-stage standardized clearance gates for Full-Stack, AI/ML, DSA, System Design, and Core CS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetTrack}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-border/60 hover:bg-muted rounded-lg transition-colors"
            title="Reset current track progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Track
          </button>
        </div>
      </div>

      {/* 1. Track Selector Tabs */}
      <TrackSelector
        tracks={MILESTONE_TRACKS}
        activeTrackId={activeTrack.id}
        onSelectTrack={(id: TrackId) => setActiveTrackId(id)}
        getTrackCompletion={getTrackCompletion}
      />

      {/* 2. Track Progress Overview & Next Gate */}
      <MilestoneProgressOverview
        activeTrack={activeTrack}
        trackProgress={currentTrackProgress}
        percentage={percentage}
        completedCount={completedCount}
        totalCount={totalCount}
        currentMilestoneCode={currentMilestoneCode}
        onSelectMilestoneCode={handleSelectMilestoneCode}
      />

      {/* 3. Milestone Progression Stepper / Roadmap */}
      <MilestoneRoadmap
        milestones={activeTrack.milestones}
        activeMilestoneId={activeMilestone.id}
        trackProgress={currentTrackProgress}
        onSelectMilestone={(id: string) => setActiveMilestoneId(id)}
      />

      {/* 4. Active Milestone Detail (Practice, Gate, Evidence) */}
      <MilestoneDetailCard
        key={activeMilestone.id}
        trackId={activeTrack.id}
        milestone={activeMilestone}
        progressState={
          currentTrackProgress[activeMilestone.code] || {
            status: "not_started",
            completedPracticeItems: [],
            completedEvidenceItems: [],
            evidenceLinks: {},
          }
        }
        activeAimlSubTrack={activeAimlSubTrack}
        onSetStatus={(status) =>
          setMilestoneStatus(activeTrack.id, activeMilestone.code, status)
        }
        onTogglePracticeItem={(item) =>
          togglePracticeItem(activeTrack.id, activeMilestone.code, item)
        }
        onToggleEvidenceItem={(item) =>
          toggleEvidenceItem(activeTrack.id, activeMilestone.code, item)
        }
        onSetEvidenceLink={(itemKey, url) =>
          setEvidenceLink(activeTrack.id, activeMilestone.code, itemKey, url)
        }
        onSelectAimlSubTrack={(sub) => setActiveAimlSubTrack(sub)}
      />
    </div>
  );
}
