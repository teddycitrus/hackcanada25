"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Record() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Debugging: Log file state whenever it changes
  useEffect(() => {
    console.log("File state updated:", file);
  }, [file]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("File selected:", selectedFile);

    if (selectedFile && (selectedFile.type === 'audio/mp3' || selectedFile.type === 'audio/mpeg')) {
      setFile(selectedFile); // Update file state
      setMessage(`${selectedFile.name}`);
    } else {
      setFile(null); // Reset file state if invalid
      setMessage('Please upload an MP3 file.');
    }
  };

  const handleFileUpload = async () => {
    console.log("File state during upload:", file); // Debugging: Log file state

    if (!file) {
      setMessage('No file selected.');
      return;
    }

    setUploading(true);
    setMessage('Uploading file...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('File uploaded successfully.');
        console.log('Transcript:', data.transcript);
        console.log('Patient Info:', data.patientInfo);
      } else {
        setMessage('Failed to upload file.');
      }
    } catch (error) {
      setMessage(`Error uploading file: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ color: 'ivory' }}>
        <div className="el"></div>
      <header
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 10,
    backgroundColor: 'black',
    color: 'ivory',
    paddingLeft: '26px',
    paddingRight: '50px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}
>
  <h1>MedPal</h1>
  <nav>
    <Link
      href="/"
      style={{
        marginTop: '10px',
        marginRight: '60px',
        color: 'white',
        textDecoration: 'none',
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, Cantarell, "Helvetica Neue", Oxygen, "Open Sans", sans-serif', // Change the font
        fontSize: '20px', // Make the text bigger
      }}
    >
      Home
    </Link>
    <Link
      href="/chart"
      style={{
        marginTop: '10px',
        marginRight: '60px',
        color: 'white',
        textDecoration: 'none',
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, Cantarell, "Helvetica Neue", Oxygen, "Open Sans", sans-serif', // Change the font
        fontSize: '20px', // Make the text bigger
      }}
    >
      View Records
    </Link>
    <Link
      href="/plan"
      style={{
        marginTop: '10px',
        color: 'white',
        textDecoration: 'none',
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, Cantarell, "Helvetica Neue", Oxygen, "Open Sans", sans-serif', // Change the font
        fontSize: '20px', // Make the text bigger
      }}
    >
      Treatment
    </Link>
  </nav>
</header>
      <h1>Upload your consultation recording below (.mp3 required, must end with .mp3 too)</h1>
      <input
        type="file"
        accept="audio/mp3"
        style={{width: 240, padding: 10, border: 'none', borderRadius: 5, cursor: 'pointer'}}
        onChange={handleFileChange}
        disabled={uploading}
      />
      <button
        style={{padding: 12}}
        onClick={handleFileUpload}
        disabled={uploading || !file} // Disable button if no file is selected
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
      <p>File selected: <code>{message}</code></p>
    </div>
  );
}