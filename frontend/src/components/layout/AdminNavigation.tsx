import { NavLink, useLocation } from "react-router-dom";
import Sidebar from "@components/ui/Sidebar.tsx";
import { useEffect, useState } from "react";
import HamburgerIcon from "@icons/HamburgerIcon.tsx";
import HomeIcon from "@icons/HomeIcon.tsx";
import ReceiptIcon from "@icons/ReceiptIcon.tsx";
import ShoppingBagIcon from "@icons/ShoppingBag.tsx";
import UserIcon from "@icons/UserIcon.tsx";
import MessageDotsIcon from "@icons/MessageDotsIcon.tsx";
import BellIcon from "@icons/BellIcon.tsx";
import HornIcon from "@icons/HornIcon.tsx";
import CategoryIcon from "@icons/CategoryIcon.tsx";
import ImageIcon from "@icons/ImageIcon.tsx";
import CogIcon from "@icons/CogIcon.tsx";

const navItems = [
  {
    name: "Dashboard",
    to: "/admin",
    icon: <HomeIcon className="w-6 h-6" />,
  },
  {
    name: "Orders",
    to: "/admin/orders",
    icon: <ReceiptIcon className="w-6 h-6" />,
  },
  {
    name: "Products",
    to: "/admin/products",
    icon: <ShoppingBagIcon className="w-6 h-6" />,
  },
  {
    name: "Users",
    to: "/admin/users",
    icon: <UserIcon className="w-6 h-6 " />,
  },
  {
    name: "Contacts",
    to: "/admin/contacts",
    icon: <MessageDotsIcon className="w-6 h-6" />,
  },
  {
    name: "Categories",
    to: "/admin/general-settings",
    icon: <CategoryIcon className="w-6 h-6" />,
  },
  {
    name: "Sliders",
    to: "/admin/general-settings",
    icon: <ImageIcon className="w-6 h-6 fill-white" />,
  },
  {
    name: "Active Promos",
    to: "/admin/general-settings",
    icon: <BellIcon className="w-6 h-6 fill-white" />,
  },
  {
    name: "Announcements",
    to: "/admin/general-settings",
    icon: <HornIcon className="w-6 h-6" />,
  },
  {
    name: "Order Rules",
    to: "/admin/order-rules",
    icon: <CogIcon className="w-6 h-6" />,
  },
];

const AdminNavigation = ({
  unreadContactFormCount,
}: {
  unreadContactFormCount: number;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (setIsSidebarOpen) setIsSidebarOpen(false);
  }, [location]);

  return (
    <>
      <div className="h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white w-16 flex flex-col items-center relative pt-2">
        <div className="flex flex-col items-center sticky top-2">
          <button onClick={() => setIsSidebarOpen(true)}>
            <HamburgerIcon className="w-6 h-6" />
          </button>

          <nav className="mt-6 space-y-2 ">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `group relative flex items-center gap-4 px-4 py-2 text-sm hover:bg-gray-700 transition ${
                    isActive ? "bg-gray-700" : ""
                  }`
                }
              >
                <span className="w-6 h-6 relative">
                  {item.icon}
                  {item.name === "Contacts" && unreadContactFormCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none shadow">
                      {unreadContactFormCount > 9
                        ? "9+"
                        : unreadContactFormCount}
                    </span>
                  )}
                </span>

                <span className="absolute left-full p-2 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-x-1 transition-all duration-300 whitespace-nowrap">
                  {item.name}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        direction="left"
        onClose={() => setIsSidebarOpen(false)}
      >
        <nav className="h-screen  bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl">
          <div className="flex items-center justify-center">
            <NavLink to="/admin" title="" className="">
              <img
                className={`block w-48 h-auto object-contain`}
                src="/images/dummyLogo.png"
                alt=""
              />
            </NavLink>
          </div>
          <ul className="mt-6 space-y-1 px-2">
            {navItems.map(({ name, to, icon: Icon }) => (
              <li key={name}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:text-white ${
                      isActive ? "bg-gray-700" : "text-gray-300"
                    }`
                  }
                >
                  <span>{Icon}</span>
                  <span className="text-sm font-medium">{name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </Sidebar>
    </>
  );
};

export default AdminNavigation;
