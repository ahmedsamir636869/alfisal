import type { CSSProperties } from "react";

/**
 * Builds a responsive `fontSize` CSS property from CMS content values.
 *
 * Looks for `{key}_fontsize_mobile` and `{key}_fontsize_desktop` in the
 * content record. If both are present, produces a CSS `clamp()` that
 * fluidly scales between 375px (mobile) and 1440px (desktop) viewports.
 * If only one is present, returns a static rem value.
 * Returns `undefined` when no font size override exists.
 *
 * @example
 * ```tsx
 * <h2 style={responsiveFs(content, "section_title")}>…</h2>
 * ```
 */
export function responsiveFs(
  content: Record<string, string>,
  key: string
): CSSProperties | undefined {
  const mob = content[`${key}_fontsize_mobile`];
  const dsk = content[`${key}_fontsize_desktop`];
  if (!mob && !dsk) return undefined;

  const mRem = parseFloat(mob || dsk || "1");
  const dRem = parseFloat(dsk || mob || "1");

  // Single value — no fluid scaling needed
  if (mRem === dRem || !mob || !dsk) {
    return { fontSize: `${mob ? mRem : dRem}rem` };
  }

  // Fluid clamp(): linear interpolation between 375px and 1440px
  const mPx = mRem * 16;
  const dPx = dRem * 16;
  const slope = (dPx - mPx) / (1440 - 375);
  const intercept = mPx - slope * 375;
  const slopeVw = +(slope * 100).toFixed(4);
  const interceptRem = +(intercept / 16).toFixed(4);

  return {
    fontSize: `clamp(${mRem}rem, ${interceptRem}rem + ${slopeVw}vw, ${dRem}rem)`,
  };
}
