import { MongoClient } from "mongodb";


const uri = "mongodb+srv://user1:123@cluster30411.3mu4zpg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster30411";
const client = new MongoClient(uri);

const savePatientData = async (req, res) => {
  if (req.method === "POST") {
    const { transcript, patientInfo } = req.body;

    try {
      await client.connect();
      const db = client.db("EHR_db");
      const collection = db.collection("E");

      const newEntry = {
        transcript,
        patientInfo,
        createdAt: new Date(),
      };

      await collection.insertOne(newEntry);

      res.status(200).json({ message: "Patient data saved successfully!" });
    } catch (error) {
      console.error("Error saving data to MongoDB:", error);
      res.status(500).json({ error: "Error saving patient data" });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default savePatientData;
