import { CheerioCrawler, RequestQueue, ProxyConfiguration } from 'crawlee';
import { convert } from 'html-to-text';
import { createHash, randomUUID } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PROXY_URLS = [
  'http://sp3t6soe8s:wmA1+pUdq481hnnqNE@dc.decodo.com:10000',
  'http://sp3e12j8xf:5K67yumpNr_8BdfKmr@gate.decodo.com:7000',
];

const proxyConfiguration = new ProxyConfiguration({
  tieredProxyUrls: [PROXY_URLS],
});

export interface ScrapeResult {
  url: string;
  text: string;
  charCount: number;
  storagePath: string;
  success: boolean;
  error?: string;
}

export interface ScrapeRequest {
  partitionId: string;
  urls: string[];
  maxConcurrency?: number;
  maxRequestsPerMinute?: number;
}

export async function scrapeUrls(req: ScrapeRequest): Promise<ScrapeResult[]> {
  const { partitionId, urls, maxConcurrency = 10, maxRequestsPerMinute = 60 } = req;
  const jobId = randomUUID();
  const requestQueue = await RequestQueue.open(jobId);

  const results: ScrapeResult[] = [];

  const crawler = new CheerioCrawler({
    maxConcurrency,
    maxRequestsPerMinute,
    proxyConfiguration,
    requestQueue,
    requestHandler: async ({ request, body, contentType }) => {
      try {
        const html = body.toString(contentType?.encoding || 'utf8');
        const cleanText = convert(html, {
          wordwrap: false,
          selectors: [
            { selector: 'script', format: 'skip' },
            { selector: 'style', format: 'skip' },
            { selector: 'nav', format: 'skip' },
            { selector: 'footer', format: 'skip' },
          ],
        });

        const fileName = createHash('sha256').update(request.url).digest('hex') + '.txt';
        const storagePath = `scraping/${partitionId}/${fileName}`;

        const { error } = await supabase.storage
          .from('scraped-content')
          .upload(storagePath, cleanText, {
            contentType: 'text/plain',
            upsert: true,
          });

        if (error) throw error;

        results.push({
          url: request.url,
          text: cleanText,
          charCount: cleanText.length,
          storagePath,
          success: true,
        });
      } catch (err: any) {
        results.push({
          url: request.url,
          text: '',
          charCount: 0,
          storagePath: '',
          success: false,
          error: err.message,
        });
      }
    },
    failedRequestHandler: async ({ request }, error) => {
      results.push({
        url: request.url,
        text: '',
        charCount: 0,
        storagePath: '',
        success: false,
        error: error.message,
      });
    },
  });

  await crawler.run(urls);
  return results;
}
