import CreditCartIcon from "../../icons/CreditCartIcon.tsx";
import useAuthContext from "@hooks/useAuthContext.ts";
import {PaymentMethodType} from "@types";
type Props = {
  onModalClose: () => void;
};

const CreditCardFormModalContent = ({ onModalClose }: Props) => {
  const addPaymentMethod = useAuthContext().addPaymentMethod;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const creditCartDetails :PaymentMethodType= {
      paymentMethod: "credit-card",
      cardHolderName: formData.get("cardHolderName") as string,
      cardNumber: formData.get("cardNumber") as string,
    };
    addPaymentMethod(creditCartDetails);
    onModalClose();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Add Payment Method
      </h2>
      <div className="flex gap-2 justify-end">
        <img className="object-cover" src="/images/visa.png" alt="" />
        <img className="object-cover" src="/images/mastercard.png" alt="" />
        <img
          className="object-cover"
          src="/images/americanexpress.png"
          alt=""
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Credit Card Section */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
            <CreditCartIcon className="w-5 h-5 text-blue-600 mr-2" />
            Credit Card Details
          </h3>

          <div className="space-y-4">
            <input
              type="text"
              name="cardHolderName"
              placeholder="Cardholder Name"
              className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              name="cardNumber"
              placeholder="Card Number"
              className="w-full p-3 border rounded-lg bg-white  focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="flex space-x-4">
              <input
                type="number"
                name="expireDate"
                placeholder="MM"
                className="w-1/2 p-3 border rounded-lg bg-white  focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                name="expireDate"
                placeholder="YY"
                className="w-1/2 p-3 border rounded-lg bg-white  focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                name="cvv"
                placeholder="CVV"
                className="w-1/2 p-3 border rounded-lg bg-white  focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onModalClose}
            className="px-5 py-2 bg-gray-300 rounded-lg text-gray-700 hover:bg-gray-400 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreditCardFormModalContent;
