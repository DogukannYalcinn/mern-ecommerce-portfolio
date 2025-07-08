import { OrderRulesType } from "@types";
import { useEffect, useState } from "react";
import adminApi from "@api/adminApi.ts";
import generalApi from "@api/generalApi.ts";
import CreditCartIcon from "@icons/CreditCartIcon.tsx";
import TruckIcon from "@icons/TruckIcon.tsx";
import useUIContext from "@hooks/useUIContext.ts";

type StateType = {
  settings: OrderRulesType;
  isLoading: boolean;
};

const AdminOrderRulesPage = () => {
  const [state, setState] = useState<StateType>({
    settings: {
      paymentMethods: [],
      deliveryMethods: [],
      giftWrapFee: 0,
      taxRate: 0,
      freeShippingThreshold: 0,
    },
    isLoading: false,
  });
  const { showToast } = useUIContext();

  const handleMethodChange = (
    type: "paymentMethods" | "deliveryMethods",
    index: number,
    field: "label" | "fee" | "description",
    value: string | number,
  ) => {
    setState((prev) => {
      const updated = { ...prev.settings };
      updated[type] = [...updated[type]];
      updated[type][index] = { ...updated[type][index], [field]: value };
      return { ...prev, settings: updated };
    });
  };

  const handleFieldChange = (
    field: keyof OrderRulesType,
    value: string | number,
  ) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        const settings = await generalApi.fetchOrderRules();
        setState((prev) => ({ ...prev, settings }));
      } catch (e) {
        console.error(e);
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await adminApi.editOrderRules(state.settings);
      showToast("success", "order rules updated successfully.");
    } catch (e) {
      showToast("error", "failed to update order rules.");
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto py-8 px-4">
      <h1 className="text-3xl text-gray-700 font-bold mb-8 text-center tracking-tight">
        Order Rules & Fees
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* PAYMENT & DELIVERY METHODS yan yana */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* PAYMENT METHODS */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <CreditCartIcon className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl text-gray-600 font-bold">
                Payment Methods
              </h2>
            </div>
            <div className="flex flex-col gap-6">
              {state.settings.paymentMethods.map((method, index) => (
                <div
                  key={method.identifier}
                  className="p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-sm flex flex-col gap-4"
                >
                  <div>
                    <label className="font-semibold mb-1 text-gray-700">
                      Label
                    </label>
                    <input
                      type="text"
                      className="block w-full border-2 border-blue-300 focus:border-blue-600 rounded-lg px-3 py-2 outline-none transition"
                      value={method.label}
                      onChange={(e) =>
                        handleMethodChange(
                          "paymentMethods",
                          index,
                          "label",
                          e.target.value,
                        )
                      }
                      placeholder="Label"
                    />
                  </div>
                  <div>
                    <label className="font-semibold mb-1 text-gray-700">
                      Identifier
                    </label>
                    <input
                      type="text"
                      className="block w-full border-2 border-blue-100 bg-gray-50 rounded-lg px-3 py-2 outline-none"
                      value={method.identifier}
                      readOnly
                      disabled
                      style={{ opacity: 0.7, cursor: "not-allowed" }}
                      title="Identifier cannot be changed"
                    />
                  </div>
                  <div>
                    <label className="font-semibold mb-1 text-gray-700">
                      Fee
                    </label>
                    <input
                      type="number"
                      className="block w-full border-2 border-blue-300 focus:border-blue-600 rounded-lg px-3 py-2 outline-none transition"
                      value={method.fee}
                      placeholder="Fee"
                      onChange={(e) =>
                        handleMethodChange(
                          "paymentMethods",
                          index,
                          "fee",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="font-semibold mb-1 text-gray-700">
                      Description
                    </label>
                    <input
                      type="text"
                      className="block w-full border-2 border-blue-300 focus:border-blue-600 rounded-lg px-3 py-2 outline-none transition"
                      value={method.description}
                      onChange={(e) =>
                        handleMethodChange(
                          "paymentMethods",
                          index,
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="Description"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* DELIVERY METHODS */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <TruckIcon className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl text-gray-600 font-bold">
                Delivery Methods
              </h2>
            </div>
            <div className="flex flex-col gap-6">
              {state.settings.deliveryMethods.map((method, index) => (
                <div
                  key={method.identifier}
                  className="p-6 rounded-2xl bg-white border-2 border-green-200 shadow-sm flex flex-col gap-4"
                >
                  <div>
                    <label className="font-semibold mb-1 text-gray-700">
                      Label
                    </label>
                    <input
                      type="text"
                      className="block w-full border-2 border-green-300 focus:border-green-600 rounded-lg px-3 py-2 outline-none transition"
                      value={method.label}
                      onChange={(e) =>
                        handleMethodChange(
                          "deliveryMethods",
                          index,
                          "label",
                          e.target.value,
                        )
                      }
                      placeholder="Label"
                    />
                  </div>
                  <div>
                    <label className="font-semibold mb-1 text-gray-700">
                      Identifier
                    </label>
                    <input
                      type="text"
                      className="block w-full border-2 border-green-100 bg-gray-50 rounded-lg px-3 py-2 outline-none"
                      value={method.identifier}
                      readOnly
                      disabled
                      style={{ opacity: 0.7, cursor: "not-allowed" }}
                      title="Identifier cannot be changed"
                    />
                  </div>
                  <div>
                    <label className="font-semibold mb-1 text-gray-700">
                      Fee
                    </label>
                    <input
                      type="number"
                      className="block w-full border-2 border-green-300 focus:border-green-600 rounded-lg px-3 py-2 outline-none transition"
                      value={method.fee}
                      onChange={(e) =>
                        handleMethodChange(
                          "deliveryMethods",
                          index,
                          "fee",
                          e.target.value,
                        )
                      }
                      placeholder="Fee"
                    />
                  </div>
                  <div>
                    <label className="font-semibold mb-1 text-gray-700">
                      Description
                    </label>
                    <input
                      type="text"
                      className="block w-full border-2 border-green-300 focus:border-green-600 rounded-lg px-3 py-2 outline-none transition"
                      value={method.description}
                      onChange={(e) =>
                        handleMethodChange(
                          "deliveryMethods",
                          index,
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="Description"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* OTHER FEES */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col">
            <label className="block mb-1 font-medium text-gray-700">
              Gift Wrap Fee
            </label>
            <input
              type="number"
              className="input input-bordered text-base rounded-lg px-3 py-2 border-2 border-gray-300 focus:border-blue-600 transition"
              value={state.settings.giftWrapFee ?? ""}
              onChange={(e) => handleFieldChange("giftWrapFee", e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-1 font-medium text-gray-700">
              Tax Rate (%)
            </label>
            <input
              type="number"
              className="input input-bordered text-base rounded-lg px-3 py-2 border-2 border-gray-300 focus:border-blue-600 transition"
              value={state.settings.taxRate ?? ""}
              onChange={(e) => handleFieldChange("taxRate", e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-1 font-medium text-gray-700">
              Free Shipping Threshold
            </label>
            <input
              type="number"
              className="input input-bordered text-base rounded-lg px-3 py-2 border-2 border-gray-300 focus:border-blue-600 transition"
              value={state.settings.freeShippingThreshold ?? ""}
              onChange={(e) =>
                handleFieldChange("freeShippingThreshold", e.target.value)
              }
            />
          </div>
        </section>

        <div className="text-center pt-12">
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-blue-700 text-white text-lg font-semibold shadow-lg hover:bg-blue-800 transition-transform hover:scale-105"
            disabled={state.isLoading}
          >
            {state.isLoading ? (
              <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin mx-auto" />
            ) : (
              "Save Settings"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminOrderRulesPage;
