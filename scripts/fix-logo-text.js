#!/usr/bin/env node
/**
 * Improves logo text legibility: system fonts, higher contrast, tighter viewBox.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const TARGETS = [
  "public/logo-dark.svg",
  "public/logo.svg",
  "public/brand/logo-dark.svg",
  "public/brand/logo.svg",
];

const TIGHT_VIEWBOX = 'viewBox="0 55 520 200"';

function patchDark(svg) {
  let out = svg.replace(
    /viewBox="0 0 520\.71 304\.2"/,
    `${TIGHT_VIEWBOX} text-rendering="geometricPrecision"`
  );

  out = out.replace(
    /\.st0 \{\s*font-family: Georgia, Georgia;\s*font-size: 41\.01px;\s*\}\s*\.st0, \.st1 \{\s*fill: #fbe8ae;\s*\}/,
    `.st0 {
        font-family: Georgia, 'Times New Roman', Times, serif;
        font-size: 44px;
        font-weight: 700;
        letter-spacing: 0.05em;
        fill: #FFF5D4;
      }

      .st0, .st1 {
        fill: #FFF5D4;
      }`
  );

  out = out.replace(
    /\.st6 \{\s*font-family: Montserrat-Regular, Montserrat;\s*font-size: 23\.04px;\s*\}\s*\.st6, \.st7 \{\s*fill: #e0b457;\s*\}/,
    `.st6 {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        font-size: 26px;
        font-weight: 600;
        letter-spacing: 0.14em;
        fill: #F5DC8A;
      }

      .st6, .st7 {
        fill: #F5DC8A;
      }`
  );

  return out;
}

function patchLight(svg) {
  let out = svg.replace(
    /viewBox="0 0 520\.71 304\.2"/,
    `${TIGHT_VIEWBOX} text-rendering="geometricPrecision"`
  );

  out = out.replace(
    /\.st1, \.st3 \{\s*font-family: Georgia, Georgia;\s*font-size: 41\.01px;\s*\}/,
    `.st1, .st3 {
        font-family: Georgia, 'Times New Roman', Times, serif;
        font-size: 44px;
        font-weight: 700;
        letter-spacing: 0.05em;
      }`
  );

  out = out.replace(
    /\.st4, \.st5 \{\s*font-family: Montserrat-Regular, Montserrat;\s*font-size: 23\.04px;\s*\}/,
    `.st4, .st5 {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        font-size: 26px;
        font-weight: 600;
        letter-spacing: 0.14em;
      }`
  );

  out = out.replace(
    /\.st4, \.st3 \{\s*fill: #231f20;\s*\}/,
    `.st4, .st3 {
        fill: #0a192f;
      }`
  );

  // Remove duplicate off-canvas logo artboard
  out = out.replace(/\s*<g>\s*<rect class="st7" x="669\.15[\s\S]*?<\/g>\s*<\/g>\s*<\/g>\s*<\/svg>/, "\n</g>\n</svg>");

  return out;
}

for (const rel of TARGETS) {
  const filePath = path.join(ROOT, rel);
  const original = fs.readFileSync(filePath, "utf8");
  const isDark = rel.includes("logo-dark");
  const patched = isDark ? patchDark(original) : patchLight(original);

  if (patched === original) {
    console.warn(`No changes applied to ${rel}`);
  } else {
    fs.writeFileSync(filePath, patched);
    console.log(`Updated ${rel}`);
  }
}
