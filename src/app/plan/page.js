"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Plan() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [error, setError] = useState(null);

  // Fetch patients data when the page loads
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/get-patients');
        const data = await response.json();
        if (response.ok) {
          setPatients(data);
        } else {
          setError('Failed to fetch patient data');
        }
      } catch (err) {
        setError('Error fetching patient data');
      }
    };

    fetchPatients();
  }, []);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setTreatmentPlan(''); // Reset treatment plan
    setError(null); // Reset any errors
  };

  const handleGenerateTreatmentPlan = async () => {
    if (!selectedPatient) {
      setError('Please select a patient first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/treat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientData: selectedPatient }),
      });

      const data = await response.json();

      if (response.ok) {
        setTreatmentPlan(data.treatmentPlan);
      } else {
        setError(data.message || 'Failed to generate treatment plan');
      }
    } catch (err) {
      setError('An error occurred while generating the treatment plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
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
          alignItems: 'center',
          height: '45px',
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
              fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, Cantarell, "Helvetica Neue", Oxygen, "Open Sans", sans-serif',
              fontSize: '20px',
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
              fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, Cantarell, "Helvetica Neue", Oxygen, "Open Sans", sans-serif',
              fontSize: '20px',
            }}
          >
            Add Record
          </Link>
          <Link
            href="/chart"
            style={{
              marginTop: '10px',
              color: 'white',
              textDecoration: 'none',
              fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, Cantarell, "Helvetica Neue", Oxygen, "Open Sans", sans-serif',
              fontSize: '20px',
            }}
          >
            View Records
          </Link>
        </nav>
      </header>

      <main style={{ paddingTop: '60px' }}>
        <h1>Two clicks for a base treatment plan. It's that easy!</h1>

        {error && <p className="error">{error}</p>}

        {/* Patient Table */}
        <table className="patient-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Visit Date</th>
              <th>Diagnosis</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient._id}
                onClick={() => handleSelectPatient(patient)}
                className={selectedPatient?._id === patient._id ? 'selected' : ''}
              >
                <td>{patient.Name}</td>
                <td>{patient['Date of Birth']}</td>
                <td>{patient['Visit Date']}</td>
                <td>{patient.Diagnosis}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Display Treatment Plan */}
        {treatmentPlan && (
          <div>
            <h3>Treatment Plan:</h3>
            <p style={{letterSpacing: '1.2px', lineHeight: '1.2'}}>{treatmentPlan}</p>
          </div>
        )}
      </main>

      {/* Footer Section (fixed at the bottom) */}
      {selectedPatient && (
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
            onClick={handleGenerateTreatmentPlan}
            className="confirm-button"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Treatment Plan'}
          </button>
      </footer>
      )}
    </div>
  );
}
