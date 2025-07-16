import React from 'react';
import { useState } from 'react';
const API = import.meta.env.VITE_API_URL;

export default function VinLookup() {
  const [vin, setVin] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
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
      const res = await fetch(`${API}/api/parts?vin=${vin}`);
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
    <div className="max-w-xl mx-auto p-4 bg-white rounded-2xl shadow">
      <h1 className="text-xl font-semibold mb-4">VIN Part Lookup</h1>
      <input
        type="text"
        value={vin}
        onChange={(e) => setVin(e.target.value)}
        placeholder="Enter VIN"
        className="w-full border border-gray-300 p-2 rounded mb-2"
      />
      <button
        onClick={handleLookup}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Looking up...' : 'Lookup'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {results && (
        <div className="mt-4">
          <h2 className="font-bold">Vehicle:</h2>
          <p>{results.vehicle.year} {results.vehicle.make} {results.vehicle.model} ({results.vehicle.body})</p>

          <h2 className="font-bold mt-3">Parts:</h2>
          <table className="w-full mt-2 border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-1 text-left">Part #</th>
                <th className="border p-1 text-left">Description</th>
                <th className="border p-1 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {results.parts.map((part, i) => (
                <tr key={i}>
                  <td className="border p-1">{part.PartNumber}</td>
                  <td className="border p-1">{part.Description}</td>
                  <td className="border p-1">{part.Price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
