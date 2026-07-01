import express from 'express';
import dotenv from 'dotenv';
import { scrapeUrls, ScrapeRequest } from '../scraper/scraper.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'grjp-scraper' });
});

/**
 * Main scraping endpoint
 * POST /scrape
 * Body: { partitionId: string, urls: string[], maxConcurrency?: number, maxRequestsPerMinute?: number }
 */
app.post('/scrape', async (req, res) => {
  try {
    const body: ScrapeRequest = req.body;

    if (!body.partitionId || !body.urls || !Array.isArray(body.urls)) {
      return res.status(400).json({ 
        error: 'Missing required fields: partitionId and urls[]' 
      });
    }

    console.log(`[scrape] Starting job for partition ${body.partitionId} with ${body.urls.length} URLs`);

    const results = await scrapeUrls(body);

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    res.json({
      success: true,
      partitionId: body.partitionId,
      total: results.length,
      successful: successful.length,
      failed: failed.length,
      results,
    });
  } catch (error: any) {
    console.error('[scrape] Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 GRJP Scraper running on port ${PORT}`);
  console.log(`   POST http://localhost:${PORT}/scrape`);
});
