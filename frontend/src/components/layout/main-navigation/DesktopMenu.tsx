import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import MenuItem from "@components/layout/main-navigation/MenuItem.tsx";
import CategoryDropdown from "@components/layout/main-navigation/CategoryDropdown.tsx";
import BestSellersDropdown from "@components/layout/main-navigation/BestSellersDropdown.tsx";
import MostPopularBrandsDropdown from "@components/layout/main-navigation/MostPopularBrandsDropdown.tsx";
import OnSaleDropdown from "@components/layout/main-navigation/OnSaleDropdown.tsx";

const DesktopMenu = () => {
  const [activeMenu, setActiveMenu] = useState<null | string>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (activeMenu !== null) {
      setActiveMenu(null);
    }
  }, [location]);

  const handleOpenMenu = (menuKey: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveMenu(menuKey);
  };

  const handleCloseMenu = () => {
    closeTimerRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 300);
  };

  return (
    <ul className="hidden lg:flex items-center gap-4 xl:gap-8">
      <li>
        <MenuItem
          title="Our Products"
          menuKey="category"
          activeMenu={activeMenu}
          openMenu={handleOpenMenu}
          closeMenu={handleCloseMenu}
        >
          <CategoryDropdown />
        </MenuItem>
      </li>
      <li>
        <MenuItem
          title="Best Seller"
          menuKey="best_seller"
          activeMenu={activeMenu}
          openMenu={handleOpenMenu}
          closeMenu={handleCloseMenu}
        >
          <BestSellersDropdown />
        </MenuItem>
      </li>
      <li>
        <MenuItem
          title="Popular Brands"
          menuKey="popular_brands"
          activeMenu={activeMenu}
          openMenu={handleOpenMenu}
          closeMenu={handleCloseMenu}
        >
          <MostPopularBrandsDropdown />
        </MenuItem>
      </li>
      <li>
        {" "}
        <MenuItem
          title="On Sale"
          menuKey="on_sale"
          activeMenu={activeMenu}
          openMenu={handleOpenMenu}
          closeMenu={handleCloseMenu}
        >
          <OnSaleDropdown />
        </MenuItem>
      </li>
      <li>
        <NavLink
          to="/contact"
          className="text-md font-medium text-white hover:text-red-400 transition-colors duration-500 cursor-pointer"
        >
          Contact
        </NavLink>
      </li>
    </ul>
  );
};
export default DesktopMenu;
