export function LogoIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tc-grad" x1="2" y1="4" x2="30" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f0a875" />
          <stop offset="0.5" stopColor="#b18ad6" />
          <stop offset="1" stopColor="#7fabd9" />
        </linearGradient>
      </defs>
      <rect x="2" y="5" width="28" height="24" rx="6" stroke="url(#tc-grad)" strokeWidth="2" fill="none" />
      <path d="M2 12H30" stroke="url(#tc-grad)" strokeWidth="2" />
      <path d="M9 2V8" stroke="url(#tc-grad)" strokeWidth="2" strokeLinecap="round" />
      <path d="M23 2V8" stroke="url(#tc-grad)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="11" cy="19" r="2.4" fill="#f0a875" />
      <circle cx="16" cy="19" r="2.4" fill="#b18ad6" />
      <circle cx="21" cy="19" r="2.4" fill="#7fabd9" />
    </svg>
  );
}

export default function Logo({ size = 28, withWordmark = true }: { size?: number; withWordmark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <LogoIcon size={size} />
      {withWordmark && <span className="font-semibold tracking-tight text-lg">Team Calendar</span>}
    </div>
  );
}
