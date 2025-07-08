import { useNavigate } from "react-router-dom";
import { useState, FormEvent, useEffect } from "react";
import useAuthContext from "@hooks/useAuthContext.ts";
import { adminLoginValidation } from "@utils/formValidations.ts";
import FormErrorMessage from "@components/ui/FormErrorMessage.tsx";

const initialState = { username: "", password: "" };
const AdminLoginPage = () => {
  const { state: authCtx, adminLogin } = useAuthContext();
  const { error: authError, currentUser } = authCtx;
  const isAuth = currentUser?.role === "admin";

  const [validationErrors, setValidationErrors] =
    useState<Record<string, string>>(initialState);

  const navigate = useNavigate();

  useEffect(() => {
    if (authError?.errorCode === 401) {
      setValidationErrors({
        username: "username or password doesn't match",
        password: "username or password doesn't match",
      });
    }

    if (isAuth) {
      navigate("/admin");
    }
  }, [authError?.errorCode, isAuth, navigate]);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = form.username.value;
    const password = form.password.value;

    const errors = adminLoginValidation(username, password);
    if (Object.values(errors).some((value) => value !== "")) {
      setValidationErrors(() => ({ ...errors }));
      return;
    }

    await adminLogin(username, password);
  };

  return (
    <section className="bg-gray-800">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen">
        <img
          className="w-64 h-auto object-contain"
          src="/images/dummyLogo.png"
          alt="logo"
        />
        <div className="w-full bg-gray-700 rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl ">
              Log in to your account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              method="POST"
              onSubmit={submitHandler}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Your Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="bg-gray-700 border border-gray-400 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  onFocus={() => setValidationErrors(initialState)}
                />
                <FormErrorMessage message={validationErrors.username} />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="bg-gray-700 border border-gray-400 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  onFocus={() => setValidationErrors(initialState)}
                />
                <FormErrorMessage message={validationErrors.password} />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700  focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                Log in
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLoginPage;
