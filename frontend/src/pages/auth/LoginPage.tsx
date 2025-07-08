import useAuthContext from "@hooks/useAuthContext.ts";
import { NavLink, useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { loginValidation } from "@utils/formValidations.ts";
import FormErrorMessage from "@components/ui/FormErrorMessage.tsx";

const LoginPage = () => {
  const { userLogin, state: authState } = useAuthContext();
  const [validationErrors, setValidationError] = useState({
    email: "",
    password: "",
  });
  const currentUser = useAuthContext().state.currentUser;
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) navigate("/");
  }, [currentUser]);

  useEffect(() => {
    if (authState.error?.type === "login") {
      setValidationError(() => ({
        email:
          authState.error?.field === "email" ? authState.error.message : "",
        password:
          authState.error?.field === "password" ? authState.error.message : "",
      }));
    }
  }, [authState.error]);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    const errors = loginValidation(email, password);
    if (Object.values(errors).some((value) => value !== "")) {
      setValidationError(() => ({ ...errors }));
      return;
    }
    await userLogin(email, password);
  };

  return (
    <>
      <main className="bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-[calc(100vh-25vh)] lg:py-0">
          <NavLink to={"/"}>
            <img
              className="w-64 h-auto object-contain"
              src="/images/dummyLogo.png"
              alt="logo"
            />
          </NavLink>
          <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Sign in to your account
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                method="POST"
                onSubmit={submitHandler}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                  />
                  <FormErrorMessage message={validationErrors.email} />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                  />
                  <FormErrorMessage message={validationErrors.password} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-500">
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Sign in
                </button>
                <p className="text-sm font-light text-gray-500 ">
                  Don’t have an account yet?
                  <NavLink
                    to="/auth/register"
                    className="font-medium text-blueblue-600 hover:underline"
                  >
                    Sign up
                  </NavLink>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
