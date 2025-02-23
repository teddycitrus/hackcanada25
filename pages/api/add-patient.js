// pages/api/add-patient.js
"use server"

import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://johnmannul:Vcan2oTljFBfFuOz@cluster0.nky1w.mongodb.net/ehr_db?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await client.connect();
      const database = client.db('ehr_db'); // Your MongoDB database name
      const patients = database.collection('patients'); // Your collection name

      // Get patient data from req.body
      const newPatient = req.body;

      // Insert new patient record
      const result = await patients.insertOne(newPatient);

      res.status(201).json({ message: "Patient added successfully", patientId: result.insertedId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to add patient', error: error.message });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

export default handler;