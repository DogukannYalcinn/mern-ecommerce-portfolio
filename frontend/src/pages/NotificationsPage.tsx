import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import useAuthContext from "@hooks/useAuthContext.ts";
import EyeIcon from "@icons/EyeIcon.tsx";
import HornIcon from "@icons/HornIcon.tsx";
import { formatDate } from "@utils/formatDate.ts";
import useUIContext from "@hooks/useUIContext.ts";
import { orderStatusTypes } from "@constants/orderStatus.tsx";
import userApi from "@api/userApi.ts";

const notificationToStatusMap: Record<string, string> = {
  order_pending: "pending",
  order_placed: "placed",
  order_in_transit: "in_transit",
  order_completed: "completed",
  order_cancelled: "cancelled",
  order_refund_request: "refund_request",
};

type Notification = {
  _id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  type:
    | "order_placed"
    | "order_cancelled"
    | "order_in_transit"
    | "order_completed"
    | "order_refund_issued"
    | "promo";
};

type State = {
  notifications: Notification[];
  page: number;
  limit: number;
  totalCount: number;
  isLoading: boolean;
};
const NotificationsPage = () => {
  const currentUser = useAuthContext().state.currentUser;
  const isAuth = currentUser && currentUser.role === "user";
  const [state, setState] = useState<State>({
    totalCount: 0,
    notifications: [],
    page: 1,
    limit: 15,
    isLoading: false,
  });
  const { showToast } = useUIContext();

  const handleMarkAsRead = async () => {
    if (!isAuth) return;

    try {
      const unreadIds = state.notifications
        .filter((n) => !n.isRead && n.type !== "promo")
        .map((n) => n._id);

      if (unreadIds.length === 0) return;

      await userApi.markNotificationsAsRead(unreadIds);
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) =>
          unreadIds.includes(n._id) ? { ...n, isRead: true } : n,
        ),
      }));
      showToast("success", `${unreadIds.length} notifications marked as read`);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const fetchUserNotifications = async () => {
    setState((prevState) => ({ ...prevState, isLoading: true }));
    try {
      const { notifications, totalCount } = await userApi.getUserNotifications({
        page: state.page,
        limit: state.limit,
        userId: isAuth ? currentUser._id : undefined,
      });
      setState((prevState) => ({
        ...prevState,
        notifications:
          state.page === 1
            ? notifications
            : [...prevState.notifications, ...notifications],
        totalCount: totalCount,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setState((prevState) => ({ ...prevState, isLoading: false }));
    }
  };

  const loadMore = () =>
    setState((prevState) => ({ ...prevState, page: prevState.page + 1 }));
  const hasLoadMore = state.page * state.limit < state.totalCount;

  useEffect(() => {
    fetchUserNotifications();
  }, [currentUser?._id, state.page, state.limit]);

  return (
    <main className="max-w-5xl mx-auto flex flex-col">
      <section className="flex justify-between items-center p-4 border-b">
        <div className="flex gap-1 items-center">
          <h2 className="text-lg md:text-2xl font-semibold text-gray-800">
            Notifications
          </h2>
          <HornIcon className="w-6 h-6 text-blue-500" aria-hidden="true" />
        </div>
        {currentUser && (
          <button
            onClick={handleMarkAsRead}
            className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800 hover:scale-105 transition-all duration-500 "
          >
            Set All As Read
            <EyeIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2">
        {state.notifications.map((notification) => {
          const isRead = notification.type !== "promo" && notification.isRead;

          const statusKey = notificationToStatusMap[notification.type];
          const statusConfig = orderStatusTypes.find(
            (status) => status.identifier === statusKey,
          );

          const icon = statusConfig?.icon || (
            <HornIcon className="w-4 h-4 text-purple-700" />
          );
          const label = statusConfig?.label || "Promotion";
          const colorClasses =
            statusConfig?.colorClasses ||
            "bg-purple-50 border-l-4 border-purple-400 text-purple-700";

          return (
            <div
              key={notification._id}
              className={`p-4 m-2 rounded-lg border ${colorClasses} ${
                isRead ? "opacity-50" : ""
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                {/* Left Side: Icon + Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-sm font-semibold">{label}</span>
                  </div>
                  <p className="text-sm text-gray-800">
                    {notification.message}
                  </p>
                  {notification.link && (
                    <NavLink
                      to={notification.link}
                      className="text-sm font-medium text-blue-700 hover:underline inline-block"
                    >
                      Go to details
                    </NavLink>
                  )}
                </div>

                {/* Right Side: CreatedAt */}
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-500">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Load More Button */}
      {hasLoadMore && (
        <div className=" p-3 border-t text-center">
          <button
            className="w-1/4 py-4 bg-blue-500 hover:bg-blue-600 font-medium  rounded-lg text-white transition-all"
            onClick={loadMore}
          >
            {state.isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </main>
  );
};
export default NotificationsPage;
