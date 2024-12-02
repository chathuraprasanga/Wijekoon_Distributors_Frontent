import axios from "axios";
import { store } from "../store/store";
import { logOut, tokenRefresh } from "../store/authSlice/authSlice";
import toNotify from "../helpers/toNotify.tsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: backendUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Pass the response if the request succeeds
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to 401/403 and not retried yet
    if (
      !originalRequest._retry &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      originalRequest._retry = true; // Mark the request as retried to avoid loops

      try {
        // Attempt to refresh the token
        const result = await store.dispatch(tokenRefresh());

        if (result.type === "auth/tokenRefresh/fulfilled") {
          // Successfully refreshed the token
          const newAccessToken = result.payload.result.accessToken;
          localStorage.setItem("ACCESS_TOKEN", newAccessToken);

          // Update the Authorization headers for the new token
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // Retry the original request with the updated token
          return axiosInstance(originalRequest);
        } else {
          // Token refresh failed for application-specific reasons
          store.dispatch(logOut());
          toNotify("Error", "Please log in to the system again", "ERROR");
          return Promise.reject(error); // Reject with the original error
        }
      } catch (refreshError) {
        // Token refresh failed due to network or unexpected issues
        store.dispatch(logOut());
        toNotify(
          "Error",
          "Unable to refresh session. Please log in again.",
          "ERROR",
        );
        return Promise.reject(refreshError);
      }
    }

    // For other errors or after retrying, reject with the original error
    return Promise.reject(error);
  },
);

export default axiosInstance;
