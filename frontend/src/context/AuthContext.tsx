import {
  useEffect,
  useCallback,
  useReducer,
  ReactElement,
  createContext,
} from "react";
import { AxiosError } from "axios";
import {
  UserType,
  AdminType,
  PaymentMethodType,
  EditableUserType,
} from "@types";
import userApi from "../api/userApi.ts";
import adminApi from "../api/adminApi.ts";
import { setAuthToken } from "@utils/axiosInstance.ts";
import useUIContext from "../hooks/useUIContext.ts";

export type ErrorType = {
  message: string;
  errorCode?: number;
  field?: string;
  type?: "login" | "register" | "token" | "unauthorized";
};

type StateType = {
  currentUser: UserType | AdminType | null;
  isLoading: boolean;
  error: ErrorType | null;
  accessToken: string;
};

const initAuthState: StateType = {
  currentUser: null,
  isLoading: false,
  error: null,
  accessToken: "",
};

export const enum AUTH_ACTION_TYPE {
  LOGIN_SUCCESS,
  LOGOUT,
  SET_AUTH_ERROR,
  RESET_AUTH_ERROR,
  REFRESH_TOKEN_SUCCESS,
  UPDATE_USER_PROFILE,
  SET_IS_LOADING,
}

type AuthAction =
  | {
      type: AUTH_ACTION_TYPE.LOGIN_SUCCESS;
      payload: {
        currentUser: UserType | AdminType;
        accessToken: string | null;
      };
    }
  | { type: AUTH_ACTION_TYPE.LOGOUT }
  | { type: AUTH_ACTION_TYPE.SET_AUTH_ERROR; payload: ErrorType }
  | { type: AUTH_ACTION_TYPE.REFRESH_TOKEN_SUCCESS; payload: string }
  | { type: AUTH_ACTION_TYPE.UPDATE_USER_PROFILE; payload: UserType }
  | { type: AUTH_ACTION_TYPE.RESET_AUTH_ERROR }
  | { type: AUTH_ACTION_TYPE.SET_IS_LOADING; payload: boolean };

const authReducer = (state: StateType, action: AuthAction): StateType => {
  switch (action.type) {
    case AUTH_ACTION_TYPE.LOGIN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload.currentUser,
        isLoading: false,
        error: null,
        accessToken: action.payload.accessToken ?? "",
      };
    case AUTH_ACTION_TYPE.LOGOUT:
      return {
        ...state,
        currentUser: null,
        isLoading: false,
        error: null,
        accessToken: "",
      };
    case AUTH_ACTION_TYPE.SET_AUTH_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    case AUTH_ACTION_TYPE.REFRESH_TOKEN_SUCCESS:
      return { ...state, accessToken: action.payload ?? "" };
    case AUTH_ACTION_TYPE.SET_IS_LOADING: {
      return { ...state, isLoading: action.payload };
    }
    case AUTH_ACTION_TYPE.UPDATE_USER_PROFILE: {
      if (state.currentUser && state.currentUser.role === "user") {
        const updatedUser = action.payload;
        return {
          ...state,
          currentUser: {
            ...state.currentUser,
            ...updatedUser,
            _id: state.currentUser._id,
            role: state.currentUser.role,
            cart: state.currentUser.cart,
          },
        };
      }
      return state;
    }
    case AUTH_ACTION_TYPE.RESET_AUTH_ERROR: {
      return { ...state, error: null };
    }
    default:
      return state;
  }
};

type AuthContextType = {
  state: StateType;
  userLogin: (username: string, password: string) => Promise<void>;
  userLogout: () => void;
  refreshToken: () => Promise<void>;
  toggleUserFavorite: (productId: string) => Promise<void>;
  fetchUserStats: () => Promise<void>;
  editUserProfile: (editedUser: EditableUserType) => Promise<void>;
  resetAuthError: () => void;
  addPaymentMethod: (paymentDetails: PaymentMethodType) => void;
  deletePaymentMethod: (method: string) => void;
  adminLogin: (username: string, password: string) => Promise<void>;
  adminLogout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

type ChildrenType = {
  children?: ReactElement | ReactElement[];
};

const AuthContextProvider = ({ children }: ChildrenType): ReactElement => {
  const [state, dispatch] = useReducer(authReducer, initAuthState);
  const showToast = useUIContext().showToast;

  function handleAuthError(error: unknown, type: ErrorType["type"]) {
    const axiosError = error as AxiosError<any>;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;

    if (status === 422) {
      dispatch({
        type: AUTH_ACTION_TYPE.SET_AUTH_ERROR,
        payload: {
          message: data?.message || "Validation failed.",
          field: data?.field,
          type,
          errorCode: status,
        },
      });
      return;
    }

    dispatch({
      type: AUTH_ACTION_TYPE.SET_AUTH_ERROR,
      payload: {
        message: data?.message || "Unauthorized or unexpected error.",
        type,
        errorCode: status,
      },
    });

    if (status === 401 || status === 403) {
      dispatch({ type: AUTH_ACTION_TYPE.LOGOUT });
    }
  }

  const resetAuthError = async () => {
    dispatch({ type: AUTH_ACTION_TYPE.RESET_AUTH_ERROR });
  };

  const userLogin = async (email: string, password: string) => {
    try {
      const { accessToken, user } = await userApi.login(email, password);
      dispatch({
        type: AUTH_ACTION_TYPE.LOGIN_SUCCESS,
        payload: { currentUser: user, accessToken },
      });
      setAuthToken(accessToken);
      showToast("success", `Welcome ${user.firstName} ${user.lastName}`);
    } catch (error) {
      handleAuthError(error, "login");
    }
  };

  const userLogout = async () => {
    if (!state.currentUser) return;
    try {
      await userApi.logout();
      dispatch({ type: AUTH_ACTION_TYPE.LOGOUT });
      setAuthToken(null);
      showToast("success", "you are successfully signed out.");
    } catch (err) {
      console.log(err);
      showToast("error", "something went wrong.");
    }
  };

  const refreshToken = useCallback(async () => {
    try {
      const { accessToken: newAccessToken } = await userApi.refreshToken();
      dispatch({
        type: AUTH_ACTION_TYPE.REFRESH_TOKEN_SUCCESS,
        payload: newAccessToken,
      });
      setAuthToken(newAccessToken);
    } catch (error) {
      handleAuthError(error, "token");
    }
  }, []);

  const adminLogin = async (username: string, password: string) => {
    try {
      const loggedInInAdmin = await adminApi.login(username, password);

      dispatch({
        type: AUTH_ACTION_TYPE.LOGIN_SUCCESS,
        payload: { currentUser: loggedInInAdmin, accessToken: null },
      });

      showToast("success", `Welcome ${loggedInInAdmin.username}`);
    } catch (errorData: any) {
      const error: ErrorType = {
        message: errorData.response.data.message ?? "Login Failed",
        errorCode: errorData.response.status,
      };
      dispatch({
        type: AUTH_ACTION_TYPE.SET_AUTH_ERROR,
        payload: error,
      });
    }
  };

  const adminLogout = async () => {
    dispatch({ type: AUTH_ACTION_TYPE.LOGOUT });
    await adminApi.logout();
    showToast("success", "You are successfully signed out.");
  };

  const editUserProfile = async (editedUser: EditableUserType) => {
    if (state.currentUser?.role === "user") {
      try {
        const updatedUser = await userApi.editProfile(editedUser);
        dispatch({
          type: AUTH_ACTION_TYPE.UPDATE_USER_PROFILE,
          payload: updatedUser,
        });
        showToast("success", "your profile updated successfully!");
      } catch (error) {
        handleAuthError(error, "unauthorized");
      }
    }
  };

  const toggleUserFavorite = async (productId: string) => {
    if (state.currentUser?.role === "user") {
      try {
        const updatedFavorites = await userApi.toggleFavorite(productId);
        const updatedUser = {
          ...state.currentUser,
          favorites: updatedFavorites,
        };
        dispatch({
          type: AUTH_ACTION_TYPE.UPDATE_USER_PROFILE,
          payload: updatedUser,
        });
        showToast("success", "your favorites updated!");
      } catch (error) {
        handleAuthError(error, "unauthorized");
      }
    }
    return;
  };

  const fetchUserStats = useCallback(async () => {
    if (state.currentUser?.role === "user") {
      try {
        const userStats = await userApi.fetchUserStats();
        const updatedUser = { ...state.currentUser, stats: userStats };
        dispatch({
          type: AUTH_ACTION_TYPE.UPDATE_USER_PROFILE,
          payload: updatedUser,
        });
      } catch (error) {
        handleAuthError(error, "unauthorized");
      }
    }
    return;
  }, [state.currentUser?._id]);

  const addPaymentMethod = async (paymentDetails: PaymentMethodType) => {
    if (state.currentUser?.role === "user") {
      try {
        const updatedUserPaymentMethods =
          await userApi.addPaymentMethod(paymentDetails);
        const updatedUser = {
          ...state.currentUser,
          paymentMethods: updatedUserPaymentMethods,
        };
        dispatch({
          type: AUTH_ACTION_TYPE.UPDATE_USER_PROFILE,
          payload: updatedUser,
        });
        showToast("success", "payment added successfully!");
      } catch (error) {
        handleAuthError(error, "unauthorized");
      }
    }
    return;
  };

  const deletePaymentMethod = async (method: string) => {
    if (state.currentUser?.role === "user") {
      try {
        const updatedUserPaymentMethods =
          await userApi.deletePaymentMethod(method);
        const updatedUser = {
          ...state.currentUser,
          paymentMethods: updatedUserPaymentMethods,
        };
        dispatch({
          type: AUTH_ACTION_TYPE.UPDATE_USER_PROFILE,
          payload: updatedUser,
        });
        showToast("success", "payment deleted successfully!");
      } catch (error) {
        handleAuthError(error, "unauthorized");
      }
    }
    return;
  };

  useEffect(() => {
    if (state.currentUser?.role === "user") {
      const refreshInterval = setInterval(
        () => {
          console.log("Refreshing token...");
          refreshToken();
        },
        13 * 60 * 1000,
      );

      return () => clearInterval(refreshInterval);
    }
  }, [state.currentUser?._id, refreshToken]);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const { accessToken, user } = await userApi.checkSession();

        dispatch({
          type: AUTH_ACTION_TYPE.LOGIN_SUCCESS,
          payload: { currentUser: user, accessToken },
        });

        setAuthToken(accessToken);
      } catch (error) {
        console.error("Session check failed", error);
      }
    };
    checkUserSession();
  }, []);

  useEffect(() => {
    const handleLogoutAdmin = async () => {
      setTimeout(
        () => {
          adminLogout();
        },
        59 * 60 * 1000,
      );
    };

    if (state.currentUser?.role === "admin") {
      handleLogoutAdmin();
    }
  }, [state.currentUser]);

  return (
    <AuthContext.Provider
      value={{
        state,
        userLogin,
        userLogout,
        refreshToken,
        adminLogin,
        adminLogout,
        editUserProfile,
        resetAuthError,
        toggleUserFavorite,
        fetchUserStats,
        addPaymentMethod,
        deletePaymentMethod,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
