import React from "react";

// Small brand mark for the sidebar header — same character as the mobile
// app's CapybaraMascot, simplified for a 28px UI chrome context.
export function CapybaraMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <ellipse cx="60" cy="88" rx="40" ry="28" fill="#CBA47C" />
      <circle cx="60" cy="46" r="33" fill="#D9B896" />
      <ellipse cx="33" cy="22" rx="10" ry="13" fill="#C29868" />
      <ellipse cx="87" cy="22" rx="10" ry="13" fill="#C29868" />
      <circle cx="38" cy="56" r="7" fill="#F4C0D1" opacity="0.7" />
      <circle cx="82" cy="56" r="7" fill="#F4C0D1" opacity="0.7" />
      <ellipse cx="48" cy="42" rx="4.5" ry="5.5" fill="#4A3626" />
      <ellipse cx="72" cy="42" rx="4.5" ry="5.5" fill="#4A3626" />
    </svg>
  );
}
