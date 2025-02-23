import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
    const uri = "mongodb+srv://user1:123@cluster30411.3mu4zpg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster30411";
    const client = new MongoClient(uri);

  if (req.method === 'POST') {
    try {
      const { changes } = req.body;
      
      if (!changes || changes.length === 0) {
        return res.status(400).json({ error: 'No changes to update' });
      }

      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      const db = client.db('EHR_records');
      const collection = db.collection('E');

      if(collection && db && client) {
        console.log("mongo connections established")
      } else {
        console.log("connections insufficient")
      }

    //   const allIds = await collection.find({}, { projection: { _id: '67b9f3c510cc01fa5069a86c' } }).toArray();
    //   console.log("All IDs in Collection:", allIds);
console.log("====================");

      for (const updatedPatient of changes) {
        const { _id, ...updateData } = updatedPatient;
        console.log(_id);
        console.log(ObjectId.createFromHexString(_id));
        const data = await collection.find({
            _id: {
                $exists: true
            }
        }).toArray()
        console.log(data);
        // console.log(data.pretty());
        

        const res = await collection.findOne({ _id: ObjectId.createFromHexString(_id) })
        console.log("Existing data: " + res);

        // console.log("Existing Document:", existingDoc);

        console.log("ID to update:", _id);
        console.log("Data to update:", updateData);

        const filter = { _id: ObjectId.createFromHexString(_id) };
        console.log(filter);
        
        const updateDocument = { $set: updateData };
        console.log(updateDocument);
        

        const result = await collection.updateOne(filter, updateDocument);
        console.log("Update Result:", result);
    }

      await client.close();
      res.status(200).json({ message: 'Patient data updated successfully' });
    } catch (error) {
      console.error('Error updating patient data:', error);
      res.status(500).json({ error: 'Failed to update patient data' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
