import { IncomingForm } from "formidable";
import fs from "fs";
import axios from "axios";
import path from "path";
import FormData from "form-data";

// Set up formidable to parse incoming files
export const config = {
  api: {
    bodyParser: false, // Disable default body parser
  },
};

const transcribeAudio = async (filePath) => {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));
  
  formData.append("model", "whisper-1"); // Add the model parameter

  // Debugging: Log FormData headers
  console.log("FormData headers:", formData.getHeaders());

  // Debugging: Manually inspect FormData contents
  console.log("FormData contents:");
  console.log("File:", filePath);
  console.log("Model:", "whisper-1");

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          ...formData.getHeaders(), // Include form-data headers
        },
      }
    );

    return response.data;
  } catch (error) {
    // Log the full error response
    console.error("Error details:", error.response?.data || error.message);
    throw error; // Re-throw the error for further handling
  }
};

const extractPatientInfo = async (transcript) => {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Extract relevant patient information (Patient ID, Name, Date of Birth, Gender, Visit Date, Visit Type, Reason For Visit, Chief Complaint, Past Medical History, Medications, Physical Examination, Diagnosis, Plan) concisely from the following transcript, putting the values, in that order, into a single comma-separated string:",
        },
        {
          role: "user",
          content: transcript,
        },
      ],
      max_tokens: 500,
    },
    {
      headers: {
        Authorization: `Bearer ${openaiKey}`,
      },
    }
  );

  return response.data.choices[0].message.content;
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    const form = new IncomingForm();
    form.uploadDir = path.join(process.cwd(), "/public/uploads");
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing file" });
      }

      const filePath = files.file[0].filepath;

      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        return res.status(400).json({ error: "File not found" });
      }

      try {
        // Step 1: Transcribe the audio file
        const transcriptionData = await transcribeAudio(filePath);
        const transcript = transcriptionData.text;
        console.log("Transcription:", transcript);

        // Step 2: Extract patient information using GPT-4
        const patientInfo = await extractPatientInfo(transcript);

        // Send the transcript and patient info to the frontend
        res.status(200).json({ transcript, patientInfo });
      } catch (error) {
        console.error("Error during transcription or extraction:", error);
        res.status(500).json({ error: "Failed to process the audio file" });
      }
    });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default handler;