# GRJP Scraper (Standalone)

Lightweight, self-contained HTML scraper extracted from the original GRJP monorepo.

- Uses **Crawlee + Cheerio** (fast, no browser needed)
- Works with or without Supabase
- Automatically tries to create the storage bucket
- Simple HTTP API designed for Clay

## Quick Start (Minimal Setup)

```bash
git clone https://github.com/Romankid/grjp-scraper.git
cd grjp-scraper
cp .env.example .env
npm install
npm run dev
```

That's it. The scraper will work even without Supabase configured (it just returns the text in the response).

## Usage

**POST** `http://localhost:3000/scrape`

```json
{
  "partitionId": "clay-leads-2026",
  "urls": [
    "https://example.com"
  ]
}
```

**Response** includes the clean text for every URL.  
If Supabase is configured, it also saves the text to storage.

## Optional: Supabase Storage

If you want the scraped text saved to Supabase:

1. Add these to `.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. The scraper will automatically create the `scraped-content` bucket if it doesn't exist.

## Deployment

```bash
docker build -t grjp-scraper .
docker run -p 3000:3000 --env-file .env grjp-scraper
```

---

**Status**: Fully working, minimal setup version. Ready to use.