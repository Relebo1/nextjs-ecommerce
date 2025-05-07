// pages/api/queries/index.js
import dbConnect from '../../../lib/db';
import Query from '../../../models/Query';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const queries = await Query.find({});
    res.status(200).json(queries);
  } else if (req.method === 'POST') {
    const query = new Query(req.body);
    await query.save();
    res.status(201).json(query);
  } else {
    res.status(405).end();
  }
}