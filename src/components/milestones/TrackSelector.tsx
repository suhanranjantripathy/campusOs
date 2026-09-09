"use client";

import React from "react";
import { TrackId, TrackFramework } from "@/types/milestones";
import { Layers, BrainCircuit, Binary, Network, Cpu, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackSelectorProps {
  tracks: TrackFramework[];
  activeTrackId: TrackId;
  onSelectTrack: (trackId: TrackId) => void;
  getTrackCompletion: (trackId: TrackId) => { completedCount: number; totalCount: number; percentage: number };
}

const iconMap: Record<string, React.ElementType> = {
  Layers,
  BrainCircuit,
  Binary,
  Network,
  Cpu,
};

export function TrackSelector({
  tracks,
  activeTrackId,
  onSelectTrack,
  getTrackCompletion,
}: TrackSelectorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Select Framework Track
        </h3>
        <span className="text-xs text-muted-foreground">
          5 Industry Readiness Tracks
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {tracks.map((track) => {
          const isActive = activeTrackId === track.id;
          const Icon = iconMap[track.icon] || Layers;
          const { completedCount, totalCount, percentage } = getTrackCompletion(track.id);

          return (
            <button
              key={track.id}
              onClick={() => onSelectTrack(track.id)}
              className={cn(
                "relative group text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden",
                isActive
                  ? "bg-card border-primary/50 shadow-md shadow-primary/5 ring-1 ring-primary/40"
                  : "bg-card/60 hover:bg-card border-border/60 hover:border-border hover:shadow-sm"
              )}
            >
              {/* Subtle top indicator bar */}
              <div
                className={cn(
                  "absolute top-0 left-0 right-0 h-1 transition-opacity",
                  isActive ? "opacity-100 bg-primary" : "opacity-0 group-hover:opacity-40 bg-muted-foreground"
                )}
              />

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                      isActive
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted/60 text-muted-foreground border-border/40"
                    )}
                  >
                    {track.badge}
                  </span>
                </div>

                <div className="font-semibold text-sm tracking-tight text-foreground line-clamp-1">
                  {track.name}
                </div>
                <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                  {track.subtitle}
                </div>
              </div>

              {/* Progress mini bar */}
              <div className="mt-3.5 pt-2.5 border-t border-border/40">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-muted-foreground font-medium">Progress</span>
                  <span className="font-bold flex items-center gap-1">
                    {percentage === 100 && (
                      <CheckCircle2 className="w-3 h-3 text-green-500 inline" />
                    )}
                    {completedCount}/{totalCount} ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
