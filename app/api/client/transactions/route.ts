import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    await connectToDatabase();

    // Simulated logged-in user ID
    const userId = '681b43b0bf6c7f632cc6ca92';

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    return NextResponse.json(Array.isArray(transactions) ? transactions : []);
  } catch (err: any) {
    console.error('Transaction Fetch Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch transactions', details: err.message },
      { status: 500 }
    );
  }
}
