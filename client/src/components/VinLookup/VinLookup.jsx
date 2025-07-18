import React from 'react';
import Part from '../Part';

export const VinLookup = ({
  vin,
  loading,
  results,
  error,
  onTextChange,
  onImageUpload,
  onLookup,
}) => (
  <div className="VinLookup flex">
    <h1>Look Up Parts by VIN</h1>
    <input type="file" name="vinImage" accept="image/*" onChange={onImageUpload} />
    <div style={{ marginTop: '10px', width: '300px' }}>
      <input
        type="text"
        value={vin}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Enter VIN"
      />
      <button onClick={() => onLookup(vin)} disabled={loading}>
        {loading ? 'Looking up...' : 'Lookup'}
      </button>
    </div>

    {error && <p>{error}</p>}

    {results && results.vehicle && (
      <div>
        <h2>Vehicle:</h2>
        <p>{results.vehicle.year} {results.vehicle.make} {results.vehicle.model} ({results.vehicle.body})</p>
        {results.parts.map((part, i) => <Part key={i} part={part} />)}
      </div>
    )}
  </div>
)
export default VinLookup;