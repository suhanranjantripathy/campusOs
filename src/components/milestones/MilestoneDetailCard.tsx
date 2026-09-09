"use client";

import React, { useState } from "react";
import {
  MilestoneItem,
  MilestoneProgressState,
  MilestoneStatus,
  TrackId,
  AimlSubTrack,
} from "@/types/milestones";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  Circle,
  HelpCircle,
  BookOpen,
  Award,
  FileCheck2,
  ExternalLink,
  Save,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MilestoneDetailCardProps {
  trackId: TrackId;
  milestone: MilestoneItem;
  progressState: MilestoneProgressState;
  activeAimlSubTrack: AimlSubTrack;
  onSetStatus: (status: MilestoneStatus) => void;
  onTogglePracticeItem: (item: string) => void;
  onToggleEvidenceItem: (item: string) => void;
  onSetEvidenceLink: (itemKey: string, url: string) => void;
  onSelectAimlSubTrack: (sub: AimlSubTrack) => void;
}

export function MilestoneDetailCard({
  trackId,
  milestone,
  progressState,
  activeAimlSubTrack,
  onSetStatus,
  onTogglePracticeItem,
  onToggleEvidenceItem,
  onSetEvidenceLink,
  onSelectAimlSubTrack,
}: MilestoneDetailCardProps) {
  const currentStatus = progressState?.status || "not_started";
  const completedPractices = progressState?.completedPracticeItems || [];
  const completedEvidences = progressState?.completedEvidenceItems || [];
  const evidenceLinks = progressState?.evidenceLinks || {};

  // For inline link edits
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [linkInput, setLinkInput] = useState<string>("");

  const handleStartEditLink = (key: string, currentUrl?: string) => {
    setEditingKey(key);
    setLinkInput(currentUrl || "");
  };

  const handleSaveLink = (key: string) => {
    onSetEvidenceLink(key, linkInput.trim());
    setEditingKey(null);
  };

  // Determine current practice items & evidence items (support AI/ML sub-tracks)
  const isAimlM3 = trackId === "aiml" && milestone.code === "M3" && milestone.subTracks;
  const currentSubTrack = isAimlM3 ? milestone.subTracks?.[activeAimlSubTrack] : null;

  const practiceItems = currentSubTrack
    ? [...milestone.practice.items, ...currentSubTrack.practice]
    : milestone.practice.items;

  const evidenceItems = currentSubTrack
    ? [...milestone.evidence, ...currentSubTrack.evidence]
    : milestone.evidence;

  const practiceCompletionCount = practiceItems.filter((i) =>
    completedPractices.includes(i)
  ).length;

  const evidenceCompletionCount = evidenceItems.filter(
    (i) => completedEvidences.includes(i) || Boolean(evidenceLinks[i])
  ).length;

  return (
    <div className="space-y-6">
      {/* Milestone Hero Card */}
      <Card className="glass overflow-hidden border-border/70">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-sm font-black px-2.5 py-1 rounded-md bg-primary text-primary-foreground">
                  {milestone.code}
                </span>
                <Badge variant="outline" className="text-xs font-semibold">
                  Stage {milestone.code.slice(1)} of 5
                </Badge>
                {currentStatus === "completed" && (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Cleared
                  </Badge>
                )}
                {currentStatus === "in_progress" && (
                  <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    In Progress
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {milestone.title}
              </h1>

              {/* "Can you say YES?" motivational banner */}
              {milestone.canYouSayYes && (
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary mt-1 text-sm font-medium">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>The Litmus Test: <strong className="font-bold underline decoration-primary/50 underline-offset-2">{milestone.canYouSayYes}</strong></span>
                </div>
              )}
            </div>

            {/* Status Switcher Button Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 bg-background/50 p-1.5 rounded-xl border border-border/60">
              <button
                onClick={() => onSetStatus("not_started")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
                  currentStatus === "not_started"
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Circle className="w-3.5 h-3.5" />
                Not Started
              </button>

              <button
                onClick={() => onSetStatus("in_progress")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
                  currentStatus === "in_progress"
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Clock className="w-3.5 h-3.5" />
                In Progress
              </button>

              <button
                onClick={() => onSetStatus("completed")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
                  currentStatus === "completed"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark Cleared
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI / ML Specialization Sub-Track Selector (M3 only) */}
      {isAimlM3 && milestone.subTracks && (
        <Card className="glass border-purple-500/30 bg-purple-500/5">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  M3 Specialization Selection
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose your deep dive specialization track. Criteria and evidence will update automatically.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(["s1", "s2", "s3"] as AimlSubTrack[]).map((subKey) => {
                const sub = milestone.subTracks![subKey];
                const isActive = activeAimlSubTrack === subKey;

                return (
                  <button
                    key={subKey}
                    onClick={() => onSelectAimlSubTrack(subKey)}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all",
                      isActive
                        ? "bg-card border-purple-500 shadow-sm ring-1 ring-purple-500/30"
                        : "bg-card/40 border-border/60 hover:border-border hover:bg-card/70"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        {sub.code}
                      </span>
                      {isActive && (
                        <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                          Active Path
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-sm text-foreground">{sub.name}</div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3 Pillars Grid: Practice, Gate, Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pillar 1: What you do (The Practice) */}
        <Card className="glass border-border/70 flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                What you do (The Practice)
              </CardTitle>
              <span className="text-xs font-semibold text-muted-foreground">
                {practiceCompletionCount}/{practiceItems.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Hands-on building & daily curriculum tasks.
            </p>
          </CardHeader>

          <CardContent className="space-y-4 flex-1">
            {milestone.practice.overview && (
              <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-xs font-medium text-foreground">
                {milestone.practice.overview}
              </div>
            )}

            <div className="space-y-2.5">
              {practiceItems.map((item, idx) => {
                const isChecked = completedPractices.includes(item);
                return (
                  <div
                    key={idx}
                    onClick={() => onTogglePracticeItem(item)}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none",
                      isChecked
                        ? "bg-primary/5 border-primary/30 text-foreground"
                        : "bg-background/40 hover:bg-background/70 border-border/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground/40 hover:text-primary" />
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-xs leading-relaxed",
                        isChecked && "line-through text-muted-foreground"
                      )}
                    >
                      {item}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Core Topics Badges (if present) */}
            {milestone.practice.coreTopics && (
              <div className="pt-3 border-t border-border/40">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Core Topics Tested
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {milestone.practice.coreTopics.map((topic, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="text-[11px] font-medium py-0.5 px-2 bg-muted/60"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pillar 2: How you clear it (The Gate) */}
        <Card className="glass border-border/70 flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                How you clear it (The Gate)
              </CardTitle>
              <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 text-[11px]">
                {milestone.gate.threshold || "Standard"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Evaluator criteria & benchmark thresholds.
            </p>
          </CardHeader>

          <CardContent className="space-y-4 flex-1">
            {/* Gate Highlight Box */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25">
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                Clearing Threshold
              </div>
              <div className="text-sm font-semibold text-foreground">
                {milestone.gate.threshold || "Pass faculty and proctored assessment"}
              </div>
            </div>

            <div className="space-y-2.5">
              {milestone.gate.criteria.map((crit, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-background/40"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <p className="text-xs leading-relaxed text-foreground font-medium">
                    {crit}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/40 text-[11px] text-muted-foreground leading-relaxed">
              💡 <strong>Pro-tip:</strong> Gates are non-negotiable standards. You cannot jump to the next level until your evaluation score meets the benchmark.
            </div>
          </CardContent>
        </Card>

        {/* Pillar 3: Evidence you must show */}
        <Card className="glass border-border/70 flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-500" />
                Evidence you must show
              </CardTitle>
              <span className="text-xs font-semibold text-muted-foreground">
                {evidenceCompletionCount}/{evidenceItems.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Proof of work & submission links.
            </p>
          </CardHeader>

          <CardContent className="space-y-3.5 flex-1">
            <div className="space-y-2.5">
              {evidenceItems.map((item, idx) => {
                const isChecked = completedEvidences.includes(item);
                const currentLink = evidenceLinks[item] || "";
                const isEditing = editingKey === item;

                return (
                  <div
                    key={idx}
                    className={cn(
                      "p-3 rounded-xl border transition-all space-y-2",
                      isChecked || Boolean(currentLink)
                        ? "bg-emerald-500/5 border-emerald-500/30"
                        : "bg-background/40 border-border/50"
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <button
                        onClick={() => onToggleEvidenceItem(item)}
                        className="mt-0.5 shrink-0 text-muted-foreground hover:text-emerald-500 transition-colors"
                      >
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4 opacity-50" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-xs leading-relaxed font-medium",
                            isChecked ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {item}
                        </p>
                      </div>
                    </div>

                    {/* URL link / proof input */}
                    {isEditing ? (
                      <div className="flex items-center gap-1.5 pt-1">
                        <input
                          type="url"
                          placeholder="Paste GitHub / deployed URL / PDF link..."
                          value={linkInput}
                          onChange={(e) => setLinkInput(e.target.value)}
                          className="flex-1 text-xs px-2.5 py-1.5 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveLink(item);
                          }}
                        />
                        <button
                          onClick={() => handleSaveLink(item)}
                          className="px-2.5 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-semibold flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          Save
                        </button>
                      </div>
                    ) : currentLink ? (
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/30">
                        <a
                          href={currentLink.startsWith("http") ? currentLink : `https://${currentLink}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 truncate max-w-[200px]"
                        >
                          <LinkIcon className="w-3 h-3 shrink-0" />
                          <span className="truncate">{currentLink}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                        <button
                          onClick={() => handleStartEditLink(item, currentLink)}
                          className="text-muted-foreground hover:text-foreground text-[10px] underline ml-2"
                        >
                          Edit
                        </button>
                      </div>
                    ) : (
                      <div className="pt-0.5">
                        <button
                          onClick={() => handleStartEditLink(item)}
                          className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                        >
                          <LinkIcon className="w-3 h-3" />
                          + Attach Link / Proof
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
