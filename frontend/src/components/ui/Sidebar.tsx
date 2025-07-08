import { createPortal } from "react-dom";
import CloseIcon from "@icons/CloseIcon.tsx";

type Props = {
  isOpen: boolean;
  direction: "left" | "right";
  onClose: () => void;
  children: React.ReactNode;
};
const Sidebar = ({ isOpen, onClose, direction, children }: Props) => {
  const portalRoot = document.getElementById("sidebar-root");
  if (!portalRoot) return null;
  return createPortal(
    <>
      {/*OVERLAY*/}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-80 z-30"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 min-h-screen w-96 bg-white shadow-lg transition-transform duration-300 z-40 ${
          direction === "left" ? "left-0" : "right-0"
        } ${
          isOpen
            ? "translate-x-0"
            : direction === "left"
              ? "-translate-x-full"
              : "translate-x-full"
        }`}
      >
        <div className=" absolute top-2 right-2 z-50">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <CloseIcon className="h-8 w-8  text-gray-500 hover:text-gray-700 hover:scale-110 hover:rotate-180 transition-all duration-300" />
          </button>
        </div>

        {children}
      </aside>
    </>,
    portalRoot,
  );
};

export default Sidebar;
// type Props = {
//     isOpen: boolean;
//     direction: "left" | "right";
//     width?: string;
//     onClose: () => void;
//     children: React.ReactNode;
// };
//
// const Sidebar = ({
//                      isOpen,
//                      direction = "right",
//                      width = "96",
//                     onClose,
//                     children
//                  }: Props) => {
//
//
//
//     const getTransformClass = () => {
//         if (!isOpen) {
//             return direction === "left" ? "-translate-x-full" : "translate-x-full";
//         }
//         return "-translate-x-0";
//     };
//
//     const getPositionClass = () => {
//         return direction === "left" ? "left-0" : "right-0";
//     };
//
//     return (
//         <>
//             {/* Overlay */}
//             {isOpen && (
//                 <div
//                     className="fixed inset-0 bg-gray-900 bg-opacity-80 z-30"
//                     onClick={onClose}
//                 />
//             )}
//
//             {/* Sidebar */}
//             <aside
//                 id="sidebar-multi-level-sidebar"
//                 className={`
//           fixed
//           top-0
//           ${getPositionClass()}
//           z-40
//           w-96
//           h-screen
//           ${getTransformClass()}
//           transition-transform
//           duration-500
//         `}
//                 aria-label="Sidebar"
//             >
//                 <div className="flex flex-col gap-4 h-full px-3 overflow-y-auto bg-gray-50">
//                     {/* Close button */}
//                     {/*<div className="inline-block group  relative">*/}
//                     {/*    <button*/}
//                     {/*        onClick={onClose}*/}
//                     {/*        className={`absolute top-4 right-4 text-gray-800 hover:text-gray-900`}*/}
//                     {/*    >*/}
//                     {/*        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
//                     {/*            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}*/}
//                     {/*                  d="M6 18L18 6M6 6l12 12"/>*/}
//                     {/*        </svg>*/}
//                     {/*    </button>*/}
//                     {/*</div>*/}
//
//
//                     {/* Your sidebar content goes here */}
//                     <div className="">
//                         {children}
//                     </div>
//                 </div>
//             </aside>
//         </>
//     );
// };
//
// export default Sidebar;
