import type { Investor } from "@/lib/investors";

function initials(name: string): string {
  const parts = name
    .replace(/[()]/g, "")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const GRADIENTS = [
  ["#0F9D58", "#0B7E45"], // green
  ["#1A73E8", "#0B57B0"], // blue
  ["#9334E6", "#5E18A6"], // purple
  ["#D93025", "#A01A12"], // red
  ["#F29900", "#B36B00"], // orange
  ["#00897B", "#00574B"], // teal
  ["#3F51B5", "#283593"], // indigo
  ["#E91E63", "#AD1457"], // pink
  ["#5E35B1", "#311B92"], // deep purple
  ["#455A64", "#263238"], // slate
];

function gradientFor(seed: string): [string, string] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length] as [string, string];
}

const CATEGORY_BADGE: Partial<Record<Investor["category"], string>> = {
  ai: "AI",
  politician: "✦",
  themed: "★",
};

export function Avatar({
  investor,
  size = 48,
  className = "",
}: {
  investor: Investor;
  size?: number;
  className?: string;
}) {
  if (investor.image) {
    return (
      // Use a plain <img> so we don't need to pre-configure next/image domains.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={investor.image}
        alt={investor.manager}
        width={size}
        height={size}
        className={`rounded-full object-cover bg-ink-100 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  const [from, to] = gradientFor(investor.slug || investor.manager);
  const badge = CATEGORY_BADGE[investor.category];
  const fontSize = Math.round(size * 0.38);
  return (
    <div
      className={`relative rounded-full flex items-center justify-center text-white font-semibold shadow-inner ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        fontSize,
        letterSpacing: "-0.02em",
      }}
    >
      <span>{initials(investor.manager)}</span>
      {badge && (
        <span
          className="absolute -bottom-0.5 -right-0.5 rounded-full bg-white text-ink-900 text-[10px] font-bold flex items-center justify-center border border-ink-100 shadow-card"
          style={{
            width: Math.max(16, size * 0.34),
            height: Math.max(16, size * 0.34),
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}
