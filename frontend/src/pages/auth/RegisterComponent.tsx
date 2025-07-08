import { useState, FormEvent } from "react";
import { NavLink } from "react-router-dom";
import { UserRegisterType } from "@types";
import { registerFormValidation } from "@utils/formValidations.ts";
import FormErrorMessage from "@components/ui/FormErrorMessage.tsx";

type Props = {
  onFormSubmit: (userObj: UserRegisterType) => void;
};

const inputClasses =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 block w-full p-2";
const labelClasses = "block mb-2 text-sm font-medium text-gray-900";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phoneNumber: "",
  confirmPassword: "",
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

const RegisterComponent = ({ onFormSubmit }: Props) => {
  const [validationErrors, setValidationErrors] =
    useState<UserRegisterType>(initialState);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const formUserDetailsObject = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
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

    const errors = registerFormValidation(formUserDetailsObject);

    if (
      Object.values(errors).some(
        (value) => typeof value === "string" && value !== "",
      ) ||
      Object.values(errors.homeAddress).some((val) => val !== "") ||
      Object.values(errors.deliveryAddress).some((val) => val !== "")
    ) {
      setValidationErrors(errors);
      return;
    }

    onFormSubmit(formUserDetailsObject);
  };

  const resetValidationErrors = () => {
    setValidationErrors(initialState);
  };

  return (
    <>
      <main className="flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-7xl rounded-lg">
          <form className="" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="col-span-1 space-y-4 ">
                <h2 className="text-xl font-bold text-gray-700 border-b pb-2">
                  Personal Information
                </h2>
                <div>
                  <label htmlFor="firstName" className={labelClasses}>
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className={inputClasses}
                    onFocus={resetValidationErrors}
                  />
                  <FormErrorMessage message={validationErrors.firstName} />
                </div>
                <div>
                  <label htmlFor="lastName" className={labelClasses}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className={inputClasses}
                    onFocus={resetValidationErrors}
                  />
                  <FormErrorMessage message={validationErrors.lastName} />
                </div>
                <div>
                  <label htmlFor="email" className={labelClasses}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className={inputClasses}
                    onFocus={resetValidationErrors}
                  />
                  <FormErrorMessage message={validationErrors.email} />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className={labelClasses}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    className={inputClasses}
                    onFocus={resetValidationErrors}
                  />
                  <FormErrorMessage message={validationErrors.phoneNumber} />
                </div>
                <div>
                  <label htmlFor="password" className={labelClasses}>
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className={inputClasses}
                    onFocus={resetValidationErrors}
                  />
                  <FormErrorMessage message={validationErrors.password} />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className={labelClasses}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className={inputClasses}
                    onFocus={resetValidationErrors}
                  />
                  <FormErrorMessage
                    message={validationErrors.confirmPassword}
                  />
                </div>
              </div>

              {/* Delivery Information */}
              <div className="col-span-1 space-y-4 ">
                <h2 className="text-xl font-bold text-gray-700 border-b pb-2">
                  Delivery Address
                </h2>
                <div>
                  <label htmlFor="deliveryAddress" className={labelClasses}>
                    Address
                  </label>
                  <input
                    type="text"
                    name="deliveryAddress.address"
                    id="deliveryAddress"
                    className={inputClasses}
                    onFocus={resetValidationErrors}
                  />
                  <FormErrorMessage
                    message={validationErrors.deliveryAddress.address}
                  />
                </div>
                <div>
                  <label htmlFor="deliveryCity" className={labelClasses}>
                    City
                  </label>
                  <input
                    type="text"
                    name="deliveryAddress.city"
                    id="deliveryAddress.city"
                    className={inputClasses}
                    onFocus={resetValidationErrors}
                  />
                  <FormErrorMessage
                    message={validationErrors.deliveryAddress.city}
                  />
                </div>
                <div>
                  <label htmlFor="deliveryPostalCode" className={labelClasses}>
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="deliveryAddress.postalCode"
                    id="deliveryPostalCode"
                    className={inputClasses}
                    onFocus={resetValidationErrors}
                  />
                  <FormErrorMessage
                    message={validationErrors.deliveryAddress.postalCode}
                  />
                </div>
              </div>

              {/* Home Address */}
              <div className="col-span-1 space-y-4">
                <h2 className="text-xl font-bold text-gray-700 border-b pb-2">
                  Home Address
                </h2>
                <div>
                  <label htmlFor="homeAddress" className={labelClasses}>
                    Address
                  </label>
                  <input
                    type="text"
                    name="homeAddress.address"
                    id="homeAddress"
                    className={inputClasses}
                    onFocus={resetValidationErrors}
                  />
                  <FormErrorMessage
                    message={validationErrors.homeAddress.address}
                  />
                </div>
                <div>
                  <label htmlFor="homeCity" className={labelClasses}>
                    City
                  </label>
                  <input
                    type="text"
                    name="homeAddress.city"
                    id="homeCity"
                    className={inputClasses}
                    onFocus={resetValidationErrors}
                  />
                  <FormErrorMessage
                    message={validationErrors.homeAddress.city}
                  />
                </div>
                <div>
                  <label htmlFor="homePostalCode" className={labelClasses}>
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="homeAddress.postalCode"
                    id="homePostalCode"
                    className={inputClasses}
                    onFocus={resetValidationErrors}
                  />
                  <FormErrorMessage
                    message={validationErrors.homeAddress.postalCode}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-4 px-2 py-4">
              {/* Submit Button + LoginPage Link */}
              <div className="flex flex-col items-center">
                <button
                  type="submit"
                  className="w-full md:w-auto px-16 py-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Register
                </button>
                <p className="text-gray-500 text-sm mt-3 text-center">
                  Already have an account?
                  <NavLink
                    to={"/auth/login"}
                    className="text-blue-400 font-semibold hover:underline ml-1"
                  >
                    Login here
                  </NavLink>
                </p>
              </div>
              {/* Checkbox */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-gray-500"
                >
                  I accept the
                  <a
                    href="#"
                    className="text-blue-400 font-semibold hover:underline ml-1"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default RegisterComponent;
