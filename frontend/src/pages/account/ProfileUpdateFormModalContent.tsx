import { FormEvent, useState } from "react";
import { userProfileUpdateValidation } from "@utils/formValidations.ts";
import useAuthContext from "@hooks/useAuthContext.ts";
import { EditableUserType, UserType } from "@types";

type Props = {
  onModalClose: () => void;
};

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  homeAddress: {
    address: "",
    city: "",
    postalCode: "",
  },
  deliveryAddress: {
    address: "",
    city: "",
    postalCode: "",
  },
};
const ProfileUpdateFormModalContent = ({ onModalClose }: Props) => {
  const [validationError, setValidationError] =
    useState<Partial<UserType>>(initialState);
  const updateUserProfile = useAuthContext().editUserProfile;
  const isLoading = useAuthContext().state.isLoading;
  const currentUser = useAuthContext().state.currentUser;

  if (!currentUser || currentUser.role !== "user") return null;

  const validationErrorSpanClasses =
    "opacity-0 text-red-500 text-sm font-medium transition-opacity duration-500 ";
  const inputClasses =
    "bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const resetValidationErrors = () => {
    setValidationError(initialState);
  };

  const onUpdateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const formUserDetailsObject: EditableUserType = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      homeAddress: {
        address: formData.get("homeAddress.address") as string,
        city: formData.get("homeAddress.city") as string,
        postalCode: formData.get("homeAddress.postalCode") as string,
      },
      deliveryAddress: {
        address: formData.get("deliveryAddress.address") as string,
        city: formData.get("deliveryAddress.city") as string,
        postalCode: formData.get("deliveryAddress.postalCode") as string,
      },
    };

    const errors = userProfileUpdateValidation(formUserDetailsObject);

    if (
      Object.values(errors).some(
        (value) => typeof value === "string" && value !== "",
      ) ||
      Object.values(errors.homeAddress).some((val) => val !== "") ||
      Object.values(errors.deliveryAddress).some((val) => val !== "")
    ) {
      setValidationError(errors);
      return;
    }

    updateUserProfile(formUserDetailsObject);
    onModalClose();
  };

  return (
    <main className="bg-gray-700">
      <section className="py-8 px-4 lg:py-16">
        <header>
          <h2 className="mb-4 text-xl font-bold text-white">Update Profile</h2>
        </header>
        <form onSubmit={onUpdateUser}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="w-full">
              <label
                htmlFor="firstName"
                className="block mb-2 text-sm font-medium text-white"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                className={inputClasses}
                defaultValue={currentUser?.firstName}
                onFocus={resetValidationErrors}
              />
              <span
                className={`${validationErrorSpanClasses} ${validationError.homeAddress?.address ? "opacity-100" : null}`}
              >
                {validationError.firstName}
              </span>
            </div>

            <div className="w-full">
              <label
                htmlFor="lastName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                className={inputClasses}
                defaultValue={currentUser?.lastName}
                onFocus={resetValidationErrors}
              />
              <span
                className={`${validationErrorSpanClasses} ${validationError.homeAddress?.address ? "opacity-100" : null}`}
              >
                {validationError.lastName}{" "}
              </span>
            </div>

            <div className="w-full">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-white"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className={inputClasses}
                defaultValue={currentUser?.email}
                onFocus={resetValidationErrors}
              />
              <span
                className={`${validationErrorSpanClasses} ${validationError.homeAddress?.address ? "opacity-100" : null}`}
              >
                {validationError.email}
              </span>
            </div>

            <div className="w-full">
              <label
                htmlFor="phoneNumber"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                className={inputClasses}
                defaultValue={currentUser?.phoneNumber}
                onFocus={resetValidationErrors}
              />
              <span
                className={`${validationErrorSpanClasses} ${validationError.homeAddress?.address ? "opacity-100" : null}`}
              >
                {validationError.phoneNumber}
              </span>
            </div>

            <div className="w-full">
              <h3 className="text-lg font-semibold text-white mb-5">
                Home Address
              </h3>

              {/* Home Address - Street */}
              <label
                htmlFor="homeAddress"
                className="block mb-2 text-sm font-medium text-white"
              >
                Street Address
              </label>
              <input
                type="text"
                name="homeAddress.address"
                id="homeAddress"
                className={inputClasses}
                onFocus={resetValidationErrors}
                defaultValue={currentUser?.homeAddress?.address}
              />
              <span
                className={`${validationErrorSpanClasses} ${validationError.homeAddress?.address ? "opacity-100" : null}`}
              >
                {validationError.homeAddress?.address}
              </span>

              {/* Home Address - City */}
              <label
                htmlFor="homeCity"
                className="block mt-3 mb-2 text-sm font-medium text-white"
              >
                City
              </label>
              <input
                type="text"
                name="homeAddress.city"
                id="homeCity"
                className={inputClasses}
                onFocus={resetValidationErrors}
                defaultValue={currentUser?.homeAddress?.city}
              />
              <span
                className={`${validationErrorSpanClasses} ${validationError.homeAddress?.address ? "opacity-100" : null}`}
              >
                {validationError.homeAddress?.city ?? "test error"}
              </span>

              {/* Home Address - Postal Code */}
              <label
                htmlFor="homePostalCode"
                className="block mt-3 mb-2 text-sm font-medium text-white"
              >
                Postal Code
              </label>
              <input
                type="text"
                name="homeAddress.postalCode"
                id="homePostalCode"
                className={inputClasses}
                onFocus={resetValidationErrors}
                defaultValue={currentUser?.homeAddress?.postalCode}
              />
              <span
                className={`${validationErrorSpanClasses} ${validationError.homeAddress?.address ? "opacity-100" : null}`}
              >
                {validationError.homeAddress?.postalCode}
              </span>
            </div>

            <div className="w-full">
              <h3 className="text-lg font-semibold text-white mb-5">
                Delivery Address
              </h3>

              {/* Delivery Address - Street */}
              <label
                htmlFor="deliveryAddress"
                className="block mb-2 text-sm font-medium text-white"
              >
                Street Address
              </label>
              <input
                type="text"
                name="deliveryAddress.address"
                id="deliveryAddress"
                className={inputClasses}
                onFocus={resetValidationErrors}
                defaultValue={currentUser?.deliveryAddress?.address}
              />
              <span
                className={`${validationErrorSpanClasses} ${validationError.homeAddress?.address ? "opacity-100" : null}`}
              >
                {validationError.deliveryAddress?.address}
              </span>

              {/* Delivery Address - City */}
              <label
                htmlFor="deliveryCity"
                className="block mt-3 mb-2 text-sm font-medium text-white"
              >
                City
              </label>
              <input
                type="text"
                name="deliveryAddress.city"
                id="deliveryCity"
                className={inputClasses}
                onFocus={resetValidationErrors}
                defaultValue={currentUser?.deliveryAddress?.city}
              />
              <span
                className={`${validationErrorSpanClasses} ${validationError.homeAddress?.address ? "opacity-100" : null}`}
              >
                {validationError.deliveryAddress?.city}
              </span>

              {/* Delivery Address - Postal Code */}
              <label
                htmlFor="deliveryPostalCode"
                className="block mt-3 mb-2 text-sm font-medium text-white"
              >
                Postal Code
              </label>
              <input
                type="text"
                name="deliveryAddress.postalCode"
                id="deliveryPostalCode"
                className={inputClasses}
                onFocus={resetValidationErrors}
                defaultValue={currentUser?.deliveryAddress?.postalCode}
              />
              <span
                className={`${validationErrorSpanClasses} ${validationError.homeAddress?.address ? "opacity-100" : null}`}
              >
                {validationError.deliveryAddress?.postalCode}
              </span>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
            >
              {isLoading ? (
                <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};
export default ProfileUpdateFormModalContent;
