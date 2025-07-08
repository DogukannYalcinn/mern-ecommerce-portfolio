import useAuthContext from "@hooks/useAuthContext.ts";
import { NavLink } from "react-router-dom";
import EditIcon from "@icons/EditIcon.tsx";

const PersonalDetailsSection = () => {
  const currentUser = useAuthContext().state.currentUser;

  if (!currentUser || currentUser.role !== "user") return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 ">Personal Details</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="mb-2 block text-sm font-medium text-gray-900 "
          >
            {" "}
            Your name{" "}
          </label>
          <input
            type="text"
            id="firstName"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 "
            placeholder={currentUser.firstName}
            disabled={true}
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="mb-2 block text-sm font-medium text-gray-900 "
          >
            {" "}
            Your Email*{" "}
          </label>
          <input
            type="email"
            id="lastName"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
            placeholder={currentUser.email}
            disabled={true}
          />
        </div>

        <div>
          <label
            htmlFor="your_email"
            className="mb-2 block text-sm font-medium text-gray-900 "
          >
            {" "}
            Your Email*{" "}
          </label>
          <input
            type="email"
            id="your_email"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
            placeholder={currentUser.email}
            disabled={true}
          />
        </div>

        <div>
          <label
            htmlFor="your_phone"
            className="mb-2 block text-sm font-medium text-gray-900 "
          >
            {" "}
            Your Phone{" "}
          </label>
          <input
            type="text"
            id="your_phone"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 "
            placeholder={currentUser.phoneNumber}
            disabled={true}
          />
        </div>

        <div className="sm:col-span-2">
          <NavLink
            to="/account/profile"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700"
          >
            <EditIcon className="h-6 w-6" />
            Edit Details
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default PersonalDetailsSection;
