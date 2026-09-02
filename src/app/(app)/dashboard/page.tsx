"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, BookOpen, Clock, Target, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Good Morning, Suhan</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm font-medium">Semester 3</Badge>
          <Badge className="bg-success text-success-foreground hover:bg-success/90">Productivity: 92%</Badge>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <BookOpen className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">2 due this week</p>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <CalendarDays className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Midsems</div>
            <p className="text-xs text-muted-foreground">Starts in 12 days</p>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Milestone Progress</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
            <p className="text-xs text-muted-foreground">Meeting Mate Sprint</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 glass">
          <CardHeader>
            <CardTitle>Today's Timeline</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-8 pl-4">
              <div className="flex relative">
                <div className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                <div className="absolute -left-[22px] top-4 h-full w-px bg-border" />
                <div className="w-16 text-sm text-muted-foreground pt-0.5">09:00</div>
                <div className="flex-1 rounded-md border border-border/50 bg-background/50 p-3 shadow-sm">
                  <h4 className="font-semibold text-sm">Data Structures & Algorithms</h4>
                  <p className="text-xs text-muted-foreground mt-1">Room 304 • Prof. Sharma</p>
                </div>
              </div>
              
              <div className="flex relative">
                <div className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                <div className="absolute -left-[22px] top-4 h-full w-px bg-border" />
                <div className="w-16 text-sm text-muted-foreground pt-0.5">11:00</div>
                <div className="flex-1 rounded-md border border-border/50 bg-background/50 p-3 shadow-sm">
                  <h4 className="font-semibold text-sm">Engineering Physics</h4>
                  <p className="text-xs text-muted-foreground mt-1">Lab 2 • Prof. Kumar</p>
                </div>
              </div>
              
              <div className="flex relative">
                <div className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-warning ring-4 ring-background" />
                <div className="absolute -left-[22px] top-4 h-full w-px bg-border" />
                <div className="w-16 text-sm text-muted-foreground pt-0.5">14:00</div>
                <div className="flex-1 rounded-md border border-warning/20 bg-warning/5 p-3 shadow-sm">
                  <h4 className="font-semibold text-sm text-warning-foreground">Assignment Due: OS Virtual Memory</h4>
                  <p className="text-xs text-muted-foreground mt-1">Submit via Portal</p>
                </div>
              </div>
              
              <div className="flex relative">
                <div className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-success ring-4 ring-background" />
                <div className="w-16 text-sm text-muted-foreground pt-0.5">18:00</div>
                <div className="flex-1 rounded-md border border-success/20 bg-success/5 p-3 shadow-sm">
                  <h4 className="font-semibold text-sm">Meeting Mate Sprint</h4>
                  <p className="text-xs text-muted-foreground mt-1">Backend API Development</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 glass">
          <CardHeader>
            <CardTitle>Insights & Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 rounded-md border border-danger/20 bg-danger/5 p-4">
                <Clock className="mt-0.5 h-5 w-5 text-danger" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Attendance Warning</p>
                  <p className="text-sm text-muted-foreground">
                    You need to attend the next 2 classes of OS to maintain 75% attendance.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 rounded-md border border-primary/20 bg-primary/5 p-4">
                <BrainCircuit className="mt-0.5 h-5 w-5 text-primary" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">AI Suggestion</p>
                  <p className="text-sm text-muted-foreground">
                    You have a light schedule tomorrow. Consider completing your Physics assignment early.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Needed to add BrainCircuit here since it's used
import { BrainCircuit } from "lucide-react";
