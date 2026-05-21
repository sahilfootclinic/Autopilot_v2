// Short factual bios for the people and portfolios behind each entry,
// keyed by slug. Shown in the "About" section of each detail page.

export const BIOS: Record<string, string> = {
  // ----- 13F fund managers -----
  berkshire:
    "Warren Buffett is the chairman of Berkshire Hathaway and the most celebrated value investor of the modern era. A student of Benjamin Graham, he built Berkshire into a trillion-dollar conglomerate by buying durable businesses at sensible prices and holding them for decades.",
  scion:
    "Michael Burry founded Scion Asset Management. He famously identified the subprime mortgage bubble and bet against it before the 2008 crash — a trade chronicled in Michael Lewis's book and the film The Big Short. He is known for deep contrarian research and concentrated positions.",
  "pershing-square":
    "Bill Ackman founded Pershing Square Capital Management. He is an activist investor known for large, concentrated positions and public campaigns to change how the companies he owns are run.",
  bridgewater:
    "Ray Dalio founded Bridgewater Associates, the world's largest hedge fund. He built his career on a systematic, macro-driven process and the firm's All Weather and Pure Alpha strategies.",
  renaissance:
    "Jim Simons was a mathematician and founder of Renaissance Technologies, whose Medallion Fund posted one of the greatest track records in history using quantitative, model-driven trading. Simons passed away in 2024; the firm continues.",
  appaloosa:
    "David Tepper founded Appaloosa Management and owns the Carolina Panthers. He is known for bold, well-timed bets on distressed debt and beaten-down equities.",
  greenlight:
    "David Einhorn founded Greenlight Capital, a long/short value fund known for rigorous fundamental research and several high-profile short calls.",
  "third-point":
    "Daniel Loeb founded Third Point, an event-driven and activist hedge fund known for pointed letters to corporate management.",
  "tiger-global":
    "Chase Coleman founded Tiger Global Management. A 'Tiger Cub' mentored by Julian Robertson, he is known for aggressive growth and technology investing across public and private markets.",
  baupost:
    "Seth Klarman founded the Baupost Group and wrote Margin of Safety. He is a value investor known for patience, large cash balances and strict downside discipline.",
  ark:
    "Cathie Wood is the founder, CEO and CIO of ARK Invest. She is known for high-conviction, thematic bets on disruptive innovation — genomics, artificial intelligence and electric vehicles.",
  coatue:
    "Philippe Laffont founded Coatue Management, a 'Tiger Cub' running a technology-focused long/short strategy across public and private markets.",
  soros:
    "George Soros founded Soros Fund Management and is one of the most famous macro traders in history, known for 'breaking the Bank of England' in 1992 and his theory of reflexivity.",
  "lone-pine":
    "Stephen Mandel founded Lone Pine Capital, a 'Tiger Cub' known for fundamental, research-driven long/short investing in high-quality growth companies.",
  citadel:
    "Ken Griffin founded Citadel, a multi-strategy hedge fund, and Citadel Securities, a leading market maker. He is one of the most successful financiers of his generation.",
  "two-sigma":
    "John Overdeck and David Siegel co-founded Two Sigma, a quantitative hedge fund that applies data science and large-scale computing to systematic trading.",
  millennium:
    "Israel Englander founded Millennium Management, a multi-strategy 'pod shop' that allocates capital across many specialized, independently-run trading teams.",
  "de-shaw":
    "David E. Shaw founded D. E. Shaw & Co., a pioneer of quantitative and computational finance and one of the original quant powerhouses.",
  duquesne:
    "Stanley Druckenmiller is a legendary macro investor who ran Duquesne Capital for decades reportedly without a losing year, and helped execute the 1992 sterling trade. He now invests through the Duquesne Family Office.",
  pabrai:
    "Mohnish Pabrai founded Pabrai Investment Funds and is a devoted follower of Buffett and Munger. He is known for the low-risk, high-uncertainty 'Dhandho' approach to value investing.",

  // ----- Themed / coming-soon -----
  "situational-awareness":
    "Leopold Aschenbrenner is a former OpenAI researcher and the author of Situational Awareness, a widely-read essay series arguing that artificial general intelligence is close. He launched an investment firm built around that thesis.",
  "inverse-cramer":
    "Jim Cramer is the host of CNBC's Mad Money and a former hedge fund manager. 'Inverse Cramer' is a tongue-in-cheek idea popular online: take the opposite side of his on-air calls. It is a meme strategy, not an endorsement.",

  // ----- AI portfolios -----
  "gpt-portfolio":
    "Alejandro Lopez-Lira is a finance professor whose research showed that large language models can extract useful signal from financial news. The GPT Portfolio applies that work: each month ChatGPT scores the S&P 500 and assembles a 15-asset portfolio.",
  "grok-portfolio":
    "The Grok Portfolio follows the same monthly, LLM-scored methodology as the GPT Portfolio — developed from Alejandro Lopez-Lira's research — but uses xAI's Grok model to score companies and set allocations.",

  // ----- Politicians -----
  "nancy-pelosi":
    "Nancy Pelosi represents California in the U.S. House and is a former Speaker of the House. Trades disclosed by her household — often well-timed large-cap technology positions — are among the most closely watched in Congress.",
  "marjorie-taylor-greene":
    "Marjorie Taylor Greene represents Georgia's 14th district and has been an active individual-stock trader since entering Congress.",
  "dan-crenshaw":
    "Dan Crenshaw represents Texas's 2nd district and is a former U.S. Navy SEAL.",
  "josh-gottheimer":
    "Josh Gottheimer represents New Jersey's 5th district and is consistently one of the most active traders in the House by number of disclosures.",
  "ro-khanna":
    "Ro Khanna represents California's 17th district, covering much of Silicon Valley. His disclosures are large and broadly diversified, with many positions held by family trusts.",
};

export function getBio(slug: string): string | undefined {
  return BIOS[slug];
}
