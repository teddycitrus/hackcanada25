"use client"

import { useEffect, useState } from "react";
import Link from 'next/link';

export default function Chart() {
  const [patients, setPatients] = useState([]);
  const [editedPatients, setEditedPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all patients data on component mount
  useEffect(() => {
    console.log("loading started");
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/get-patients');
        const data = await response.json();

        if (response.ok) {
          setPatients(data);
          setEditedPatients(data); // Initialize editedPatients with the fetched data
        } else {
          console.error('Failed to fetch patients:', data.message);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
        console.log("loading over");
      }
    };

    fetchPatients();
  }, []);

  const handleChange = (index, key, value) => {
    const updatedPatients = [...editedPatients];
    updatedPatients[index] = {
      ...updatedPatients[index],
      [key]: value
    };
    setEditedPatients(updatedPatients);
  };

  const handleSaveChanges = async () => {
    const changes = editedPatients.filter((patient, index) => {
      const originalPatient = patients[index];
      return Object.keys(patient).some(key => patient[key] !== originalPatient[key]);
    });
  
    if (changes.length > 0) {
      console.log(changes);
      if (window.confirm("Save changes?")) {
        try {
          // Send changes to the backend API
          const response = await fetch('/api/updatePatient', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ changes })
          });
  
          const result = await response.json();
          
          if (response.ok) {
            alert('Changes saved successfully!');
          } else {
            alert(`Error: ${result.error || 'Failed to save changes'}`);
          }
        } catch (error) {
          alert(`Error: ${error.message}`);
        }
      }
    } else {
      alert('No changes detected.');
    }
  };

  let content;

  if (loading) {
    content = (
      <div className="loader" class="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  } else {
    content = (
      <div>
        <table className="table-auto w-full border-1px border-solid">
          <thead>
            <tr>
              {["Object ID", "Patient ID", "Name", "D.O.B.", "Gender", "Visit Date", "Visit Type", "Reason For Visit", "Chief Complaint", "Past Medical History", "Medications", "Physical Examination", "Diagnosis"].map(header => (
                <th key={header} className="border-1px px-4 py-14">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {editedPatients.map((patient, index) => (
              <tr key={patient._id}>
                {Object.keys(patient).map((key, idx) => (
                  <td key={idx} className="border-1px px-4 py-14">
                    <input
                      type="text"
                      value={patient[key] || ""}
                      onChange={(e) => handleChange(index, key, e.target.value)}
                      className="w-full text-center"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <footer>
        <button
          onClick={handleSaveChanges}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Save Changes
        </button>
        </footer>
      </div>
    );
  }

  return (
    <div>
      <div class = "el"></div>
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
    alignItems: 'center',
    height: '45px'
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
      href="/record"
      style={{
        marginTop: '10px',
        marginRight: '60px',
        color: 'white',
        textDecoration: 'none',
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, Cantarell, "Helvetica Neue", Oxygen, "Open Sans", sans-serif', // Change the font
        fontSize: '20px', // Make the text bigger
      }}
    >
      Add Record
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
<div style={{marginTop: 30}}>
      {content}
      </div>
      <footer
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 40,
          zIndex: 100,
          backgroundColor: 'black',
          color: 'ivory',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 -2px 5px rgba(0,0,0,0.2)', // Optional shadow for footer
        }}
      >
        <button
          onClick={handleSaveChanges}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px', // Optional: increase font size
          }}
        >
          Save Changes
        </button>
      </footer>
    </div>
  );
}
