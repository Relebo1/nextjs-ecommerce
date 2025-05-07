// pages/api/sales/index.js
import dbConnect from '../../../lib/db';
import Sale from '../../../models/Sale';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const sales = await Sale.find({});
    res.status(200).json(sales);
  } else if (req.method === 'POST') {
    const sale = new Sale(req.body);
    await sale.save();
    res.status(201).json(sale);
  } else {
    res.status(405).end();
  }
}