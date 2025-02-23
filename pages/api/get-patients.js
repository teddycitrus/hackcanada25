// pages/api/get-all-patients.js
"use server"

import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://user1:123@cluster30411.3mu4zpg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster30411";
const client = new MongoClient(uri);

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await client.connect();
      const database = client.db('EHR_records');
      const patients = database.collection('E');

      // Get all patient records
      const allPatients = await patients.find({}).toArray();

      res.status(200).json(allPatients);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch patients', error: error.message });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

export default handler;