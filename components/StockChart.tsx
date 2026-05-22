"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type Point = { t: number; v: number };
type Period = "1D" | "5D" | "1M" | "6M" | "1Y" | "5Y";

const PERIODS: Period[] = ["1D", "5D", "1M", "6M", "1Y", "5Y"];
const W = 800;
const H = 200;
const PAD_Y = 16;

function buildPath(points: Point[]): { line: string; area: string } {
  if (points.length === 0) return { line: "", area: "" };
  const ts = points.map((p) => p.t);
  const vs = points.map((p) => p.v);
  const tMin = Math.min(...ts);
  const tMax = Math.max(...ts);
  const vMin = Math.min(...vs);
  const vMax = Math.max(...vs);
  const tRange = tMax - tMin || 1;
  const vRange = vMax - vMin || 1;

  const x = (t: number) => ((t - tMin) / tRange) * W;
  const y = (v: number) =>
    H - PAD_Y - ((v - vMin) / vRange) * (H - PAD_Y * 2);

  const coords = points.map((p) => `${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`);
  const line = "M " + coords.join(" L ");
  const area =
    line +
    ` L ${x(ts[ts.length - 1]).toFixed(1)},${H} L ${x(ts[0]).toFixed(1)},${H} Z`;

  return { line, area };
}

function formatDate(t: number, period: Period): string {
  const d = new Date(t * 1000);
  if (period === "1D" || period === "5D") {
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: period === "5Y" ? "numeric" : undefined,
  });
}

export function StockChart({
  ticker,
  currentPrice,
}: {
  ticker: string;
  currentPrice?: number | null;
}) {
  const [period, setPeriod] = useState<Period>("1M");
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<Point | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const fetchChart = useCallback(
    async (p: Period) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/chart/${ticker}?period=${p}`);
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        setPoints(data.points ?? []);
      } catch {
        setPoints([]);
      } finally {
        setLoading(false);
      }
    },
    [ticker]
  );

  useEffect(() => {
    fetchChart(period);
  }, [fetchChart, period]);

  const firstPrice = points[0]?.v ?? currentPrice ?? 0;
  const lastPrice =
    hovered?.v ?? (points.length > 0 ? points[points.length - 1].v : currentPrice ?? 0);
  const isUp = lastPrice >= firstPrice;
  const change = firstPrice ? lastPrice - firstPrice : 0;
  const changePct = firstPrice ? (change / firstPrice) * 100 : 0;
  const color = isUp ? "#228B22" : "#D93025";
  const fillId = `fill-${ticker}`;

  const { line, area } = buildPath(points);

  function handleMouseMove(e: React.MouseEvent<SVGElement>) {
    if (points.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * W;
    const ts = points.map((p) => p.t);
    const tMin = Math.min(...ts);
    const tMax = Math.max(...ts);
    const tRange = tMax - tMin || 1;
    const fraction = relX / W;
    const targetT = tMin + fraction * tRange;
    const closest = points.reduce((a, b) =>
      Math.abs(b.t - targetT) < Math.abs(a.t - targetT) ? b : a
    );
    setHovered(closest);
    const cx = ((closest.t - tMin) / tRange) * W;
    setHoverX(cx);
  }

  function handleMouseLeave() {
    setHovered(null);
    setHoverX(null);
  }

  const displayPrice = hovered?.v ?? lastPrice;
  const displayDate = hovered ? formatDate(hovered.t, period) : null;

  return (
    <div className="rounded-2xl border border-ink-100 bg-white shadow-card p-4 sm:p-6">
      {/* Price header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="text-2xl sm:text-3xl font-semibold tabular-nums">
            ${displayPrice.toFixed(2)}
          </div>
          {displayDate ? (
            <div className="text-sm text-ink-400 mt-0.5">{displayDate}</div>
          ) : (
            <div
              className="text-sm font-medium mt-0.5 tabular-nums"
              style={{ color }}
            >
              {isUp ? "+" : ""}
              {change.toFixed(2)} ({isUp ? "+" : ""}
              {changePct.toFixed(2)}%) {period}
            </div>
          )}
        </div>
        {/* Period selector */}
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={
                "px-2.5 py-1 rounded-lg text-xs font-semibold transition min-w-[36px] " +
                (period === p
                  ? "bg-ink-900 text-white"
                  : "text-ink-500 hover:text-ink-900 hover:bg-ink-100")
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div ref={svgContainerRef} className="w-full relative select-none touch-none">
        {loading ? (
          <div
            className="w-full bg-ink-50 rounded-xl animate-pulse"
            style={{ height: "160px" }}
          />
        ) : points.length === 0 ? (
          <div
            className="w-full bg-ink-50 rounded-xl flex items-center justify-center text-ink-400 text-sm"
            style={{ height: "160px" }}
          >
            Chart data unavailable
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: "160px", display: "block" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              if (!touch) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const relX = ((touch.clientX - rect.left) / rect.width) * W;
              const ts = points.map((p) => p.t);
              const tMin = Math.min(...ts);
              const tMax = Math.max(...ts);
              const tRange = tMax - tMin || 1;
              const fraction = relX / W;
              const targetT = tMin + fraction * tRange;
              const closest = points.reduce((a, b) =>
                Math.abs(b.t - targetT) < Math.abs(a.t - targetT) ? b : a
              );
              setHovered(closest);
              const cx = ((closest.t - tMin) / tRange) * W;
              setHoverX(cx);
            }}
            onTouchEnd={handleMouseLeave}
          >
            <defs>
              <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.18" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path d={area} fill={`url(#${fillId})`} />
            {/* Line */}
            <path
              d={line}
              fill="none"
              stroke={color}
              strokeWidth="1.8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Hover indicator */}
            {hoverX != null && hovered != null && (() => {
              const ts = points.map((p) => p.t);
              const vs = points.map((p) => p.v);
              const tMin = Math.min(...ts);
              const tMax = Math.max(...ts);
              const vMin = Math.min(...vs);
              const vMax = Math.max(...vs);
              const tRange = tMax - tMin || 1;
              const vRange = vMax - vMin || 1;
              const cx = hoverX;
              const cy =
                H - PAD_Y - ((hovered.v - vMin) / vRange) * (H - PAD_Y * 2);
              return (
                <>
                  <line
                    x1={cx}
                    y1={PAD_Y}
                    x2={cx}
                    y2={H - PAD_Y}
                    stroke={color}
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    opacity="0.5"
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill={color}
                    stroke="white"
                    strokeWidth="2"
                  />
                </>
              );
            })()}
          </svg>
        )}
      </div>
    </div>
  );
}
