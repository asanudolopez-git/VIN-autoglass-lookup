import React, { useState } from 'react';
import { getPartsFromImage, getPartsFromVin } from '../api';
import { VinLookup } from '.';

const VinLookupContainer = ({ initialState = {} }) => {
  const [vin, setVin] = useState(initialState.vin || '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(initialState.results || null);
  const [error, setError] = useState(null);
  console.log(import.meta.env.VITE_API_URL);

  const handleData = data => {
    if (data.parts) {
      setResults(data);
      setVin(data.vin);
    } else {
      setError(data.error || 'No parts found.');
    }
  };

  const resetState = () => {
    setError(null);
    setLoading(false);
    setResults(null);
  };

  const handleImageUpload = async e => {
    e.preventDefault();
    resetState();
    const image = e.target.files[0];
    try {
      setLoading(true);
      const data = await getPartsFromImage(image);
      handleData(data);
    } catch (err) {
      setError('Error uploading image.');
    } finally {
      setLoading(false);
      e.target.value = null;
    }
  }

  const handleLookup = async () => {
    if (vin.length !== 17) {
      setError('VIN must be 17 characters');
      return;
    }
    resetState();
    try {
      setLoading(true);
      const data = await getPartsFromVin(vin);
      handleData(data);
    } catch (err) {
      setError('Error contacting server.');
    } finally {
      setLoading(false);
    }
  };

  return <VinLookup
    vin={vin}
    loading={loading}
    results={results}
    error={error}
    onTextChange={setVin}
    onImageUpload={handleImageUpload}
    onLookup={handleLookup}
  />
};
export default VinLookupContainer;