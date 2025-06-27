/**
 * Converts markdown text to compact list format by removing unnecessary blank lines between list items
 * @param markdownText - The input markdown text
 * @returns The compacted markdown text with reduced spacing in lists
 */
export function convertToCompactList(markdownText: string): string {
  const lines = markdownText.split("\n");
  const output: string[] = [];
  const testListItem = (str: string) => /^\s*(?:[*-]|\d+\.)\s/.test(str);

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i].trimEnd(); // Preserve leading spaces, remove trailing spaces
    const isCurrentListItem = testListItem(currentLine); // Match list items
    const isCurrentBlank = /^\s*$/.test(currentLine); // Match blank lines

    if (isCurrentListItem) {
      output.push(currentLine); // Always add list items
    } else if (isCurrentBlank) {
      // Check if this blank line should be preserved
      let shouldPreserve = true;

      // Look for the previous non-blank line
      let prevNonBlankIndex = i - 1;
      while (prevNonBlankIndex >= 0 && /^\s*$/.test(lines[prevNonBlankIndex])) {
        prevNonBlankIndex--;
      }

      // Look for the next non-blank line
      let nextNonBlankIndex = i + 1;
      while (
        nextNonBlankIndex < lines.length &&
        /^\s*$/.test(lines[nextNonBlankIndex])
      ) {
        nextNonBlankIndex++;
      }

      if (prevNonBlankIndex >= 0 && nextNonBlankIndex < lines.length) {
        const prevLine = lines[prevNonBlankIndex].trimEnd();
        const nextLine = lines[nextNonBlankIndex].trimEnd();
        const isPrevListItem = testListItem(prevLine);
        const isNextListItem = testListItem(nextLine);

        // Only skip blank lines that are between two list items
        // This preserves blank lines before titles, after lists, or between different content blocks
        if (isPrevListItem && isNextListItem) {
          shouldPreserve = false;
        }
      }

      if (shouldPreserve) {
        output.push(currentLine);
      }
    } else {
      output.push(currentLine); // Add non-list, non-blank lines
    }
  }

  return output.join("\n");
}
