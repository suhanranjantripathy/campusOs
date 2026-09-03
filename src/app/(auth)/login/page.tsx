"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, Key, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useCampusStore } from "@/store/campusStore";

export default function LoginPage() {
  const router = useRouter();
  const { setAuthenticated, syncAll } = useCampusStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [token, setToken] = useState("");
  const [showGuide, setShowGuide] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token.trim()) {
      setError("Please enter your Newton School session token.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      setStatus("Verifying token with Newton School...");
      const authRes = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });

      const authData = await authRes.json();

      if (!authData.success) {
        throw new Error(authData.error || "Invalid token. Please try again.");
      }

      setAuthenticated(true);
      setStatus("Syncing your attendance, assignments & profile...");
      await syncAll();

      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setIsLoading(false);
      setStatus("");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
          <span className="text-2xl font-bold text-primary-foreground">C</span>
        </div>
        <span className="text-3xl font-bold tracking-tight">CampusOS</span>
      </div>

      <Card className="w-full glass border-white/10 shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-4">
          <CardTitle className="text-2xl">Connect Newton School</CardTitle>
          <CardDescription>
            Paste your Newton School session token to sync all your data instantly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="token" className="flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5" />
                Session Token
              </Label>
              <Input
                id="token"
                name="token"
                type="password"
                placeholder="Paste your token here..."
                className="bg-background/50 focus-visible:ring-primary font-mono text-xs"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !token.trim()}
              className="mt-2 flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-70 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {status || "Connecting..."}
                </>
              ) : (
                "Sync & Continue"
              )}
            </button>
          </form>
        </CardContent>

        {/* Step-by-step guide */}
        <CardFooter className="flex flex-col gap-3 pt-0 px-6 pb-6">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="flex w-full items-center justify-between rounded-md border border-border/50 bg-background/30 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="font-medium">How to get your session token</span>
            {showGuide ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {showGuide && (
            <div className="w-full space-y-3 rounded-md border border-border/40 bg-background/20 p-4 text-xs text-muted-foreground">
              <ol className="list-none space-y-3">
                <li className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-[10px]">1</span>
                  <span>
                    Open{" "}
                    <a
                      href="https://my.newtonschool.co"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary inline-flex items-center gap-0.5 hover:underline"
                    >
                      my.newtonschool.co <ExternalLink className="h-2.5 w-2.5" />
                    </a>{" "}
                    and log in with your Google account.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-[10px]">2</span>
                  <span>Press <kbd className="rounded border border-border px-1 py-0.5 font-mono bg-background/40">F12</kbd> to open DevTools → go to the <strong className="text-foreground">Application</strong> tab.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-[10px]">3</span>
                  <span>In the left sidebar, open <strong className="text-foreground">Storage → Local Storage → https://my.newtonschool.co</strong>.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-[10px]">4</span>
                  <span>Look for a key called <strong className="text-foreground">token</strong>, <strong className="text-foreground">access_token</strong>, or <strong className="text-foreground">authToken</strong> and copy its value.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-[10px]">5</span>
                  <span>Paste it above and click <strong className="text-foreground">Sync & Continue</strong>.</span>
                </li>
              </ol>
              <p className="mt-2 rounded-md border border-yellow-500/20 bg-yellow-500/10 p-2 text-yellow-400/80">
                ⚡ Your token is sent securely to our server and is never stored — it is only used to fetch your data once.
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
