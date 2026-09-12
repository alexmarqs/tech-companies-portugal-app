import { useEffect, useRef } from "react";

/**
 * Keeps the start of a result list reachable when the list shrinks.
 *
 * Filtering can drop hundreds of results to none, which makes the document far
 * shorter. The browser keeps the scroll offset, so the reader is left below the
 * end of the results — in the footer, with the sticky filter bar dragged out of
 * view along with its containing block.
 *
 * Attach the returned ref to the element wrapping the results.
 */
export const useKeepResultsInView = (resultCount: number) => {
  const listRef = useRef<HTMLDivElement>(null);
  const previousCount = useRef(resultCount);

  useEffect(() => {
    const previous = previousCount.current;
    previousCount.current = resultCount;

    // Only a shrinking list collapses the page; growing one keeps every
    // existing scroll offset valid.
    if (resultCount >= previous) {
      return;
    }

    // Measured on the next frame: the facet selects and pagination ask nuqs to
    // scroll the window itself, and this must not fight that — by then the list
    // is already in view and there is nothing left to do.
    const frame = requestAnimationFrame(() => {
      const list = listRef.current;

      // Only act once the start of the results has scrolled above the viewport.
      // While it is still on screen the collapse has not stranded anyone, and
      // moving the page would just be jarring.
      if (list && list.getBoundingClientRect().top < 0) {
        list.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [resultCount]);

  return { listRef };
};
