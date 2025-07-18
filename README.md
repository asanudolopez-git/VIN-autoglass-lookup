# VIN Autoglass Lookup 🔍🧼

A full-stack VIN decoder tool that allows users to **upload a photo of their vehicle’s VIN**, automatically extract it using **Google Cloud Vision OCR**, and redirect to part lookup based on the decoded VIN.

Live: [https://vin-autoglass-lookup.onrender.com](https://vin-autoglass-lookup.onrender.com)

---

## 🚘 Features

- Upload a VIN image from a windshield or door
- Smart preprocessing using `sharp` to improve OCR accuracy
- OCR fallback using **Google Cloud Vision API**
- Regex VIN extraction and redirection to `/api/parts?vin=...`
- Deployed and testable on Render
- Node.js + Express backend with Vite + React frontend

---

## 🛠 Development Setup

Clone the repo:

```bash
git clone https://github.com/asanudolopez-git/VIN-autoglass-lookup.git
cd VIN-autoglass-lookup
```

Install dependencies:

```bash
npm install
```

Set up environment variables:

```env
# .env (root or /server)
GOOGLE_VISION_API_KEY=your-google-api-key-here
```

Start fullstack dev mode (client + server concurrently):

```bash
npm run dev
```

If you want to work only on the frontend:

```bash
# In one terminal
cd client
npm run dev

# In another terminal (for API routes)
cd server
npm run dev
```

---

## 🧪 API Endpoints

### `POST /api/parts-from-image`

Upload a VIN image via `multipart/form-data`:

**Body**: `vinImage` (file)

**Returns**: Redirects to `/api/parts?vin=...` if successful, or JSON error.

---

## 📦 Deployment

This project is deployed on [Render](https://render.com). Make sure your `GOOGLE_VISION_API_KEY` is set in Render's environment variables panel.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a branch: `git checkout -b feature/thing`
3. Commit your changes: `git commit -m "Add thing"`
4. Push to your fork: `git push origin feature/thing`
5. Submit a Pull Request 🎉

---

## 📄 License

MIT — do whatever you want, just don’t sell VINs to aliens 👽

---

## ✨ Maintained by

**Alex Sanudo Lopez**  
Saint John, NB 🇨🇦  
[github.com/asanudolopez-git](https://github.com/asanudolopez-git)