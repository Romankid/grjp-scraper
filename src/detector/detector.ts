import * as cheerio from 'cheerio';
import { detectClues, MatchKeys } from './html-matcher.js';

export interface DetectionResult {
  url: string;
  success: boolean;
  chatbots?: Array<{ match: string; foundStrings: string[] }>;
  crm?: Array<{ match: string; foundStrings: string[] }>;
  custom?: Array<{ match: string; foundStrings: string[] }>;
  error?: string;
}

export interface DetectRequest {
  urls: string[];
  includeChatbots?: boolean;
  includeCrm?: boolean;
  customKeys?: MatchKeys;
  caseSensitive?: boolean;
}

export async function detectFromUrls(req: DetectRequest): Promise<DetectionResult[]> {
  const results: DetectionResult[] = [];

  for (const url of req.urls) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; GRJP-Scraper/1.0)',
        },
      });

      if (!response.ok) {
        results.push({
          url,
          success: false,
          error: `HTTP ${response.status}`,
        });
        continue;
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const fullHtml = $.html();

      const clues = detectClues(fullHtml, {
        chatbots: req.includeChatbots !== false,
        crm: req.includeCrm !== false,
        customKeys: req.customKeys,
      });

      results.push({
        url,
        success: true,
        chatbots: clues.chatbots,
        crm: clues.crm,
        custom: clues.custom,
      });
    } catch (err: any) {
      results.push({
        url,
        success: false,
        error: err.message,
      });
    }
  }

  return results;
}
