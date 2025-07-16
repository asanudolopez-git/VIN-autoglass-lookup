import React, { useState } from 'react';
import Part from './Part';

export default function VinLookup({ VIN = '', res }) {
  const [vin, setVin] = useState(VIN);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(res);
  const [error, setError] = useState(null);

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
      <h1>VIN Part Lookup</h1>
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
