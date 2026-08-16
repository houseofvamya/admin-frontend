/**
 * Recharts requires concrete color values (hex/hsl strings) — it cannot consume
 * Tailwind utility classes. These constants mirror the CSS custom properties
 * defined in app/globals.css so charts stay visually consistent with the rest
 * of the design system.
 *
 * Source tokens (app/globals.css):
 *   --color-ivory:        hsl(40 33% 97%)
 *   --color-cream:        hsl(38 30% 94%)
 *   --color-charcoal:     hsl(220 10% 12%)
 *   --color-charcoal-soft hsl(220 8% 30%)
 *   --color-gold:         hsl(38 55% 55%)
 *   --color-gold-soft:    hsl(40 45% 72%)
 *   --color-gold-deep:    hsl(35 60% 40%)
 *   --color-line:         hsl(30 15% 87%)
 */

export const CHART_COLORS = {
  ivory: "hsl(40, 33%, 97%)",
  cream: "hsl(38, 30%, 94%)",
  charcoal: "hsl(220, 10%, 12%)",
  charcoalSoft: "hsl(220, 8%, 30%)",
  gold: "hsl(38, 55%, 55%)",
  goldSoft: "hsl(40, 45%, 72%)",
  goldDeep: "hsl(35, 60%, 40%)",
  line: "hsl(30, 15%, 87%)",
  success: "hsl(152, 60%, 40%)",
  danger: "hsl(0, 70%, 55%)",
} as const;

/** Approximate hex equivalents, provided for consumers that require hex strings. */
export const CHART_COLORS_HEX = {
  ivory: "#FAF7F1",
  cream: "#F2ECE0",
  charcoal: "#1F2023",
  charcoalSoft: "#494B52",
  gold: "#C29A5C",
  goldSoft: "#D9BD94",
  goldDeep: "#A66E29",
  line: "#E6DFD3",
  success: "#20A876",
  danger: "#E33E3E",
} as const;

/** Ordered palette for multi-series charts (bars, pies, stacked areas, etc.). */
export const CHART_SERIES_PALETTE = [
  CHART_COLORS.gold,
  CHART_COLORS.charcoal,
  CHART_COLORS.goldSoft,
  CHART_COLORS.charcoalSoft,
  CHART_COLORS.goldDeep,
] as const;

export const CHART_GRID_PROPS = {
  stroke: CHART_COLORS.line,
  strokeDasharray: "4 8",
  vertical: false,
} as const;

export const CHART_AXIS_PROPS = {
  stroke: CHART_COLORS.charcoalSoft,
  tick: { fill: CHART_COLORS.charcoalSoft, fontSize: 12 },
  tickLine: false,
  axisLine: false,
} as const;

export const CHART_TOOLTIP_CONTENT_STYLE = {
  borderRadius: 12,
  border: `1px solid ${CHART_COLORS.line}`,
  backgroundColor: CHART_COLORS.ivory,
  boxShadow: "0 12px 32px -8px rgb(0 0 0 / 0.12)",
  fontSize: 13,
  color: CHART_COLORS.charcoal,
} as const;
