/**
 * algorithms/lru.js — LRU (Least Recently Used) Page Replacement Algorithm
 *
 * HOW IT WORKS:
 *   When a new page must be loaded and all frames are full, evict the page
 *   that has NOT been used for the LONGEST time.
 *   The idea: if you haven't needed a page recently, you probably won't
 *   need it soon either — so it's the best candidate to throw out.
 *
 * ANALOGY:
 *   Like clearing your desk — if you haven't touched a document in weeks,
 *   it gets filed away to free up desk space for the thing you just picked up.
 *
 * HOW WE TRACK "LEAST RECENTLY USED":
 *   We keep a Map called lastUsed:  page → last step index it was accessed.
 *   When we need to evict, we find the page in frames with the SMALLEST
 *   lastUsed value (oldest access = least recently used).
 *
 * PROS:  Generally better hit rate than FIFO; closer to Optimal.
 * CONS:  More expensive to implement in real hardware; needs tracking.
 *
 * @param {number[]} pages      - The sequence of page numbers the CPU requests
 * @param {number}   frameCount - How many memory frames are available
 * @returns {{ steps, faults, hits }} - Full step-by-step trace + summary
 */
function lru(pages, frameCount) {

  // frames[] — pages currently loaded in memory (null = empty slot).
  const frames = new Array(frameCount).fill(null);

  // lastUsed Map — records the most recent step index at which each page
  // was accessed. Example: lastUsed.get(3) = 5 means page 3 was last
  // used at step index 5.
  const lastUsed = new Map();

  const steps  = [];  // step-by-step snapshots for the frontend
  let faults   = 0;   // total page fault count

  for (let i = 0; i < pages.length; i++) {
    const page     = pages[i];
    const inMemory = frames.includes(page);

    if (!inMemory) {
      // ── PAGE FAULT ── Page not found in memory — must load it.
      faults++;
      let replaced   = null;
      let replaceIdx = -1;

      // Check if any frame is still empty (we can load without evicting).
      const emptyIdx = frames.indexOf(null);

      if (emptyIdx !== -1) {
        // There is a free slot — use it directly, no eviction needed.
        replaceIdx = emptyIdx;

      } else {
        // All frames full — find which page was LEAST RECENTLY USED.
        // We scan every frame and pick the one with the smallest lastUsed time.
        let lruTime = Infinity; // start with the largest possible value

        frames.forEach((framePage, frameIndex) => {
          // If the page has never been used, lastUsed returns undefined,
          // so we default to -1 (treated as used before step 0 — oldest possible).
          const lastAccessTime = lastUsed.get(framePage) ?? -1;

          if (lastAccessTime < lruTime) {
            // This page was used even longer ago — it's the new LRU candidate.
            lruTime    = lastAccessTime;
            replaceIdx = frameIndex;
          }
        });

        replaced = frames[replaceIdx]; // record which page we're evicting
      }

      // Load the requested page into the chosen frame slot.
      frames[replaceIdx] = page;

      // ── Build lruAges for the UI reasoning panel ──
      // lruAges tells the frontend how many steps ago each frame's page
      // was last accessed, so users can SEE why one was chosen over another.
      const lruAges = {};
      frames.forEach((f, fi) => {
        if (f !== null) {
          // If this is the page we JUST loaded, its age is 0.
          // Otherwise, age = current step − last access step.
          lruAges[fi] = (f === page) ? 0 : (i - (lastUsed.get(f) ?? 0));
        }
      });

      // Build a plain-English explanation of the eviction decision.
      const reason = replaced !== null
        ? `Page ${replaced} was least recently used (${i - (lastUsed.get(replaced) ?? 0)} steps ago)`
        : `Loaded into empty frame F${replaceIdx + 1}`;

      steps.push({
        step: i + 1, page,
        frames: [...frames],  // snapshot AFTER the change
        fault: true, replaced, replaceIdx,
        hitIdx: -1,
        lruAges,  // extra data shown in the reasoning panel
        reason,   // human-readable explanation
      });

    } else {
      // ── PAGE HIT ── Page is already in memory.
      // Even on a hit we still update lruAges so the UI shows current ages.
      const lruAges = {};
      frames.forEach((f, fi) => {
        if (f !== null) lruAges[fi] = i - (lastUsed.get(f) ?? 0);
      });

      const hitFrame = frames.indexOf(page);
      steps.push({
        step: i + 1, page,
        frames: [...frames],
        fault: false, replaced: null, replaceIdx: -1,
        hitIdx: hitFrame,
        lruAges,
        reason: `Page ${page} found in F${hitFrame + 1} (last used ${i - (lastUsed.get(page) ?? 0)} steps ago)`,
      });
    }

    // ── Update last-used time for the accessed page ──
    // This MUST happen after building lruAges above, so that
    // the "age" we display reflects state BEFORE this access.
    lastUsed.set(page, i);
  }

  return { steps, faults, hits: pages.length - faults };
}

module.exports = lru;
