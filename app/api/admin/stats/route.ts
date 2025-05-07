import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongoose';
import User from '@/models/User';
import Query from '@/models/Query'; // Assuming you also have a Query model for the client queries

export async function GET() {
  try {
    // Connect to the MongoDB database
    await connectToDatabase();

    // Get the total number of users
    const totalUsers = await User.countDocuments();

    // Get the total number of queries
    const totalQueries = await Query.countDocuments();

    // Get the number of unresolved queries
    const unresolvedQueries = await Query.countDocuments({ status: 'pending' });

    // Collect all the statistics
    const stats = {
      totalUsers,
      totalQueries,
      unresolvedQueries,
    };

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Server Error', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
