import express from 'express';
import cors from 'cors';
import { Client } from 'pg';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const app = express();
app.use(cors());

app.get('/api/parts', async (req, res) => {
  const vin = req.query.vin;
  if (!vin || vin.length !== 17) {
    return res.status(400).json({ error: 'Invalid VIN' });
  }

  const vinData = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`);
  const decoded = vinData.data.Results[0];

  const {
    Make: make,
    Model: model,
    ModelYear: year,
    BodyClass: body,
  } = decoded;

  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    await client.connect();
    const query = `
      SELECT * FROM public."${process.env.DB_TABLE}"
      WHERE "Make" ILIKE $1 AND "Model" ILIKE $2 AND "Year" = $3 AND "Body" ILIKE '%' || $4 || '%'
    `;
    const values = [make, model, year, body];
    const result = await client.query(query, values);
    await client.end();

    res.json({
      vin,
      vehicle: { make, model, year, body },
      parts: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.listen(3000, () => {
  console.log('🚀 API listening at http://localhost:3000');
});
