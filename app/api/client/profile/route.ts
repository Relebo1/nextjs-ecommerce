import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/models/User';

export async function GET() {
  try {
    await connectToDatabase();

    // Simulated logged-in user ID
    const userId = '681b48e4bf6c7f632cc6caae';

    const user = await User.findById(userId).select('name email');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err: any) {
    console.error('User Fetch Error:', err);
    return NextResponse.json({ error: 'Failed to fetch user', details: err.message }, { status: 500 });
  }
}
