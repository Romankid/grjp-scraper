import express from 'express';
import dotenv from 'dotenv';
import { detectFromUrls, DetectRequest } from '../detector/detector.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'grjp-clue-detector' });
});

/**
 * Main clue detection endpoint
 * POST /detect
 */
app.post('/detect', async (req, res) => {
  try {
    const body: DetectRequest = req.body;

    if (!body.urls || !Array.isArray(body.urls) || body.urls.length === 0) {
      return res.status(400).json({ error: 'urls array is required' });
    }

    const results = await detectFromUrls(body);

    res.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🔍 GRJP Clue Detector running on port ${PORT}`);
  console.log(`   POST http://localhost:${PORT}/detect`);
});
