import CloseIcon from "@icons/CloseIcon.tsx";
import useAuthContext from "@hooks/useAuthContext.ts";
import CirclePlusIcon from "@icons/CirclePlusIcon.tsx";
import { NavLink } from "react-router-dom";

interface OrderSelectionCardProps {
  title: string;
  options: {
    identifier: string;
    label: string;
    description: string;
    fee: number;
  }[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  error?: string;
}

const OrderSelectionCard: React.FC<OrderSelectionCardProps> = ({
  title,
  options,
  selectedValue,
  onSelect,
  error,
}) => {
  const currentUser = useAuthContext().state.currentUser;

  if (!currentUser || currentUser.role !== "user") return null;

  return (
    <div
      className={`p-2 space-y-4 rounded-md transition-all duration-1000 ${error ? "border border-red-500" : ""}`}
    >
      {error && (
        <p className="flex items-center text-red-500 text-sm font-medium transition-opacity duration-300 capitalize">
          <CloseIcon className="w-6 h-6" /> {error}
        </p>
      )}

      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {options.map((option) => {
          const isCustomPayment = ["credit-card", "paypal"].includes(
            option.identifier,
          );
          const userHasThisMethod = currentUser.paymentMethods?.some(
            (pm) => pm.paymentMethod === option.identifier,
          );

          if (isCustomPayment && !userHasThisMethod) {
            return (
              <NavLink to="/profile">
                <div
                  key={option.identifier}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4 cursor-pointer"
                  onClick={() => onSelect(option.identifier)}
                >
                  <CirclePlusIcon className="w-6 h-6 text-blue-500 " />
                  <span className="text-lg tracking-wide hover:underline">
                    Add {option.label}
                  </span>
                </div>
              </NavLink>
            );
          }

          return (
            <div
              key={option.identifier}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4 cursor-pointer"
              onClick={() => onSelect(option.identifier)}
            >
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    type="radio"
                    id={option.identifier}
                    name={title}
                    className="h-4 w-4 border-gray-300 bg-white text-blue-600 cursor-pointer"
                    checked={selectedValue === option.identifier}
                    readOnly
                  />
                </div>

                <div className="ms-4 text-sm">
                  <label
                    htmlFor={option.identifier}
                    className="font-medium leading-none text-gray-900 cursor-pointer"
                  >
                    {option.label}{" "}
                    {option.fee > 0 ? (
                      <span className="text-xs text-blue-500">
                        ({option.fee}$)
                      </span>
                    ) : null}
                  </label>
                  <p className="mt-1 text-xs font-normal text-gray-500">
                    {option.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderSelectionCard;
