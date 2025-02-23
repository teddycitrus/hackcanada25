import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://user1:123@cluster30411.3mu4zpg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster30411";
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { patientData } = req.body;

      // Validate and confirm the data
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      const db = client.db('medpal');
      const collection = db.collection('patients');
      
      // Insert confirmed patient data into the collection
      await collection.insertOne(patientData);

      res.status(200).json({ message: 'Patient data added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error confirming data' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
