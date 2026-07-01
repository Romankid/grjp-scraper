# GRJP Clue Detector

Detects specific HTML clues on websites (chatbots, CRMs, tech stack signals, etc.).

This is the correct extraction from the original GRJP scraper focused on **identifying vendors and signals** in HTML, not bulk text scraping.

## Quick Start

```bash
git clone https://github.com/Romankid/grjp-scraper.git
cd grjp-scraper
npm install
npm run dev
```

## Usage

**POST** `/detect`

```json
{
  "urls": ["https://university.edu"],
  "includeChatbots": true,
  "includeCrm": true
}
```

**Response example:**

```json
{
  "success": true,
  "results": [
    {
      "url": "https://university.edu",
      "success": true,
      "chatbots": [
        { "match": "Element451", "foundStrings": ["messenger.451.io"] }
      ],
      "crm": [
        { "match": "Slate", "foundStrings": ["slate-technolutions"] }
      ]
    }
  ]
}
```

## Default Detections

- **Chatbots**: Mainstay, Ocelot, Gecko, Element451, Ivy.ai, Oracle, BlackBeltHelp, Ada, Olark, Chaport
- **CRMs**: Slate, Target X, Ellucian CRM Recruit, Enrollment Rx, Salesforce, BlackBaud

You can also pass custom `customKeys` for your own detection rules.

## Purpose

Built for identifying technology and service clues on higher education websites via HTML inspection. Designed to be called from Clay or other enrichment tools.