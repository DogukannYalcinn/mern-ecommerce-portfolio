import { useEffect, useRef, useState } from "react";
import RightArrowIcon from "@icons/RightArrowIcon.tsx";

const BackToTop = () => {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [showArrow, setShowArrow] = useState(false);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const observerTarget = observerRef.current;
    if (!observerTarget) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowArrow(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(observerTarget);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Sentinel div */}
      <div ref={observerRef} className="h-1 w-full" />

      {/* Scroll-to-top arrow */}
      <button
        onClick={handleScrollToTop}
        className={`fixed bottom-1/4 right-1 z-50 p-2 rounded-full bg-blue-700 text-white shadow-lg hover:bg-blue-600 transition-opacity duration-300 ${
          showArrow ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <RightArrowIcon className="w-8 h-8 -rotate-90" />
      </button>
    </>
  );
};

export default BackToTop;
