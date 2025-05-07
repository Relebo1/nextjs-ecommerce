// app/api/admin/activities/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simulate activity data
    const activities = [
      { id: 1, action: 'User login', timestamp: new Date() },
      { id: 2, action: 'Query submitted', timestamp: new Date() },
    ];

    return NextResponse.json({ activities });
  } catch (error: any) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities', details: error.message },
      { status: 500 }
    );
  }
}
