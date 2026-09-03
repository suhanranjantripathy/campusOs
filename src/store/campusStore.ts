import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NewtonProfile, NewtonAttendance, NewtonAssignment } from "@/types/newton";

interface CampusStore {
  // Auth
  isAuthenticated: boolean;
  
  // Data
  profile: NewtonProfile | null;
  attendance: NewtonAttendance | null;
  assignments: NewtonAssignment[];

  // Sync status
  isSyncing: boolean;
  lastSyncedAt: number | null;
  syncError: string | null;

  // Actions
  setAuthenticated: (val: boolean) => void;
  setProfile: (data: NewtonProfile) => void;
  setAttendance: (data: NewtonAttendance) => void;
  setAssignments: (data: NewtonAssignment[]) => void;
  setSyncing: (val: boolean) => void;
  setSyncError: (error: string | null) => void;
  syncAll: () => Promise<void>;
  logout: () => void;
}

export const useCampusStore = create<CampusStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      profile: null,
      attendance: null,
      assignments: [],
      isSyncing: false,
      lastSyncedAt: null,
      syncError: null,

      setAuthenticated: (val) => set({ isAuthenticated: val }),
      setProfile: (data) => set({ profile: data }),
      setAttendance: (data) => set({ attendance: data }),
      setAssignments: (data) => set({ assignments: data }),
      setSyncing: (val) => set({ isSyncing: val }),
      setSyncError: (error) => set({ syncError: error }),

      syncAll: async () => {
        set({ isSyncing: true, syncError: null });
        try {
          // Fetch all data in parallel
          const [profileRes, attendanceRes, assignmentsRes] = await Promise.allSettled([
            fetch("/api/newton/profile").then((r) => r.json()),
            fetch("/api/newton/attendance").then((r) => r.json()),
            fetch("/api/newton/assignments").then((r) => r.json()),
          ]);

          if (profileRes.status === "fulfilled" && profileRes.value.success) {
            set({ profile: profileRes.value.data });
          }
          if (attendanceRes.status === "fulfilled" && attendanceRes.value.success) {
            set({ attendance: attendanceRes.value.data });
          }
          if (assignmentsRes.status === "fulfilled" && assignmentsRes.value.success) {
            set({ assignments: assignmentsRes.value.data });
          }

          set({ lastSyncedAt: Date.now() });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Sync failed";
          set({ syncError: message });
        } finally {
          set({ isSyncing: false });
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          profile: null,
          attendance: null,
          assignments: [],
          lastSyncedAt: null,
        });
        // Clear the server-side session cookie
        fetch("/api/auth/logout", { method: "POST" });
      },
    }),
    {
      name: "campus-store",
      // Don't persist sensitive session data; cookies are handled server-side
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        profile: state.profile,
        attendance: state.attendance,
        assignments: state.assignments,
        lastSyncedAt: state.lastSyncedAt,
      }),
    }
  )
);
