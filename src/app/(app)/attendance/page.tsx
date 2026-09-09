'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  BookOpen,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  GraduationCap,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  emoji: string;
  attended: number;
  total: number;
}

const THRESHOLDS = [75, 80, 85, 90] as const;

function pct(attended: number, total: number) {
  if (total === 0) return 0;
  return (attended / total) * 100;
}

function classesNeededFor(attended: number, total: number, goal: number) {
  if (pct(attended, total) >= goal) return 0;
  return Math.ceil((goal * total - 100 * attended) / (100 - goal));
}

function classesCanSkipFor(attended: number, total: number, goal: number) {
  if (pct(attended, total) < goal) return 0;
  return Math.max(0, Math.floor((100 * attended - goal * total) / goal));
}

const EMOJIS = ['📘', '🧮', '🧠', '💼', '🌐', '🔬', '🎯', '🏗️', '⚙️', '🖥️'];

const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'ada', name: 'ADA', emoji: '📘', attended: 14, total: 20 },
  { id: 'asd', name: 'ASD', emoji: '🧠', attended: 16, total: 22 },
  { id: 'de', name: 'DE', emoji: '⚙️', attended: 17, total: 22 },
  { id: 'maths-3', name: 'Maths 3', emoji: '🧮', attended: 12, total: 18 },
  { id: 'entrepreneurship', name: 'Entrepreneurship', emoji: '💼', attended: 0, total: 0 },
];

const STORAGE_KEY = 'campusOs:attendance:subjects';

function saveSubjects(subjects: Subject[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects)); } catch {}
}

// ─── ThresholdGrid ────────────────────────────────────────────────────────────

function ThresholdGrid({ attended, total }: { attended: number; total: number }) {
  const percentage = pct(attended, total);
  return (
    <div className="grid grid-cols-4 gap-1.5 mt-3">
      {THRESHOLDS.map((t) => {
        const needed = classesNeededFor(attended, total, t);
        const canSkip = classesCanSkipFor(attended, total, t);
        const achieved = percentage >= t;
        const bgStyle = achieved
          ? { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }
          : { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' };
        return (
          <div key={t} style={bgStyle} className="rounded-xl p-2.5 text-center">
            <p className={achieved ? 'text-[10px] font-bold mb-1 text-emerald-400' : 'text-[10px] font-bold mb-1 text-red-400'}>
              {t}%
            </p>
            <p className="text-base font-extrabold text-foreground leading-none">
              {achieved ? canSkip : needed}
            </p>
            <p className="text-[9px] text-muted-foreground mt-0.5">{achieved ? 'can skip' : 'needed'}</p>
          </div>
        );
      })}
    </div>
  );
}

// ─── SubjectCard ──────────────────────────────────────────────────────────────

interface SubjectCardProps {
  subject: Subject;
  onAttend: () => void;
  onMiss: () => void;
  onUndoAttend: () => void;
  onUndoMiss: () => void;
  onDelete: () => void;
}

function SubjectCard({ subject, onAttend, onMiss, onUndoAttend, onUndoMiss, onDelete }: SubjectCardProps) {
  const { name, emoji, attended, total } = subject;
  const percentage = pct(attended, total);
  const isSafe = percentage >= 75;
  const barColor =
    percentage >= 85 ? '#10b981' :
    percentage >= 75 ? '#f59e0b' :
    percentage >= 60 ? '#f97316' : '#ef4444';

  return (
    <div className="group rounded-2xl border border-border/40 bg-card/70 backdrop-blur-sm p-4 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl shrink-0">{emoji}</span>
          <div className="min-w-0">
            <h3 className="font-bold text-foreground text-sm leading-tight truncate">{name}</h3>
            <p className="text-[11px] text-muted-foreground">{attended} / {total} attended</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={isSafe ? 'text-sm font-extrabold text-emerald-400' : 'text-sm font-extrabold text-red-400'}>
            {percentage.toFixed(1)}%
          </span>
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg text-muted-foreground hover:text-red-400"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div className="h-1.5 w-full rounded-full bg-muted/50 overflow-hidden my-3">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%`, background: barColor }}
        />
      </div>

      <div className="flex gap-2">
        <div
          className="flex-1 flex items-center rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.08)' }}
        >
          <button onClick={onUndoAttend} disabled={attended === 0}
            className="px-3 py-2 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold">
            −
          </button>
          <div className="flex-1 flex items-center justify-center gap-1 py-1.5">
            <CheckCircle2 size={11} className="text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300">Attended</span>
          </div>
          <button onClick={onAttend}
            className="px-3 py-2 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm font-bold">
            +
          </button>
        </div>

        <div
          className="flex-1 flex items-center rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)' }}
        >
          <button onClick={onUndoMiss} disabled={total - attended === 0 || total === 0}
            className="px-3 py-2 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold">
            −
          </button>
          <div className="flex-1 flex items-center justify-center gap-1 py-1.5">
            <XCircle size={11} className="text-red-400" />
            <span className="text-xs font-semibold text-red-300">Missed</span>
          </div>
          <button onClick={onMiss}
            className="px-3 py-2 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-bold">
            +
          </button>
        </div>
      </div>

      <ThresholdGrid attended={attended} total={total} />
    </div>
  );
}

// ─── AddSubjectModal ──────────────────────────────────────────────────────────

function AddSubjectModal({ onAdd, onClose }: { onAdd: (name: string, emoji: string) => void; onClose: () => void }) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📘');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border/60 bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Plus size={18} className="text-primary" />
          Add Subject
        </h2>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject Name</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) { onAdd(name.trim(), emoji); onClose(); } }}
          placeholder="e.g. Data Structures"
          className="mt-1 mb-4 w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm outline-none transition-all"
        />
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pick an Emoji</label>
        <div className="mt-1 mb-5 grid grid-cols-5 gap-2">
          {EMOJIS.map((e) => (
            <button key={e} onClick={() => setEmoji(e)}
              className="text-xl rounded-xl py-2 transition-all border border-transparent hover:bg-muted/60"
              style={emoji === e ? { background: 'rgba(37,99,235,0.2)', borderColor: 'rgba(37,99,235,0.4)', transform: 'scale(1.1)' } : {}}>
              {e}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl border border-border/60 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted/40 transition-all">
            Cancel
          </button>
          <button disabled={!name.trim()}
            onClick={() => { if (name.trim()) { onAdd(name.trim(), emoji); onClose(); } }}
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            Add Subject
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SummaryStrip ─────────────────────────────────────────────────────────────

function SummaryStrip({ subjects }: { subjects: Subject[] }) {
  const totalAttended = subjects.reduce((s, x) => s + x.attended, 0);
  const totalClasses = subjects.reduce((s, x) => s + x.total, 0);
  const overall = pct(totalAttended, totalClasses);
  const below75 = subjects.filter((s) => pct(s.attended, s.total) < 75).length;
  const isSafe = overall >= 75;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4 rounded-2xl border p-4"
        style={{
          border: isSafe ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
          background: isSafe ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
        }}>
        <div className={isSafe ? 'shrink-0 mt-0.5 text-emerald-400' : 'shrink-0 mt-0.5 text-red-400'}>
          {isSafe ? <ShieldCheck size={22} /> : <AlertTriangle size={22} />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={isSafe ? 'font-bold text-sm text-emerald-300' : 'font-bold text-sm text-red-300'}>
            {isSafe ? 'Overall Attendance Safe' : 'Attendance Below 75%'}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {overall.toFixed(1)}% overall · {totalAttended}/{totalClasses} classes attended
            {below75 > 0 && ` · ${below75} subject${below75 > 1 ? 's' : ''} at risk`}
          </p>
        </div>
        <p className={isSafe ? 'text-2xl font-extrabold text-emerald-400' : 'text-2xl font-extrabold text-red-400'}>
          {overall.toFixed(1)}%
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {THRESHOLDS.map((t) => {
          const achieved = overall >= t;
          const val = achieved ? classesCanSkipFor(totalAttended, totalClasses, t) : classesNeededFor(totalAttended, totalClasses, t);
          return (
            <div key={t} className="rounded-2xl p-4" style={{
              border: achieved ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(239,68,68,0.2)',
              background: achieved ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.06)',
            }}>
              <p className={achieved ? 'text-[11px] font-bold tracking-widest mb-1 text-emerald-500' : 'text-[11px] font-bold tracking-widest mb-1 text-red-500'}>{t}%</p>
              <p className="text-3xl font-extrabold text-foreground leading-none">{val}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{achieved ? 'can safely skip' : 'classes needed'}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AttendancePage() {
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [showAdd, setShowAdd] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSubjects(parsed);
        }
      }
    } catch {}
  }, []);

  const persist = useCallback((next: Subject[]) => {
    setSubjects(next);
    saveSubjects(next);
  }, []);

  const handleSyncNewton = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/sync/direct");
      const json = await res.json();
      if (json.success && json.data?.attendance?.subjects) {
        const emojiMap: Record<string, string> = {
          ada: "📘",
          asd: "🧠",
          de: "⚙️",
          "maths-3": "🧮",
          entrepreneurship: "💼",
        };
        const syncedSubjects: Subject[] = json.data.attendance.subjects.map((s: any) => ({
          id: s.id || s.code?.toLowerCase() || String(Math.random()),
          name: s.code || s.name,
          emoji: emojiMap[s.id] || emojiMap[s.code?.toLowerCase()] || "📘",
          attended: s.attended || 0,
          total: s.total || 0,
        }));

        if (syncedSubjects.length > 0) {
          persist(syncedSubjects);
        }
      }
    } catch (e) {
      console.error("Failed to sync from Newton School cache:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const mutate = useCallback(
    (id: string, fn: (s: Subject) => Subject) => {
      persist(subjects.map((s) => (s.id === id ? fn(s) : s)));
    },
    [subjects, persist]
  );

  const handleAttend = (id: string) => mutate(id, (s) => ({ ...s, attended: s.attended + 1, total: s.total + 1 }));
  const handleMiss = (id: string) => mutate(id, (s) => ({ ...s, total: s.total + 1 }));
  const handleUndoAttend = (id: string) => mutate(id, (s) => ({ ...s, attended: Math.max(0, s.attended - 1), total: Math.max(0, s.total - 1) }));
  const handleUndoMiss = (id: string) => mutate(id, (s) => {
    const missed = s.total - s.attended;
    if (missed <= 0) return s;
    return { ...s, total: s.total - 1 };
  });
  const handleDelete = (id: string) => persist(subjects.filter((s) => s.id !== id));
  const handleAdd = (name: string, emoji: string) => {
    persist([...subjects, { id: Date.now().toString(), name, emoji, attended: 0, total: 0 }]);
  };

  return (
    <div className="min-h-full p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <GraduationCap className="text-primary" size={24} />
            Attendance Tracker
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Newton School synced · Tap &ldquo;+&rdquo; after each class to keep your records live
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSyncNewton}
            disabled={isSyncing}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card/60 px-3.5 py-2.5 text-xs font-bold text-foreground hover:bg-muted active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
            {isSyncing ? "Syncing..." : "Sync from Newton"}
          </button>
          <button
            onClick={() => setShowAdd(true)}
            id="add-subject-btn"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all shadow"
          >
            <Plus size={15} />
            Add Subject
          </button>
        </div>
      </div>

      {subjects.length > 0 && <SummaryStrip subjects={subjects} />}

      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="text-primary" size={28} />
          </div>
          <h3 className="text-lg font-bold">No subjects yet</h3>
          <p className="text-sm text-muted-foreground">Add your subjects and start marking attendance</p>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all">
            <Plus size={16} />
            Add Your First Subject
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {subjects.map((subj) => (
            <SubjectCard
              key={subj.id}
              subject={subj}
              onAttend={() => handleAttend(subj.id)}
              onMiss={() => handleMiss(subj.id)}
              onUndoAttend={() => handleUndoAttend(subj.id)}
              onUndoMiss={() => handleUndoMiss(subj.id)}
              onDelete={() => handleDelete(subj.id)}
            />
          ))}
        </div>
      )}

      {showAdd && <AddSubjectModal onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
