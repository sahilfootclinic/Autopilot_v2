export type AvatarProps = {
  /** Stable seed for the gradient (a slug works well) */
  seed: string;
  /** Name used to derive initials */
  label: string;
  /** Optional image path under /public */
  image?: string;
  /** Optional tiny badge character, e.g. "AI", "★", "D", "R" */
  badge?: string;
  badgeColor?: string;
  size?: number;
  className?: string;
};

function initials(name: string): string {
  const parts = name
    .replace(/[()]/g, "")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const GRADIENTS: [string, string][] = [
  ["#0F9D58", "#0B7E45"],
  ["#1A73E8", "#0B57B0"],
  ["#9334E6", "#5E18A6"],
  ["#D93025", "#A01A12"],
  ["#F29900", "#B36B00"],
  ["#00897B", "#00574B"],
  ["#3F51B5", "#283593"],
  ["#E91E63", "#AD1457"],
  ["#5E35B1", "#311B92"],
  ["#455A64", "#263238"],
];

function gradientFor(seed: string): [string, string] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

export function Avatar({
  seed,
  label,
  image,
  badge,
  badgeColor = "#0A0A0A",
  size = 48,
  className = "",
}: AvatarProps) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={label}
        width={size}
        height={size}
        className={`rounded-full object-cover bg-ink-100 shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  const [from, to] = gradientFor(seed || label);
  const fontSize = Math.round(size * 0.38);
  return (
    <div
      className={`relative rounded-full flex items-center justify-center text-white font-semibold shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        fontSize,
        letterSpacing: "-0.02em",
      }}
    >
      <span>{initials(label)}</span>
      {badge && (
        <span
          className="absolute -bottom-0.5 -right-0.5 rounded-full bg-white flex items-center justify-center border border-ink-100 shadow-card font-bold"
          style={{
            width: Math.max(17, size * 0.36),
            height: Math.max(17, size * 0.36),
            fontSize: Math.max(9, size * 0.2),
            color: badgeColor,
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}
