import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import AuthContextProvider from "./context/AuthContext.tsx";
import ProductContextProvider from "./context/ProductContext.tsx";
import CartContextProvider from "./context/CartContext.tsx";
import RootLayout from "@components/layout/RootLayout.tsx";
import IndexPage from "@pages/home/IndexPage.tsx";
import ProductsPage from "@pages/products/ProductsPage.tsx";
import LoginPage from "@pages/auth/LoginPage.tsx";
import CartPage from "@pages/cart/CartPage.tsx";
import ProfilePage from "@pages/account/ProfilePage.tsx";
import RegisterPage from "@pages/auth/RegisterPage.tsx";
import AdminLoginPage from "@pages/admin/AdminLoginPage.tsx";
import AdminRootLayout from "@components/layout/AdminRootLayout.tsx";
import AdminDashboardPage from "@pages/admin/AdminDashboardPage.tsx";
import AdminOrdersPage from "@pages/admin/AdminOrdersPage.tsx";
import AdminUsersPage from "@pages/admin/AdminUsersPage.tsx";
import AdminProductsPage from "@pages/admin/AdminProductsPage.tsx";
import UIContextProvider from "./context/UIContext.tsx";
import FavoritesPage from "@pages/account/FavoritesPage.tsx";
import UserOrdersPage from "@pages/account/UserOrdersPage.tsx";
import OrderPlacementPage from "@pages/auth/OrderPlacementPage.tsx";
import RefundRequestPage from "@pages/account/RefundRequestPage.tsx";
import NotificationsPage from "@pages/NotificationsPage.tsx";
import SearchProductsPage from "@pages/products/SearchProductsPage.tsx";
import CheckoutPage from "@pages/cart/checkout/CheckoutPage.tsx";
import ProductDetailsPage from "@pages/products/ProductDetailsPage.tsx";
import AdminProductEditPage from "@pages/admin/AdminProductEditPage.tsx";
import AdminOrderDetailsPage from "@pages/admin/AdminOrderDetailsPage.tsx";
import AdminGeneralSettingsPage from "@pages/admin/AdminGeneralSettingsPage.tsx";
import ContactPage from "@pages/ContactPage.tsx";
import AdminContactsPage from "@pages/admin/AdminContactsPage.tsx";
import BestSellersPage from "@pages/products/BestSellersPage.tsx";
import OnSalePage from "@pages/products/OnSalePage.tsx";
import OrderDetailsPage from "@pages/account/OrderDetailsPage.tsx";
import ProtectedRoute from "@components/layout/ProtectedRoute.tsx";
import AdminOrderRulesPage from "@pages/admin/AdminOrderRulesPage.tsx";
import NotFoundPage from "@pages/NotFoundPage.tsx";
import ErrorFallback from "@components/ErrorFallback.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <IndexPage /> },
      {
        path: "products",
        children: [
          { index: true, element: <ProductsPage /> },
          { path: "search", element: <SearchProductsPage /> },
          { path: "best-sellers", element: <BestSellersPage /> },
          { path: "on-sale", element: <OnSalePage /> },
          { path: ":slug", element: <ProductDetailsPage /> },
        ],
      },
      {
        path: "account",
        children: [
          {
            path: "profile",
            element: (
              <ProtectedRoute requiredRole="user">
                <ProfilePage />
              </ProtectedRoute>
            ),
          },
          {
            path: "favorites",
            element: (
              <ProtectedRoute requiredRole="user">
                <FavoritesPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "orders",
            element: (
              <ProtectedRoute requiredRole="user">
                <UserOrdersPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "orders/refund-request",
            element: (
              <ProtectedRoute requiredRole="user">
                <RefundRequestPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "orders/:id",
            element: (
              <ProtectedRoute requiredRole="user">
                <OrderDetailsPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "auth",
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
          { path: "order-placement", element: <OrderPlacementPage /> },
        ],
      },
      {
        path: "cart",
        children: [
          {
            index: true,
            element: <CartPage />,
          },
          {
            path: "checkout",
            element: (
              <ProtectedRoute requiredRole="user">
                <CheckoutPage />
              </ProtectedRoute>
            ),
          },
        ],
      },

      { path: "notifications", element: <NotificationsPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin/",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminRootLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "orders", element: <AdminOrdersPage /> },
      { path: "orders/:id", element: <AdminOrderDetailsPage /> },
      { path: "products", element: <AdminProductsPage /> },
      { path: "products/edit/:slug", element: <AdminProductEditPage /> },
      { path: "users", element: <AdminUsersPage /> },
      { path: "general-settings", element: <AdminGeneralSettingsPage /> },
      { path: "contacts", element: <AdminContactsPage /> },
      { path: "order-rules", element: <AdminOrderRulesPage /> },
    ],
  },
]);

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <UIContextProvider>
        <AuthContextProvider>
          <ProductContextProvider>
            <CartContextProvider>
              <RouterProvider router={router} />
            </CartContextProvider>
          </ProductContextProvider>
        </AuthContextProvider>
      </UIContextProvider>
    </ErrorBoundary>
  );
}

export default App;
