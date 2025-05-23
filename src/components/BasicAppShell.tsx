import {
    ActionIcon,
    AppShell,
    Box,
    Burger,
    Divider,
    Group,
    NavLink,
    Paper,
    ScrollArea,
    Text,
    useComputedColorScheme,
    useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import logo from "../assets/logo1.png";
import UserInfo from "./UserInfo.tsx";
import {
    IconBuildingStore,
    IconBuildingWarehouse,
    IconCalendarDollar,
    IconCar,
    IconCashBanknote,
    IconInvoice,
    IconLayoutDashboard, IconMessageDollar,
    IconMoodSearch,
    IconMoon,
    IconPackages,
    IconReceipt,
    IconReceiptDollar,
    IconSun,
    IconTruck,
    IconUsersGroup,
} from "@tabler/icons-react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../store/store.ts";
import cx from "clsx";
import classes from "./Demo.module.css";
import { hasAnyPrivilege } from "../helpers/previlleges.ts";
import { USER_ROLES } from "../helpers/types.ts";
import {
    assetsRoutes,
    customersRoutes,
    paymentsRoutes,
    suppliersRoutes,
} from "../utils/settings.ts";

const BasicAppShell = () => {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme("light", {
        getInitialValueInEffect: true,
    });
    const navigate = useNavigate();
    const location = useLocation();
    const userDetails = useSelector((state: RootState) => state.auth.user);
    const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] =
        useDisclosure(false);
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

    const greetingName = userDetails?.username?.split(" ")[0];
    const activePath = location?.pathname?.split("/")[2];

    const handleNavLinkClick = (path: any) => {
        navigate(path);
        closeMobile(); // Close the mobile navbar when a NavLink is clicked
    };

    const currentDate = new Date();
    const displayDate = currentDate.toISOString().split("T")[0];

    const getActiveMainRoute = (type: string) => {
        const location = useLocation();

        const routeMap: Record<string, string[]> = {
            CUSTOMERS: customersRoutes,
            SUPPLIERS: suppliersRoutes,
            PAYMENTS: paymentsRoutes,
            ASSETS: assetsRoutes,
        };

        const routes = routeMap[type];

        if (!routes) return false;

        return routes.some((route) =>
            location.pathname.includes(route.split("/:")[0])
        );
    };

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: "sm",
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
            padding="md"
            zIndex={1}
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Box display="flex" className="flex items-center">
                        <Burger
                            opened={mobileOpened}
                            onClick={toggleMobile}
                            hiddenFrom="sm"
                            size="sm"
                        />
                        <Burger
                            opened={desktopOpened}
                            onClick={toggleDesktop}
                            visibleFrom="sm"
                            size="sm"
                        />
                        <img
                            src={logo}
                            height={30}
                            className="h-10 ml-6"
                            alt="logo"
                        />
                    </Box>
                    <Group display="flex" justify="center">
                        <ActionIcon
                            onClick={() =>
                                setColorScheme(
                                    computedColorScheme === "light"
                                        ? "dark"
                                        : "light"
                                )
                            }
                            variant="light"
                            size="md"
                            aria-label="Toggle color scheme"
                            mr="sm"
                        >
                            <IconSun
                                className={cx(classes.icon, classes.light)}
                                stroke={1.5}
                            />
                            <IconMoon
                                className={cx(classes.icon, classes.dark)}
                                stroke={1.5}
                            />
                        </ActionIcon>
                        <UserInfo />
                    </Group>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar>
                <ScrollArea>
                    <NavLink
                        onClick={() => handleNavLinkClick("dashboard")}
                        label="Dashboard"
                        leftSection={
                            <IconLayoutDashboard size="1rem" stroke={1.5} />
                        }
                        variant="filled"
                        active={activePath === "dashboard"}
                    />
                    <NavLink
                        label="Customers"
                        active={getActiveMainRoute("CUSTOMERS")}
                        leftSection={
                            <IconUsersGroup size="1rem" stroke={1.5} />
                        }
                        variant="filled"
                    >
                        {hasAnyPrivilege(userDetails.role, [
                            USER_ROLES.SUPER_ADMIN,
                            USER_ROLES.ADMIN,
                            USER_ROLES.OWNER,
                            USER_ROLES.SALES_REP,
                            USER_ROLES.SALES_MANAGER,
                            USER_ROLES.DRIVER,
                            USER_ROLES.WAREHOUSE_MANAGER,
                        ]) && (
                            <NavLink
                                onClick={() => handleNavLinkClick("customers")}
                                label="Customers"
                                leftSection={
                                    <IconUsersGroup size="1rem" stroke={1.5} />
                                }
                                variant="light"
                                active={activePath === "customers"}
                            />
                        )}
                        {hasAnyPrivilege(userDetails.role, [
                            USER_ROLES.SUPER_ADMIN,
                            USER_ROLES.ADMIN,
                            USER_ROLES.OWNER,
                            USER_ROLES.SALES_REP,
                            USER_ROLES.SALES_MANAGER,
                            USER_ROLES.WAREHOUSE_MANAGER,
                            USER_ROLES.STOCK_KEEPER,
                        ]) && (
                            <NavLink
                                onClick={() => handleNavLinkClick("orders")}
                                label="Purchase Orders"
                                leftSection={
                                    <IconReceipt size="1rem" stroke={1.5} />
                                }
                                variant="light"
                                active={activePath === "orders"}
                            />
                        )}
                        {hasAnyPrivilege(userDetails.role, [
                            USER_ROLES.SUPER_ADMIN,
                            USER_ROLES.ADMIN,
                            USER_ROLES.OWNER,
                            USER_ROLES.SALES_REP,
                            USER_ROLES.SALES_MANAGER,
                            USER_ROLES.WAREHOUSE_MANAGER,
                            USER_ROLES.STOCK_KEEPER,
                        ]) && (
                            <NavLink
                                onClick={() =>
                                    handleNavLinkClick("sales-records")
                                }
                                label="Sales Records"
                                leftSection={
                                    <IconBuildingStore
                                        size="1rem"
                                        stroke={1.5}
                                    />
                                }
                                variant="light"
                                active={activePath === "sales-records"}
                            />
                        )}
                        {hasAnyPrivilege(userDetails.role, [
                            USER_ROLES.SUPER_ADMIN,
                            USER_ROLES.ADMIN,
                            USER_ROLES.OWNER,
                            USER_ROLES.SALES_REP,
                            USER_ROLES.SALES_MANAGER,
                            USER_ROLES.WAREHOUSE_MANAGER,
                        ]) && (
                            <NavLink
                                onClick={() => handleNavLinkClick("cheques")}
                                label="Cheques"
                                leftSection={
                                    <IconCashBanknote
                                        size="1rem"
                                        stroke={1.5}
                                    />
                                }
                                variant="light"
                                active={activePath === "cheques"}
                            />
                        )}
                    </NavLink>

                    <NavLink
                        label="Suppliers"
                        active={getActiveMainRoute("SUPPLIERS")}
                        leftSection={<IconTruck size="1rem" stroke={1.5} />}
                        variant="filled"
                    >
                        {hasAnyPrivilege(userDetails.role, [
                            USER_ROLES.SUPER_ADMIN,
                            USER_ROLES.ADMIN,
                            USER_ROLES.OWNER,
                        ]) && (
                            <NavLink
                                onClick={() => handleNavLinkClick("suppliers")}
                                label="Suppliers"
                                leftSection={
                                    <IconTruck size="1rem" stroke={1.5} />
                                }
                                variant="light"
                                active={activePath === "suppliers"}
                            />
                        )}
                        {hasAnyPrivilege(userDetails.role, [
                            USER_ROLES.SUPER_ADMIN,
                            USER_ROLES.ADMIN,
                            USER_ROLES.OWNER,
                            USER_ROLES.SALES_REP,
                            USER_ROLES.SALES_MANAGER,
                            USER_ROLES.WAREHOUSE_MANAGER,
                        ]) && (
                            <NavLink
                                onClick={() => handleNavLinkClick("products")}
                                label="Products"
                                leftSection={
                                    <IconPackages size="1rem" stroke={1.5} />
                                }
                                variant="light"
                                active={activePath === "products"}
                            />
                        )}
                        {hasAnyPrivilege(userDetails.role, [
                            USER_ROLES.SUPER_ADMIN,
                            USER_ROLES.ADMIN,
                            USER_ROLES.OWNER,
                        ]) && (
                            <NavLink
                                onClick={() => handleNavLinkClick("invoices")}
                                label="Invoices"
                                leftSection={
                                    <IconInvoice size="1rem" stroke={1.5} />
                                }
                                variant="light"
                                active={activePath === "invoices"}
                            />
                        )}
                        {hasAnyPrivilege(userDetails.role, [
                            USER_ROLES.SUPER_ADMIN,
                            USER_ROLES.ADMIN,
                            USER_ROLES.OWNER,
                        ]) && (
                            <NavLink
                                onClick={() =>
                                    handleNavLinkClick("bulk-invoice-payments")
                                }
                                label="Bulk Invoice Payments"
                                leftSection={
                                    <IconReceiptDollar
                                        size="1rem"
                                        stroke={1.5}
                                    />
                                }
                                variant="light"
                                active={activePath === "bulk-invoice-payments"}
                            />
                        )}
                    </NavLink>

                    <NavLink
                        label="Assets"
                        active={getActiveMainRoute("ASSETS")}
                        leftSection={
                            <IconBuildingWarehouse size="1rem" stroke={1.5} />
                        }
                        variant="filled"
                    >
                        {hasAnyPrivilege(userDetails.role, [
                            USER_ROLES.SUPER_ADMIN,
                            USER_ROLES.ADMIN,
                            USER_ROLES.OWNER,
                            USER_ROLES.WAREHOUSE_MANAGER,
                            USER_ROLES.STOCK_KEEPER,
                            USER_ROLES.SALES_MANAGER,
                        ]) && (
                            <NavLink
                                onClick={() => handleNavLinkClick("warehouses")}
                                label="Warehouses"
                                leftSection={
                                    <IconBuildingWarehouse
                                        size="1rem"
                                        stroke={1.5}
                                    />
                                }
                                variant="light"
                                active={activePath === "warehouses"}
                            />
                        )}
                        {hasAnyPrivilege(userDetails.role, [
                            USER_ROLES.SUPER_ADMIN,
                            USER_ROLES.ADMIN,
                            USER_ROLES.OWNER,
                        ]) && (
                            <NavLink
                                onClick={() => handleNavLinkClick("employees")}
                                label="Employees"
                                leftSection={
                                    <IconMoodSearch size="1rem" stroke={1.5} />
                                }
                                variant="light"
                                active={activePath === "employees"}
                            />
                        )}
                        {hasAnyPrivilege(userDetails.role, [
                            USER_ROLES.SUPER_ADMIN,
                            USER_ROLES.ADMIN,
                            USER_ROLES.OWNER,
                        ]) && (
                            <NavLink
                                onClick={() => handleNavLinkClick("vehicles")}
                                label="Vehicles"
                                leftSection={
                                    <IconCar size="1rem" stroke={1.5} />
                                }
                                variant="light"
                                active={activePath === "vehicles"}
                            />
                        )}
                    </NavLink>

                    <NavLink
                        label="Finance"
                        active={getActiveMainRoute("PAYMENTS")}
                        leftSection={
                            <IconCalendarDollar size="1rem" stroke={1.5} />
                        }
                        variant="filled"
                    >
                        {hasAnyPrivilege(userDetails.role, [
                            USER_ROLES.SUPER_ADMIN,
                            USER_ROLES.ADMIN,
                            USER_ROLES.OWNER,
                        ]) && (
                            <NavLink
                                onClick={() =>
                                    handleNavLinkClick("cheque-payments")
                                }
                                label="Cheque Payments"
                                leftSection={
                                    <IconCalendarDollar
                                        size="1rem"
                                        stroke={1.5}
                                    />
                                }
                                variant="light"
                                active={activePath === "cheque-payments"}
                            />
                        )}
                        {hasAnyPrivilege(userDetails.role, [
                            USER_ROLES.SUPER_ADMIN,
                            USER_ROLES.ADMIN,
                            USER_ROLES.OWNER,
                        ]) && (
                            <NavLink
                                onClick={() =>
                                    handleNavLinkClick("expenses")
                                }
                                label="Expenses"
                                leftSection={
                                    <IconMessageDollar
                                        size="1rem"
                                        stroke={1.5}
                                    />
                                }
                                variant="light"
                                active={activePath === "expenses"}
                            />
                        )}
                    </NavLink>
                </ScrollArea>
            </AppShell.Navbar>

            <AppShell.Main>
                <Paper shadow="md" p="md" withBorder className="h-full w-full">
                    {activePath === "dashboard" && (
                        <>
                            <Group>
                                <Text size="xl" fw={500}>
                                    Hello {greetingName}.!
                                </Text>
                            </Group>
                            <Group>
                                <Text size="xs">{displayDate}</Text>
                            </Group>
                            <Divider mt="sm" />
                        </>
                    )}
                    <Outlet />
                </Paper>
            </AppShell.Main>
        </AppShell>
    );
};

export default BasicAppShell;
