import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@icons/SearchIcon.tsx";
import AdminTable from "@pages/admin/AdminTable.tsx";
import orderApi from "@api/orderApi.ts";
import { OrderType } from "@types";
import { orderStatusTypes } from "@constants/orderStatus.tsx";

type State = {
  isModalOpen: boolean;
  orders: OrderType[];
  page: number;
  totalCount: number;
  filter: string;
  limit: number;
  isLoading: boolean;
};

const AdminOrdersPage = () => {
  const [state, setState] = useState<State>({
    isModalOpen: false,
    orders: [],
    page: 1,
    totalCount: 0,
    filter: "",
    limit: 10,
    isLoading: false,
  });

  const navigate = useNavigate();
  const handlePageChange = (pageNumber: number) => {
    setState((prevState) => ({
      ...prevState,
      page: prevState.page + pageNumber,
    }));
  };

  const handleFilterChange = (filter: string) =>
    setState((prevState) => ({ ...prevState, filter, page: 1 }));

  useEffect(() => {
    (async () => {
      try {
        const { orders, totalCount } = await orderApi.fetchAllOrders({
          page: state.page,
          limit: state.limit,
          filter: state.filter,
        });
        setState((prevState) => ({
          ...prevState,
          orders: orders,
          totalCount: totalCount,
        }));
      } catch (e) {
        console.log(e);
      }
    })();
  }, [state.page, state.limit, state.filter]);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="w-full max-w-7xl mx-auto">
        <AdminTable
          title="Order Management"
          pagination={{
            page: state.page,
            limit: state.limit,
            totalCount: state.totalCount,
            onPageChange: handlePageChange,
          }}
          headers={[
            "Order ID",
            "User",
            "Total",
            "Delivery",
            "Payment",
            "Status",
            "Actions",
          ]}
          filter={{
            enabled: true,
            value: state.filter,
            options: [
              { value: "", label: "All" },
              { value: "pending", label: "Pending" },
              { value: "cancelled", label: "Cancelled" },
              { value: "in_transit", label: "In Transit" },
              { value: "completed", label: "Completed" },
              { value: "refund_request", label: "Refund Request" },
            ],
            onChange: handleFilterChange,
          }}
        >
          {state.orders.length === 0 && (
            <tr>
              <td colSpan={10}>
                <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                  <SearchIcon className="w-12 h-12 mb-4 text-gray-400" />
                  <p className="text-lg font-semibold">No Products Found</p>
                  <p className="text-sm mt-2 text-gray-400">
                    Try adjusting your search or filters.
                  </p>
                </div>
              </td>
            </tr>
          )}

          {state.orders.map((order) => {
            const statusObj = orderStatusTypes.find(
              (status) => status.identifier === order.currentStatus,
            );
            return (
              <tr
                key={order._id}
                className={`transition-colors duration-200 hover:bg-gray-50 ${statusObj?.colorClasses} cursor-pointer`}
                onClick={() => navigate(`/admin/orders/${order._id}`)}
              >
                {/* Order ID */}
                <td className="px-6 py-4 font-medium text-gray-900">
                  #{order._id.slice(-6)}
                </td>

                {/* User */}
                <td className="px-6 py-4 font-medium text-gray-700">
                  {order.user?.email || "Unknown"}
                </td>

                {/* Total */}
                <td className="px-6 py-4 text-gray-800 font-semibold">
                  ${order.total.toFixed(2)}
                </td>

                {/* Delivery */}
                <td className="px-6 py-4 text-gray-600">
                  <span className="font-medium capitalize">
                    {order.deliveryMethod}
                  </span>
                </td>

                {/* Payment */}
                <td className="px-6 py-4 text-gray-600">
                  <span className="font-medium capitalize">
                    {order.paymentMethod}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {/* ICON */}
                    <span className="text-lg">{statusObj?.icon}</span>

                    {/* BADGE */}
                    <span className="px-2 py-1 text-sm font-semibold capitalize">
                      {order.currentStatus.replace(/_/g, " ")}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/orders/${order._id}`);
                    }}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    <span className="flex gap-1">
                      <SearchIcon className="w-5 h-5" />
                      View
                    </span>
                  </button>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      </div>
    </main>
  );
};

export default AdminOrdersPage;
