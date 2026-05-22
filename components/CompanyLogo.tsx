"use client";

// Inline SVG brand logos for Mag 7 – no external URL dependencies.

function AppleLogo({ size, className }: { size: number; className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-label="Apple"
      className={"shrink-0 " + className}
      style={{ width: size, height: size }}
    >
      <rect width="24" height="24" rx="12" fill="#000" />
      <path
        fill="#fff"
        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91
           1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454
           2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0
           2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948
           1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221
           -3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09
           -3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53
           3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805
           -3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104
           2.715-.688 3.559-1.701"
      />
    </svg>
  );
}

function MicrosoftLogo({ size, className }: { size: number; className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 23 23"
      aria-label="Microsoft"
      className={"shrink-0 " + className}
      style={{ width: size, height: size }}
    >
      <rect width="23" height="23" rx="3" fill="#fff" />
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

function AlphabetLogo({ size, className }: { size: number; className: string }) {
  // Multicolour Google G
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-label="Alphabet"
      className={"shrink-0 " + className}
      style={{ width: size, height: size }}
    >
      <rect width="48" height="48" rx="24" fill="#fff" />
      {/* Blue arc – top-right portion */}
      <path
        fill="#4285F4"
        d="M44.5 20H24v8h11.8C34.7 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13
           13-13c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4
           3 24s9.4 21 21 21c10.5 0 20-7.7 20-21 0-1.4-.2-2.7-.5-4z"
      />
      {/* Red – small segment */}
      <path
        fill="#EA4335"
        d="M5.3 14.7l6.6 4.8C13.5 15.1 18.4 11 24 11c3.1 0 5.9 1.1 8.1
           2.9l5.7-5.7C34.6 5.1 29.6 3 24 3 15.7 3 8.6 7.8 5.3 14.7z"
      />
      {/* Yellow */}
      <path
        fill="#FBBC05"
        d="M24 45c5.5 0 10.5-1.9 14.3-5.1l-6.6-5.5C29.8 36 27 37 24 37c-5.7
           0-10.6-3.9-12.3-9.2l-6.7 5.2C8.5 40.1 15.7 45 24 45z"
      />
      {/* Green */}
      <path
        fill="#34A853"
        d="M44.5 20H24v8h11.8c-.9 2.5-2.6 4.7-4.7 6.2l.1.1 6.6 5.5C37.6
           39.2 45 34 45 24c0-1.4-.2-2.7-.5-4z"
      />
    </svg>
  );
}

function AmazonLogo({ size, className }: { size: number; className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-label="Amazon"
      className={"shrink-0 " + className}
      style={{ width: size, height: size }}
    >
      <rect width="48" height="48" rx="8" fill="#fff" />
      {/* Amazon wordmark "a" */}
      <path
        fill="#232F3E"
        d="M16.5 18.5c0-2.4.7-4.3 2-5.6 1.4-1.3 3.2-2 5.5-2 1.2 0 2.3.2
           3.2.6.9.4 1.6 1 2.1 1.8.5.8.8 1.7.8 2.8v10h-2.8v-1.7c-.4.6-1
           1.1-1.7 1.5-.7.4-1.5.5-2.4.5-1.4 0-2.5-.4-3.4-1.2-.9-.8-1.3-1.9
           -1.3-3.3 0-1.5.5-2.6 1.5-3.4 1-.8 2.4-1.2 4.2-1.2h3.1v-.7c0-1-.3
           -1.7-.8-2.2-.5-.5-1.2-.7-2.2-.7-.7 0-1.4.2-1.9.5-.5.3-1 .8-1.3
           1.4l-2.3-1.3zm9 3.8h-2.8c-.9 0-1.6.2-2 .6-.5.4-.7 1-.7 1.7 0
           .6.2 1.1.6 1.5.4.4 1 .5 1.7.5.9 0 1.6-.3 2.2-.8.5-.6.9-1.4.9
           -2.3v-1.2z"
      />
      {/* Amazon smile arrow */}
      <path
        fill="#FF9900"
        d="M10 32.5c6.5 3.7 13.8 5.6 21.3 5.1 5.3-.3 10.5-1.9 15-4.5.6-.3
           1.1.3.7.8-4.3 5.6-11 9.1-18.5 9.1-8.6 0-16.3-4-21.5-10.2-.4-.5.3
           -1.1.9-.7l2.1.4z"
      />
      <path
        fill="#FF9900"
        d="M34 31.5c.5-.6 3.2-.8 4.3-.4.4.1.5.5.1.8l-.8.5c-.1.1-.2 0-.3-.1
           -.4-.5-1.3-.6-2-.3-.2.1-.5-.3-.3-.5z"
      />
    </svg>
  );
}

function NvidiaLogo({ size, className }: { size: number; className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-label="NVIDIA"
      className={"shrink-0 " + className}
      style={{ width: size, height: size }}
    >
      <rect width="48" height="48" rx="8" fill="#000" />
      {/* NVIDIA eye – stylised green shape */}
      <path
        fill="#76B900"
        d="M10 18.5C13.5 13 19 10 24.5 10c4.5 0 8.6 1.8 11.7 4.8l-2.8 2.8
           C31.2 15.3 28 14 24.5 14 20 14 16 16.4 13.5 20L10 18.5z"
      />
      <path
        fill="#76B900"
        d="M24.5 14v4c2.7 0 5.1 1.2 6.8 3.1l2.9-2.9C32 16 28.5 14 24.5 14z"
      />
      <path
        fill="#76B900"
        d="M10 18.5v9.5c0 7.5 6.5 14 14.5 14s14.5-6.5 14.5-14c0-2.4-.6-4.6
           -1.7-6.5l-3.1 3.1c.5 1.1.8 2.2.8 3.4 0 5.5-4.5 10-10 10s-10-4.5-10
           -10V20L10 18.5z"
      />
      <circle cx="24.5" cy="24.5" r="4" fill="#76B900" />
    </svg>
  );
}

function MetaLogo({ size, className }: { size: number; className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-label="Meta"
      className={"shrink-0 " + className}
      style={{ width: size, height: size }}
    >
      <rect width="48" height="48" rx="24" fill="#0082fb" />
      {/* Meta infinity loop */}
      <path
        fill="#fff"
        d="M8 24c0-4.1 2.4-7 5.5-7 2.2 0 3.7 1.2 5.8 4.3.5.7 1 1.5 1.5
           2.3.5-.8 1-1.6 1.5-2.3C24.4 18.2 25.9 17 28 17c3.1 0 5.5 2.9 5.5
           7s-2.4 7-5.5 7c-2.2 0-3.7-1.2-5.8-4.3L21 25.3l-1.2 1.4C17.7 29.8
           16.2 31 14 31 10.9 31 8 28.1 8 24zm6 0c0 2.2 1.1 4.2 2.8 4.2 1.3
           0 2.3-.9 4-3.5l.5-.7-.5-.7c-1.7-2.6-2.7-3.5-4-3.5C15.1 19.8 14
           21.8 14 24zm14 4.2c1.7 0 2.8-2 2.8-4.2s-1.1-4.2-2.8-4.2c-1.3 0
           -2.3.9-4 3.5l-.5.7.5.7c1.7 2.6 2.7 3.5 4 3.5z"
      />
    </svg>
  );
}

function TeslaLogo({ size, className }: { size: number; className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-label="Tesla"
      className={"shrink-0 " + className}
      style={{ width: size, height: size }}
    >
      <rect width="24" height="24" rx="4" fill="#CC0000" />
      <path
        fill="#fff"
        d="M4.736 3.847L5.474 2h13.044l.738 1.847C16.953 3.952 14.542 4
           12 4c-2.544 0-4.953-.048-7.264-.153zM12 22L3 4.232C3.684 4.27
           5.55 4.5 12 4.5s8.316-.23 9-.268L12 22z"
      />
    </svg>
  );
}

const MAG7_LOGOS: Record<string, React.ComponentType<{ size: number; className: string }>> = {
  AAPL: AppleLogo,
  MSFT: MicrosoftLogo,
  GOOGL: AlphabetLogo,
  GOOG: AlphabetLogo,
  AMZN: AmazonLogo,
  NVDA: NvidiaLogo,
  META: MetaLogo,
  TSLA: TeslaLogo,
};

const BRAND_COLORS: Record<string, string> = {
  AAPL: "#000000",
  MSFT: "#00A4EF",
  GOOGL: "#4285F4",
  GOOG: "#4285F4",
  AMZN: "#FF9900",
  NVDA: "#76B900",
  META: "#0866FF",
  TSLA: "#CC0000",
};

export function CompanyLogo({
  ticker,
  name,
  size = 40,
  className = "",
}: {
  ticker: string;
  name: string;
  size?: number;
  className?: string;
}) {
  const key = ticker.toUpperCase();
  const Logo = MAG7_LOGOS[key];

  if (Logo) return <Logo size={size} className={className} />;

  // Fallback: brand-colour circle with initial letter
  const color = BRAND_COLORS[key] ?? "#52525B";
  const initial = (name || ticker).slice(0, 1).toUpperCase();
  return (
    <div
      className={"rounded-full flex items-center justify-center font-bold text-white shrink-0 " + className}
      style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}
