export type TrackId = 
  | "fullstack" 
  | "aiml" 
  | "dsa" 
  | "system_design" 
  | "core_cs";

export type AimlSubTrack = "s1" | "s2" | "s3";

export type MilestoneStatus = "not_started" | "in_progress" | "completed";

export interface MilestoneGate {
  threshold?: string;
  criteria: string[];
}

export interface MilestoneItem {
  id: string; // e.g. "m1", "m2"
  code: "M1" | "M2" | "M3" | "M4" | "M5";
  title: string;
  canYouSayYes?: string;
  practice: {
    overview?: string;
    items: string[];
    coreTopics?: string[];
  };
  gate: MilestoneGate;
  evidence: string[];
  subTracks?: {
    [key in AimlSubTrack]: {
      name: string;
      code: string;
      practice: string[];
      evidence: string[];
    };
  };
}

export interface TrackFramework {
  id: TrackId;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  badge: string;
  color: string;
  gradient: string;
  milestones: MilestoneItem[];
}

export interface MilestoneProgressState {
  status: MilestoneStatus;
  completedPracticeItems: string[];
  completedEvidenceItems: string[];
  evidenceLinks: { [key: string]: string };
  completedAt?: number;
}

export interface UserTrackProgress {
  selectedMilestoneId: string;
  selectedAimlSubTrack?: AimlSubTrack;
  milestones: {
    [milestoneCode: string]: MilestoneProgressState;
  };
}
