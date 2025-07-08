import { NavLink } from "react-router-dom";
import useAuthContext from "@hooks/useAuthContext.ts";
import HomeIcon from "@icons/HomeIcon.tsx";
import HeartIcon from "@icons/HeartIcon.tsx";
import LoginIcon from "@icons/LoginIcon.tsx";
import LogoutIcon from "@icons/LogoutIcon.tsx";
import UserIcon from "@icons/UserIcon.tsx";
import ShoppingBagIcon from "@icons/ShoppingBag.tsx";

type Props = {
  isOpen: boolean;
};
const ProfileDropdown = ({ isOpen }: Props) => {
  const currentUser = useAuthContext().state.currentUser;
  const userLogout = useAuthContext().userLogout;
  const isAuth = currentUser && currentUser.role === "user";

  const listClasses = "flex flex-col gap-4 items-center";
  const itemClasses = "flex items-center justify-between gap-4 group";
  const textClasses =
    "text-lg font-medium text-gray-700 group-hover:text-red-700";
  const iconClasses = "w-6 h-6 text-gray-700 group-hover:text-red-700";

  const AuthMenuItems = [
    {
      title: "Profile",
      to: "account/profile",
      icon: <HomeIcon className={iconClasses} />,
    },
    {
      title: "Favorites",
      to: "account/favorites",
      icon: <HeartIcon className={iconClasses} />,
    },
    {
      title: "My Orders",
      to: "account/orders",
      icon: <ShoppingBagIcon className={iconClasses} />,
    },
  ];

  const GuestMenuItems = [
    {
      title: "Sign In",
      to: "/auth/login",
      icon: <LoginIcon className={iconClasses} />,
    },
    {
      title: "Sign Up",
      to: "/auth/register",
      icon: <UserIcon className={iconClasses} />,
    },
  ];

  return (
    <div className="inline-block relative text-left">
      {isOpen && (
        <div
          id="myCartDropdown2"
          className="absolute top-full right-0 mt-1 z-10 mx-auto w-48 space-y-4 overflow-hidden rounded-lg bg-white px-4 py-2 antialiased"
        >
          <ul className={listClasses}>
            {(isAuth ? AuthMenuItems : GuestMenuItems).map((item) => (
              <li key={item.title}>
                <NavLink to={item.to} className={itemClasses}>
                  <span className={textClasses}>{item.title}</span>
                  {item.icon}
                </NavLink>
              </li>
            ))}
            {isAuth && (
              <li className={listClasses}>
                <button className={itemClasses} onClick={userLogout}>
                  <span className={textClasses}>Sign Out</span>
                  <LogoutIcon className={iconClasses} aria-hidden="true" />
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
