import { AppShell, Burger, Divider, Group, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import logo from "../assets/logo1.png";
import UserInfo from "./UserInfo.tsx";
import {
    IconCashBanknote,
    IconInvoice,
    IconLayoutDashboard,
    IconPackages,
    IconTruck,
    IconUsersGroup,
} from "@tabler/icons-react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../store/store.ts";

const BasicAppShell = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userDetails = useSelector((state: RootState) => state.auth.user);
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

    const greetingName = userDetails?.username?.split(" ")[0];

    const activePath = location?.pathname?.split("/")[2];

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
                    <div className="flex flex-row items-center">
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
                    </div>
                    <div>
                        <UserInfo />
                    </div>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar>
                <NavLink
                    onClick={() => navigate("dashboard")}
                    label="Dashboard"
                    leftSection={
                        <IconLayoutDashboard size="1rem" stroke={1.5} />
                    }
                    variant="filled"
                    color="dark"
                    active={activePath === "dashboard"}
                />
                <NavLink
                    onClick={() => navigate("customers")}
                    label="Customers"
                    leftSection={<IconUsersGroup size="1rem" stroke={1.5} />}
                    variant="filled"
                    color="dark"
                    active={activePath === "customers"}
                />
                <NavLink
                    onClick={() => navigate("products")}
                    label="Products"
                    leftSection={<IconPackages size="1rem" stroke={1.5} />}
                    variant="filled"
                    color="dark"
                    active={activePath === "products"}
                />
                <NavLink
                    onClick={() => navigate("suppliers")}
                    label="Suppliers"
                    leftSection={<IconTruck size="1rem" stroke={1.5} />}
                    variant="filled"
                    color="dark"
                    active={activePath === "suppliers"}
                />
                <NavLink
                    onClick={() => navigate("cheques")}
                    label="Cheques"
                    leftSection={<IconCashBanknote size="1rem" stroke={1.5} />}
                    variant="filled"
                    color="dark"
                    active={activePath === "cheques"}
                />
                <NavLink
                    onClick={() => navigate("invoices")}
                    label="Invoices"
                    leftSection={<IconInvoice size="1rem" stroke={1.5} />}
                    variant="filled"
                    color="dark"
                    active={activePath === "invoices"}
                />
            </AppShell.Navbar>

            <AppShell.Main>
                { activePath === "dashboard" && (<div>
                    <span className="text-lg font-semibold">
                        Hello {greetingName}.!
                    </span>
                    <Divider/>
                </div>)}
                <div className="mt-2 border shadow-md h-full w-full">
                    <Outlet />
                </div>
            </AppShell.Main>
        </AppShell>
    );
};

export default BasicAppShell;
