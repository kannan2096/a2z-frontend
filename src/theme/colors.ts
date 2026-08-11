// Same pastel family as the mobile app (see a2z-mobileapp/src/theme/colors.ts)
// but used sparingly here — the admin console is a data-dense internal tool,
// so pastels are accents (sidebar, active states, badges) on a neutral base
// rather than the whole-screen treatment used on the customer-facing app.
export const colors = {
  pastelBlue: "#E6F1FB",
  pastelBlueStrong: "#85B7EB",
  pastelPurple: "#EEEDFE",
  pastelPurpleStrong: "#CECBF6",
  pastelPink: "#FBEAF0",
  pastelPinkStrong: "#F4C0D1",

  textOnBlue: "#042C53",
  textOnPurple: "#3C3489",
  textOnPink: "#72243E",

  bg: "#F7F7F5",
  surface: "#FFFFFF",
  border: "#E7E5DE",
  textPrimary: "#2C2C2A",
  textSecondary: "#5F5E5A",
  textMuted: "#888780",
  danger: "#A32D2D",
  success: "#3B6D11",
} as const;
