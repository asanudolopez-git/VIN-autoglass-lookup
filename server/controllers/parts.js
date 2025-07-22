import fs from 'fs';
import { unlink } from 'fs/promises';  // for async unlink
import { Client } from 'pg';
import { getVinTextFromImage, } from '../services/google.js';
import { decodeVin } from '../services/nhtsa_vpic.js';

// GET /api/parts?vin={vin}
export const partsIndex = async (req, res) => {
  const vin = req.query.vin.trim().toUpperCase();

  if (!vin || vin.length !== 17) {
    return res.status(400).json({ error: 'Invalid VIN' });
  }

  try {
    const result = await decodeVin(vin);
    if (!result || !result.Make || !result.Model || !result.ModelYear) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    const {
      Make,
      Model,
      ModelYear: year,
      BodyClass,
    } = result;

    const make = Make.split(/\W/)[0].toUpperCase();
    const model = Model.split(/\W/)[0].toUpperCase();
    const bodyRegex = new RegExp(`${BodyClass.toUpperCase().split(/\W/).filter(str => str).join('|')}`);

    const db = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: { rejectUnauthorized: false },
    });

    await db.connect();
    const query = `
      SELECT * FROM public."${process.env.DB_TABLE}"
      WHERE
      "Year" = $1
      AND UPPER("Make") LIKE '%' || $2 || '%' 
      AND UPPER("Model") LIKE '%' || $3 || '%'
      AND "WebsitePrice1_CanAm" != 'Call for Price'
    `;
    const values = [year, make, model];
    const queryString = query.replace('$1', year).replace('$2', make).replace('$3', model)
    console.log('SQL Query:', queryString);
    const resultSet = await db.query(query, values);
    await db.end();

    const parts = Object.values(resultSet.rows.reduce((uniqueParts, part) => {
      const { PartNumber, Year, Make, Model, Body, ModelHref, BodyHref } = part;
      
      if (Body && !Body.toUpperCase().match(bodyRegex)) {
        return uniqueParts;
      }
      const vehicles = uniqueParts[PartNumber] && uniqueParts[PartNumber].vehicles || [];
      const vehicle = {
        name: `${Year} ${Make} ${Model}${Body ? ` ${Body}` : ''}`,
        href: BodyHref || ModelHref,
      };
      uniqueParts[PartNumber] = {
        ...part,
        href: `https://www.canamautoglass.ca/parts/${PartNumber}`,
        vehicles: [...vehicles, vehicle],
      };
      return uniqueParts;
    }, {}));

    res.json({
      vin,
      vehicle: { make: Make, model: Model, year, body: BodyClass },
      parts
    });
  } catch (err) {
    console.error('❌ Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/parts/image
export const partsImage = async (req, res) => {
  const filePath = req.file.path;

  if (!filePath || !req.file.filename) {
    return res.status(400).json({ error: 'Invalid file upload' });
  }

  const imageBuffer = await fs.readFileSync(filePath);
  const base64Image = imageBuffer.toString('base64');
  try {
    const { vin, rawText } = await getVinTextFromImage(base64Image);

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
};