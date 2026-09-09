"use client";

import Link from "next/link";
import { Bell, Search, RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useCampusStore } from "@/store/campusStore";

export function Header() {
  const { profile, lastSyncedAt } = useCampusStore();
  const studentName =
    profile?.name && profile.name !== "Sanghamitra Sarangi"
      ? profile.name
      : "Suhan Ranjan Tripathy";

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "ST";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/50 bg-background/50 px-6 backdrop-blur-xl">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search across CampusOS... (Cmd+K)" 
            className="w-full rounded-full bg-muted/50 pl-9 border-none focus-visible:ring-1" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="h-3 w-3" />
          <span>{lastSyncedAt ? "Synced" : "Synced just now"}</span>
        </div>
        
        <button className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger border-2 border-background" />
        </button>
        
        <Link href="/profile" title={studentName}>
          <Avatar className="h-8 w-8 cursor-pointer border border-border/50">
            {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={studentName} />}
            <AvatarFallback className="bg-[#00a389] text-white text-xs font-bold">
              {getInitials(studentName)}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
