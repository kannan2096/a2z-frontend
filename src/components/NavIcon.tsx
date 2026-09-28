import React from "react";

// Small hand-drawn stroke icons (Feather-style) so the sidebar doesn't need
// an icon library dependency for four glyphs.
const common = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function NavIcon({ name }: { name: "dashboard" | "catalogue" | "orders" | "staff" }) {
  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      );
    case "catalogue":
      return (
        <svg {...common}>
          <path d="M21 8 12 3 3 8l9 5 9-5Z" />
          <path d="M3 8v8l9 5 9-5V8" />
          <path d="M12 13v8" />
        </svg>
      );
    case "orders":
      return (
        <svg {...common}>
          <path d="M6 2h9l3 3v17H6z" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </svg>
      );
    case "staff":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3.5 20c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6" />
          <circle cx="18" cy="8.5" r="2.4" />
          <path d="M15.5 20c.2-2.5 1.8-4.5 3.9-4.9" />
        </svg>
      );
  }
}
