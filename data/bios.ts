// Factual bios for the people and portfolios behind each entry, keyed by slug.
// Shown in the "About" section on each detail page.

export const BIOS: Record<string, string> = {
  // ----- 13F fund managers (expanded) -----

  berkshire:
    "Warren Buffett is the chairman and CEO of Berkshire Hathaway and the most celebrated value investor in history. A student of Benjamin Graham at Columbia Business School, Buffett took control of a struggling textile company in 1965 and transformed it into a trillion-dollar conglomerate spanning insurance, railroads, energy and consumer brands. His record of compounding at roughly 20% per year for six decades is unmatched. He is known for buying wonderful businesses at fair prices, holding them essentially forever, and for his extraordinary candour in Berkshire's annual shareholder letters. His partnership with the late Charlie Munger refined the original Graham framework into a system that prizes competitive moats, honest management and the long-term power of retained earnings.",

  "pershing-square":
    "Bill Ackman founded Pershing Square Capital Management in 2004 and runs one of the most concentrated and publicly argued activist books on Wall Street. He typically holds fewer than ten positions at a time, takes large stakes, and then makes his investment thesis public through detailed slide decks and media appearances. Notable wins include a blockbuster bet against the US housing market via bond insurance and a multi-billion dollar long in Chipotle. Notable losses include a disastrous short in Herbalife and a costly bet against bonds in 2022. Ackman has in recent years expanded his public profile through X/Twitter, where he is one of the most followed investors in the world, weighing in on everything from politics to university governance.",

  bridgewater:
    "Ray Dalio founded Bridgewater Associates in his New York City apartment in 1975. It grew into the world's largest hedge fund, managing roughly $150 billion at its peak, built on two flagship strategies: Pure Alpha, a macro discretionary fund, and All Weather, a risk-parity approach that became widely copied across the industry. Dalio is the architect of Bridgewater's radical-transparency culture — recorded meetings, 'dot collector' feedback scores and an explicit belief that honest disagreement produces better decisions. He stepped back from day-to-day management in 2022 but remains a senior mentor. His book Principles and his framework for the long-term debt cycle have become required reading for a generation of investors and policymakers.",

  "situational-awareness":
    "Leopold Aschenbrenner is a former researcher at OpenAI and the author of Situational Awareness, a widely-read 2024 essay series arguing that artificial general intelligence is far closer than mainstream consensus acknowledges and that the US-China race for AI supremacy will be the defining geopolitical event of the next decade. He left OpenAI and launched Situational Awareness LP as a vehicle to invest directly in the companies he believes will capture the economic value of superintelligence — primarily the hyperscalers building AI infrastructure and the frontier-model labs themselves. The fund is small and concentrated, with public filings that have attracted enormous attention from the AI investor community.",

  ark:
    "Cathie Wood is the founder, CEO and CIO of ARK Invest, which she launched in 2014 after a distinguished career at AllianceBernstein. ARK's thematic ETFs — ARKK, ARKW, ARKG and others — became household names during the 2020–21 growth-stock rally when ARKK returned over 150% in a single year. The strategy focuses on five innovation platforms ARK identifies as generating exponential growth: AI and robotics, energy storage, DNA sequencing, blockchain technology and multiomics. Wood is one of the few major fund managers to make her full research and models publicly available. She has been a long-time bull on Tesla, cited it as a $2,000-plus target, and has maintained conviction through the stock's sharp drawdowns.",

  soros:
    "George Soros founded Soros Fund Management in 1970 and is one of the most consequential macro traders in history. He is best known for the 1992 'Black Wednesday' trade in which he shorted the British pound against the European Exchange Rate Mechanism and reportedly made $1 billion in a single day, forcing the UK out of the ERM. His intellectual framework — 'reflexivity', the idea that market prices and fundamentals influence each other in feedback loops — was developed over decades and lays out an alternative to the efficient-market hypothesis. Soros has largely transitioned his firm into a family office structure and has donated much of his fortune to Open Society Foundations, his global network of democracy and human-rights organisations.",

  renaissance:
    "Jim Simons was a world-class mathematician and codebreaker before he founded Renaissance Technologies in 1982. Renaissance's Medallion Fund, available only to employees, posted gross annualised returns of roughly 66% over three decades — one of the greatest track records in financial history. The strategy relies entirely on quantitative, model-driven trading: thousands of short-term signals derived from vast datasets, managed by a team of mathematicians, physicists and computer scientists rather than traditional finance professionals. Simons passed away in May 2024. His philanthropic foundation donated billions to mathematics education and scientific research. The firm's external funds — RIEF and RIDA — have produced more modest but still strong returns, and Renaissance continues to operate under its existing leadership.",

  appaloosa:
    "David Tepper founded Appaloosa Management in 1993 after being passed over for a partnership at Goldman Sachs. He built his reputation buying distressed debt in companies near or in bankruptcy — a strategy that required both deep credit analysis and nerves of steel. His most celebrated trade came at the March 2009 market bottom when he made a highly public bet on bank stocks, generating a reported $7 billion personal profit as the financial sector recovered. Tepper is known for bold, well-timed macro calls delivered with unusual directness. He also owns the Carolina Panthers NFL franchise. In recent years Appaloosa has shifted toward a more diversified equity book alongside its macro and distressed expertise.",

  scion:
    "Michael Burry founded Scion Asset Management and became a legend in financial history for identifying the US subprime mortgage bubble and constructing a massive credit-default-swap position against it — a trade that returned roughly 500% for his investors while the broader market collapsed in 2008. The story was told in Michael Lewis's book The Big Short and the subsequent film. Burry is known for deep, contrarian research: he reads every word of financial filings and looks for mispriced securities that the market has either missed or misunderstood. His portfolio is small by hedge-fund standards and intensely concentrated. He has been an outspoken critic of passive investing and index funds, warning they create a 'liquidity mismatch' that will end badly.",

  duquesne:
    "Stanley Druckenmiller ran Duquesne Capital from 1981 and reportedly did not have a single losing year across the fund's life, an almost unparalleled record in money management. He also served as George Soros's chief investment officer at Quantum Fund, where he helped execute the 1992 sterling trade. Druckenmiller's style combines deep macro analysis with a willingness to take enormous concentrated positions when he has strong conviction — both long and short. He closed Duquesne Capital to outside investors in 2010, citing the mental strain of managing client money, and now runs the Duquesne Family Office solely for his own account. He has been outspoken on US fiscal policy and the risks posed by the national debt.",

  // ----- Twitter Legends -----

  "michael-sikand":
    "Michael Sikand served as Head of International at Robinhood, overseeing global expansion for one of the most disruptive consumer brokerages in history. After leaving Robinhood he became a prominent voice on fintech, retail investing democratisation, and the future of financial infrastructure. He invests with a strong focus on next-generation financial platforms, digital assets, and AI-driven services — and has been publicly bullish on Coinbase, Block and Palantir.",

  "nikhil-kamath":
    "Nikhil Kamath is the co-founder of Zerodha, India's largest stock brokerage by active clients, and True Beacon, a SEBI-registered hedge fund that manages high-net-worth capital. One of India's youngest self-made billionaires, he is known for his candid macro-driven thinking and for blending quant strategies with deep fundamental research. He has spoken publicly about diversifying into US equities, particularly AI infrastructure and technology, and is one of the most followed investors in the Indian ecosystem.",

  "inverse-cramer":
    "Jim Cramer is the host of CNBC's Mad Money and a former hedge fund manager. 'Inverse Cramer' is a tongue-in-cheek strategy that went viral when retail traders documented his on-air buy calls underperforming the market — sometimes dramatically. The idea is simple: take the opposite side of whatever he recommends on television. It is a meme strategy and not a licensed fund. The holdings shown represent what an inverse position to his recent on-air calls would look like. For entertainment purposes only — not investment advice.",

  // ----- AI portfolios -----

  matt:
    "Matt is Sentinel's proprietary AI, built to do what the platform's data uniquely enables: synthesise the disclosed trades of every hedge fund manager, politician, and AI portfolio tracked on Sentinel into a single, continuously updated investment view. Where most AI portfolios score stocks in isolation, Matt cross-references thousands of disclosed positions across the entire Sentinel universe, tracks which investors are adding or trimming, and weights each signal by the investor's historical risk-adjusted performance. The result is a portfolio that reflects not just what any one investor believes, but where the collective intelligence of the market's most scrutinised participants actually converges — and where Matt's own analysis says the crowd has it right. Matt rebalances monthly and publishes a plain-English explanation of which portfolio signals drove each position. It is the only portfolio on Sentinel that knows what every other portfolio is doing.",

  "gpt-portfolio":
    "Alejandro Lopez-Lira is a finance professor whose research demonstrated that large language models can extract useful investment signal from financial news. The GPT Portfolio applies that work: each month ChatGPT scores every S&P 500 company on a 1–100 scale using firm financials, the past week's news headlines, and an AI-generated macro report. The top ~30 scored companies are shortlisted; ChatGPT then allocates a diversified 15-asset portfolio with per-position weights, investment theses and risk notes.",

  "grok-portfolio":
    "The Grok Portfolio follows the same monthly, LLM-scored methodology as the GPT Portfolio — developed from Alejandro Lopez-Lira's research — but uses xAI's Grok model to score companies and set allocations. Grok's training on X/Twitter data may give it differentiated signal on retail sentiment and emerging narratives.",

  // ----- Politicians -----

  "nancy-pelosi":
    "Nancy Pelosi represents California's 11th district in the U.S. House and is a former Speaker of the House, serving in the role during 2007–2011 and again during 2019–2023. The trades disclosed by her household — frequently large-cap technology positions, sometimes timed weeks before major legislative or regulatory developments — are among the most scrutinised in Congress and helped galvanise the STOCK Act compliance debate.",

  "marjorie-taylor-greene":
    "Marjorie Taylor Greene represents Georgia's 14th district and has been a frequent and active individual-stock trader since entering Congress in 2021. Her disclosed trades span large-cap US equities across sectors including technology, energy and healthcare.",

  "dan-crenshaw":
    "Dan Crenshaw represents Texas's 2nd district and is a former U.S. Navy SEAL. His disclosed portfolio tends toward energy and defence, reflecting his district's economic base and his committee work.",

  "josh-gottheimer":
    "Josh Gottheimer represents New Jersey's 5th district and is consistently one of the most active traders in the House by number of STOCK Act disclosures — often reporting dozens of trades per quarter across a diverse set of equities.",

  "ro-khanna":
    "Ro Khanna represents California's 17th district, covering much of Silicon Valley. His disclosures are notably large and broadly diversified, with many positions held by family trusts, reflecting deep ties to the technology industry.",

  "tommy-tuberville":
    "Tommy Tuberville is a U.S. Senator from Alabama and a former college football head coach. He is one of the most active stock traders in the Senate, with hundreds of disclosed trades spanning technology, energy, financials and consumer companies.",

  "michael-mccaul":
    "Michael McCaul represents Texas's 10th district and chairs the House Foreign Affairs Committee. His portfolio reflects the committee's focus areas, with notable exposure to defence contractors and technology companies.",

  "virginia-foxx":
    "Virginia Foxx represents North Carolina's 5th district and chairs the House Committee on Education and the Workforce. She is among the more active House traders, with a diversified portfolio of US equities.",
};

export function getBio(slug: string): string | undefined {
  return BIOS[slug];
}
