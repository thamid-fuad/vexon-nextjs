/**
 * FINAL Vexon logo — Bot Head (Round 2 design 01, approved 2026-11-08).
 * SVG geometry copied verbatim from the approved static build's
 * botHeadIcon() generator: antenna, ear pods, glowing visor eyes.
 */
export default function BotHeadLogo({
  size = 34,
  uid,
}: {
  size?: number;
  uid: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Vexon Bot Head logo"
    >
      <defs>
        <linearGradient id={`gs${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#14E0C8" />
          <stop offset="1" stopColor="#22B8F0" />
        </linearGradient>
        <filter id={`gl${uid}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <line
        x1="32"
        y1="15"
        x2="32"
        y2="8.5"
        stroke={`url(#gs${uid})`}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="32" cy="6" r="3.1" fill="#14E0C8" filter={`url(#gl${uid})`} />
      <rect x="3.4" y="26" width="6.6" height="13" rx="3.3" fill={`url(#gs${uid})`} />
      <rect x="54" y="26" width="6.6" height="13" rx="3.3" fill={`url(#gs${uid})`} />
      <rect x="9" y="13" width="46" height="39" rx="13" fill={`url(#gs${uid})`} />
      <path
        d="M31 18.5 h2"
        stroke="#062A33"
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M14.5 26.5 a17.5 13.5 0 0 1 35 0 l0 6.5 a17.5 13.5 0 0 1 -35 0 Z"
        fill="#081426"
      />
      <circle cx="24.8" cy="32.8" r="3.1" fill="#14E0C8" filter={`url(#gl${uid})`} />
      <circle cx="39.2" cy="32.8" r="3.1" fill="#14E0C8" filter={`url(#gl${uid})`} />
      <path
        d="M26.5 44.6 h11"
        stroke="#062A33"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
