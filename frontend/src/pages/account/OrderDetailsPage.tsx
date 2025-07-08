import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { OrderType } from "@types";
import useUIContext from "@hooks/useUIContext.ts";
import orderApi from "@api/orderApi.ts";
import useAuthContext from "@hooks/useAuthContext.ts";

type StateType = {
  order: OrderType | null;
  isLoading: boolean;
};

const OrderDetailsPage = () => {
  const currentUser = useAuthContext().state.currentUser;
  if (!currentUser) return null;

  const [state, setState] = useState<StateType>({
    order: null,
    isLoading: false,
  });
  const { id } = useParams();
  const { showToast } = useUIContext();

  useEffect(() => {
    if (!id) return;
    const fetchUserOrder = async () => {
      setState((prevState) => ({ ...prevState, isLoading: true }));
      try {
        const order = await orderApi.fetchUserOrderById(id);
        setState((prevState) => ({
          ...prevState,
          order: order,
        }));
      } catch (e) {
        showToast("error", "product not found! you are redirecting...");
      } finally {
        setState((prevState) => ({ ...prevState, isLoading: false }));
      }
    };
    if (currentUser.role === "user") {
      fetchUserOrder();
    }
  }, [currentUser, id]);

  if (!state.order) return null;

  return (
    <main className="min-h-screen max-w-7xl mx-auto mt-10 px-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Order Summary</h2>
        <p className="text-gray-500">
          <span className="font-medium text-gray-600">Order ID:</span>{" "}
          {state.order._id}
        </p>
        <p className="text-gray-500 capitalize">
          <span className="font-medium text-gray-600">Status:</span>{" "}
          {state.order.currentStatus}
        </p>
        <p className="text-gray-500">
          <span className="font-medium text-gray-600">Created At:</span>{" "}
          {new Date(state.order.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Status History */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          Status History
        </h3>
        <ul className="space-y-1 text-slate-600 pl-4 list-disc">
          {state.order.statusHistory.map((entry) => (
            <li key={entry._id}>
              <span className="capitalize">
                {entry.status.replace(/_/g, " ")}
              </span>{" "}
              – {new Date(entry.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      {/* Product List */}
      <div className="mb-6 border-t pt-4 space-y-4 max-h-72 overflow-y-auto">
        {state.order.cart.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-white p-2 rounded shadow-sm border border-gray-100"
          >
            <img
              src={`http://localhost:4000/images/${item.product.images[0].url}`}
              alt={item.product.title}
              className="w-16 h-16 rounded object-cover border"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 capitalize">
                {item.product.title}
              </h4>
              <p className="text-sm text-gray-600">
                {item.quantity} x ${item.purchasePrice.toFixed(2)}
                {item.purchaseDiscountRatio ? (
                  <span className="text-red-500 ml-2">
                    (-{item.purchaseDiscountRatio}%)
                  </span>
                ) : null}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm border space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Payment Fee:</span>
          <span>${state.order.paymentMethodFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery Fee:</span>
          <span>${state.order.deliveryMethodFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Gift Wrap Fee:</span>
          <span>${state.order.giftWrapFee.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 flex justify-between text-lg font-semibold text-gray-800">
          <span>Total:</span>
          <span>${state.order.total.toFixed(2)}</span>
        </div>
      </div>
    </main>
  );
};
export default OrderDetailsPage;
