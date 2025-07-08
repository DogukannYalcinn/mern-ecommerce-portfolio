import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import useCartContext from "@hooks/useCartContext.ts";
import { validateOrder } from "@utils/formValidations.ts";
import useUIContext from "@hooks/useUIContext.ts";
import CheckBadgeIcon from "@icons/CheckBadgeIcon.tsx";
import Spinner from "@components/ui/Spinner.tsx";
import orderApi from "@api/orderApi.ts";
import useAuthContext from "@hooks/useAuthContext.ts";
import ShippingAndPaymentSection from "@pages/cart/checkout/ShippingAndPaymentSection.tsx";
import PersonalDetailsSection from "@pages/cart/checkout/PersonalDetailsSection.tsx";
import OrderSummarySection from "@pages/cart/checkout/OrderSummarySection.tsx";

export type CheckoutValidationErrorType = {
  paymentMethod: string;
  deliveryMethod: string;
  shippingAddress: string;
  cart: string;
};

type State = {
  paymentMethod: string | null;
  deliveryMethod: string | null;
  isGiftBox: boolean;
  shippingAddress: "home" | "delivery" | null;
  validationErrors: CheckoutValidationErrorType | null;
  isLoading: boolean;
};

const CheckoutPage = () => {
  const currentUser = useAuthContext().state.currentUser;
  if (!currentUser || currentUser.role !== "user") return null;

  const { cartSummary, state: cartState, clearCart } = useCartContext();
  const { orderRules } = useCartContext().state;
  const { showToast } = useUIContext();

  const [state, setState] = useState<State>({
    paymentMethod: null,
    deliveryMethod: null,
    isGiftBox: false,
    shippingAddress: null,
    validationErrors: null,
    isLoading: false,
  });

  const navigate = useNavigate();

  const finalSummary = useMemo(() => {
    const selectedDeliveryMethod = orderRules.deliveryMethods.find(
      (method) => method.identifier === state.deliveryMethod,
    );
    const shippingFee = selectedDeliveryMethod ? selectedDeliveryMethod.fee : 0;

    const selectedPaymentMethod = orderRules.paymentMethods.find(
      (method) => method.identifier === state.paymentMethod,
    );
    const paymentFee = selectedPaymentMethod ? selectedPaymentMethod.fee : 0;

    const giftWrapFee = state.isGiftBox ? orderRules.giftWrapFee : 0;

    const taxAmountRaw =
      (cartSummary.subtotal + shippingFee + paymentFee + giftWrapFee) *
      cartState.orderRules.taxRate;

    const grandTotalRaw =
      cartSummary.subtotal +
      shippingFee +
      paymentFee +
      giftWrapFee +
      taxAmountRaw;

    const taxAmount = parseFloat(taxAmountRaw.toFixed(2));
    const grandTotal = parseFloat(grandTotalRaw.toFixed(2));

    return {
      shippingFee: parseFloat(shippingFee.toFixed(2)),
      paymentFee: parseFloat(paymentFee.toFixed(2)),
      taxAmount,
      grandTotal,
    };
  }, [
    cartSummary.subtotal,
    cartState.orderRules.taxRate,
    state.isGiftBox,
    state.deliveryMethod,
    state.paymentMethod,
  ]);

  const handleSelectOption = (
    type: "paymentMethod" | "deliveryMethod" | "shippingAddress" | "giftBox",
    identifier: string | null,
  ) => {
    if (type === "giftBox" && identifier === null) {
      setState((prevState: State) => ({
        ...prevState,
        isGiftBox: !prevState.isGiftBox,
      }));
      return;
    }

    setState((prevState: State) => ({
      ...prevState,
      validationErrors: null,
      [type]: identifier,
    }));
  };

  const handlePostOrder = async () => {
    const validationErrors = validateOrder({
      paymentMethod: state.paymentMethod,
      deliveryMethod: state.deliveryMethod,
      cart: cartState.list,
      shippingAddress: state.shippingAddress,
    });

    if (Object.values(validationErrors).some((value) => value !== "")) {
      setState((prevState) => ({
        ...prevState,
        validationErrors: validationErrors,
      }));
      return;
    }

    setState((prevState) => ({ ...prevState, isLoading: true }));
    try {
      const newOrder = await orderApi.createOrder({
        paymentMethod: state.paymentMethod!,
        deliveryMethod: state.deliveryMethod!,
        shippingAddress: state.shippingAddress!,
        total: finalSummary.grandTotal,
        isGiftWrap: state.isGiftBox,
      });
      clearCart();
      navigate("/auth/order-placement", { state: newOrder });
    } catch (error) {
      showToast("error", "order placement failed");
    } finally {
      setState((prevState) => ({ ...prevState, isLoading: false }));
    }
  };

  return (
    <>
      {state.isLoading && <Spinner />}
      <main className="mx-auto max-w-screen-xl px-4 2xl:px-0bg-white py-8 antialiased ">
        <ol className="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-500 ">
          <li className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200  sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
            <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/']">
              <CheckBadgeIcon className="me-2 h-4 w-4 sm:h-5 sm:w-5" />
              Cart
            </span>
          </li>

          <li className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200  sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
            <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/']  sm:after:hidden">
              <CheckBadgeIcon className="me-2 h-4 w-4 sm:h-5 sm:w-5" />
              Checkout
            </span>
          </li>

          <li className="flex shrink-0 items-center">
            <CheckBadgeIcon className="me-2 h-4 w-4 sm:h-5 sm:w-5" />
            Order summary
          </li>
        </ol>

        <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
          <div className="min-w-0 flex-1 space-y-8">
            {/*Personal Details*/}
            <PersonalDetailsSection />

            {/*Shipping And Payment*/}
            <ShippingAndPaymentSection
              selectedPaymentMethod={state.paymentMethod}
              selectedDeliveryMethod={state.deliveryMethod}
              selectedShippingAddress={state.shippingAddress}
              handleSelectOption={handleSelectOption}
              errors={state.validationErrors}
            />
          </div>

          {/*Final Order Summary*/}
          <OrderSummarySection
            finalSummary={finalSummary}
            handleSelectOption={handleSelectOption}
            isGiftBox={state.isGiftBox}
            onPostOrder={handlePostOrder}
          />
        </div>
      </main>
    </>
  );
};

export default CheckoutPage;
