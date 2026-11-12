import { useLayoutEffect, useRef, useState } from 'react';

// Width of an element in pixels: measured before the first paint, then kept up to date
export function useElementWidth<T extends HTMLElement>(fallback = 300) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // First measurement on the next frame, then whenever the element resizes
    const frame = requestAnimationFrame(() => setWidth(el.getBoundingClientRect().width || fallback));
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [fallback]);

  return [ref, width] as const;
}
