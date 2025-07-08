import { NavLink } from "react-router-dom";
import useCartContext from "@hooks/useCartContext.ts";
import SearchIcon from "@icons/SearchIcon.tsx";
import ShoppingCartIcon from "@icons/ShoppingCartIcon.tsx";
import BellIcon from "@icons/BellIcon.tsx";
import ProfileDropdown from "./ProfileDropdown.tsx";
import HamburgerIcon from "@icons/HamburgerIcon.tsx";
import UserIcon from "@icons/UserIcon.tsx";
import { PanelName } from "./MainNavigation.tsx";

type Props = {
  activePanel: PanelName | null;
  openPanel: (panel: PanelName) => void;
  closePanel: () => void;
  unreadNotificationsCount: number;
};
const RightSection = ({
  activePanel,
  openPanel,
  closePanel,
  unreadNotificationsCount,
}: Props) => {
  const cartProductCount = useCartContext().state.list.length;

  return (
    <div className="flex">
      <ul className="flex items-center space-x-2 lg:space-x-4">
        {/* SearchProductsPage */}
        <li onMouseEnter={closePanel}>
          <button
            className="inline-flex items-center justify-center p-2"
            onClick={() => openPanel("search")}
            aria-label="Search"
          >
            <SearchIcon className="h-8 w-8 text-white hover:text-red-500 hover:scale-110 transition-all duration-300" />
          </button>
        </li>

        {/* CartPage */}
        <li>
          <button
            className="inline-flex items-center justify-center p-2 relative"
            onClick={() => openPanel("cart")}
            aria-label="Cart"
          >
            <ShoppingCartIcon className="w-8 h-8 text-white hover:text-red-700 hover:scale-110 transition-all duration-300" />

            <div className="absolute top-0 right-0 -translate-x-1 translate-y-[-0.3rem] w-5 h-5 flex items-center justify-center">
              <div
                key={cartProductCount}
                className="w-full h-full rounded-full bg-red-700 text-white text-xs font-mono flex items-center justify-center group-hover:bg-white group-hover:text-red-500 animate-cartBounce"
              >
                {cartProductCount}
              </div>
            </div>
          </button>
        </li>

        {/* NotificationsPage */}
        <li className="hidden lg:flex">
          <NavLink
            to="/notifications"
            className="inline-flex items-center justify-center p-2 relative group transition-all duration-500"
            aria-label="Notifications"
          >
            <BellIcon className="w-8 h-8 text-white group-hover:text-red-700 group-hover:scale-110 transition-all duration-300" />
            <div className="absolute top-0 right-0 -translate-x-1 translate-y-[-0.3rem] w-5 h-5 bg-red-700 text-white text-xs font-mono flex items-center justify-center rounded-full group-hover:bg-white group-hover:text-red-500 transition-colors duration-300">
              {unreadNotificationsCount}
            </div>
          </NavLink>
        </li>

        {/* ProfilePage */}
        <li onMouseLeave={closePanel}>
          <button
            className="hidden lg:inline-flex items-center rounded-lg justify-center p-2"
            onClick={() => openPanel("profile")}
            aria-label="Profile"
          >
            <UserIcon className="w-8 h-8 text-white hover:text-red-700 hover:scale-110 transition duration-300" />
          </button>
          <ProfileDropdown isOpen={activePanel === "profile"} />
        </li>

        {/* Mobile Menu */}
        <li>
          <button
            type="button"
            aria-controls="mobile-menu"
            aria-expanded="false"
            aria-label="Open mobile menu"
            onClick={() => openPanel("mobile_menu")}
            className="inline-flex lg:hidden items-center justify-center text-white hover:text-red-700 transition duration-300"
          >
            <HamburgerIcon className="h-8 w-8 text-white hover:text-red-700 hover:scale-110 transition-all duration-300" />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default RightSection;
