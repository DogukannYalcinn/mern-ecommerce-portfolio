import MainNavigation from "@components/layout/main-navigation/MainNavigation.tsx";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";

import useUIContext from "@hooks/useUIContext.ts";
import Footer from "@components/layout/Footer.tsx";
import Announcement from "@components/layout/Announcement.tsx";
import useProductContext from "@hooks/useProductContext.ts";
import useAuthContext from "@hooks/useAuthContext.ts";
import BackToTop from "@components/ui/BackToTop.tsx";
import LoaderScreen from "@components/ui/LoaderScreen.tsx";

function RootLayout() {
  const { isLoading } = useProductContext().state.ui;
  const { state: authState, resetAuthError } = useAuthContext();
  const { showToast } = useUIContext();
  const navigate = useNavigate();

  useEffect(() => {
    const error = authState.error;

    if (!error) return;

    if (error.type === "unauthorized") {
      showToast("error", error.message || "you are not authorized.");
      navigate("/login");
      resetAuthError();
      return;
    }

    if (error.type === "token") {
      showToast(
        "error",
        error.message || "session expired. please log in again.",
      );
      navigate("/login");
      resetAuthError();
      return;
    }
  }, [authState.error]);

  return (
    <>
      {isLoading && <LoaderScreen />}
      <div className="flex flex-col min-h-screen overflow-hidden">
        <ScrollRestoration />
        <Announcement />
        <MainNavigation />

        <main className="flex-grow">
          <Outlet />
          <BackToTop />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default RootLayout;
