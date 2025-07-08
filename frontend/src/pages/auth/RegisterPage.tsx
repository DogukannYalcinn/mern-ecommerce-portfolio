import RegisterComponent from "@pages/auth/RegisterComponent.tsx";
import userApi from "@api/userApi.ts";
import { UserRegisterType } from "@types";
import useUIContext from "@hooks/useUIContext.ts";

const RegisterPage = () => {
  const { showToast } = useUIContext();

  const registerUser = async (userObj: UserRegisterType) => {
    try {
      await userApi.register(userObj);
      showToast("success", "user created successfully!");
    } catch (error) {
      console.error(error);
      showToast("error", "Register error");
    }
  };

  return <RegisterComponent onFormSubmit={registerUser} />;
};

export default RegisterPage;
