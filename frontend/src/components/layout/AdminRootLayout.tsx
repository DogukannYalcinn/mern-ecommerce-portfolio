import { useState, useEffect } from "react";
import { Outlet, useLocation, ScrollRestoration } from "react-router-dom";
import AdminNavigation from "@components/layout/AdminNavigation.tsx";
import Footer from "./Footer.tsx";
import adminApi from "@api/adminApi.ts";
import useAuthContext from "@hooks/useAuthContext.ts";

export interface AdminLayoutContext {
  setUnreadContactFormCount: React.Dispatch<React.SetStateAction<number>>;
}

const AdminRootLayout = () => {
  const currentUser = useAuthContext().state.currentUser;
  if (!currentUser || currentUser.role !== "admin") return null;

  const [unreadContactFormCount, setUnreadContactFormCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await adminApi.fetchUnreadContactCount();
        setUnreadContactFormCount(response.count);
      } catch (error) {
        console.error("Failed to fetch unread contact count", error);
      }
    };
    fetchUnreadCount();
  }, [location.pathname]);

  return (
    <main className="relative min-h-screen grid grid-cols-[64px_1fr]">
      <div className="z-20">
        <ScrollRestoration />
        <AdminNavigation unreadContactFormCount={unreadContactFormCount} />
      </div>

      <div className="flex flex-col min-h-screen">
        <Outlet context={{ setUnreadContactFormCount }} />
        <Footer />
      </div>
    </main>
  );
};

export default AdminRootLayout;
