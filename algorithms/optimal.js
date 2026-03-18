/**
 * algorithms/optimal.js — Optimal (Bélády's) Page Replacement Algorithm
 *
 * HOW IT WORKS:
 *   When eviction is needed, look AHEAD in the page-reference string and
 *   find which frame's page will NOT be needed again for the longest time.
 *   Evict that page — it's the one we'll miss least.
 *   If a page in memory will NEVER be used again, it is the perfect victim.
 *
 * ANALOGY:
 *   You're packing for a trip and can only carry 3 items.
 *   You have 4 items to choose from. You put back the one you won't
 *   need until the furthest point in the trip (or never at all).
 *
 * WHY IT'S THEORETICAL:
 *   A real operating system cannot know the future sequence of page requests.
 *   Optimal only works here because we have the complete page string upfront.
 *   It serves as a BENCHMARK — the best any algorithm can possibly do.
 *
 * PROS:  Fewest possible page faults for a given input.
 * CONS:  Cannot be implemented in a real OS (requires future knowledge).
 *
 * @param {number[]} pages      - The full page reference sequence
 * @param {number}   frameCount - Number of available memory frames
 * @returns {{ steps, faults, hits }}
 */
function optimal(pages, frameCount) {

  // frames[] — pages currently in memory (null = empty slot).
  const frames = new Array(frameCount).fill(null);

  const steps = [];
  let faults  = 0;

  for (let i = 0; i < pages.length; i++) {
    const page     = pages[i];
    const inMemory = frames.includes(page);

    if (!inMemory) {
      // ── PAGE FAULT ── Page not in memory — must load it.
      faults++;
      let replaced   = null;
      let replaceIdx = -1;

      // Is there a free slot? Use it first (no eviction needed).
      const emptyIdx = frames.indexOf(null);
      if (emptyIdx !== -1) {
        replaceIdx = emptyIdx;

      } else {
        // All frames full — find the OPTIMAL victim.
        // Strategy: for each page currently in a frame, find the NEXT time
        // it appears in the REMAINING pages (pages[i+1], pages[i+2], ...).
        // Evict the page whose next use is FARTHEST away (or never used again).

        let farthestUse = -1; // track the latest "next use" index seen so far

        for (let frameIdx = 0; frameIdx < frames.length; frameIdx++) {
          const framePage = frames[frameIdx];

          // pages.indexOf(framePage, i + 1) searches for framePage in the
          // pages array starting AFTER the current position i.
          // Returns -1 if the page never appears again.
          const nextUseIndex = pages.indexOf(framePage, i + 1);

          if (nextUseIndex === -1) {
            // This page is NEVER needed again — perfect victim, stop searching.
            replaceIdx = frameIdx;
            break; // no need to check other frames
          }

          if (nextUseIndex > farthestUse) {
            // This page's next use is further away than any seen so far.
            // It's our current best candidate for eviction.
            farthestUse = nextUseIndex;
            replaceIdx  = frameIdx;
          }
        }

        replaced = frames[replaceIdx]; // the page we decided to evict
      }

      // Load the requested page into the chosen slot.
      frames[replaceIdx] = page;

      // ── Build nextUseAt map for the UI reasoning panel ──
      // For each frame, record the NEXT step index at which that frame's
      // page will be needed. Infinity means it's never needed again.
      const nextUseAt = {};
      frames.forEach((f, fi) => {
        if (f !== null) {
          const nu       = pages.indexOf(f, i + 1);
          nextUseAt[fi]  = (nu === -1) ? Infinity : nu;
        }
      });

      // Build human-readable explanation of why we evicted this page.
      const nuOfEvicted = (replaced !== null) ? pages.indexOf(replaced, i + 1) : -1;
      const reason = replaced !== null
        ? (nuOfEvicted === -1
            ? `Page ${replaced} is never used again → perfect candidate to evict`
            : `Page ${replaced} is next needed at step ${nuOfEvicted + 1} (farthest of all frames)`)
        : `Loaded into empty frame F${replaceIdx + 1}`;

      steps.push({
        step: i + 1, page,
        frames: [...frames],
        fault: true, replaced, replaceIdx,
        hitIdx: -1,
        nextUseAt,  // shown in reasoning panel on the UI
        reason,
      });

    } else {
      // ── PAGE HIT ── Page already in memory.
      // Still build nextUseAt so the UI panel can show future-use info.
      const nextUseAt = {};
      frames.forEach((f, fi) => {
        if (f !== null) {
          const nu      = pages.indexOf(f, i + 1);
          nextUseAt[fi] = (nu === -1) ? Infinity : nu;
        }
      });

      const hitFrame = frames.indexOf(page);
      const nuOfHit  = pages.indexOf(page, i + 1);
      steps.push({
        step: i + 1, page,
        frames: [...frames],
        fault: false, replaced: null, replaceIdx: -1,
        hitIdx: hitFrame,
        nextUseAt,
        reason: `Page ${page} found in F${hitFrame + 1} — next needed at step ${nuOfHit === -1 ? '∞ (never again)' : nuOfHit + 1}`,
      });
    }
  }

  return { steps, faults, hits: pages.length - faults };
}

module.exports = optimal;
