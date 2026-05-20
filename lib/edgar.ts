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

export type PositionChange = {
  cusip: string;
  nameOfIssuer: string;
  titleOfClass: string;
  prevShares: number;
  currShares: number;
  prevValue: number;
  currValue: number;
  sharesDelta: number;
  valueDelta: number;
  pctChange: number; // share-count change as a fraction (1.0 = +100%); Infinity for new
  kind: "new" | "increased" | "reduced" | "sold" | "unchanged";
};

export type QoQDiff = {
  prevReportDate: string;
  prevAccession: string;
  newPositions: PositionChange[];
  increased: PositionChange[];
  reduced: PositionChange[];
  soldOut: PositionChange[];
};

function aggregateByCusip(holdings: Holding[]): Map<
  string,
  { shares: number; value: number; sample: Holding }
> {
  const m = new Map<string, { shares: number; value: number; sample: Holding }>();
  for (const h of holdings) {
    if (!h.cusip) continue;
    // Skip option/derivative rows for cleaner diffing.
    if (h.putCall) continue;
    const cur = m.get(h.cusip);
    if (cur) {
      cur.shares += h.shares;
      cur.value += h.value;
    } else {
      m.set(h.cusip, { shares: h.shares, value: h.value, sample: h });
    }
  }
  return m;
}

export async function getQoQDiff(
  cik: string,
  accessionRaw: string
): Promise<QoQDiff | null> {
  const filings = await get13FFilings(cik);
  const idx = filings.findIndex((f) => f.accessionRaw === accessionRaw);
  if (idx < 0) return null;
  const prev = filings.slice(idx + 1).find((f) => f.form === "13F-HR");
  if (!prev) return null;

  const [curr, prior] = await Promise.all([
    getFilingHoldings(cik, accessionRaw),
    getFilingHoldings(cik, prev.accessionRaw),
  ]);
  if (!curr || !prior) return null;

  const currMap = aggregateByCusip(curr.holdings);
  const prevMap = aggregateByCusip(prior.holdings);

  const allCusips = new Set<string>([...currMap.keys(), ...prevMap.keys()]);
  const newPositions: PositionChange[] = [];
  const increased: PositionChange[] = [];
  const reduced: PositionChange[] = [];
  const soldOut: PositionChange[] = [];

  for (const cusip of allCusips) {
    const c = currMap.get(cusip);
    const p = prevMap.get(cusip);
    const sample = c?.sample ?? p?.sample;
    if (!sample) continue;
    const currShares = c?.shares ?? 0;
    const prevShares = p?.shares ?? 0;
    const currValue = c?.value ?? 0;
    const prevValue = p?.value ?? 0;
    const sharesDelta = currShares - prevShares;
    const valueDelta = currValue - prevValue;
    const pctChange =
      prevShares > 0
        ? sharesDelta / prevShares
        : currShares > 0
        ? Infinity
        : 0;

    let kind: PositionChange["kind"] = "unchanged";
    if (prevShares === 0 && currShares > 0) kind = "new";
    else if (prevShares > 0 && currShares === 0) kind = "sold";
    else if (sharesDelta > 0) kind = "increased";
    else if (sharesDelta < 0) kind = "reduced";

    const change: PositionChange = {
      cusip,
      nameOfIssuer: sample.nameOfIssuer,
      titleOfClass: sample.titleOfClass,
      prevShares,
      currShares,
      prevValue,
      currValue,
      sharesDelta,
      valueDelta,
      pctChange,
      kind,
    };

    if (kind === "new") newPositions.push(change);
    else if (kind === "sold") soldOut.push(change);
    else if (kind === "increased") increased.push(change);
    else if (kind === "reduced") reduced.push(change);
  }

  newPositions.sort((a, b) => b.currValue - a.currValue);
  soldOut.sort((a, b) => b.prevValue - a.prevValue);
  increased.sort((a, b) => b.valueDelta - a.valueDelta);
  reduced.sort((a, b) => a.valueDelta - b.valueDelta); // most negative first

  return {
    prevReportDate: prev.reportDate,
    prevAccession: prev.accessionRaw,
    newPositions,
    increased,
    reduced,
    soldOut,
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
