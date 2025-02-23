// pages/api/treat.js

import { OpenAI } from 'openai';

// Initialize OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Destructure patient data from the request body
  const { patientData } = req.body;

  // Validate the incoming patient data
  if (!patientData || typeof patientData !== 'object') {
    return res.status(400).json({ message: 'Invalid patient data' });
  }

  // Destructure patient information for clarity
  const {
    Name,
    "Date of Birth": dob,
    Gender,
    "Visit Date": visitDate,
    "Visit Type": visitType,
    "Reason for Visit": reasonForVisit,
    "Chief Complaint": chiefComplaint,
    "Past Medical History": medicalHistory,
    Medications,
    "Physical Examination": physicalExamination,
    Diagnosis,
    Plan,
  } = patientData;

  try {
    // Generate a prompt for ChatGPT to create a treatment plan
    const prompt = `Based on the following patient data, generate a short but comprehensive treatment plan. Be clear, concise, and professional. Don't begin with any direct restatement of patient details; get right to the treatment plan.

    Patient Data:
    Name: ${Name}
    D.O.B.: ${dob}
    Gender: ${Gender}
    Visit Date: ${visitDate}
    Visit Type: ${visitType}
    Reason for Visit: ${reasonForVisit}
    Chief Complaint: ${chiefComplaint}
    Past Medical History: ${medicalHistory}
    Medications: ${Medications}
    Physical Examination: ${physicalExamination}
    Diagnosis: ${Diagnosis}
    Plan (basic): ${Plan}

    Treatment Plan:`;

    // Make API request to OpenAI to get treatment plan using gpt-4 model
    const response = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful medical assistant.' },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-4', // Using GPT-4 model
    });

    // Check if response contains the expected result
    if (!response || !response.choices || response.choices.length === 0) {
      return res.status(500).json({ message: 'Failed to generate treatment plan.' });
    }

    // Extract treatment plan and trim whitespace
    const treatmentPlan = response.choices[0].message.content.trim();

    // Return the treatment plan to the frontend
    return res.status(200).json({ treatmentPlan });
  } catch (error) {
    console.error('Error generating treatment plan:', error);
    // Return error details to frontend for easier debugging
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
