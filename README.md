# GRJP Scraper

Standalone HTML scraper extracted from the original GRJP monorepo.  
Uses **Crawlee + Cheerio** for fast, lightweight scraping and stores clean text in **Supabase Storage**.

Designed to be called from Clay (or any HTTP client) and owned by you.

## Features
- Cheerio-based scraping (fast, no browser overhead)
- Clean text extraction with `html-to-text`
- Automatic upload to Supabase Storage
- Proxy support (Decodo configured)
- Simple REST API

## Setup

### 1. Supabase Setup (one-time)

1. Go to your Supabase project
2. Create a new Storage bucket called **`scraped-content`** (make it public or use service role)
3. Get your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

### 2. Local Development

```bash
git clone https://github.com/Romankid/grjp-scraper.git
cd grjp-scraper
cp .env.example .env
# Edit .env with your Supabase credentials
npm install
npm run dev
```

The server will start on port 3000.

### 3. Usage (from Clay or curl)

**POST** `http://localhost:3000/scrape`

```json
{
  "partitionId": "clay-leads-june2026",
  "urls": [
    "https://example.com/page1",
    "https://example.com/page2"
  ],
  "maxConcurrency": 8,
  "maxRequestsPerMinute": 40
}
```

**Response:**
```json
{
  "success": true,
  "partitionId": "clay-leads-june2026",
  "total": 2,
  "successful": 2,
  "failed": 0,
  "results": [
    {
      "url": "https://example.com/page1",
      "text": "Clean extracted text here...",
      "charCount": 1240,
      "storagePath": "scraping/clay-leads-june2026/abc123.txt",
      "success": true
    }
  ]
}
```

The cleaned text is also saved to Supabase Storage at `scraping/{partitionId}/{hash}.txt`.

## Deployment

### Docker

```bash
docker build -t grjp-scraper .
docker run -p 3000:3000 --env-file .env grjp-scraper
```

(See Dockerfile below)

## Notes for Milo (the agent)

This tool is now owned and maintained in this repo.  
Both you and Sam can use the `/scrape` endpoint.

---

**Status**: Initial working version complete. Ready for testing.