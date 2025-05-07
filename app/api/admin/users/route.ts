// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { connectToDatabase } from '../../../../lib/mongoose';

export async function GET() {
  await connectToDatabase();
  const users = await User.find().sort({ createdAt: -1 });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();

  try {
    const { name, email, password, role } = body;

    const allowedRoles = ['sales', 'admin', 'finance', 'developer', 'investor', 'client', 'partner'];
    if (!role || !allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid or missing role.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'User creation failed', details: err.message || err },
      { status: 400 }
    );
  }
}
