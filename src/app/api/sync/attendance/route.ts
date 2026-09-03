import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock attendance data that would be scraped/synced from Newton School
  const mockAttendance = {
    overall: 87.5,
    trend: "+2.1%",
    subjects: [
      {
        id: "dsa-101",
        name: "Data Structures & Algorithms",
        faculty: "Prof. Sharma",
        attended: 35,
        total: 40,
        percentage: 87.5,
      },
      {
        id: "phy-102",
        name: "Engineering Physics",
        faculty: "Prof. Kumar",
        attended: 28,
        total: 30,
        percentage: 93.3,
      },
      {
        id: "os-201",
        name: "Operating Systems",
        faculty: "Prof. Verma",
        attended: 25,
        total: 35,
        percentage: 71.4,
      }
    ],
    warnings: [
      {
        subjectId: "os-201",
        message: "You need to attend the next 2 classes to maintain 75% attendance.",
      }
    ]
  };

  return NextResponse.json(mockAttendance);
}
