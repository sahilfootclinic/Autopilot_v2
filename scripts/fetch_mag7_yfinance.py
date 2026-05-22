#!/usr/bin/env python3
"""Fetch comprehensive financial data for Mag 7 companies via yfinance.

Run from the project root:
    python3 scripts/fetch_mag7_yfinance.py

Outputs: data/mag7_yfinance_data.json
"""

import json
import sys
from datetime import datetime

try:
    import yfinance as yf
except ImportError:
    print("yfinance not found. Install it: pip3 install yfinance")
    sys.exit(1)

MAG7_TICKERS = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA"]


def safe_float(val):
    try:
        if val is None:
            return None
        f = float(val)
        return None if f != f else f  # NaN check
    except (TypeError, ValueError):
        return None


def safe_int(val):
    try:
        if val is None:
            return None
        return int(val)
    except (TypeError, ValueError):
        return None


def df_to_dict(df):
    """Convert a pandas DataFrame to {row_label: {date_str: value}} dict."""
    if df is None or df.empty:
        return {}
    out = {}
    for row_label in df.index:
        row_key = str(row_label)
        out[row_key] = {}
        for col in df.columns:
            date_str = col.strftime("%Y-%m-%d") if hasattr(col, "strftime") else str(col)
            out[row_key][date_str] = safe_float(df.loc[row_label, col])
    return out


def history_to_list(hist):
    """Convert price history DataFrame to a list of OHLCV dicts."""
    if hist is None or hist.empty:
        return []
    records = []
    for ts, row in hist.iterrows():
        records.append({
            "date": ts.strftime("%Y-%m-%d"),
            "open": safe_float(row.get("Open")),
            "high": safe_float(row.get("High")),
            "low": safe_float(row.get("Low")),
            "close": safe_float(row.get("Close")),
            "volume": safe_float(row.get("Volume")),
        })
    return records


def fetch_ticker(ticker: str) -> dict:
    print(f"  Fetching {ticker} …", flush=True)
    t = yf.Ticker(ticker)
    info = t.info or {}

    # --- key metrics from info dict ---
    summary = {
        "marketCap": safe_float(info.get("marketCap")),
        "trailingPE": safe_float(info.get("trailingPE")),
        "forwardPE": safe_float(info.get("forwardPE")),
        "trailingEps": safe_float(info.get("trailingEps")),
        "revenue": safe_float(info.get("totalRevenue")),
        "grossProfits": safe_float(info.get("grossProfits")),
        "ebitda": safe_float(info.get("ebitda")),
        "netIncomeToCommon": safe_float(info.get("netIncomeToCommon")),
        "freeCashflow": safe_float(info.get("freeCashflow")),
        "operatingCashflow": safe_float(info.get("operatingCashflow")),
        "totalCash": safe_float(info.get("totalCash")),
        "totalDebt": safe_float(info.get("totalDebt")),
        "currentRatio": safe_float(info.get("currentRatio")),
        "debtToEquity": safe_float(info.get("debtToEquity")),
        "returnOnEquity": safe_float(info.get("returnOnEquity")),
        "returnOnAssets": safe_float(info.get("returnOnAssets")),
        "grossMargins": safe_float(info.get("grossMargins")),
        "operatingMargins": safe_float(info.get("operatingMargins")),
        "profitMargins": safe_float(info.get("profitMargins")),
        "revenueGrowth": safe_float(info.get("revenueGrowth")),
        "earningsGrowth": safe_float(info.get("earningsGrowth")),
        "beta": safe_float(info.get("beta")),
        "dividendYield": safe_float(info.get("dividendYield")),
        "fiftyTwoWeekHigh": safe_float(info.get("fiftyTwoWeekHigh")),
        "fiftyTwoWeekLow": safe_float(info.get("fiftyTwoWeekLow")),
        "priceToBook": safe_float(info.get("priceToBook")),
        "enterpriseValue": safe_float(info.get("enterpriseValue")),
        "sharesOutstanding": safe_float(info.get("sharesOutstanding")),
        "averageVolume": safe_float(info.get("averageVolume")),
        "employeeCount": safe_int(info.get("fullTimeEmployees")),
        "industry": info.get("industry"),
        "sector": info.get("sector"),
        "currentPrice": safe_float(info.get("currentPrice") or info.get("regularMarketPrice")),
        "previousClose": safe_float(info.get("previousClose") or info.get("regularMarketPreviousClose")),
        "targetMeanPrice": safe_float(info.get("targetMeanPrice")),
        "recommendationKey": info.get("recommendationKey"),
        "numberOfAnalystOpinions": safe_int(info.get("numberOfAnalystOpinions")),
    }

    # --- price history (5 years, monthly) ---
    try:
        hist_5y = t.history(period="5y", interval="1mo")
        history_monthly = history_to_list(hist_5y)
    except Exception as e:
        print(f"    history error for {ticker}: {e}", flush=True)
        history_monthly = []

    # --- annual income statement ---
    try:
        income_annual = df_to_dict(t.financials)
    except Exception as e:
        print(f"    financials error for {ticker}: {e}", flush=True)
        income_annual = {}

    # --- quarterly income statement ---
    try:
        income_quarterly = df_to_dict(t.quarterly_financials)
    except Exception as e:
        print(f"    quarterly_financials error for {ticker}: {e}", flush=True)
        income_quarterly = {}

    # --- annual balance sheet ---
    try:
        balance_annual = df_to_dict(t.balance_sheet)
    except Exception as e:
        print(f"    balance_sheet error for {ticker}: {e}", flush=True)
        balance_annual = {}

    # --- quarterly balance sheet ---
    try:
        balance_quarterly = df_to_dict(t.quarterly_balance_sheet)
    except Exception as e:
        print(f"    quarterly_balance_sheet error for {ticker}: {e}", flush=True)
        balance_quarterly = {}

    # --- annual cash flow ---
    try:
        cashflow_annual = df_to_dict(t.cashflow)
    except Exception as e:
        print(f"    cashflow error for {ticker}: {e}", flush=True)
        cashflow_annual = {}

    # --- quarterly cash flow ---
    try:
        cashflow_quarterly = df_to_dict(t.quarterly_cashflow)
    except Exception as e:
        print(f"    quarterly_cashflow error for {ticker}: {e}", flush=True)
        cashflow_quarterly = {}

    return {
        "ticker": ticker,
        "fetchedAt": datetime.utcnow().isoformat() + "Z",
        "summary": summary,
        "historyMonthly": history_monthly,
        "incomeStatement": {
            "annual": income_annual,
            "quarterly": income_quarterly,
        },
        "balanceSheet": {
            "annual": balance_annual,
            "quarterly": balance_quarterly,
        },
        "cashFlow": {
            "annual": cashflow_annual,
            "quarterly": cashflow_quarterly,
        },
    }


def main():
    print("Fetching Mag 7 financials via yfinance …")
    all_data: dict = {}
    errors: list[str] = []

    for ticker in MAG7_TICKERS:
        try:
            all_data[ticker] = fetch_ticker(ticker)
        except Exception as exc:
            print(f"  ERROR {ticker}: {exc}", flush=True)
            errors.append(f"{ticker}: {exc}")
            all_data[ticker] = {"ticker": ticker, "error": str(exc)}

    output_path = "data/mag7_yfinance_data.json"
    with open(output_path, "w") as fh:
        json.dump(all_data, fh, indent=2, default=str)

    print(f"\nSaved → {output_path}")
    if errors:
        print("Errors encountered:")
        for e in errors:
            print(f"  {e}")
    else:
        print("All tickers fetched successfully.")


if __name__ == "__main__":
    main()
