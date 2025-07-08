import { ReactNode, useRef } from "react";
type Props = {
  title: string;
  menuKey: string;
  activeMenu: string | null;
  openMenu: (activeMenuKey: string) => void;
  closeMenu: () => void;
  children: ReactNode;
};
const MenuItem = ({
  title,
  menuKey,
  activeMenu,
  openMenu,
  closeMenu,
  children,
}: Props) => {
  const isOpen = activeMenu === menuKey;
  const wrapperRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className=""
      ref={wrapperRef}
      onMouseEnter={() => openMenu(menuKey)}
      onMouseLeave={closeMenu}
    >
      <span className="text-md font-medium text-white hover:text-red-400 transition-colors duration-500 cursor-pointer">
        {title}
      </span>

      <div
        className={`absolute top-full left-0 bg-gray-50 shadow-lg backdrop-blur-sm w-full transition-all duration-300 ease-out z-10
      ${
        isOpen
          ? "opacity-100 translate-y-0 visible pointer-events-auto"
          : "opacity-0 -translate-y-3 invisible pointer-events-none"
      }`}
      >
        {children}
      </div>
    </div>
  );
};

export default MenuItem;
