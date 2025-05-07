import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongoose';
import Query from '@/models/Query'; // Import the Query model

export async function GET() {
  try {
    // Connect to the MongoDB database
    await connectToDatabase();

    // Fetch all queries from the database
    const queries = await Query.find(); // Optionally, add filters to limit or sort results

    // Return the queries in the response
    return NextResponse.json({ queries }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching queries:', error);
    return NextResponse.json(
      { error: 'Server Error', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    // Parse the incoming JSON body
    const { queryId, status } = await req.json();

    // Validate the status and queryId
    if (!queryId || !status) {
      return NextResponse.json(
        { error: 'Query ID and status are required' },
        { status: 400 }
      );
    }

    // Connect to the MongoDB database
    await connectToDatabase();

    // Find the query by ID and update its status
    const updatedQuery = await Query.findByIdAndUpdate(
      queryId,
      { status }, // Update the status of the query
      { new: true } // Return the updated document
    );

    if (!updatedQuery) {
      return NextResponse.json(
        { error: 'Query not found' },
        { status: 404 }
      );
    }

    // Return the updated query
    return NextResponse.json({ message: 'Query updated', query: updatedQuery }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating query:', error);
    return NextResponse.json(
      { error: 'Server Error', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // Parse the incoming JSON body
    const { queryId } = await req.json();

    // Validate the queryId
    if (!queryId) {
      return NextResponse.json(
        { error: 'Query ID is required' },
        { status: 400 }
      );
    }

    // Connect to the MongoDB database
    await connectToDatabase();

    // Find and delete the query by ID
    const deletedQuery = await Query.findByIdAndDelete(queryId);

    if (!deletedQuery) {
      return NextResponse.json(
        { error: 'Query not found' },
        { status: 404 }
      );
    }

    // Return a success response
    return NextResponse.json({ message: 'Query deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting query:', error);
    return NextResponse.json(
      { error: 'Server Error', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
