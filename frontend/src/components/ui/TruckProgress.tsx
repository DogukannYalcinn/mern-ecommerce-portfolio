import TruckIcon from "@icons/TruckIcon.tsx";
import useCartContext from "@hooks/useCartContext.ts";
import CheckBadgeIcon from "@icons/CheckBadgeIcon.tsx";

const TruckProgress = () => {
  const { state, cartSummary } = useCartContext();

  const percentage = Math.min(
    (cartSummary.subtotal / state.orderRules.freeShippingThreshold) * 100,
    100,
  );

  console.log(cartSummary);
  console.log(state.orderRules);
  return (
    <div className="flex flex-col flex-shrink-0 pt-4 overflow-hidden">
      <div className="relative w-full mt-4">
        {/* Truck SVG */}
        <div
          className="absolute bottom-1 transition-all duration-500 z-10"
          style={{
            left: `min(${percentage}%, calc(100% - 16px))`,
            transform: "translateX(-50%)",
          }}
        >
          <TruckIcon className="w-8 h-8 text-red-600" />
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-2.5 bg-gray-300 rounded-full">
          <div
            className="absolute h-full bg-blue-400 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div
        className={`flex gap-1 items-center mt-1 ${cartSummary.freeShippingQualified ? " text-green-500" : " text-gray-600"}`}
      >
        <p>
          {cartSummary.freeShippingQualified
            ? "You qualify for free shipping!"
            : `Only  ${(state.orderRules.freeShippingThreshold - cartSummary.subtotal).toFixed(2)}$ away from free shipping`}
        </p>
        {cartSummary.freeShippingQualified && (
          <CheckBadgeIcon className="h-4 w-4" />
        )}
      </div>
    </div>
  );
};
export default TruckProgress;
