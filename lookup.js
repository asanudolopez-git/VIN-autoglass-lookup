import axios from 'axios';
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const decodeVin = async vin => {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`;
  const { data } = await axios.get(url);
  const result = data.Results[0];
  return {
    make: result.Make || null,
    model: result.Model || null,
    year: result.ModelYear || null,
    body: result.BodyClass || null,
  };
};

const findParts = async ({ make, model, year, body }) => {
  DB_USER = 'alexsanudo';
  DB_HOST = 'localhost';
  DB_DATABASE = 'dynasty-dev';
  DB_PASSWORD = '';
  DB_PORT = '5432';
  DB_TABLE = 'DG_PartPriceDetail';

  await client.connect();
  const query = `
  SELECT * FROM public."${TABLE}"
  WHERE
    "Make" ILIKE '${make}' AND
    "Model" ILIKE '${model}' AND
    "Year" = '${year}' AND
    "Body" ILIKE '%${body}%'
  `;
  console.log(query);
  const res = await client.query(query);
  await client.end();
  return res.rows;
};

const lookup = async vin => {
  if (!vin || vin.length !== 17) {
    console.error('❌ Please provide a valid 17-character VIN.');
  }

  console.log(`🔍 Decoding VIN: ${VIN}`);
  const { make, model, year, body } = await decodeVin(vin);
  const parts = await findParts({ make, model, year, body });
  if (parts.length === 0) {
    console.log('❌ No matching parts found in database.');
  } else {
    console.log(`✅ Found ${parts.length} matching part(s):`);
    console.table(parts);
  }
}
// console.log({
//   DB_USER: process.env.DB_USER,
//   DB_HOST: process.env.DB_HOST,
//   DB_DATABASE: process.env.DB_DATABASE,
//   DB_PASSWORD: process.env.DB_PASSWORD,
//   DB_PORT: process.env.DB_PORT,
//   DB_TABLE: process.env.DB_TABLE,
//   VIN,
// });
export default lookup;