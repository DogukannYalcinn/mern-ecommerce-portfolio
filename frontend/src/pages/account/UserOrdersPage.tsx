import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Spinner from "@components/ui/Spinner.tsx";
import NoResults from "@components/ui/NoResults.tsx";
import { formatDate } from "@utils/formatDate.ts";
import { OrderType } from "@types";
import { orderStatusTypes } from "@constants/orderStatus.tsx";
import orderApi from "@api/orderApi.ts";
import useAuthContext from "@hooks/useAuthContext.ts";

const orderDateTypes = [
  { identifier: "this-week", label: "This Week" },
  {
    identifier: "this-month",
    label: "This Month",
  },
  { identifier: "last-3-months", label: "Last 3 Months" },
  {
    identifier: "last-6-months",
    label: "Last 6 Months",
  },
  { identifier: "this-year", label: "This Year" },
];

type StateType = {
  orders: OrderType[];
  status: string;
  date: null | Date;
  page: number;
  limit: number;
  totalCount: number;
  isLoading: boolean;
};

const UserOrdersPage = () => {
  const currentUser = useAuthContext().state.currentUser;
  if (!currentUser) return null;

  const [state, setState] = useState<StateType>({
    orders: [],
    status: "",
    date: null,
    page: 1,
    limit: 5,
    totalCount: 0,
    isLoading: false,
  });
  const navigate = useNavigate();

  const handleDurationChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const date = event.target.value;
    const selectedDate = orderDateTypes.find((dt) => dt.identifier);
    if (!selectedDate) return;
    let startDate: Date | null = null;
    const today = new Date();

    switch (date) {
      case "this-week":
        startDate = new Date();
        startDate.setDate(today.getDate() - today.getDay());
        break;
      case "this-month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "last-3-months":
        startDate = new Date();
        startDate.setMonth(today.getMonth() - 3);
        break;
      case "last-6-months":
        startDate = new Date();
        startDate.setMonth(today.getMonth() - 6);
        break;
      case "this-year":
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        startDate = null;
    }
    setState((prevState) => ({ ...prevState, date: startDate, page: 1 }));
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const identifier = event.target.value;
    const selectedStatus = orderStatusTypes.find(
      (ord) => ord.identifier === identifier,
    );
    setState((prevState) => ({
      ...prevState,
      status: selectedStatus ? selectedStatus.identifier : "",
      page: 1,
    }));
  };

  const handleLoadMore = () =>
    setState((prevState) => ({ ...prevState, page: prevState.page + 1 }));

  const hasLoadMore = state.page * state.limit < state.totalCount;

  const handleNavigateRefundRequest = (orderId: string) => {
    const order = state.orders.find((ord) => ord._id === orderId);
    if (!order) return;
    navigate("refund-request", { state: { orderId } });
  };

  useEffect(() => {
    const fetchData = async () => {
      setState((prevState) => ({
        ...prevState,
        isLoading: true,
        error: null,
      }));

      try {
        const { orders, totalCount } = await orderApi.fetchUserOrders(
          state.status,
          state.date,
          state.page,
          state.limit,
        );

        setState((prevState) => ({
          ...prevState,
          orders: state.page === 1 ? orders : [...prevState.orders, ...orders],
          totalCount: totalCount,
        }));
      } catch (error: any) {
        // error management
      } finally {
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      }
    };

    if (currentUser.role === "user") {
      fetchData();
    }
  }, [currentUser, state.status, state.date, state.page, state.limit]);

  return (
    <>
      {state.isLoading && <Spinner />}
      <section className="antialiased pt-10 min-h-screen">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-5xl space-y-10">
            <div className="gap-4 sm:flex sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                My Orders
              </h2>
              <div className="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
                <div>
                  <label
                    htmlFor="order-type"
                    className="sr-only mb-2 block text-sm font-medium text-gray-900"
                  >
                    Select order type
                  </label>
                  <select
                    className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                    onChange={handleStatusChange}
                  >
                    <option value={""}>All Orders</option>
                    {orderStatusTypes.map((status) => (
                      <option key={status.identifier} value={status.identifier}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <span className="inline-block text-gray-500"> From </span>

                <div>
                  <label
                    htmlFor="duration"
                    className="sr-only mb-2 block text-sm font-medium text-gray-900e"
                  >
                    Select duration
                  </label>
                  <select
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    onChange={handleDurationChange}
                  >
                    {orderDateTypes.map((date) => (
                      <option
                        key={date.identifier}
                        value={date.identifier}
                        className="capitalize text-sm"
                      >
                        {date.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flow-root sm:mt-8">
              {state.orders.length === 0 && (
                <NoResults
                  title="no order found."
                  subtitle="try adjusting your search or filters."
                />
              )}

              <div className="divide-y divide-gray-200">
                {state.orders.map((order) => {
                  console.log(order);
                  const statusObj = orderStatusTypes.find(
                    (item) => item.identifier === order.currentStatus,
                  );
                  console.log(statusObj);

                  return (
                    <div
                      key={order._id}
                      className={`flex flex-wrap items-center gap-y-4 py-6 ${state.isLoading ? "opacity-0 pointer-events-none" : null}`}
                    >
                      <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                        <dt className="text-base font-medium text-gray-500 ">
                          Order ID:
                        </dt>
                        <dd className="mt-1.5 text-base font-semibold text-gray-900">
                          <NavLink
                            to={`/${order._id}`}
                            className="hover:underline"
                          >
                            #{order._id.slice(0, 8)}
                          </NavLink>
                        </dd>
                      </dl>

                      <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                        <dt className="text-base font-medium text-gray-500">
                          Date:
                        </dt>
                        <dd className="mt-1.5 text-base font-semibold text-gray-900">
                          {formatDate(order.createdAt)}
                        </dd>
                      </dl>

                      <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                        <dt className="text-base font-medium text-gray-500">
                          Price:
                        </dt>
                        <dd className="mt-1.5 text-base font-semibold text-gray-900 ">
                          ${order.total.toFixed(2)}
                        </dd>
                      </dl>

                      <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                        <dt className="text-base font-medium text-gray-500 ">
                          Status:
                        </dt>

                        <dd
                          className={`inline-flex justify-center  items-center gap-0.5 rounded px-2.5 py-0.5 text-xs font-medium ${statusObj?.colorClasses} `}
                        >
                          <span>{statusObj?.icon}</span>
                          <span className="text-sm capitalize">
                            {statusObj?.label}
                          </span>
                        </dd>
                      </dl>

                      <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
                        {order.currentStatus === "pending" && (
                          <button
                            type="button"
                            className="w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300  lg:w-auto"
                            onClick={() =>
                              handleNavigateRefundRequest(order._id)
                            }
                          >
                            Cancel order
                          </button>
                        )}
                        <NavLink
                          to={`${order._id}`}
                          className="w-full inline-flex justify-center rounded-lg  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 lg:w-auto"
                        >
                          View details
                        </NavLink>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {hasLoadMore && (
              <div className="flex justify-center items-center p-4">
                <button
                  className="px-8 py-2 bg-blue-700 rounded-lg text-white"
                  onClick={handleLoadMore}
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
export default UserOrdersPage;
