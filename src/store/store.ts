import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/authSlice";
import customerReducer from "./customerSlice/customerSlice";
import productReducer from "./productSlice/productSlice";
import supplierReducer from "./supplierSlice/supplierSlice";
import chequeReducer from "./chequeSlice/chequeSlice";
import invoiceReducer from "./invoiceSlice/invoiceSlice";
import dashboardReducer from "./dashboardSlice/dashboardSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        customer: customerReducer,
        product: productReducer,
        supplier: supplierReducer,
        cheque: chequeReducer,
        invoice: invoiceReducer,
        dashboard: dashboardReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
