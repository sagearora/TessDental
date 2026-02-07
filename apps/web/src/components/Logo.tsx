export function Logo({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Blue square background with rounded corners */}
      <rect
        x="0"
        y="0"
        width="40"
        height="40"
        rx="8"
        ry="8"
        fill="#2563eb"
      />
      {/* White letter T - using path for better rendering */}
      <path
        d="M20 12 L20 28 M12 12 L28 12"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
