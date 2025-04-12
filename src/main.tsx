import React, { StrictMode, Suspense } from "react";
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

const LoginPage = React.lazy(() => import("./pages/LoginPage.tsx"));
const AppLayout = React.lazy(() => import("./layouts/AppLayout.tsx"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage.tsx"));
const Customers = React.lazy(() => import("./pages/customers"));
const Products = React.lazy(() => import("./pages/products"));
const Suppliers = React.lazy(() => import("./pages/suppliers"));
const Cheques = React.lazy(() => import("./pages/cheques"));
const Warehouses = React.lazy(() => import("./pages/warehouses"));
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
const ViewWarehouse = React.lazy(
    () => import("./pages/warehouses/ViewWarehouse.tsx")
);
const ViewCheque = React.lazy(() => import("./pages/cheques/ViewCheque.tsx"));
const ViewInvoice = React.lazy(
    () => import("./pages/invoices/ViewInvoice.tsx")
);
const SettingsPage = React.lazy(() => import("./pages/SettingsPage.tsx"));
const ChequePayments = React.lazy(
    () => import("./pages/chequePayments/index.tsx")
);
const AddChequePayment = React.lazy(
    () => import("./pages/chequePayments/AddChequePayment.tsx")
);
const EditChequePayment = React.lazy(
    () => import("./pages/chequePayments/EditChequePayment.tsx")
);
const ViewChequePayment = React.lazy(
    () => import("./pages/chequePayments/ViewChequePayments.tsx")
);
const AddBulkInvoicePayment = React.lazy(
    () => import("./pages/bulkInvoicePayments/AddBulkInvoicePayment.tsx")
);
const PreviousBulkInvoicePayments = React.lazy(
    () =>
        import(
            "./pages/bulkInvoicePayments"
        )
);
const ViewBulkInvoicePayments = React.lazy(
    () =>
        import(
            "./pages/bulkInvoicePayments/ViewBulkInvoicePayment.tsx"
        )
);
const SalesRecords = React.lazy(() => import("./pages/salesRecords/index.tsx"));
const AddSalesRecord = React.lazy(
    () => import("./pages/salesRecords/AddSalesRecord.tsx")
);

const ViewSalesRecord = React.lazy(
    () => import("./pages/salesRecords/ViewSalesRecord.tsx")
);

const EditSalesRecord = React.lazy(
    () => import("./pages/salesRecords/EditSalesRecord.tsx")
);

const PdfView = React.lazy(() => import("./pages/PdfViewPage.tsx"));
const Orders = React.lazy(() => import("./pages/orders"));
const AddOrder = React.lazy(
    () => import("./pages/orders/AddOrder.tsx")
);
const EditOrder = React.lazy(
    () => import("./pages/orders/EditOrder.tsx")
);
const ViewOrder = React.lazy(
    () => import("./pages/orders/ViewOrder.tsx")
);

const router = createBrowserRouter([
    {
        path: "app",
        element: <AppLayout />,
        loader: AuthLoaderChecker,
        children: [
            // dashboard route
            {
                path: "dashboard",
                element: <DashboardPage />,
            },

            // customers routes
            // customers sub
            {
                path: "customers",
                element: <Customers />,
            },
            {
                path: "customers/add-customer",
                element: <AddCustomer />,
            },
            {
                path: "customers/edit-customer/:id",
                element: <EditCustomer />,
            },
            {
                path: "customers/view-customer/:id",
                element: <ViewCustomer />,
            },
            // sales records sub
            {
                path: "sales-records",
                element: <SalesRecords />,
            },
            {
                path: "sales-records/add-sales-record",
                element: <AddSalesRecord />,
            },
            {
                path: "sales-records/view-sales-record/:id",
                element: <ViewSalesRecord />,
            },
            {
                path: "sales-records/edit-sales-record/:id",
                element: <EditSalesRecord />,
            },
            // orders sub
            {
                path: "orders",
                element: <Orders />,
            },
            {
                path: "orders/add-order",
                element: <AddOrder />,
            },
            {
                path: "orders/edit-order/:id",
                element: <EditOrder />,
            },
            {
                path: "orders/view-order/:id",
                element: <ViewOrder />,
            },

            // suppliers routes
            // suppliers sub
            {
                path: "suppliers",
                element: <Suppliers />,
            },
            {
                path: "suppliers/edit-supplier/:id",
                element: <EditSupplier />,
            },
            {
                path: "suppliers/add-supplier",
                element: <AddSupplier />,
            },
            {
                path: "suppliers/view-supplier/:id",
                element: <ViewSupplier />,
            },
            // products sub
            {
                path: "products",
                element: <Products />,
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
                path: "products/add-product",
                element: <AddProduct />,
            },

            // invoices routes
            // invoices sub
            {
                path: "invoices",
                element: <Invoices />,
            },
            {
                path: "invoices/add-invoice",
                element: <AddInvoice />,
            },
            {
                path: "invoices/edit-invoice/:id",
                element: <EditInvoice />,
            },
            {
                path: "invoices/view-invoice/:id",
                element: <ViewInvoice />,
            },
            // bulk invoices sub
            {
                path: "bulk-invoice-payments",
                element: <PreviousBulkInvoicePayments />,
            },
            {
                path: "bulk-invoice-payments/add-bulk-invoice-payment",
                element: <AddBulkInvoicePayment />,
            },
            {
                path: "bulk-invoice-payments/view-bulk-invoice-payment/:id",
                element: <ViewBulkInvoicePayments />,
            },

            // payments route
            // cheques sub
            {
                path: "cheques",
                element: <Cheques />,
            },
            {
                path: "cheques/add-cheque",
                element: <AddCheque />,
            },
            {
                path: "cheques/edit-cheque/:id",
                element: <EditCheque />,
            },
            {
                path: "cheques/view-cheque/:id",
                element: <ViewCheque />,
            },
            // cheque payments sub
            {
                path: "cheque-payments",
                element: <ChequePayments />,
            },
            {
                path: "cheque-payments/add-cheque-payment",
                element: <AddChequePayment />,
            },
            {
                path: "cheque-payments/edit-cheque-payment/:id",
                element: <EditChequePayment />,
            },
            {
                path: "cheque-payments/view-cheque-payment/:id",
                element: <ViewChequePayment />,
            },

            // assets routes
            // warehouses sub
            {
                path: "warehouses/view-warehouse/:id",
                element: <ViewWarehouse />,
            },
            {
                path: "warehouses",
                element: <Warehouses />,
            },

            // settings routes
            {
                path: "settings",
                element: <SettingsPage />,
            },

            // PDF routes
            {
                path: "pdf/view",
                element: <PdfView />,
            },

            // etc.
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
        <MantineProvider
            defaultColorScheme="light"
            theme={{ fontFamily: "Ubuntu, sans-serif" }}
        >
            <DatesProvider settings={{ timezone: "UTC" }}>
                <Suspense fallback={<Loading />}>
                    <LoadingProvider>
                        <Notifications position="top-right" mt={50} />
                        <StrictMode>
                            <RouterProvider router={router} />
                        </StrictMode>
                    </LoadingProvider>
                </Suspense>
            </DatesProvider>
        </MantineProvider>
    </Provider>
);
