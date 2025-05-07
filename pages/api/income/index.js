// pages/api/income/index.js
import dbConnect from '../../../lib/db';
import Income from '../../../models/Income';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const income = await Income.find({});
    res.status(200).json(income);
  } else if (req.method === 'POST') {
    const record = new Income(req.body);
    await record.save();
    res.status(201).json(record);
  } else {
    res.status(405).end();
  }
}