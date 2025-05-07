import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongoose';
import Query from '@/models/Query'; // Import the Query model

export async function POST(req: Request) {
  try {
    // Parse the incoming JSON body
    const { message } = await req.json();
    
    // Validate the query message
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query message cannot be empty' },
        { status: 400 }
      );
    }

    // Connect to the MongoDB database
    await connectToDatabase();

    // Create a new query
    const newQuery = new Query({
      message,
      status: 'pending', // Default status
    });

    // Save the query to the database
    await newQuery.save();

    // Return a success response
    return NextResponse.json(
      { message: 'Query submitted successfully', query: newQuery },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('Error submitting query:', error);
    return NextResponse.json(
      { error: 'Server Error', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
