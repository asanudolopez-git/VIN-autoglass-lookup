import axios from 'axios';

export const decodeVin = async vin => {
  try {
    const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`);
    return response.data.Results[0];
  } catch (error) {
    console.error('Error decoding VIN:', error);
    return {};
  }
};