#!/usr/bin/env node
/**
 * WCAG 2.1 contrast check for the dark theme: reads unimicro-dark.css, resolves the token pairs that
 * matter for reading text, and fails if any pair is below AA (4.5:1 for text, 3:1 for icons/borders).
 * Usage: node theme/check-contrast.mjs [path-to-css]
 */
import { readFileSync } from "node:fs";

const file = process.argv[2] ?? new URL("./unimicro-dark.css", import.meta.url);
const css = readFileSync(file, "utf8");
const tokens = Object.fromEntries([...css.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
}
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

// [foreground, background, minimum]
const pairs = [
  ["--text-default", "--surface-default", 4.5],
  ["--text-default", "--surface-subdued", 4.5],
  ["--text-subdued", "--surface-default", 4.5],
  ["--text-subdued", "--surface-subdued", 4.5],
  ["--text-interactive", "--surface-default", 4.5],
  ["--text-link", "--surface-default", 4.5],
  ["--text-critical", "--surface-default", 4.5],
  ["--text-default", "--surface-info", 4.5],
  ["--text-default", "--surface-success", 4.5],
  ["--text-default", "--surface-warning", 4.5],
  ["--text-default", "--surface-critical", 4.5],
  ["--text-default", "--surface-selected", 4.5],
  ["--text-default", "--surface-hover", 4.5],
  ["--text-default", "--surface-readonly", 4.5],
  ["--table-header-text", "--table-header", 4.5],
  ["--btn-primary-text", "--btn-primary", 4.5],
  ["--btn-secondary-text", "--btn-secondary", 4.5],
  ["--btn-destructive-text", "--btn-destructive", 4.5],
  ["--tooltip-text", "--tooltip-bg", 4.5],
  ["--text-invert", "--icon-interactive", 4.5],
  ["--icon-default", "--surface-default", 3],
  ["--icon-info", "--surface-info", 3],
  ["--icon-success", "--surface-success", 3],
  ["--icon-warning", "--surface-warning", 3],
  ["--icon-critical", "--surface-critical", 3],
  ["--border-default", "--surface-default", 1.5],
  ["--border-focus", "--surface-default", 3],
  ["--avatar-dark-ash", "--avatar-light-ash", 4.5],
  ["--avatar-dark-blue", "--avatar-light-blue", 4.5],
  ["--avatar-dark-orange", "--avatar-light-orange", 4.5],
  ["--avatar-dark-purple", "--avatar-light-purple", 4.5],
  ["--avatar-dark-red", "--avatar-light-red", 4.5],
  ["--avatar-dark-yellow", "--avatar-light-yellow", 4.5],
  ["--avatar-dark-green", "--avatar-light-green", 4.5],
  ["--avatar-dark-emerald", "--avatar-light-emerald", 4.5],
];

let failures = 0;
for (const [fg, bg, min] of pairs) {
  const f = tokens[fg], b = tokens[bg];
  if (!f || !b || !f.startsWith("#") || !b.startsWith("#")) { console.log(`skip ${fg} on ${bg}`); continue; }
  const r = ratio(f, b);
  const ok = r >= min;
  if (!ok) failures++;
  console.log(`${ok ? "ok  " : "FAIL"} ${r.toFixed(2).padStart(6)} (min ${min}) ${fg} ${f} on ${bg} ${b}`);
}
console.log(failures ? `\n${failures} pair(s) below target` : "\nAll pairs meet their targets");
process.exit(failures ? 1 : 0);
