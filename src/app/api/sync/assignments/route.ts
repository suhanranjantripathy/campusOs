import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Mock assignments data that would be scraped/synced from Newton School
  const mockAssignments = [
    {
      id: "a1",
      title: "OS Virtual Memory Implementation",
      subject: "Operating Systems",
      description: "Implement a page replacement algorithm simulator.",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days from now
      status: "todo",
      priority: "high"
    },
    {
      id: "a2",
      title: "Graph Traversal Exercises",
      subject: "Data Structures & Algorithms",
      description: "Solve problems 4, 5, and 6 on LeetCode.",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days from now
      status: "in_progress",
      priority: "medium"
    },
    {
      id: "a3",
      title: "Physics Lab Report",
      subject: "Engineering Physics",
      description: "Submit the lab report for the optics experiment.",
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
      status: "completed",
      priority: "low"
    }
  ];

  return NextResponse.json(mockAssignments);
}
