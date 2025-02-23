import { OpenAI } from 'openai';
import { MongoClient } from 'mongodb';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Assuming audio is sent in the request body
      const { audioBuffer } = req.body;
      
      // Step 1: Transcribe the audio using Whisper
      const transcript = await openai.transcribe(audioBuffer);
      
      // Step 2: Process the transcript using GPT-4
      const gptResponse = await openai.chat({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: `Extract patient details from this transcript: ${transcript}` }
        ]
      });

      const patientData = gptResponse.choices[0].message.content;

      // Step 3: Save the extracted data to MongoDB
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      const db = client.db('medpal');
      const collection = db.collection('patients');
      
      // Insert the patient data into the database
      await collection.insertOne(patientData);

      res.status(200).json({ message: 'Data saved successfully', patientData });
    } catch (error) {
      res.status(500).json({ error: 'Error processing data' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
