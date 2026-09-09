import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TrackId, AimlSubTrack, MilestoneStatus, MilestoneProgressState } from "@/types/milestones";
import { MILESTONE_TRACKS } from "@/data/milestonesData";

interface MilestonesStore {
  activeTrackId: TrackId;
  activeMilestoneId: string;
  activeAimlSubTrack: AimlSubTrack;

  // Track progress keyed by trackId, then milestoneCode (e.g. "M1")
  progress: Record<string, Record<string, MilestoneProgressState>>;

  // Actions
  setActiveTrackId: (id: TrackId) => void;
  setActiveMilestoneId: (id: string) => void;
  setActiveAimlSubTrack: (sub: AimlSubTrack) => void;
  setMilestoneStatus: (trackId: TrackId, milestoneCode: string, status: MilestoneStatus) => void;
  togglePracticeItem: (trackId: TrackId, milestoneCode: string, item: string) => void;
  toggleEvidenceItem: (trackId: TrackId, milestoneCode: string, item: string) => void;
  setEvidenceLink: (trackId: TrackId, milestoneCode: string, itemKey: string, url: string) => void;
  getTrackCompletion: (trackId: TrackId) => { completedCount: number; totalCount: number; percentage: number };
  getCurrentMilestoneForTrack: (trackId: TrackId) => string;
}

const defaultInitialProgress: Record<string, Record<string, MilestoneProgressState>> = {
  fullstack: {
    M1: {
      status: "in_progress",
      completedPracticeItems: [
        "Finish the prep kit + assignments on Newton Portal",
        "Cover JS, React, HTTP/REST, Git, and SQL basics",
      ],
      completedEvidenceItems: ["Prep-kit + assignments completed on portal"],
      evidenceLinks: {},
    },
    M2: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
    M3: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
    M4: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
    M5: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
  },
  aiml: {
    M1: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
    M2: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
    M3: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
    M4: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
    M5: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
  },
  dsa: {
    M1: {
      status: "in_progress",
      completedPracticeItems: ["Solve 100 problems (cumulative)"],
      completedEvidenceItems: [],
      evidenceLinks: {},
    },
    M2: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
    M3: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
    M4: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
    M5: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
  },
  system_design: {
    M1: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
    M2: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
    M3: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
    M4: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
    M5: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
  },
  core_cs: {
    M1: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
    M2: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
    M3: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
    M4: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
    M5: { status: "not_started", completedPracticeItems: [], completedEvidenceItems: [], evidenceLinks: {} },
  },
};

export const useMilestonesStore = create<MilestonesStore>()(
  persist(
    (set, get) => ({
      activeTrackId: "fullstack",
      activeMilestoneId: "fullstack-m1",
      activeAimlSubTrack: "s1",
      progress: defaultInitialProgress,

      setActiveTrackId: (id: TrackId) => {
        const track = MILESTONE_TRACKS.find((t) => t.id === id);
        const firstMilestoneId = track ? track.milestones[0].id : `${id}-m1`;
        set({ activeTrackId: id, activeMilestoneId: firstMilestoneId });
      },

      setActiveMilestoneId: (id: string) => {
        set({ activeMilestoneId: id });
      },

      setActiveAimlSubTrack: (sub: AimlSubTrack) => {
        set({ activeAimlSubTrack: sub });
      },

      setMilestoneStatus: (trackId: TrackId, milestoneCode: string, status: MilestoneStatus) => {
        set((state) => {
          const trackProgress = state.progress[trackId] || {};
          const currentMilestone = trackProgress[milestoneCode] || {
            status: "not_started",
            completedPracticeItems: [],
            completedEvidenceItems: [],
            evidenceLinks: {},
          };

          return {
            progress: {
              ...state.progress,
              [trackId]: {
                ...trackProgress,
                [milestoneCode]: {
                  ...currentMilestone,
                  status,
                  completedAt: status === "completed" ? Date.now() : undefined,
                },
              },
            },
          };
        });
      },

      togglePracticeItem: (trackId: TrackId, milestoneCode: string, item: string) => {
        set((state) => {
          const trackProgress = state.progress[trackId] || {};
          const currentMilestone = trackProgress[milestoneCode] || {
            status: "in_progress",
            completedPracticeItems: [],
            completedEvidenceItems: [],
            evidenceLinks: {},
          };

          const isAlreadyCompleted = currentMilestone.completedPracticeItems.includes(item);
          const updatedItems = isAlreadyCompleted
            ? currentMilestone.completedPracticeItems.filter((i) => i !== item)
            : [...currentMilestone.completedPracticeItems, item];

          const newStatus =
            currentMilestone.status === "not_started" && updatedItems.length > 0
              ? "in_progress"
              : currentMilestone.status;

          return {
            progress: {
              ...state.progress,
              [trackId]: {
                ...trackProgress,
                [milestoneCode]: {
                  ...currentMilestone,
                  status: newStatus,
                  completedPracticeItems: updatedItems,
                },
              },
            },
          };
        });
      },

      toggleEvidenceItem: (trackId: TrackId, milestoneCode: string, item: string) => {
        set((state) => {
          const trackProgress = state.progress[trackId] || {};
          const currentMilestone = trackProgress[milestoneCode] || {
            status: "in_progress",
            completedPracticeItems: [],
            completedEvidenceItems: [],
            evidenceLinks: {},
          };

          const isAlreadyCompleted = currentMilestone.completedEvidenceItems.includes(item);
          const updatedItems = isAlreadyCompleted
            ? currentMilestone.completedEvidenceItems.filter((i) => i !== item)
            : [...currentMilestone.completedEvidenceItems, item];

          return {
            progress: {
              ...state.progress,
              [trackId]: {
                ...trackProgress,
                [milestoneCode]: {
                  ...currentMilestone,
                  completedEvidenceItems: updatedItems,
                },
              },
            },
          };
        });
      },

      setEvidenceLink: (trackId: TrackId, milestoneCode: string, itemKey: string, url: string) => {
        set((state) => {
          const trackProgress = state.progress[trackId] || {};
          const currentMilestone = trackProgress[milestoneCode] || {
            status: "in_progress",
            completedPracticeItems: [],
            completedEvidenceItems: [],
            evidenceLinks: {},
          };

          return {
            progress: {
              ...state.progress,
              [trackId]: {
                ...trackProgress,
                [milestoneCode]: {
                  ...currentMilestone,
                  evidenceLinks: {
                    ...currentMilestone.evidenceLinks,
                    [itemKey]: url,
                  },
                },
              },
            },
          };
        });
      },

      getTrackCompletion: (trackId: TrackId) => {
        const state = get();
        const trackProgress = state.progress[trackId] || {};
        const totalCount = 5;
        let completedCount = 0;

        ["M1", "M2", "M3", "M4", "M5"].forEach((code) => {
          if (trackProgress[code]?.status === "completed") {
            completedCount += 1;
          }
        });

        const percentage = Math.round((completedCount / totalCount) * 100);
        return { completedCount, totalCount, percentage };
      },

      getCurrentMilestoneForTrack: (trackId: TrackId) => {
        const state = get();
        const trackProgress = state.progress[trackId] || {};

        for (const code of ["M1", "M2", "M3", "M4", "M5"]) {
          const status = trackProgress[code]?.status;
          if (status === "in_progress") {
            return code;
          }
          if (status !== "completed") {
            return code;
          }
        }
        return "M5";
      },
    }),
    {
      name: "campus-milestones-storage",
    }
  )
);
