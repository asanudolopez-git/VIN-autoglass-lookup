import express from 'express';
import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { partsIndex, partsImage } from './controllers/parts.js';

// Setup env and paths
dotenv.config();
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const upload = multer({ dest: 'uploads/' });

// Serve static frontend files from client/dist
const distDir = resolve(__dirname, '../client/dist');
const indexPath = resolve(__dirname, '../client/dist/index.html');
app.use(express.static(distDir));
app.use(cors());

app.post('/api/parts/image', upload.single('vinImage'), partsImage);
app.get('/api/parts', partsIndex);

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
