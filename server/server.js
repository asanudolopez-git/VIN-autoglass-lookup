import express from 'express';
import fs from 'fs';
import { unlink } from 'fs/promises';  // for async unlink
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { Client } from 'pg';
import path, { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

export const extractVINWithGoogleVision = async (imagePath) => {
  const imageBuffer = await fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');

  const body = {
    requests: [
      {
        image: { content: base64Image },
        features: [{ type: 'TEXT_DETECTION' }]
      }
    ]
  };

  try {
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    const { data: { responses = [{}] } } = response;
    const { textAnnotations, fullTextAnnotation } = responses[0];
    console.log({ textAnnotations, fullTextAnnotation });
    if (!textAnnotations || textAnnotations.length === 0) {
      // return res.status(500).json({ error: 'Failed to extract VIN from image' });
      return { vin: null, rawText: null };
    }
    const rawText = fullTextAnnotation.text.replace(/\s+/g, '').toUpperCase();
    const vinMatch = rawText.match(/[A-HJ-NPR-Z0-9]{17}/);
    console.log({ rawText, vinMatch })

    return {
      vin: vinMatch ? vinMatch[0] : null,
      rawText
    };
  } catch (err) {
    console.error('Google Vision OCR error:', JSON.stringify(err.response?.data || err.message));
    return { vin: null, rawText: null };
    // return res.status(500).json({ error: 'Failed to contact OCR' });
  }
};


// Setup env and paths
dotenv.config();
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve static frontend files from client/dist
const distDir = resolve(__dirname, '../client/dist');
const indexPath = resolve(__dirname, '../client/dist/index.html');
app.use(express.static(distDir));
app.use(cors());

// POST /api/parts-from-image
app.post('/api/parts-from-image', upload.single('vinImage'), async (req, res) => {
  const filePath = req.file.path;

  if (!filePath || !req.file.filename) {
    return res.status(400).json({ error: 'Invalid file upload' });
  }

  console.log('Processing file:', filePath);
  console.log(req.file);

  try {
    const { vin, rawText } = await extractVINWithGoogleVision(filePath);
    const candidates = rawText && rawText.match(/[A-HJ-NPR-Z0-9]{14,20}/g);

    console.log('VIN candidates:', candidates);
    console.log('OCR Result:', rawText);
    console.log('OCR VIN Result:', vin);

    if (vin) {
      res.redirect(`/api/parts?vin=${vin}`);
    } else {
      res.status(400).json({ error: 'VIN not found', vin: rawText });
    };
  } catch (err) {
    console.error('OCR error:', err);
    res.status(500).json({ error: 'Failed to extract VIN from image' });
  } finally {
    await unlink(filePath).catch(() => { });
  }
});


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
    const {
      Make: make,
      Model: model,
      ModelYear: year,
      BodyClass: body,
    } = result;

    if (!make || !model || !year || !body) {
      return res.status(404).json({ error: 'VIN decode failed' });
    }
    // Connect to DB
    const db = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: {
        rejectUnauthorized: false, // only use this for dev/self-signed
      },
    });

    await db.connect();

    // Query for matching parts
    const query = `
      SELECT * FROM public."${process.env.DB_TABLE}"
      WHERE "Make" ILIKE $1 AND "Model" ILIKE $2 AND "Year" = $3
    `;
    const values = [make, model, year];
    const resultSet = await db.query(query, values);
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
app.get(/(.*)/, (req, res) => {
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
