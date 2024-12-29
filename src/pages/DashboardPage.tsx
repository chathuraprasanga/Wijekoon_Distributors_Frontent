import {
    IconBuildingBank,
    IconCalendarTime,
    IconCashBanknote,
    IconInvoice,
    IconPackages,
    IconUsersGroup,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store.ts";
import { useEffect } from "react";
import { useLoading } from "../helpers/loadingContext.tsx";
import { getDashboardDetails } from "../store/dashboardSlice/dashboardSlice.ts";
import toNotify from "../helpers/toNotify.tsx";
import { ActionIcon, Box, Grid, Group, Paper, Text } from "@mantine/core";

const DashboardPage = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const user = useSelector((state: RootState) => state.auth.user);
    const dashboardDetails = useSelector((state: RootState) => state.dashboard);
    const chequesToDeposit:any = dashboardDetails.chequesToDeposit;

    useEffect(() => {
        fetchDashboardDetails();
    }, [dispatch]);

    const fetchDashboardDetails = async () => {
        setLoading(true);
        const response = await dispatch(
            getDashboardDetails({ userId: user._id})
        );
        if (response.type === "dashboard/getDetails/fulfilled") {
            setLoading(false);
        } else {
            setLoading(false);
            toNotify(
                "Warning",
                "Something went wrong, Please contact Admin",
                "WARNING"
            );
        }
    };

    return (
        <Paper p="md">
            <Grid gutter="md" className="flex flex-row">
                {/* Cheques Card */}
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                    <Paper
                        shadow="md"
                        p="md"
                        radius="md"
                        withBorder
                        className="hover:shadow-lg transition-transform transform hover:scale-105"
                    >
                        <Group align="center">
                            <ActionIcon
                                size="xl"
                                radius="md"
                                variant="gradient"
                                gradient={{ from: "teal", to: "blue", deg: 45 }}
                            >
                                <IconCashBanknote size={28} />
                            </ActionIcon>
                            <Box>
                                <Text size="lg" fw={600}>
                                    Cheques
                                </Text>
                                <Text size="sm" c="dimmed">
                                    # {dashboardDetails?.chequesCount}
                                </Text>
                            </Box>
                        </Group>
                    </Paper>
                </Grid.Col>

                {/* Invoices Card */}
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                    <Paper
                        shadow="md"
                        p="md"
                        radius="md"
                        withBorder
                        className="hover:shadow-lg transition-transform transform hover:scale-105"
                    >
                        <Group align="center">
                            <ActionIcon
                                size="xl"
                                radius="md"
                                variant="gradient"
                                gradient={{
                                    from: "orange",
                                    to: "red",
                                    deg: 45,
                                }}
                            >
                                <IconInvoice size={28} />
                            </ActionIcon>
                            <Box>
                                <Text size="lg" fw={600}>
                                    Invoices
                                </Text>
                                <Text size="sm" c="dimmed">
                                    # {dashboardDetails?.invoicesCount}
                                </Text>
                            </Box>
                        </Group>
                    </Paper>
                </Grid.Col>

                {/* Customers Card */}
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                    <Paper
                        shadow="md"
                        p="md"
                        radius="md"
                        withBorder
                        className="hover:shadow-lg transition-transform transform hover:scale-105"
                    >
                        <Group align="center">
                            <ActionIcon
                                size="xl"
                                radius="md"
                                variant="gradient"
                                gradient={{
                                    from: "purple",
                                    to: "pink",
                                    deg: 45,
                                }}
                            >
                                <IconUsersGroup size={28} />
                            </ActionIcon>
                            <Box>
                                <Text size="lg" fw={600}>
                                    Customers
                                </Text>
                                <Text size="sm" c="dimmed">
                                    # {dashboardDetails?.customersCount}
                                </Text>
                            </Box>
                        </Group>
                    </Paper>
                </Grid.Col>

                {/* Products Card */}
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                    <Paper
                        shadow="md"
                        p="md"
                        radius="md"
                        withBorder
                        className="hover:shadow-lg transition-transform transform hover:scale-105"
                    >
                        <Group align="center">
                            <ActionIcon
                                size="xl"
                                radius="md"
                                variant="gradient"
                                gradient={{
                                    from: "cyan",
                                    to: "green",
                                    deg: 45,
                                }}
                            >
                                <IconPackages size={28} />
                            </ActionIcon>
                            <Box>
                                <Text size="lg" fw={600}>
                                    Products
                                </Text>
                                <Text size="sm" c="dimmed">
                                    # {dashboardDetails?.productsCount}
                                </Text>
                            </Box>
                        </Group>
                    </Paper>
                </Grid.Col>
            </Grid>
            <Grid mt="md">
                <Grid.Col span={{ lg: 6, md: 6, sm: 12 }}>
                    <Paper
                        shadow="md"
                        p="md"
                        radius="md"
                        withBorder
                        className="hover:shadow-lg transition-transform transform hover:scale-105"
                    >
                        <Group align="center">
                            <ActionIcon
                                size="xl"
                                radius="md"
                                variant="gradient"
                                gradient={{
                                    from: "indigo",
                                    to: "cyan",
                                    deg: 45,
                                }}
                            >
                                <IconBuildingBank size={28} />
                            </ActionIcon>
                            <Box>
                                <Text size="lg" fw={600}>
                                    Cheques to Deposit Today
                                </Text>
                                <Text size="sm" c="dimmed">
                                    Cheque Count: #{chequesToDeposit.count}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    Total Value: Rs. {chequesToDeposit.amount.toFixed(2) || 0.00}
                                </Text>
                            </Box>
                        </Group>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={{ lg: 6, md: 6, sm: 12 }}>
                    <Paper
                        shadow="md"
                        p="md"
                        radius="md"
                        withBorder
                        className="hover:shadow-lg transition-transform transform hover:scale-105"
                    >
                        <Group align="center">
                            <ActionIcon
                                size="xl"
                                radius="md"
                                variant="gradient"
                                gradient={{ from: "blue", to: "cyan", deg: 90 }}
                            >
                                <IconCalendarTime size={28} />
                            </ActionIcon>
                            <Box>
                                <Text size="lg" fw={600}>
                                    Cheques Comes to Transfer
                                </Text>
                                <Text size="sm" c="dimmed">
                                    Cheque Count: #4
                                </Text>
                                <Text size="sm" c="dimmed">
                                    Total Value: Rs. 11000
                                </Text>
                            </Box>
                        </Group>
                    </Paper>
                </Grid.Col>
            </Grid>
        </Paper>
    );
};

export default DashboardPage;
