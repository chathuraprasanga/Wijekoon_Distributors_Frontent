import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";
import { AuthLoaderChecker } from "./utils/authChecker.ts";
import { Notifications } from "@mantine/notifications";
import Loading from "./components/Loading.tsx";
import { LoadingProvider } from "./helpers/loadingContext.tsx";

// import LoginPage from "./pages/LoginPage.tsx";
// import AppLayout from "./layouts/AppLayout.tsx";
// import DashboardPage from "./pages/DashboardPage.tsx";
// import Customers from "./pages/customers";
// import Products from "./pages/products";
// import Suppliers from "./pages/suppliers";
// import Cheques from "./pages/cheques";
// import Invoices from "./pages/invoices";
// import AddCustomer from "./pages/customers/AddCustomer.tsx";
// import AddProduct from "./pages/products/AddProduct.tsx";
// import AddSupplier from "./pages/suppliers/AddSupplier.tsx";
// import AddCheque from "./pages/cheques/AddCheque.tsx";
// import AddInvoice from "./pages/invoices/AddInvoice.tsx";

const LoginPage = React.lazy(() => import("./pages/LoginPage.tsx"));
const AppLayout = React.lazy(() => import("./layouts/AppLayout.tsx"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage.tsx"));
const Customers = React.lazy(() => import("./pages/customers"));
const Products = React.lazy(() => import("./pages/products"));
const Suppliers = React.lazy(() => import("./pages/suppliers"));
const Cheques = React.lazy(() => import("./pages/cheques"));
const Invoices = React.lazy(() => import("./pages/invoices"));
const AddCustomer = React.lazy(
    () => import("./pages/customers/AddCustomer.tsx")
);
const AddProduct = React.lazy(() => import("./pages/products/AddProduct.tsx"));
const AddSupplier = React.lazy(
    () => import("./pages/suppliers/AddSupplier.tsx")
);
const AddCheque = React.lazy(() => import("./pages/cheques/AddCheque.tsx"));
const AddInvoice = React.lazy(() => import("./pages/invoices/AddInvoice.tsx"));
const EditCustomer = React.lazy(() => import("./pages/customers/EditCustomer.tsx"));

const router = createBrowserRouter([
    {
        path: "app",
        element: <AppLayout />,
        loader: AuthLoaderChecker,
        children: [
            {
                path: "dashboard",
                element: <DashboardPage />,
            },
            {
                path: "customers",
                element: <Customers />,
            },
            {
                path: "products",
                element: <Products />,
            },
            {
                path: "suppliers",
                element: <Suppliers />,
            },
            {
                path: "cheques",
                element: <Cheques />,
            },
            {
                path: "invoices",
                element: <Invoices />,
            },
            {
                path: "customers/add-customer",
                element: <AddCustomer />,
            },
            {
                path: "products/add-product",
                element: <AddProduct />,
            },
            {
                path: "suppliers/add-supplier",
                element: <AddSupplier />,
            },
            {
                path: "cheques/add-cheque",
                element: <AddCheque />,
            },
            {
                path: "invoices/add-invoice",
                element: <AddInvoice />,
            },
            {
                path: "customers/edit-customer/:id",
                element: <EditCustomer />,
            },
        ],
    },
    {
        path: "/",
        element: <Navigate to="/app/dashboard" replace />,
    },
    {
        path: "login",
        element: <LoginPage />,
    },
]);

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <MantineProvider>
            <Suspense fallback={<Loading />}>
                <LoadingProvider>
                    <Notifications position="top-right" mt={50} />
                    {/*<StrictMode>*/}
                        <RouterProvider router={router} />
                    {/*</StrictMode>*/}
                </LoadingProvider>
            </Suspense>
        </MantineProvider>
    </Provider>
);
