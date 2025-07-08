import { useState, useEffect } from "react";
import SearchModalContent from "@components/layout/main-navigation/SearchModalContent.tsx";
import MobileNavbar from "@components/layout/main-navigation/MobileNavbar.tsx";
import Sidebar from "@components/ui/Sidebar.tsx";
import CartSidebarContent from "@components/layout/main-navigation/CartSidebarContent.tsx";
import Modal from "@components/ui/Modal.tsx";
import userApi from "@api/userApi.ts";
import LeftSection from "@components/layout/main-navigation/LeftSection.tsx";
import RightSection from "@components/layout/main-navigation/RightSection.tsx";
import { useLocation } from "react-router-dom";
import useAuthContext from "@hooks/useAuthContext.ts";

export type PanelName = "search" | "cart" | "mobile_menu" | "profile";
type PanelType = PanelName | null;

const MainNavigation = () => {
  const [isFixed, setIsFixed] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const location = useLocation();
  const currentUser = useAuthContext().state.currentUser;

  const openPanel = (panel: PanelName) => {
    setActivePanel(panel);
  };

  const closePanel = () => {
    setActivePanel(null);
  };

  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  useEffect(() => {
    if (activePanel !== null) {
      closePanel();
    }
    const fetchUnreadUserNotifications = async () => {
      try {
        const { count } = await userApi.getUnreadNotifications();
        setUnreadNotificationsCount(count);
      } catch (error) {
        console.error("Failed to fetch unread notifications:", error);
      }
    };

    fetchUnreadUserNotifications();
  }, [location.pathname, currentUser?._id]);

  useEffect(() => {
    const handleScroll = () => {
      const shouldBeFixed = window.scrollY >= 100;
      setIsFixed((prev) => {
        if (prev !== shouldBeFixed) {
          return shouldBeFixed;
        }
        return prev;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {activePanel === "search" && (
        <Modal isOpen={true} onClose={closePanel}>
          <SearchModalContent />
        </Modal>
      )}

      <Sidebar
        isOpen={activePanel === "cart"}
        direction="right"
        onClose={closePanel}
      >
        <CartSidebarContent />
      </Sidebar>

      <Sidebar
        isOpen={activePanel === "mobile_menu"}
        direction="left"
        onClose={closePanel}
      >
        <MobileNavbar
          key={activePanel}
          unreadNotificationsCount={unreadNotificationsCount}
        />
      </Sidebar>

      <nav
        className={`w-full z-20 antialiased bg-blue-950/90 backdrop-blur-md shadow-md transition-all duration-500 ${
          isFixed ? "fixed animate-fadeInDown" : "relative animate-fadeOutUp"
        }`}
      >
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 py-1">
          <div className="flex items-center justify-between">
            <LeftSection isFixed={isFixed} />
            <RightSection
              activePanel={activePanel}
              openPanel={openPanel}
              closePanel={closePanel}
              unreadNotificationsCount={unreadNotificationsCount}
            />
          </div>
        </div>
      </nav>
    </>
  );
};

export default MainNavigation;
