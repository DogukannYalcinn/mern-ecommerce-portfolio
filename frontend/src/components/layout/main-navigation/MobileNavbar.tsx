import { useState } from "react";
import { NavLink } from "react-router-dom";
import useAuthContext from "@hooks/useAuthContext.ts";
import useProductContext from "@hooks/useProductContext.ts";
import HomeIcon from "@icons/HomeIcon.tsx";
import ChevronDownIcon from "@icons/ChevronDownIcon.tsx";
import ShoppingCartIcon from "@icons/ShoppingCartIcon.tsx";
import BellIcon from "@icons/BellIcon.tsx";
import LoginIcon from "@icons/LoginIcon.tsx";
import UserIcon from "@icons/UserIcon.tsx";
import ProfileCardIcon from "@icons/ProfileCardIcon.tsx";
import LogoutIcon from "@icons/LogoutIcon.tsx";
import HeartIcon from "@icons/HeartIcon.tsx";
import PhoneIcon from "@icons/PhoneIcon.tsx";
import CheckBadgeIcon from "@icons/CheckBadgeIcon.tsx";
import OnSaleIcon from "@icons/OnSaleIcon.tsx";

const MobileNavbar = ({
  unreadNotificationsCount,
}: {
  unreadNotificationsCount: number;
}) => {
  const currentUser = useAuthContext().state.currentUser;
  const userLogout = useAuthContext().userLogout;
  const isAuth = currentUser && currentUser.role === "user";
  const categories = useProductContext().state.filters.categories;

  const popularBrands = useProductContext().state.filters.popularBrands;
  const handleDropdownOpen = (identifier: string) => {
    setActiveDropdown((prevState) => {
      return prevState === identifier ? null : identifier;
    });
  };

  const [activeDropdown, setActiveDropdown] = useState<null | string>(null);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8 h-screen overflow-y-auto p-2">
      <NavLink to="/" className="self-center">
        <img
          className="block h-auto w-44 object-contain"
          src="/images/dummyLogo.png"
          alt="logo"
        />
      </NavLink>

      <ul className="space-y-2 font-medium w-full">
        <li className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-800 hover:text-white group">
          <NavLink to="/" className="flex">
            <HomeIcon className="w-6 h-6 text-gray-400 group-hover:text-white" />
            <span className="ms-3">Home</span>
          </NavLink>
        </li>

        <li>
          <button
            type="button"
            onClick={() => setIsProductMenuOpen((prev) => !prev)}
            className="flex items-center w-full p-2 text-base text-gray-900 font-semibold transition duration-75 rounded-lg group hover:bg-blue-800 hover:text-white"
          >
            <ShoppingCartIcon className="w-6 h-6 text-gray-400 fill-gray-400 transition duration-75 group-hover:text-white group-hover:fill-white" />
            <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
              Our Products
            </span>
            <ChevronDownIcon
              className={`w-6 h-6 ml-auto transition-transform duration-300 ${isProductMenuOpen ? "rotate-180" : ""}`}
            />
          </button>
        </li>

        {isProductMenuOpen && (
          <>
            {categories.map((category, catIndex) => (
              <li
                key={category._id}
                className="flex flex-col text-gray-900 opacity-0 animate-fadeInDown "
                style={{ animationDelay: `${catIndex * 100}ms` }}
              >
                <button
                  type="button"
                  onClick={() => handleDropdownOpen(category.name)}
                  className={`flex items-center w-full p-2 text-base rounded-lg transition-all duration-300 hover:bg-blue-800 hover:text-white  ${activeDropdown === category.name ? "bg-blue-800 text-xl text-white" : null}`}
                  aria-controls="parent-category"
                  data-collapse-toggle="dropdown-example"
                >
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap capitalize">
                    {category.name}
                  </span>
                  <ChevronDownIcon
                    className={`w-6 h-6 ml-auto transition-transform duration-300 ${activeDropdown === category.name ? "rotate-180 w-8 h-8" : ""}`}
                  />
                </button>

                <ul
                  className={`${activeDropdown === category.name ? "visible" : "hidden"} py-2 space-y-2 transition-all duration-300`}
                >
                  {category.children.map((subCategory, childIndex) => (
                    <li
                      key={subCategory._id}
                      className="animate-fadeInLeft"
                      style={{
                        animationDelay: `${
                          activeDropdown === category.name
                            ? childIndex * 100
                            : 0
                        }ms`,
                      }}
                    >
                      <NavLink
                        to={`/products?categorySlugs=${subCategory.slug}`}
                        className="flex items-center capitalize w-full p-2 text-gray-700 bg-blue-100 transition-all duration-300 rounded-lg pl-11 hover:text-gray-800 hover:bg-blue-200"
                      >
                        {subCategory.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </>
        )}

        <li>
          <NavLink
            to={"/products/best-sellers"}
            className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-800 hover:text-white"
          >
            <CheckBadgeIcon className="w-6 h-6 text-gray-400 fill-gray-400 transition duration-75 group-hover:text-white group-hover:fill-white" />
            <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
              Best Sellers
            </span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/products/on-sale"
            className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-800 hover:text-white"
          >
            <OnSaleIcon className="w-6 h-6 text-gray-400 fill-gray-400 transition duration-75 group-hover:text-white group-hover:fill-white" />
            <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
              On Sale
            </span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/notifications"
            className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-blue-800 hover:text-white group"
          >
            <BellIcon className="w-6 h-6 text-gray-400 fill-gray-400 group-hover:text-white group-hover:fill-white" />
            <span className="flex-1 ms-3 whitespace-nowrap">
              Notifications({unreadNotificationsCount})
            </span>
          </NavLink>
        </li>
        {isAuth ? (
          <>
            <li>
              <NavLink
                to="/account/profile"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-800 hover:text-white group"
              >
                <UserIcon className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/account/orders"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-800 hover:text-white group"
              >
                <ShoppingCartIcon className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">My Orders</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/account/favorites"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-800 hover:text-white group"
              >
                <HeartIcon className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  My Favorites
                </span>
              </NavLink>
            </li>

            <li>
              <button
                onClick={userLogout}
                className="flex items-center w-full gap-3 p-2 text-gray-900 rounded-lg hover:bg-blue-800 hover:text-white group"
              >
                <LogoutIcon className="w-6 h-6 text-gray-400 fill-gray-400 transition duration-75 group-hover:text-white group-hover:fill-white" />
                <span className="">Sign Out</span>
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink
                to="/auth/login"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-800 hover:text-white"
              >
                <LoginIcon className="w-6 h-6 text-gray-400 fill-gray-400 group-hover:text-white group-hover:fill-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">Log In</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/auth/register"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-800 hover:text-white"
              >
                <ProfileCardIcon className="w-6 h-6 text-gray-400 fill-gray-400 group-hover:text-white group-hover:fill-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">Register</span>
              </NavLink>
            </li>
          </>
        )}

        <li>
          <NavLink
            to="/contact"
            className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-800 hover:text-white"
          >
            <PhoneIcon className="w-6 h-6 text-gray-400 fill-gray-400 transition duration-75 group-hover:text-white group-hover:fill-white" />
            <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
              Contact
            </span>
          </NavLink>
        </li>
      </ul>

      <div className="p-2 space-y-4">
        <h2 className="text-sm font-medium text-blue-900">Popular Brands</h2>
        <div className="flex gap-4 flex-wrap">
          {popularBrands.map((brand) => (
            <NavLink
              to={`/products?brands=${brand}`}
              key={brand}
              className="text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 hover:underline"
            >
              {brand}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
