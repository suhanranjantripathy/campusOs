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
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { useCampusStore } from "@/store/campusStore";

export default function LoginPage() {
  const router = useRouter();
  const { setAuthenticated, syncAll } = useCampusStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Step 1: Authenticate with Newton School via Puppeteer backend
      setStatus("Connecting to Newton School...");
      const authRes = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const authData = await authRes.json();

      if (!authData.success) {
        throw new Error(
          authData.error || "Authentication failed. Check your credentials."
        );
      }

      // Step 2: Mark authenticated and begin syncing all real data
      setAuthenticated(true);
      setStatus("Syncing your attendance, assignments & profile...");
      await syncAll();

      // Step 3: Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setIsLoading(false);
      setStatus("");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
          <span className="text-2xl font-bold text-primary-foreground">C</span>
        </div>
        <span className="text-3xl font-bold tracking-tight">CampusOS</span>
      </div>

      <Card className="w-full glass border-white/10 shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Enter your Newton School credentials to sync your data
            automatically.
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
              <Label htmlFor="email">Newton School Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="student@newtonschool.co"
                  className="pl-10 bg-background/50 focus-visible:ring-primary"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="pl-10 bg-background/50 focus-visible:ring-primary"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-70 transition-all"
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
        <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground pt-4 border-t border-border/40">
          <p>
            Your credentials are never stored. They are only used once to
            establish a secure session token with Newton School.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
