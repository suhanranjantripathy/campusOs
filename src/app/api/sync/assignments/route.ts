import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'src/lib/newton/data-cache.json');

export async function GET() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const content = fs.readFileSync(CACHE_FILE, 'utf-8');
      const cache = JSON.parse(content);
      if (Array.isArray(cache.assignments) && cache.assignments.length > 0) {
        return NextResponse.json(cache.assignments);
      }
    }
  } catch (err) {
    console.error('[SyncAssignments] Error reading cache:', err);
  }

  // Fallback to real NST student assignments
  const defaultAssignments = [
    {
      id: "asgn-de-1",
      title: "LIMIT, SQL Functions, Aggregate Functions, String Functions",
      subject: "Database Engineering (DE)",
      description: "In Class Practice · Sep 5, 2026, 10:10 am",
      dueDate: "Sep 5, 2026, 10:10 am",
      status: "todo",
      priority: "high",
      tag: "In Class",
      solvedText: "0 / 7 Solved",
      solveUrl: "https://my.newtonschool.co/course/0rsk0a0teyqh/details",
    },
    {
      id: "asgn-asd-2",
      title: "Express JS, Express.js Request, Response, Static Routes",
      subject: "Applied Software Dev (ASD)",
      description: "In Class · Sep 5, 2026, 11:02 am",
      dueDate: "Sep 5, 2026, 11:02 am",
      status: "todo",
      priority: "high",
      tag: "In Class",
      solvedText: "0 / 3 Solved",
      solveUrl: "https://my.newtonschool.co/course/0rsk0a0teyqh/details",
    },
    {
      id: "asgn-ada-3",
      title: "Backtracking - In Class",
      subject: "Algorithms (ADA)",
      description: "In Class · Sep 5, 2026, 12:53 pm",
      dueDate: "Sep 5, 2026, 12:53 pm",
      status: "in_progress",
      priority: "high",
      tag: "In Class",
      solvedText: "1 / 2 Solved",
      solveUrl: "https://my.newtonschool.co/course/0rsk0a0teyqh/details",
    },
    {
      id: "asgn-ada-4",
      title: "Backtracking - Post Class Exercises",
      subject: "Algorithms (ADA)",
      description: "Post Class · Sep 5, 2026",
      dueDate: "Sep 5, 2026, 11:59 pm",
      status: "todo",
      priority: "medium",
      tag: "Post Class",
      solvedText: "0 / 1 Solved",
      solveUrl: "https://my.newtonschool.co/course/0rsk0a0teyqh/details",
    },
    {
      id: "asgn-de-5",
      title: "HAVING Clause, SQL Conditional Logic, CASE Statements",
      subject: "Database Engineering (DE)",
      description: "Post Class · Sep 8, 2026, 2:35 pm",
      dueDate: "Sep 8, 2026, 2:35 pm",
      status: "todo",
      priority: "medium",
      tag: "Post Class",
      solvedText: "0 / 3 Solved",
      solveUrl: "https://my.newtonschool.co/course/0rsk0a0teyqh/details",
    },
    {
      id: "asgn-quiz-6",
      title: "M3 Contest 1 (Quiz Assessment)",
      subject: "Exam Sem 3",
      description: "Quiz Evaluation · Sep 4, 2026",
      dueDate: "Sep 4, 2026, 12:30 pm",
      status: "todo",
      priority: "high",
      tag: "Quiz",
      solvedText: "0 / 15 Solved",
      solveUrl: "https://my.newtonschool.co/course/0rsk0a0teyqh/details",
    }
  ];

  return NextResponse.json(defaultAssignments);
}

