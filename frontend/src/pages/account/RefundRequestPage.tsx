import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Spinner from "@components/ui/Spinner.tsx";
import useUIContext from "@hooks/useUIContext.ts";
import orderApi from "@api/orderApi.ts";
import useAuthContext from "@hooks/useAuthContext.ts";

const RefundRequestPage = () => {
  const currentUser = useAuthContext().state.currentUser;
  if (!currentUser) return null;
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    reason: "",
  });
  const { showToast } = useUIContext();
  const navigate = useNavigate();
  const { orderId } = useLocation().state;

  const handleCancelOrder = async () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    try {
      await orderApi.refundRequestOrder(orderId, state.reason);
      showToast("success", "your cancellation request has been submitted.");
      navigate("/");
    } catch (err) {
      showToast("error", "your cancellation request has been failed.");
    } finally {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      {state.isLoading && <Spinner />}
      <div className=" p-6 w-full max-w-lg text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Cancel Order</h1>
        </div>

        <p className="text-gray-600 mb-4">
          <span className="font-semibold">Order ID:</span> {orderId}
        </p>

        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={4}
          placeholder="Please provide a reason for cancellation..."
          value={state.reason}
          onChange={(e) =>
            setState((prev) => ({ ...prev, reason: e.target.value }))
          }
        ></textarea>

        <button
          onClick={handleCancelOrder}
          className="mt-4 w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition disabled:bg-gray-400"
          disabled={state.isLoading}
        >
          {state.isLoading ? "Cancelling..." : "Cancel Order"}
        </button>
        {state.error && <p className="text-red-500 mt-2">{state.error}</p>}
      </div>
    </main>
  );
};
export default RefundRequestPage;
