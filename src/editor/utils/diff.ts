export function diffChanges(
  oldText: string,
  newText: string,
): { from: number; to: number; insert: string } | null {
  if (oldText === newText) return null;

  let prefixLen = 0;
  const minLen = Math.min(oldText.length, newText.length);
  while (prefixLen < minLen && oldText[prefixLen] === newText[prefixLen]) {
    prefixLen++;
  }

  let suffixLen = 0;
  while (
    suffixLen < minLen - prefixLen &&
    oldText[oldText.length - 1 - suffixLen] ===
      newText[newText.length - 1 - suffixLen]
  ) {
    suffixLen++;
  }

  return {
    from: prefixLen,
    to: oldText.length - suffixLen,
    insert: newText.slice(prefixLen, newText.length - suffixLen),
  };
}
