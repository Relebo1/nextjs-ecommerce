// app/api/admin/users/[id]/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';
import connectDB from '@/lib/mongoose';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const user = await User.findById(params.id);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  try {
    const updatedUser = await User.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updatedUser);
  } catch (err) {
    return NextResponse.json({ error: 'Update failed', details: err }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    await User.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'User deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Delete failed', details: err }, { status: 400 });
  }
}
