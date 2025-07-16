import express from 'express';
import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { Client } from 'pg';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Setup env and paths
dotenv.config();
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../client/dist');
// Serve static frontend files from client/dist
const indexPath = resolve(__dirname, '../client/dist/index.html');
app.use(express.static(distDir));
app.use(cors());

// VIN → parts lookup API
app.get('/api/parts', async (req, res) => {

  const vin = req.query.vin.trim().toUpperCase();

  if (!vin || vin.length !== 17) {
    return res.status(400).json({ error: 'Invalid VIN' });
  }

  try {
    // Decode VIN
    const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`);
    const result = response.data.Results[0];

    const make = result.Make;
    const model = result.Model;
    const year = result.ModelYear;
    const body = result.BodyClass;

    if (!make || !model || !year) {
      return res.status(404).json({ error: 'VIN decode failed' });
    }

    // Connect to DB
    const db = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    await db.connect();

    // Query for matching parts
    const query = `
      SELECT * FROM public."${process.env.DB_TABLE}"
      WHERE "Make" ILIKE $1 AND "Model" ILIKE $2 AND "Year" = $3
    `;
    const values = [make, model, year];
    const resultSet = await db.query(query);
    await db.end();

    res.json({
      vin,
      vehicle: { make, model, year, body },
      parts: resultSet.rows,
    });

  } catch (err) {
    console.error('❌ Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// React fallback: serve index.html for any other route
app.get('*', (req, res) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend not built yet.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
