import useAuthContext from "@hooks/useAuthContext.ts";
import OptionCart from "@pages/cart/checkout/OptionCart.tsx";
import useCartContext from "@hooks/useCartContext.ts";
import { UIMethodOption } from "@types";
import CloseIcon from "@icons/CloseIcon.tsx";
import { CheckoutValidationErrorType } from "@pages/cart/checkout/CheckoutPage.tsx";

type Props = {
  selectedPaymentMethod: string | null;
  selectedDeliveryMethod: string | null;
  selectedShippingAddress: string | null;
  handleSelectOption: (
    type: "paymentMethod" | "deliveryMethod" | "shippingAddress" | "giftBox",
    identifier: string | null,
  ) => void;
  errors: CheckoutValidationErrorType | null;
};

const ShippingAndPaymentSection = ({
  selectedPaymentMethod,
  selectedDeliveryMethod,
  selectedShippingAddress,
  handleSelectOption,
  errors,
}: Props) => {
  const { orderRules } = useCartContext().state;
  const { cartSummary } = useCartContext();
  const currentUser = useAuthContext().state.currentUser;

  if (!currentUser || currentUser.role !== "user") return null;

  const userHasCreditCard = currentUser.paymentMethods.find(
    (pm) => pm.paymentMethod === "credit-card",
  );
  const userHasPaypal = currentUser.paymentMethods.find(
    (pm) => pm.paymentMethod === "paypal",
  );

  const mergedPaymentMethods: UIMethodOption[] = orderRules.paymentMethods.map(
    (pm) => {
      if (pm.identifier === "credit-card") {
        return {
          ...pm,
          isAddMode: !userHasCreditCard,
          addLink: "/account/profile",
        };
      }
      if (pm.identifier === "paypal") {
        return {
          ...pm,
          isAddMode: !userHasPaypal,
          addLink: "/account/profile",
        };
      }
      return pm;
    },
  );

  const filteredDeliveryMethods = cartSummary.freeShippingQualified
    ? orderRules.deliveryMethods
    : orderRules.deliveryMethods.filter(
        (m) => m.identifier !== "free-delivery",
      );

  return (
    <section className="space-y-8">
      <div className="space-y-8">
        {errors && errors.shippingAddress && (
          <p className="flex items-center text-red-500 text-sm font-medium transition-opacity duration-300 capitalize">
            <CloseIcon className="w-6 h-6" /> {errors.shippingAddress}
          </p>
        )}
        <h3 className="text-xl font-semibold text-gray-900">
          Shipping Address
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <OptionCart
            label="Home Address"
            selected={selectedShippingAddress === "home"}
            onSelect={() => handleSelectOption("shippingAddress", "home")}
            description={currentUser.homeAddress.address}
          />

          <OptionCart
            label="Delivery Address"
            selected={selectedShippingAddress === "delivery"}
            onSelect={() => handleSelectOption("shippingAddress", "delivery")}
            description={currentUser.deliveryAddress.address}
          />
        </div>
      </div>

      <div className="space-y-8">
        {errors && errors.paymentMethod && (
          <p className="flex items-center text-red-500 text-sm font-medium transition-opacity duration-300 capitalize">
            <CloseIcon className="w-6 h-6" /> {errors.paymentMethod}
          </p>
        )}
        <h3 className="text-xl font-semibold text-gray-900">Payment Methods</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 ">
          {mergedPaymentMethods.map((pm) => (
            <OptionCart
              key={pm.identifier}
              label={pm.label}
              description={pm.description}
              fee={pm.fee}
              selected={selectedPaymentMethod === pm.identifier}
              onSelect={() =>
                handleSelectOption("paymentMethod", pm.identifier)
              }
              isAddMode={pm.isAddMode}
              addLink={pm.addLink}
            />
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {errors && errors.deliveryMethod && (
          <p className="flex items-center text-red-500 text-sm font-medium transition-opacity duration-300 capitalize">
            <CloseIcon className="w-6 h-6" /> {errors.deliveryMethod}
          </p>
        )}
        <h3 className="text-xl font-semibold text-gray-900">
          Delivery Methods
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 ">
          {filteredDeliveryMethods.map((dm) => (
            <OptionCart
              key={dm.identifier}
              label={dm.label}
              description={dm.description}
              fee={dm.fee}
              selected={selectedDeliveryMethod === dm.identifier}
              onSelect={() =>
                handleSelectOption("deliveryMethod", dm.identifier)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShippingAndPaymentSection;
