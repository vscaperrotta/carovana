// Small curated hue set (not a full rainbow) so per-person color-coding
// stays inside the brand's chroma/lightness range across map pins, lists,
// and vote avatars.
const PERSON_HUES = [118, 35, 200, 85, 330, 250];

function hashToIndex(str, mod) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash % mod;
}

export function personColor(id) {
  const hue = PERSON_HUES[hashToIndex(id || "", PERSON_HUES.length)];
  return `oklch(0.56 0.13 ${hue})`;
}

export function initials(name) {
  return (name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
