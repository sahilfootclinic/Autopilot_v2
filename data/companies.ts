// Short, recognisable company names by ticker, plus richer info for the
// "Magnificent 7" used on stock pages.

export type CompanyInfo = {
  ticker: string;
  name: string;
  sector: string;
  ceo: string;
  ceoNote: string;
  founded: string;
  hq: string;
  description: string;
};

export const MAG7: Record<string, CompanyInfo> = {
  AAPL: {
    ticker: "AAPL",
    name: "Apple",
    sector: "Consumer Electronics",
    ceo: "Tim Cook",
    ceoNote: "CEO since 2011, previously Apple's chief operating officer.",
    founded: "1976",
    hq: "Cupertino, California",
    description:
      "Apple designs the iPhone, Mac, iPad and Apple Watch and runs a fast-growing Services business spanning the App Store, iCloud and Apple Pay. It is one of the most profitable companies in the world, known for its tight hardware-software integration and enormous, loyal customer base.",
  },
  MSFT: {
    ticker: "MSFT",
    name: "Microsoft",
    sector: "Software & Cloud",
    ceo: "Satya Nadella",
    ceoNote: "CEO since 2014, credited with Microsoft's pivot to cloud and AI.",
    founded: "1975",
    hq: "Redmond, Washington",
    description:
      "Microsoft sells Windows, Office and the Azure cloud platform, and is a central player in the AI build-out through its partnership with OpenAI and its Copilot products. Enterprise software and cloud infrastructure generate the bulk of its profit.",
  },
  GOOGL: {
    ticker: "GOOGL",
    name: "Alphabet",
    sector: "Internet & Advertising",
    ceo: "Sundar Pichai",
    ceoNote: "CEO of Google since 2015 and of parent Alphabet since 2019.",
    founded: "1998",
    hq: "Mountain View, California",
    description:
      "Alphabet is the parent of Google — search, YouTube, Android and the Google Cloud platform — plus the Gemini AI models and the Waymo self-driving unit. Advertising still drives most of its revenue.",
  },
  AMZN: {
    ticker: "AMZN",
    name: "Amazon",
    sector: "E-commerce & Cloud",
    ceo: "Andy Jassy",
    ceoNote: "CEO since 2021, the founding leader of Amazon Web Services.",
    founded: "1994",
    hq: "Seattle, Washington",
    description:
      "Amazon runs the largest Western e-commerce marketplace and Amazon Web Services, the leading cloud-computing platform and its main profit engine. It also owns advertising, Prime Video and the Whole Foods grocery business.",
  },
  NVDA: {
    ticker: "NVDA",
    name: "Nvidia",
    sector: "Semiconductors",
    ceo: "Jensen Huang",
    ceoNote: "Co-founder and CEO since 1993.",
    founded: "1993",
    hq: "Santa Clara, California",
    description:
      "Nvidia designs the GPUs and networking that power most AI training and inference. Its data-center chips became the backbone of the generative-AI boom, making it one of the most valuable companies in the world.",
  },
  META: {
    ticker: "META",
    name: "Meta",
    sector: "Social Media",
    ceo: "Mark Zuckerberg",
    ceoNote: "Co-founder, chairman and CEO since 2004.",
    founded: "2004",
    hq: "Menlo Park, California",
    description:
      "Meta operates Facebook, Instagram, WhatsApp and Threads, reaching billions of users, and funds heavy bets on AI and the metaverse through Reality Labs. Digital advertising provides almost all of its revenue.",
  },
  TSLA: {
    ticker: "TSLA",
    name: "Tesla",
    sector: "Automotive & Energy",
    ceo: "Elon Musk",
    ceoNote: "CEO since 2008; also leads SpaceX and xAI.",
    founded: "2003",
    hq: "Austin, Texas",
    description:
      "Tesla is the leading electric-vehicle maker and also sells solar and battery-storage products. Investors increasingly value it on its ambitions in autonomy, robotics and AI as much as on car sales.",
  },
};

export function getCompanyInfo(ticker: string): CompanyInfo | undefined {
  return MAG7[ticker.trim().toUpperCase().replace(/-/g, "")];
}

// Broader ticker -> short name map used to tidy holdings tables.
export const KNOWN_NAMES: Record<string, string> = {
  AAPL: "Apple",
  MSFT: "Microsoft",
  GOOGL: "Alphabet",
  GOOG: "Alphabet",
  AMZN: "Amazon",
  NVDA: "Nvidia",
  META: "Meta",
  TSLA: "Tesla",
  "BRK-B": "Berkshire Hathaway",
  "BRK-A": "Berkshire Hathaway",
  AVGO: "Broadcom",
  JPM: "JPMorgan Chase",
  V: "Visa",
  MA: "Mastercard",
  UNH: "UnitedHealth",
  LLY: "Eli Lilly",
  COST: "Costco",
  HD: "Home Depot",
  NFLX: "Netflix",
  AMD: "AMD",
  CRM: "Salesforce",
  ORCL: "Oracle",
  ADBE: "Adobe",
  BAC: "Bank of America",
  WMT: "Walmart",
  KO: "Coca-Cola",
  PEP: "PepsiCo",
  DIS: "Disney",
  UBER: "Uber",
  ABNB: "Airbnb",
  PYPL: "PayPal",
  PLTR: "Palantir",
  MU: "Micron",
  INTC: "Intel",
  QCOM: "Qualcomm",
  TXN: "Texas Instruments",
  C: "Citigroup",
  WFC: "Wells Fargo",
  GS: "Goldman Sachs",
  MS: "Morgan Stanley",
  XOM: "ExxonMobil",
  CVX: "Chevron",
  PFE: "Pfizer",
  MRK: "Merck",
  ABBV: "AbbVie",
  T: "AT&T",
  VZ: "Verizon",
  NKE: "Nike",
  MCD: "McDonald's",
  SBUX: "Starbucks",
  COIN: "Coinbase",
  SHOP: "Shopify",
  SQ: "Block",
  SMH: "VanEck Semiconductor ETF",
  SPY: "S&P 500 ETF",
  QQQ: "Nasdaq 100 ETF",
  GLD: "SPDR Gold",
  TLT: "20+ Yr Treasury ETF",
  XLE: "Energy Sector ETF",
  VRT: "Vertiv",
  ALLY: "Ally Financial",
};
