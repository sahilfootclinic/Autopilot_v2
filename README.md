# 13F Tracker

A private site for following the quarterly stock holdings of the world's
top institutional investors. Pulls data directly from SEC EDGAR — no
scraping, no API keys.

## Stack

- **Next.js 16** (App Router, server components)
- **Tailwind CSS** for styling
- **SEC EDGAR** as the data source
- Deployed on **Vercel** (push-to-deploy)

## How it stays fresh

Every fund page and the homepage are server-rendered with Next.js's
`revalidate` set to 6 hours, so data is automatically re-fetched from
SEC EDGAR without any cron jobs or background workers. The first
visitor after a 6-hour window triggers a refresh.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

All environment variables are optional — the app runs with none set:

```
# Recommended by the SEC for the EDGAR User-Agent header
SEC_USER_AGENT="Your Name your-email@example.com"

# Optional: raises the OpenFIGI CUSIP→ticker rate limit (free key)
OPENFIGI_API_KEY="..."

# Optional: override the congressional trades dataset URL
HOUSE_TRADES_URL="https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json"
```

## Data sources

- **13F holdings** — SEC EDGAR (official).
- **Live prices** — Yahoo Finance `v8/chart` endpoint; CUSIP→ticker mapping
  via the free OpenFIGI API.
- **AI Portfolios** (GPT / Grok) — reference allocations following the
  methodology in A. Lopez-Lira's *GPT Portfolio White Paper V2* (15 assets,
  monthly rebalance, LLM-scored S&P 500). Edit `data/aiPortfolios.ts` and
  push to update after a rebalance.
- **Politicians** — community `house-stock-watcher` dataset of congressional
  STOCK Act disclosures (third-party, not official SEC data).

## Deploying

This repo is configured to deploy to Vercel. Any push to a branch
creates a Preview deployment; pushes to `main` update Production.

1. In Vercel, import this GitHub repo (one-time).
2. No env vars are required. Optionally set `SEC_USER_AGENT`.
3. Every `git push` automatically rebuilds.

To share a permanent URL with family/friends, merge the feature branch
into `main` and Vercel's Production URL becomes the link to share.

## Editing the curated investor list

Edit `lib/investors.ts`. Each entry needs a CIK (SEC's identifier).
Find a manager's CIK by searching them on
https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany and noting
the 10-digit number.

## Data caveats

- 13F filings are reported up to 45 days after quarter-end. They are
  a snapshot, not real time.
- Long U.S. equity positions only — no shorts (with rare exceptions),
  no foreign equities, no private holdings.
- For informational purposes only. Not investment advice.
