import { useEffect, useState, RefObject } from "react";

export function useScrollProgress(ref?: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref && ref.current) {
        const element = ref.current;
        const rect = element.getBoundingClientRect();
        
        // Element scroll range relative to viewport
        // start: top of element reaches bottom of screen
        // end: bottom of element reaches top of screen
        const start = rect.top - window.innerHeight;
        const scrollDistance = rect.height + window.innerHeight;
        
        if (scrollDistance <= 0) return;
        
        const rawProgress = -start / scrollDistance;
        setProgress(Math.max(0, Math.min(1, rawProgress)));
      } else {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          setProgress(window.scrollY / totalHeight);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [ref]);

  return progress;
}
