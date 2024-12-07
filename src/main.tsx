import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
    createBrowserRouter,
    Navigate,
    redirect,
    RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

import { AuthLoaderChecker } from "./utils/authChecker.ts";
import { Notifications } from "@mantine/notifications";
// import Loading from "./components/Loading.tsx";
const Loading = React.lazy(() => import("./components/Loading.tsx"));
import { LoadingProvider } from "./helpers/loadingContext.tsx";
import { DatesProvider } from "@mantine/dates";

const authChecker = async () => {
    const isAuthenticated = Boolean(localStorage.getItem("ACCESS_TOKEN"));
    if (isAuthenticated) {
        return redirect("/app/dashboard"); // Redirect if already logged in
    }
    return null;
};

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
const ViewCustomer = React.lazy(
    () => import("./pages/customers/ViewCustomer.tsx")
);
const AddProduct = React.lazy(() => import("./pages/products/AddProduct.tsx"));
const AddSupplier = React.lazy(
    () => import("./pages/suppliers/AddSupplier.tsx")
);
const AddCheque = React.lazy(() => import("./pages/cheques/AddCheque.tsx"));
const AddInvoice = React.lazy(() => import("./pages/invoices/AddInvoice.tsx"));
const EditCustomer = React.lazy(
    () => import("./pages/customers/EditCustomer.tsx")
);
const EditProduct = React.lazy(
    () => import("./pages/products/EditProduct.tsx")
);
const EditSupplier = React.lazy(
    () => import("./pages/suppliers/EditSupplier.tsx")
);
const EditCheque = React.lazy(() => import("./pages/cheques/EditCheque.tsx"));
const EditInvoice = React.lazy(
    () => import("./pages/invoices/EditInvoice.tsx")
);
const ViewProduct = React.lazy(
    () => import("./pages/products/ViewProduct.tsx")
);
const ViewSupplier = React.lazy(
    () => import("./pages/suppliers/ViewSupplier.tsx")
);
const ViewCheque = React.lazy(() => import("./pages/cheques/ViewCheque.tsx"));
const ViewInvoice = React.lazy(
    () => import("./pages/invoices/ViewInvoice.tsx")
);

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
            {
                path: "customers/view-customer/:id",
                element: <ViewCustomer />,
            },
            {
                path: "products/edit-product/:id",
                element: <EditProduct />,
            },
            {
                path: "products/view-product/:id",
                element: <ViewProduct />,
            },
            {
                path: "suppliers/edit-supplier/:id",
                element: <EditSupplier />,
            },
            {
                path: "cheques/edit-cheque/:id",
                element: <EditCheque />,
            },
            {
                path: "invoices/edit-invoice/:id",
                element: <EditInvoice />,
            },
            {
                path: "suppliers/view-supplier/:id",
                element: <ViewSupplier />,
            },
            {
                path: "cheques/view-cheque/:id",
                element: <ViewCheque />,
            },
            {
                path: "invoices/view-invoice/:id",
                element: <ViewInvoice />,
            },
            {
                path: "*",
                element: <Navigate to="/app/dashboard" replace />,
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
        loader: authChecker,
    },
]);

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <MantineProvider>
            <DatesProvider settings={{ timezone: "UTC" }}>
                <Suspense fallback={<Loading />}>
                    <LoadingProvider>
                        <Notifications position="top-right" mt={50} />
                        {/*<StrictMode>*/}
                        <RouterProvider router={router} />
                        {/*</StrictMode>*/}
                    </LoadingProvider>
                </Suspense>
            </DatesProvider>
        </MantineProvider>
    </Provider>
);
