import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import HeartIcon from "@icons/HeartIcon.tsx";
import RightArrowIcon from "@icons/RightArrowIcon.tsx";

const OrderPlacementPage = () => {
  const newOrder = useLocation().state;

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-2xl p-6 md:p-10 text-center">
        <div className="flex justify-center">
          <HeartIcon className="w-16 h-16 text-red-500" />
        </div>

        <h2 className="text-xl md:text-3xl font-semibold text-gray-800 mt-4">
          Your Order Has Been Placed!
        </h2>

        <p className="text-gray-500 mt-2  px-2">
          Thank you! Your order has been received. You will be notified of any
          status updates.
        </p>

        <div className="mt-6 space-y-4 text-gray-600">
          <p>
            <span className="font-semibold">Payment Method:</span>{" "}
            {newOrder.paymentMethod}
          </p>
          <p>
            <span className="font-semibold">Delivery Method:</span>{" "}
            {newOrder.deliveryMethod}
          </p>
          <p>
            <span className="font-semibold">Total Amount:</span> $
            {newOrder.total.toFixed(2)}
          </p>
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-center gap-3">
          <NavLink
            to="/account/orders"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
          >
            View Orders
          </NavLink>

          <NavLink
            to="/"
            className="flex items-center text-sm md:text-base font-medium text-blue-600"
          >
            Continue Shopping
            <RightArrowIcon className="w-8 h-8 text-blue-500" />
          </NavLink>
        </div>
      </div>
    </main>
  );
};
export default OrderPlacementPage;
