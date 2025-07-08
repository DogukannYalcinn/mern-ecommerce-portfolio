import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CheckBadgeIcon from "@icons/CheckBadgeIcon.tsx";

import CloseCircleIcon from "@icons/CloseCircleIcon.tsx";

type Props = {
  type: "success" | "error";
  message: string;
  duration: number;
};

const Toast = ({ type, message, duration }: Props) => {
  const toastRoot = document.getElementById("toast-root");
  if (!toastRoot) return null;
  const [progress, setProgress] = useState(0);

  const isSuccess = type === "success";

  const positionClasses = isSuccess ? "top-32 right-0" : "top-32 left-0";

  const bgColor = isSuccess ? "bg-blue-500" : "bg-red-500";

  const animationClass = isSuccess
    ? "animate-toastFadeIn"
    : "animate-errorToastFadeIn";

  const Icon = isSuccess ? (
    <CheckBadgeIcon className="w-6 h-6" />
  ) : (
    <CloseCircleIcon className="w-6 h-6" />
  );

  useEffect(() => {
    setProgress(100);
    const interval = 50;
    const totalSteps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = 100 - (currentStep / totalSteps) * 100;
      setProgress(newProgress);
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  return createPortal(
    <div
      id="toast-container"
      className={`fixed z-[9999] ${positionClasses} ${animationClass} shadow-lg backdrop-opacity-50`}
    >
      <div
        className={`${bgColor} relative text-white px-4 py-4 md:px-6 md:py-5 rounded shadow-lg overflow-hidden`}
      >
        {/* Progress Bar */}
        <div
          className={`absolute bottom-0 left-0 h-1.5 ${type === "success" ? "bg-teal-300" : "bg-amber-300"} rounded transition-all ease-linear`}
          style={{ width: `${progress}%` }}
        />
        <div className="flex items-center gap-3 relative z-10">
          {Icon}
          <p className="text-sm md:text-base font-medium leading-snug break-words capitalize">
            {message}
          </p>
        </div>
      </div>
    </div>,
    toastRoot,
  );
};

export default Toast;
