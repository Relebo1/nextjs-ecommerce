import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongoose';
import Product from '@/models/Product';
import Transaction from '@/models/Transaction';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { productId, userId, quantity = 1 } = await req.json();

    if (!productId || !userId) {
      return NextResponse.json(
        { error: 'Missing productId or userId' },
        { status: 400 }
      );
    }

    // Fetch product
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Not enough stock available' },
        { status: 400 }
      );
    }

    // Reduce product stock
    product.stock -= quantity;
    await product.save();

    // Create transaction
    const totalAmount = product.price * quantity;

    const newTransaction = await Transaction.create({
      userId,
      productId,
      quantity,
      totalAmount,
      status: 'pending',
    });

    return NextResponse.json(
      {
        message: 'Purchase successful',
        transaction: newTransaction,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Purchase error:', err);
    return NextResponse.json(
      { error: 'Server error', details: err.message },
      { status: 500 }
    );
  }
}
