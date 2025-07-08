import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { UserType, OrderType, ProductType } from "@types";
import ChartIcon from "@icons/ChartIcon.tsx";
import TruckIcon from "@icons/TruckIcon.tsx";
import RefundIcon from "@icons/RefundIcon.tsx";
import UserIcon from "@icons/UserIcon.tsx";
import GiftBoxIcon from "@icons/GiftBoxIcon.tsx";
import MessageDotsIcon from "@icons/MessageDotsIcon.tsx";
import ReceiptIcon from "@icons/ReceiptIcon.tsx";
import ShoppingBagIcon from "@icons/ShoppingBag.tsx";
import { orderStatusTypes } from "@constants/orderStatus.tsx";
import BadgeDollarSignIcon from "@icons/BadgeDollarSignIcon.tsx";
import ClockIcon from "@icons/ClockIcon.tsx";
import { formatDate } from "@utils/formatDate.ts";
import adminApi from "@api/adminApi.ts";

export type DashboardStateType = {
  isLoading: boolean;
  recentUsers: UserType[];
  recentProducts: ProductType[];
  recentOrders: OrderType[];
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalPendingOrders: number;
  totalActivePromo: number;
  totalComments: number;
  totalSales: number;
  totalRefundRequests: number;
};
const AdminDashboardPage = () => {
  const [state, setState] = useState<DashboardStateType>({
    isLoading: false,
    recentUsers: [],
    recentProducts: [],
    recentOrders: [],
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalPendingOrders: 0,
    totalActivePromo: 0,
    totalComments: 0,
    totalSales: 0,
    totalRefundRequests: 0,
  });

  useEffect(() => {
    (async () => {
      setState((prevState) => ({
        ...prevState,
        isLoading: true,
      }));
      try {
        const { stats } = await adminApi.getDashboard();
        setState((prevState) => ({
          ...prevState,
          ...stats,
        }));
      } catch (e) {
        console.log(e);
      } finally {
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      }
    })();
  }, []);

  return (
    <>
      <main className="flex flex-col mx-auto max-w-4xl xl:max-w-7xl px-2 py-4 gap-6 min-h-screen">
        {/*HEADER*/}
        <header className="flex justify-center items-center ">
          <h1 className="text-3xl font-bold text-gray-700 tracking-tight">
            Welcome Admin Test
          </h1>
        </header>

        {/*STATS Section*/}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className=" bg-white p-5 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <ChartIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Sales</p>
              <h4 className="text-xl font-bold text-gray-700">
                ${state.totalSales}
              </h4>
            </div>
          </div>
          <div className=" bg-white p-5 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
              <TruckIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Order</p>
              <h4 className="text-xl font-bold text-gray-700">
                {state.totalPendingOrders}
              </h4>
            </div>
          </div>
          <div className=" bg-white p-5 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
            <div className="bg-red-100 text-red-600 p-3 rounded-full">
              <RefundIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Refund Request</p>
              <h4 className="text-xl font-bold text-gray-700">
                {state.totalRefundRequests}
              </h4>
            </div>
          </div>
          <div className=" bg-white p-5 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
            <div className="bg-teal-100 text-teal-600 p-3 rounded-full">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total User</p>
              <h4 className="text-xl font-bold text-gray-700">
                {state.totalUsers}
              </h4>
            </div>
          </div>
          <div className=" bg-white p-5 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
              <GiftBoxIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Promo</p>
              <h4 className="text-xl font-bold text-gray-700">
                {state.totalActivePromo}
              </h4>
            </div>
          </div>
          <div className=" bg-white p-5 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
            <div className="bg-gray-100 text-gray-600 p-3 rounded-full">
              <MessageDotsIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Comment</p>
              <h4 className="text-xl font-bold text-gray-700">
                {state.totalComments}
              </h4>
            </div>
          </div>
          <div className=" bg-white p-5 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
            <div className="bg-green-100 text-green-600 p-3 rounded-full">
              <ReceiptIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Order</p>
              <h4 className="text-xl font-bold text-gray-700">
                {state.totalOrders}
              </h4>
            </div>
          </div>
          <div className=" bg-white p-5 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
            <div className=" bg-fuchsia-100 text-fuchsia-600 p-3 rounded-full">
              <ShoppingBagIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Product</p>
              <h4 className="text-xl font-bold text-gray-700">
                {state.totalProducts}
              </h4>
            </div>
          </div>
        </section>

        {/*Recent-Orders*/}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-600 ">Recent Orders</h2>
            <NavLink
              to="orders"
              className="text-sm font-medium text-gray-500 hover:text-blue-800 hover:underline"
            >
              Show All Orders
            </NavLink>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {state.recentOrders.map((order) => {
              const orderStatusConfig = orderStatusTypes.find(
                (status) => status.identifier === order.currentStatus,
              );

              return (
                <div
                  key={order._id}
                  className={`p-5 rounded-xl border shadow-sm transition hover:shadow-md ${orderStatusConfig?.colorClasses}`}
                >
                  <div className="flex justify-between items-start gap-6">
                    {/* Left Content */}
                    <div className="flex-1 space-y-3">
                      {/* Order Status */}
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-current" />
                        {orderStatusConfig?.icon}
                        <span className="text-sm font-semibold">
                          {orderStatusConfig?.label}
                        </span>
                      </div>

                      {/* Total Amount */}
                      <div className="flex items-center gap-2">
                        <BadgeDollarSignIcon className="w-5 h-5 text-green-600" />
                        <span className="text-lg font-bold text-gray-900">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>

                      {/* Link to details */}
                      <NavLink
                        to={`orders/${order._id}`}
                        className="inline-block text-sm text-blue-600 font-medium hover:underline transition"
                      >
                        Go to details
                      </NavLink>
                    </div>

                    {/* Created At */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4" />
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/*Recent-ProductsPage*/}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-600 ">
              Recent Products
            </h2>
            <NavLink
              to="products"
              className="text-sm font-medium text-gray-500 hover:text-blue-800 hover:underline"
            >
              Show All Products
            </NavLink>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {state.recentProducts.map((product) => {
              const isOnSale =
                product.discountedRatio > 0 && product.discountedPrice > 0;

              return (
                <div
                  key={product._id}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition relative"
                >
                  {/* Discount Badge */}
                  {isOnSale && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow">
                      {product.discountedRatio}% OFF
                    </div>
                  )}

                  {/* Image */}
                  <img
                    className="w-24 h-24 object-contain mx-auto mb-2"
                    src={`http://localhost:4000/images/${product.images[0].url}`}
                    alt={product.title}
                  />

                  {/* Title */}
                  <h3 className="font-medium text-gray-800 text-center truncate capitalize hover:underline">
                    <NavLink to={`products/edit/${product.slug}`}>
                      {product.title}
                    </NavLink>
                  </h3>

                  {/* Price */}
                  <div className="mt-2 text-center">
                    {isOnSale ? (
                      <div className="space-y-1">
                        <p className="text-gray-400 line-through">
                          ${product.price.toFixed(2)}
                        </p>
                        <p className="font-bold text-green-600">
                          ${product.discountedPrice.toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <p className="font-semibold text-gray-900">
                        ${product.price.toFixed(2)}
                      </p>
                    )}
                  </div>

                  {/* Brand and Stock */}
                  <div className="mt-3 flex justify-between capitalize text-gray-500">
                    <span>{product.brand}</span>
                    <span>Stock: {product.stock}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Users Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-700">Recent Users</h2>
            <NavLink
              to="users"
              className="text-sm font-medium text-gray-500 hover:text-gray-800 hover:underline"
            >
              Show All Users
            </NavLink>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {state.recentUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white shadow-md border border-gray-200  rounded-xl p-4 flex flex-col items-center text-center"
              >
                <div className="bg-blue-500 p-3 rounded-full">
                  <UserIcon className="w-12 h-12 text-white" />
                </div>
                <p className="mt-2 font-semibold text-gray-800">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default AdminDashboardPage;
