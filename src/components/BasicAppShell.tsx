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
    IconBuildingWarehouse,
    IconCalendarDollar,
    IconCashBanknote,
    IconInvoice,
    IconLayoutDashboard,
    IconMoon,
    IconPackages,
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
                    {hasAnyPrivilege(userDetails.role, [
                        USER_ROLES.SUPER_ADMIN,
                        USER_ROLES.ADMIN,
                        USER_ROLES.OWNER,
                        USER_ROLES.SALES_REP,
                        USER_ROLES.SALES_MANAGER,
                        USER_ROLES.DRIVER,
                    ]) && (
                        <NavLink
                            onClick={() => handleNavLinkClick("customers")}
                            label="Customers"
                            leftSection={
                                <IconUsersGroup size="1rem" stroke={1.5} />
                            }
                            variant="filled"
                            active={activePath === "customers"}
                        />
                    )}
                    {hasAnyPrivilege(userDetails.role, [
                        USER_ROLES.SUPER_ADMIN,
                        USER_ROLES.ADMIN,
                        USER_ROLES.OWNER,
                        USER_ROLES.SALES_REP,
                        USER_ROLES.SALES_MANAGER,
                    ]) && (
                        <NavLink
                            onClick={() => handleNavLinkClick("products")}
                            label="Products"
                            leftSection={
                                <IconPackages size="1rem" stroke={1.5} />
                            }
                            variant="filled"
                            active={activePath === "products"}
                        />
                    )}
                    {hasAnyPrivilege(userDetails.role, [
                        USER_ROLES.SUPER_ADMIN,
                        USER_ROLES.ADMIN,
                        USER_ROLES.OWNER,
                    ]) && (
                        <NavLink
                            onClick={() => handleNavLinkClick("suppliers")}
                            label="Suppliers"
                            leftSection={<IconTruck size="1rem" stroke={1.5} />}
                            variant="filled"
                            active={activePath === "suppliers"}
                        />
                    )}
                    {hasAnyPrivilege(userDetails.role, [
                        USER_ROLES.SUPER_ADMIN,
                        USER_ROLES.ADMIN,
                        USER_ROLES.OWNER,
                        USER_ROLES.SALES_REP,
                        USER_ROLES.SALES_MANAGER,
                    ]) && (
                        <NavLink
                            onClick={() => handleNavLinkClick("cheques")}
                            label="Cheques"
                            leftSection={
                                <IconCashBanknote size="1rem" stroke={1.5} />
                            }
                            variant="filled"
                            active={activePath === "cheques"}
                        />
                    )}
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
                                <IconCalendarDollar size="1rem" stroke={1.5} />
                            }
                            variant="filled"
                            active={activePath === "cheque-payments"}
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
                            variant="filled"
                            active={activePath === "invoices"}
                        />
                    )}
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
                            variant="filled"
                            active={activePath === "warehouses"}
                        />
                    )}
                </ScrollArea>
            </AppShell.Navbar>

            <AppShell.Main>
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
                    </>
                )}
                <Divider mt="sm" />

                <Paper shadow="md" mt="md" withBorder className="h-full w-full">
                    <Box mt="md" className="h-full w-full">
                        <Outlet />
                    </Box>
                </Paper>
            </AppShell.Main>
        </AppShell>
    );
};

export default BasicAppShell;
