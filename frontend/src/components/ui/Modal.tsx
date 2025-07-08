import { useEffect, useRef, ReactNode } from "react";
import CloseIcon from "@icons/CloseIcon.tsx";
import { createPortal } from "react-dom";

type ModalSize = "small" | "medium" | "large" | "x-large";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: ModalSize; // default medium
  isLayer?: boolean; // default true
};

const Modal = ({
  isOpen,
  onClose,
  children,
  size = "medium",
  isLayer = true,
}: Props) => {
  const portalRoot = document.getElementById("modal-root");
  if (!portalRoot) return null;

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  // const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
  //   if (event.target === dialogRef.current) {
  //     handleClose();
  //   }
  // };

  const getWidthClass = (size: ModalSize) => {
    switch (size) {
      case "small":
        return "max-w-md";
      case "large":
        return "max-w-6xl";
      case "x-large":
        return "max-w-7xl";
      case "medium":
      default:
        return "max-w-3xl";
    }
  };

  const backdropClass = isLayer ? "backdrop:bg-black backdrop:opacity-90" : "";

  return createPortal(
    <dialog
      key={isOpen ? "open" : "closed"}
      ref={dialogRef}
      className={`modal p-0 z-20 rounded-lg shadow-xl ${backdropClass} w-5/6 ${getWidthClass(size)}`}
      // onClick={handleBackdropClick}
      onClose={handleClose}
    >
      <div className="relative">
        <div className="absolute right-2 top-2">
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 hover:bg-gray-300 rounded-full"
          >
            <CloseIcon className="w-8 h-8" />
          </button>
        </div>
        {children}
      </div>
    </dialog>,
    portalRoot,
  );
};

export default Modal;
