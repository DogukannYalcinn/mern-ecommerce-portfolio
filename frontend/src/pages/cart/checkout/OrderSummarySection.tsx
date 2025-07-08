import GiftBoxIcon from "@icons/GiftBoxIcon.tsx";
import useCartContext from "@hooks/useCartContext.ts";

type Props = {
  handleSelectOption: (
    type: "paymentMethod" | "deliveryMethod" | "shippingAddress" | "giftBox",
    identifier: string | null,
  ) => void;
  isGiftBox: boolean;
  finalSummary: Record<string, number>;
  onPostOrder: () => void;
};

const OrderSummarySection = ({
  handleSelectOption,
  isGiftBox,
  finalSummary,
  onPostOrder,
}: Props) => {
  const { orderRules } = useCartContext().state;
  const { cartSummary } = useCartContext();

  return (
    <section className="space-y-6 mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
      <div className="flex justify-between gap-4 p-4 border border-gray-300 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <GiftBoxIcon className="text-red-500 w-6 h-6" />
          <p className="text-sm text-gray-700">
            Do You Want a Gift Wrap? Only For{" "}
            <span className="font-bold text-blue-600">
              ${orderRules.giftWrapFee.toFixed(2)}
            </span>
          </p>
        </div>
        <button
          onClick={() => handleSelectOption("giftBox", null)}
          className={`text-sm font-medium px-6 py-2 rounded-lg border transition-all duration-300 ${
            isGiftBox
              ? "bg-green-500 text-white border-green-500 hover:bg-green-600 shadow-lg"
              : "bg-white text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-500 hover:text-red-600"
          }`}
        >
          {isGiftBox ? "Added" : "Add"}
        </button>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
        Order Summary
      </h2>

      <div className="-my-3 divide-y divide-gray-200 ">
        <dl className="flex items-center justify-between gap-4 py-3">
          <dt className="text-base font-normal text-gray-500 ">Subtotal</dt>
          <dd className="text-base font-medium text-gray-900 ">
            ${cartSummary.subtotal.toFixed(2)}
          </dd>
        </dl>

        <dl className="flex items-center justify-between gap-4 py-3">
          <dt className="text-base font-normal text-gray-500 ">Savings</dt>
          <dd className="text-base font-medium text-green-500">
            {cartSummary.totalSaving.toFixed(2)}
          </dd>
        </dl>

        <dl className="flex items-center justify-between gap-4 py-3">
          <dt className="text-base font-normal text-gray-500 ">Shipping Fee</dt>
          <dd className="text-base font-medium text-gray-900 ">
            ${finalSummary.shippingFee.toFixed(2)}
          </dd>
        </dl>

        <dl className="flex items-center justify-between gap-4 py-3">
          <dt className="text-base font-normal text-gray-500 ">Payment Fee</dt>
          <dd className="text-base font-medium text-gray-900 ">
            ${finalSummary.paymentFee.toFixed(2)}
          </dd>
        </dl>

        {isGiftBox && (
          <dl className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base font-normal text-gray-500 ">
              Gift Wrap Fee
            </dt>
            <dd className="text-base font-medium text-gray-900 ">
              ${orderRules.giftWrapFee.toFixed(2)}
            </dd>
          </dl>
        )}

        <dl className="flex items-center justify-between gap-4 py-3">
          <dt className="text-base font-normal text-gray-500 ">Tax</dt>
          <dd className="text-base font-medium text-gray-900 ">
            ${finalSummary.taxAmount.toFixed(2)}
          </dd>
        </dl>

        <dl className="flex items-center justify-between gap-4 py-3">
          <dt className="text-base font-bold text-gray-900 ">Total</dt>
          <dd className="text-base font-bold text-gray-900 ">
            ${finalSummary.grandTotal.toFixed(2)}
          </dd>
        </dl>
      </div>

      <div className="space-y-3">
        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4  focus:ring-blue-300 "
          onClick={onPostOrder}
        >
          Proceed to Payment
        </button>

        <p className="text-sm font-normal text-gray-500 ">
          One or more items in your cart require an account.{" "}
          <a
            href="#"
            title=""
            className="font-medium text-primary-700 underline hover:no-underline "
          >
            Sign in or create an account now.
          </a>
          .
        </p>
      </div>
    </section>
  );
};

export default OrderSummarySection;
