export const rolesData = [
    { label: "Admin", value: "admin", color: "#007bff" }, // Blue
    { label: "Driver", value: "driver", color: "#17a2b8" }, // Teal
    { label: "Helper", value: "helper", color: "#6c757d" }, // Gray
    { label: "Owner", value: "owner", color: "#ffc107" }, // Yellow
    { label: "Sales Manager", value: "sales_manager", color: "#28a745" }, // Green
    { label: "Sales Rep", value: "sales_rep", color: "#fd7e14" }, // Orange
    { label: "Stock Keeper", value: "stock_keeper", color: "#6610f2" }, // Purple
    { label: "Super Admin", value: "super_admin", color: "#dc3545" }, // Red
    { label: "Warehouse Manager", value: "warehouse_manager", color: "#20c997" }, // Light Green
];

export const searchTypes = {
    CUSTOMER: "CUSTOMER"
}

export const customersRoutes = [
    "customers",
    "customers/add-customer",
    "customers/edit-customer/:id",
    "customers/view-customer/:id",
    "sales-records",
    "sales-records/add-sales-record",
    "sales-records/view-sales-record/:id",
    "sales-records/edit-sales-record/:id",
    "orders",
    "/orders/add-order",
    "/orders/edit-order/:id",
    "/orders/view-order/:id",
    "cheques",
    "cheques/add-cheque",
    "cheques/edit-cheque/:id",
    "cheques/view-cheque/:id",
];

export const suppliersRoutes = [
    "suppliers",
    "suppliers/edit-supplier/:id",
    "suppliers/add-supplier",
    "suppliers/view-supplier/:id",
    "products",
    "products/edit-product/:id",
    "products/view-product/:id",
    "products/add-product",
    "invoices",
    "invoices/add-invoice",
    "invoices/edit-invoice/:id",
    "invoices/view-invoice/:id",
    "bulk-invoice-payments",
    "bulk-invoice-payments/add-bulk-invoice-payment",
    "bulk-invoice-payments/view-bulk-invoice-payment/:id",
];

export const paymentsRoutes = [
    "cheque-payments",
    "cheque-payments/add-cheque-payment",
    "cheque-payments/edit-cheque-payment/:id",
    "cheque-payments/view-cheque-payment/:id",
];

export const assetsRoutes = [
    "warehouses/view-warehouse/:id",
    "warehouses",
];
