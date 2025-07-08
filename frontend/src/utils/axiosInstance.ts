import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// axiosInstance.interceptors.request.use((config) => {
//     if (accessToken) {
//         config.headers["Authorization"] = `Bearer ${accessToken}`;
//     }
//     return config;
// });

// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const navigate = useNavigate();
//         const originalRequest = error.config;
//         if (error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//         }
//         navigate("/login");

//         return Promise.reject(error);
//     }
// );

export default axiosInstance;
