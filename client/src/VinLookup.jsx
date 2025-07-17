import React, { useState } from 'react';
import Part from './Part';

export default function VinLookup({ VIN = '', res }) {
  const [vin, setVin] = useState(VIN);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(res);
  const [error, setError] = useState(null);

  const handleImageChange = async e => {
    e.preventDefault();
    setVin('');
    setError(null);
    setLoading(true);
    setResults(null);

    const file = e.target.files[0];

    const formData = new FormData();
    formData.append('vinImage', file);

    const res = await fetch('/api/parts-from-image', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setLoading(false);
    if (data.parts) {
      setResults(data);
    } else {
      console.error('Error:', data);
      setVin(data.vin);
      setError(data.error || 'No parts found.');
    }
  }

  const handleLookup = async () => {
    console.log('🔍 Looking up VIN:', vin);
    if (vin.length !== 17) {
      setError('VIN must be 17 characters');
      return;
    }
    setError(null);
    setLoading(true);
    setResults(null);

    try {
      const res = await fetch(`/api/parts?vin=${vin}`);
      const data = await res.json();
      if (data.parts?.length) {
        setResults(data);
      } else {
        setError('No parts found.');
        console.log('ASANUDO: ', data.vin);
        setVin(data.vin || vin);
      }
    } catch (err) {
      setError('Error contacting server.');
    } finally {
      setLoading(false);
    }
  };

  console.log({ vin });
  console.log({ loading });
  console.log({ results });
  console.log({ error });
  return (
    <div className="VinLookup">
      <h1>Look Up Parts by VIN</h1>
      <input type="file" name="vinImage" accept="image/*" onChange={handleImageChange} />
      <div style={{ marginTop: '10px', width: '300px' }}>
        <input
          type="text"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          placeholder="Enter VIN"
        />
        <button
          onClick={handleLookup}
          disabled={loading}
        >
          {loading ? 'Looking up...' : 'Lookup'}
        </button>

      </div>

      {error && <p>{error}</p>}

      {results && results.vehicle && (
        <div >
          <h2>Vehicle:</h2>
          <p>{results.vehicle.year} {results.vehicle.make} {results.vehicle.model} ({results.vehicle.body})</p>

          <h2>Parts:</h2>
          {results.parts.map((part, i) => (
            <Part key={i} part={part} />
          ))}
        </div>
      )}
    </div>
  );
}
