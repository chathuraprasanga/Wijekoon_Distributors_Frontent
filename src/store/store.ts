import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/authSlice";
import customerReducer from "./customerSlice/customerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
