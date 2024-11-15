import { useCallback, useEffect, useState } from "react";

export function useAutoScroll(
  ref: React.RefObject<HTMLElement>,
  threshold: number = 100,
) {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const isNearBottom = useCallback(() => {
    if (!ref.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = ref.current;
    return scrollHeight - (scrollTop + clientHeight) < threshold;
  }, [ref, threshold]);

  const scrollToBottom = useCallback(() => {
    if (!ref.current) return;

    const container = ref.current;
    const scrollTarget = container.scrollHeight;
    const startPosition = container.scrollTop;
    const distance = scrollTarget - startPosition;
    const duration = 300; // ms
    let startTime: number | null = null;

    const easeOutCubic = (x: number): number => {
      return 1 - Math.pow(1 - x, 3);
    };

    const animateScroll = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        container.scrollTop = startPosition + distance * easeOutCubic(progress);
        requestAnimationFrame(animateScroll);
      } else {
        container.scrollTop = scrollTarget;
      }
    };

    requestAnimationFrame(animateScroll);
  }, []);

  const handleScroll = useCallback(() => {
    setAutoScrollEnabled(isNearBottom());
  }, [isNearBottom]);

  useEffect(() => {
    const container = ref.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return { autoScrollEnabled, setAutoScrollEnabled, scrollToBottom };
}
