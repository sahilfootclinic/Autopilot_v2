// A small gold-coin rendering of the Bitcoin symbol, used as the
// full stop after "Follow The Money".

export function BitcoinCoin({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Bitcoin"
    >
      <defs>
        <radialGradient id="bcFace" cx="36%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#fff7d0" />
          <stop offset="38%" stopColor="#f5d05c" />
          <stop offset="72%" stopColor="#d09a22" />
          <stop offset="100%" stopColor="#7d540a" />
        </radialGradient>
        <linearGradient id="bcRim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde79a" />
          <stop offset="48%" stopColor="#d8a832" />
          <stop offset="100%" stopColor="#79530b" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#bcRim)" />
      <circle cx="32" cy="32" r="25.5" fill="url(#bcFace)" />
      <circle
        cx="32"
        cy="32"
        r="25.5"
        fill="none"
        stroke="#5f410988"
        strokeWidth="1.3"
      />
      <ellipse cx="24" cy="19" rx="13" ry="6.5" fill="#ffffff" opacity="0.32" />
      {/* engraved Bitcoin symbol */}
      <text
        x="32"
        y="34"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="36"
        fontWeight={800}
        fill="#fff0bd"
        opacity="0.55"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        ₿
      </text>
      <text
        x="32"
        y="32.6"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="36"
        fontWeight={800}
        fill="#6f4b07"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        ₿
      </text>
    </svg>
  );
}
