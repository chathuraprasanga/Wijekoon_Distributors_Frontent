export const USER_ROLES = {
    SUPER_ADMIN: "super_admin",
    OWNER: "owner",
    SALES_MANAGER: "sales_manager",
    SALES_REP: "sales_rep",
    DRIVER: "driver",
    HELPER: "helper",
    ADMIN: "admin",
    WAREHOUSE_MANAGER: "warehouse_manager",
    STOCK_KEEPER: "stock_keeper",
};

export const CHEQUES_STATUS_COLORS = Object.freeze({
    PENDING: "yellow",
    DEPOSITED: "blue",
    "SEND TO SUPPLIER": "violet",
    RETURNED: "red",
    COMPLETED: "green",
});

export const BASIC_STATUS_COLORS = Object.freeze({
    true: "green",
    false: "red",
});

export const PAYMENT_STATUS_COLORS = Object.freeze({
    PAID: "green",
    "NOT PAID": "red",
});
