import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { OrderType } from "@types";
import useUIContext from "@hooks/useUIContext.ts";
import Spinner from "@components/ui/Spinner.tsx";
import NoResults from "@components/ui/NoResults.tsx";
import { orderStatusTypes } from "@constants/orderStatus.tsx";
import orderApi from "@api/orderApi.ts";
import CaretLeftIcon from "@icons/CaretLeftIcon.tsx";

type StateType = {
  order: OrderType | null;
  isLoading: boolean;
};

const AdminOrderDetailsPage = () => {
  const { showToast } = useUIContext();
  const { id } = useParams();
  const [state, setState] = useState<StateType>({
    order: null,
    isLoading: false,
  });

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const order = await orderApi.fetchAdminOrderById(id);
        setState((prevState) => ({ ...prevState, order }));
      } catch (error) {
        showToast("error", "failed to fetch order");
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchOrder();
  }, [id]);

  const getNextStatus = (status: string | null) => {
    switch (status) {
      case "pending":
        return "placed";

      case "placed":
        return "in_transit";

      case "refund_request":
        return "cancelled";

      case "in_transit":
        return "completed";

      default:
        return null;
    }
  };

  const nextStatus = state.order
    ? getNextStatus(state.order.currentStatus)
    : null;

  const currentOrderStatusObject = orderStatusTypes.find(
    (item) => item.identifier === state.order?.currentStatus,
  );

  const nextOrderStatusObject = orderStatusTypes.find(
    (item) => item.identifier === nextStatus,
  );

  const handleStatusChange = async () => {
    if (!state.order || !nextStatus) return;
    try {
      await orderApi.updateOrderStatus(state.order._id, nextStatus);
      setState((prev) =>
        prev.order
          ? { ...prev, order: { ...prev.order, currentStatus: nextStatus } }
          : prev,
      );
      showToast(
        "success",
        `Status changed to ${nextStatus.replace(/_/g, " ")}`,
      );
    } catch (error) {
      showToast("error", "Failed to update status");
    }
  };

  return (
    <>
      {state.isLoading && <Spinner />}
      <section className="min-h-screen bg-gray-100 px-6 py-12">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex gap-4">
            <NavLink
              to="/admin/orders"
              className="p-2 bg-blue-300 backdrop-blur-md hover:bg-blue-500 rounded-full shadow-md transition duration-300 hover:scale-105 active:scale-95"
            >
              <CaretLeftIcon className="w-6 h-6 text-white" />
            </NavLink>
            <h1 className="text-2xl font-bold text-gray-500">Back to Orders</h1>
          </div>

          {state.order ? (
            <div className="bg-white shadow rounded-2xl p-8 space-y-10">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  Order #{state.order._id}
                </h1>
                <span className="text-sm text-gray-500">
                  {new Date(state.order.createdAt).toLocaleString()}
                </span>
              </div>
              {/*Next Status Button*/}
              <div className="flex justify-end">
                {nextStatus && (
                  <button
                    onClick={handleStatusChange}
                    className={`px-5 py-2 rounded-lg font-semibold ${nextOrderStatusObject?.colorClasses} hover:brightness-90 hover:scale-105 transition capitalize flex items-center gap-2`}
                  >
                    {nextOrderStatusObject?.icon}
                    Mark as {nextOrderStatusObject?.label}
                  </button>
                )}
                {!nextStatus && (
                  <div className="text-sm text-gray-400 font-medium">
                    This order is finalized as{" "}
                    <strong>{currentOrderStatusObject?.label}</strong>.
                  </div>
                )}
              </div>
              {/* Customer & Summary */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Customer
                  </h2>
                  <p className="text-gray-900 font-medium">
                    {state.order.user.firstName} {state.order.user.lastName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {state.order.user.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Order Summary
                  </h2>
                  <p className="text-gray-800 font-medium">
                    Total: ${state.order.total.toFixed(2)}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Payment: {state.order.paymentMethod} /{" "}
                    {state.order.paymentStatus}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Delivery: {state.order.deliveryMethod} ($
                    {state.order.deliveryMethodFee})
                  </p>
                  <p className="text-gray-600 text-sm">
                    Gift Wrap: ${state.order.giftWrapFee}
                  </p>
                </div>
              </div>
              {/* Current Status */}
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-700">
                  Current Status
                </h2>
                <div className="flex items-center gap-3">
                  <span
                    className={`flex items-center gap-2 text-sm font-semibold capitalize rounded-full px-4 py-1 ${currentOrderStatusObject?.colorClasses}`}
                  >
                    {currentOrderStatusObject?.icon}
                    {currentOrderStatusObject?.label}
                  </span>

                  {state.order.currentStatus === "refund-request" && (
                    <span className="text-red-500 text-sm font-medium ml-2">
                      Reason: {state.order.cancellationReason}
                    </span>
                  )}
                </div>
              </div>
              {/* Status History */}
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  Status History
                </h2>
                <ul className="space-y-1 text-sm text-gray-600">
                  {state.order.statusHistory.map((entry) => (
                    <li key={entry._id}>
                      {entry.status.replace(/_/g, " ")} –{" "}
                      {new Date(entry.timestamp).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
              {/* ProductsPage */}
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Products
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {state.order.cart.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex items-center justify-between p-4 border rounded-xl bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={`${import.meta.env.VITE_BASE_URL}/images/${item.product?.images?.[0]?.url || "no-image.png"}`}
                          alt={item.product?.title || "Deleted Product"}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-gray-800 text-ellipsis">
                            {item.product?.title || "(Deleted Product)"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity} | Price: $
                            {item.purchasePrice}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-900 font-semibold">
                        ${item.purchasePrice * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <NoResults
              title="no order found."
              subtitle="try adjusting your search or filters."
            />
          )}
        </div>
      </section>
    </>
  );
};
export default AdminOrderDetailsPage;
