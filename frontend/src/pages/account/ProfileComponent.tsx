import ShoppingCartIcon from "@icons/ShoppingCartIcon.tsx";
import StarIcon from "@icons/StarIcon.tsx";
import HeartIcon from "@icons/HeartIcon.tsx";
import useAuthContext from "@hooks/useAuthContext.ts";
import ReturnIcon from "@icons/ReturnIcon.tsx";
import HomeIcon from "@icons/HomeIcon.tsx";
import TruckIcon from "@icons/TruckIcon.tsx";
import CreditCartIcon from "@icons/CreditCartIcon.tsx";
import EditIcon from "@icons/EditIcon.tsx";
import TrashBinIcon from "@icons/TrashBinIcon.tsx";

type Props = {
  onOpenModal: (identifier: string) => void;
};

const ProfileComponent = ({ onOpenModal }: Props) => {
  const currentUser = useAuthContext().state.currentUser;
  if (!currentUser || currentUser.role !== "user") return null;

  const deletePaymentMethod = useAuthContext().deletePaymentMethod;

  const hasCreditCard = currentUser.paymentMethods.some(
    (pm) => pm.paymentMethod === "credit-card",
  );
  const hasPaypal = currentUser.paymentMethods.some(
    (pm) => pm.paymentMethod === "paypal",
  );

  const onDeletePaymentMethod = (method: string) => {
    if (!method) return;
    deletePaymentMethod(method);
  };

  return (
    <>
      <div className="flex flex-col mx-auto max-w-7xl p-4 min-h-screen">
        <div className="inline-block self-end py-4">
          <button
            type="button"
            data-modal-target="editAccount"
            data-modal-toggle="editAccount"
            onClick={() => onOpenModal("edit-profile")}
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          >
            <EditIcon className="w-6 h-6" />
            Edit Profile
          </button>
        </div>
        <section className="antialiased">
          <div className="space-y-8">
            {/*STATS*/}
            <div className="flex flex-col gap-4">
              <h2 className=" text-xl font-semibold text-gray-700 sm:text-2xl">
                My Profile
              </h2>
              <div className="grid grid-cols-2 gap-6 border-b border-t border-gray-200 py-4 md:py-8 lg:grid-cols-4 xl:gap-16">
                <div>
                  <ShoppingCartIcon className="w-8 h-8 text-gray-600" />
                  <h3 className="mb-2 text-gray-400">Orders made</h3>
                  <span className="flex items-center text-2xl font-bold text-gray-900">
                    {currentUser?.stats?.completedOrderCount}
                  </span>
                </div>
                <div>
                  <StarIcon className="w-8 h-8 text-gray-600" />
                  <h3 className="mb-2 text-gray-400">Reviews added</h3>
                  <span className="flex items-center text-2xl font-bold text-gray-900">
                    {currentUser?.stats?.reviewCount}
                  </span>
                </div>
                <div>
                  <HeartIcon className="w-8 h-8 text-gray-600" />
                  <h3 className="mb-2 text-gray-400">Favorite Products</h3>
                  <span className="flex items-center text-2xl font-bold text-gray-900">
                    {currentUser?.stats?.favoriteCount}
                  </span>
                </div>

                <div>
                  <ReturnIcon className="w-8 h-8 text-gray-600" />
                  <h3 className="mb-2 text-gray-400">Cancelled Orders</h3>
                  <span className="flex items-center text-2xl font-bold text-gray-900">
                    {currentUser?.stats?.cancelledOrderCount}
                  </span>
                </div>
              </div>
            </div>

            {/*Personal Information*/}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-medium text-gray-500">
                Personal Information
              </h2>

              {/* User Identity */}
              <div className="flex gap-4 items-center">
                <div className="h-20 w-20 rounded-xl bg-gray-600 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white uppercase">
                    {currentUser?.firstName[0]}
                  </span>
                </div>
                <div>
                  <span className="mb-2 inline-block rounded bg-primary-100 px-3 py-1 text-sm font-semibold text-blue-800">
                    PRO Account
                  </span>
                  <h2 className="text-2xl font-bold text-gray-700 capitalize">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </h2>
                </div>
              </div>

              {/* Grid of Details */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Email */}
                <div className="flex flex-col">
                  <dt className="font-semibold text-gray-900">Email Address</dt>
                  <dd className="text-gray-500 mt-1">{currentUser?.email}</dd>
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                  <dt className="font-semibold text-gray-900">Phone Number</dt>
                  <dd className="text-gray-500 mt-1">
                    {currentUser?.phoneNumber}
                  </dd>
                </div>

                {/* Home Address */}
                <div className="flex flex-col sm:col-span-1">
                  <dt className="font-semibold text-gray-900">Home Address</dt>
                  <dd className="flex items-center gap-2 text-gray-500 mt-1">
                    <HomeIcon className="w-5 h-5 text-gray-400" />
                    {currentUser?.homeAddress?.address}
                  </dd>
                </div>

                {/* Delivery Address */}
                <div className="flex flex-col sm:col-span-1">
                  <dt className="font-semibold text-gray-900">
                    Delivery Address
                  </dt>
                  <dd className="flex items-center gap-2 text-gray-500 mt-1">
                    <TruckIcon className="w-5 h-5 text-gray-400" />
                    {currentUser?.deliveryAddress?.address}
                  </dd>
                </div>
              </div>
            </div>

            {/*PAYMENT METHODS*/}
            <div className="flex flex-col gap-4 max-w-4xl">
              <h2 className="text-xl font-medium text-gray-500">
                Payment Method
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Credit Card Section */}
                <div className="space-y-1 w-full md:w-1/2">
                  {hasCreditCard ? (
                    currentUser.paymentMethods
                      .filter((pm) => pm.paymentMethod === "credit-card")
                      .map((card) => (
                        <div
                          key={card.cardMaskNumber}
                          className="p-6 border border-gray-300 rounded-xl bg-white shadow-sm cursor-pointer hover:border-blue-500 transition-colors duration-500"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                              <img
                                className="w-12 h-8 object-cover"
                                src="/images/visa.png"
                                alt="Visa"
                              />
                              <span className="text-gray-800 font-semibold text-lg">
                                {card.cardMaskNumber}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                onDeletePaymentMethod("credit-card")
                              }
                              aria-label="Delete Credit Card"
                            >
                              <TrashBinIcon className="w-5 h-5 text-red-500 hover:scale-110 transition-all duration-500" />
                            </button>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>
                              Card Holder:{" "}
                              <span className="font-medium text-gray-800">
                                {card.cardHolderName}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <button
                      className="flex items-center gap-3 w-full  p-4 border border-gray-300 rounded-xl hover:bg-blue-100 transition-all"
                      onClick={() => onOpenModal("credit-card")}
                    >
                      <CreditCartIcon className="w-6 h-6 text-blue-500" />
                      <span className="font-medium text-gray-800">
                        Add Credit Card
                      </span>
                    </button>
                  )}
                </div>

                {/* PayPal Section */}
                <div className="space-y-1 w-full md:w-1/2">
                  {hasPaypal ? (
                    currentUser.paymentMethods
                      .filter((pm) => pm.paymentMethod === "paypal")
                      .map((paypal) => (
                        <div
                          key={paypal.paypalEmail}
                          className="p-6 border border-gray-300 rounded-xl bg-white shadow-sm cursor-pointer hover:border-blue-500 transition-colors duration-500"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                              <img
                                className="w-12 h-8 object-cover"
                                src="/images/paypal.png"
                                alt="PayPal"
                              />
                              <span className="text-gray-800 font-semibold text-lg">
                                {paypal.paypalEmail}
                              </span>
                            </div>
                            <button
                              onClick={() => onDeletePaymentMethod("paypal")}
                              aria-label="Delete PayPal"
                            >
                              <TrashBinIcon className="w-5 h-5 text-red-500 hover:scale-110 transition-all duration-500" />
                            </button>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>
                              User:{" "}
                              <span className="font-medium text-gray-800">
                                {currentUser.firstName} {currentUser.lastName}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <button
                      className="flex items-center gap-3 p-4 w-full border border-gray-300 rounded-xl hover:bg-blue-100 transition-all"
                      onClick={() => onOpenModal("paypal")}
                    >
                      <CreditCartIcon className="w-6 h-6 text-yellow-500" />
                      <span className="font-medium text-gray-800">
                        Add PayPal Account
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProfileComponent;
