interface CrosshairProps {
  className?: string;
}

// The page's signature mark: the same reticle the real tool draws under your
// cursor when you hover a PDF, reused here as the landing page's mascot.
export default function Crosshair({ className }: CrosshairProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="50"
        cy="50"
        r="36"
        stroke="currentColor"
        strokeWidth="6"
        strokeDasharray="6 10"
        opacity="0.5"
      />
      <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="6" />
      <line
        x1="50"
        y1="2"
        x2="50"
        y2="24"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="76"
        x2="50"
        y2="98"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1="2"
        y1="50"
        x2="24"
        y2="50"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1="76"
        y1="50"
        x2="98"
        y2="50"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="50" cy="50" r="7" fill="currentColor" />
    </svg>
  );
}
