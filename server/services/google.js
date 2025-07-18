import axios from 'axios';

export const getVinTextFromImage = async image => {
  const body = {
    requests: [
      {
        image: { content: image },
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

    if (!textAnnotations || textAnnotations.length === 0) {
      return { vin: null, rawText: null };
    }

    const rawText = fullTextAnnotation.text.replace(/\s+/g, '').toUpperCase();
    const vinMatch = rawText.match(/[A-Z0-9]{17}/);

    return {
      vin: vinMatch ? vinMatch[0] : null,
      rawText
    };
  } catch (err) {
    console.error('Google Vision OCR error:', JSON.stringify(err.response?.data || err.message));
    return { vin: null, rawText: null };
  }
}