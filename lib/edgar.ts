import { XMLParser } from "fast-xml-parser";

const UA =
  process.env.SEC_USER_AGENT ||
  "13F Tracker (private, family-use) contact@example.com";

const SEC_HEADERS: HeadersInit = {
  "User-Agent": UA,
  Accept: "application/json,text/html,application/xml;q=0.9,*/*;q=0.8",
};

const REVALIDATE = 60 * 60 * 6; // 6 hours

export function padCik(cik: string): string {
  const digits = cik.replace(/\D/g, "");
  return digits.padStart(10, "0");
}

export type FilingRef = {
  accessionNumber: string;
  accessionRaw: string;
  filingDate: string;
  reportDate: string;
  form: string;
  primaryDocument: string;
};

export type FilerProfile = {
  cik: string;
  name: string;
  sicDescription?: string;
  addresses?: any;
  filings: FilingRef[];
};

export async function getFilerProfile(cik: string): Promise<FilerProfile> {
  const padded = padCik(cik);
  const url = `https://data.sec.gov/submissions/CIK${padded}.json`;
  const res = await fetch(url, {
    headers: SEC_HEADERS,
    next: { revalidate: REVALIDATE },
  });
  if (!res.ok) {
    throw new Error(`Failed to load filer ${cik}: ${res.status}`);
  }
  const data = await res.json();
  const recent = data?.filings?.recent ?? {};
  const accessions: string[] = recent.accessionNumber ?? [];
  const filings: FilingRef[] = accessions.map((acc: string, i: number) => ({
    accessionNumber: acc,
    accessionRaw: acc.replace(/-/g, ""),
    filingDate: recent.filingDate?.[i] ?? "",
    reportDate: recent.reportDate?.[i] ?? "",
    form: recent.form?.[i] ?? "",
    primaryDocument: recent.primaryDocument?.[i] ?? "",
  }));

  return {
    cik: padded,
    name: data?.name ?? "Unknown",
    sicDescription: data?.sicDescription,
    addresses: data?.addresses,
    filings,
  };
}

export async function get13FFilings(cik: string): Promise<FilingRef[]> {
  const profile = await getFilerProfile(cik);
  return profile.filings.filter(
    (f) => f.form === "13F-HR" || f.form === "13F-HR/A"
  );
}

export type Holding = {
  nameOfIssuer: string;
  titleOfClass: string;
  cusip: string;
  value: number; // in USD (raw — see scaleMultiplier below)
  shares: number;
  sharesType?: string;
  putCall?: string;
  investmentDiscretion?: string;
  votingSole?: number;
  votingShared?: number;
  votingNone?: number;
};

export type FilingHoldings = {
  cik: string;
  accession: string;
  reportDate: string;
  filingDate: string;
  totalValueUsd: number;
  totalPositions: number;
  holdings: Holding[];
};

/**
 * The 13F information table is in an XML file inside the filing directory.
 * Newer filings use an XSD/XML pair. We list the directory index to locate
 * the InformationTable XML file.
 */
async function findInformationTableUrl(
  cik: string,
  accessionRaw: string
): Promise<string | null> {
  const cikInt = parseInt(cik, 10).toString();
  const indexUrl = `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cikInt}&type=13F&dateb=&owner=include&count=40`;
  // Use the JSON directory index instead — more stable.
  const dirUrl = `https://www.sec.gov/Archives/edgar/data/${cikInt}/${accessionRaw}/index.json`;
  const res = await fetch(dirUrl, {
    headers: SEC_HEADERS,
    next: { revalidate: REVALIDATE },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const items: any[] = data?.directory?.item ?? [];
  // Look for an XML file that is the information table.
  // Heuristics: contains "infotable" or "informationtable" or "form13fInfoTable"
  // or any .xml that isn't the primary submission doc.
  const candidates = items.filter(
    (it) =>
      typeof it.name === "string" &&
      it.name.toLowerCase().endsWith(".xml") &&
      !it.name.toLowerCase().includes("primary_doc")
  );
  let pick =
    candidates.find((c) => /info.?table/i.test(c.name)) ?? candidates[0];
  if (!pick) return null;
  return `https://www.sec.gov/Archives/edgar/data/${cikInt}/${accessionRaw}/${pick.name}`;
}

export async function getFilingHoldings(
  cik: string,
  accessionRaw: string
): Promise<FilingHoldings | null> {
  const profile = await getFilerProfile(cik);
  const filing = profile.filings.find((f) => f.accessionRaw === accessionRaw);
  if (!filing) return null;

  const infoTableUrl = await findInformationTableUrl(profile.cik, accessionRaw);
  if (!infoTableUrl) {
    return {
      cik: profile.cik,
      accession: accessionRaw,
      reportDate: filing.reportDate,
      filingDate: filing.filingDate,
      totalValueUsd: 0,
      totalPositions: 0,
      holdings: [],
    };
  }

  const res = await fetch(infoTableUrl, {
    headers: SEC_HEADERS,
    next: { revalidate: REVALIDATE },
  });
  if (!res.ok) {
    return null;
  }
  const xml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: true,
    removeNSPrefix: true,
    parseTagValue: true,
    parseAttributeValue: false,
    trimValues: true,
  });
  const parsed = parser.parse(xml);

  // Find informationTable.infoTable[] — handle namespace stripping
  const root: any =
    parsed?.informationTable ??
    parsed?.InformationTable ??
    parsed?.["informationtable"] ??
    {};
  let rows: any[] = [];
  if (Array.isArray(root?.infoTable)) rows = root.infoTable;
  else if (root?.infoTable) rows = [root.infoTable];

  // Some filings report value in thousands per the 13F instructions (post-2022 reports value in $).
  // Per SEC: starting 2023-01-03, value is reported to the nearest dollar (no scaling).
  // For filings before that, value was in thousands. Determine by reportDate.
  const reportYear = parseInt((filing.reportDate || "0").slice(0, 4), 10);
  const reportMonth = parseInt((filing.reportDate || "0").slice(5, 7), 10);
  // Reports filed for periods before 2022-Q4 used $1000 units.
  // To be safe: if reportDate < 2023-01-01 -> thousands.
  const valueIsThousands =
    !!filing.reportDate &&
    (reportYear < 2023 ||
      (reportYear === 2022 && reportMonth <= 12));
  const valueMultiplier = valueIsThousands ? 1000 : 1;

  const holdings: Holding[] = rows.map((r) => {
    const sharesNode = r?.shrsOrPrnAmt ?? {};
    const votingNode = r?.votingAuthority ?? {};
    const rawValue = Number(r?.value ?? 0);
    return {
      nameOfIssuer: String(r?.nameOfIssuer ?? "").trim(),
      titleOfClass: String(r?.titleOfClass ?? "").trim(),
      cusip: String(r?.cusip ?? "").trim(),
      value: rawValue * valueMultiplier,
      shares: Number(sharesNode?.sshPrnamt ?? 0),
      sharesType: sharesNode?.sshPrnamtType
        ? String(sharesNode.sshPrnamtType)
        : undefined,
      putCall: r?.putCall ? String(r.putCall) : undefined,
      investmentDiscretion: r?.investmentDiscretion
        ? String(r.investmentDiscretion)
        : undefined,
      votingSole: Number(votingNode?.Sole ?? 0),
      votingShared: Number(votingNode?.Shared ?? 0),
      votingNone: Number(votingNode?.None ?? 0),
    };
  });

  const totalValueUsd = holdings.reduce((s, h) => s + h.value, 0);

  return {
    cik: profile.cik,
    accession: accessionRaw,
    reportDate: filing.reportDate,
    filingDate: filing.filingDate,
    totalValueUsd,
    totalPositions: holdings.length,
    holdings,
  };
}

export type FilerSearchHit = {
  cik: string;
  name: string;
  ticker?: string;
};

export async function searchFilers(query: string): Promise<FilerSearchHit[]> {
  const q = query.trim();
  if (!q) return [];
  // EDGAR full-text-ish entity search.
  const url = `https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(
    q
  )}&forms=13F-HR&hits=20`;
  const res = await fetch(url, {
    headers: SEC_HEADERS,
    next: { revalidate: 60 * 60 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  const hits = data?.hits?.hits ?? [];
  const seen = new Set<string>();
  const out: FilerSearchHit[] = [];
  for (const h of hits) {
    const cik = String(h?._source?.ciks?.[0] ?? "").replace(/^0+/, "");
    const name = h?._source?.display_names?.[0] ?? "";
    if (!cik || !name || seen.has(cik)) continue;
    seen.add(cik);
    // display_names look like "Berkshire Hathaway Inc (BRK) (CIK 0001067983)"
    const cleanName = String(name).replace(/\s*\(CIK[^)]*\)\s*$/i, "").trim();
    out.push({ cik, name: cleanName });
    if (out.length >= 15) break;
  }
  return out;
}
