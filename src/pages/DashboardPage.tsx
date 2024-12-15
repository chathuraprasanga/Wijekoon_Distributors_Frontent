import {
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
import { ActionIcon, Box, Grid, Paper, Text } from "@mantine/core";

const DashboardPage = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const user = useSelector((state: RootState) => state.auth.user);
    const dashboardDetails = useSelector((state: RootState) => state.dashboard);

    useEffect(() => {
        fetchDashboardDetails();
    }, [dispatch]);

    const fetchDashboardDetails = async () => {
        setLoading(true);
        const response = await dispatch(
            getDashboardDetails({ userId: user._id })
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
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                    <Paper
                        shadow="md"
                        p="md"
                        radius="sm"
                        display="flex"
                        withBorder
                        className="items-center"
                    >
                        <Box mr="xl">
                            <ActionIcon size="xl" variant="light">
                                <IconCashBanknote />
                            </ActionIcon>
                        </Box>
                        <Box>
                            <Text size="lg" fw={500}>
                                Cheques
                            </Text>
                            <Text size="sm">
                                # {dashboardDetails?.chequesCount}
                            </Text>
                        </Box>
                    </Paper>
                </Grid.Col>

                {/* Invoices Card */}
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                    <Paper
                        shadow="md"
                        p="md"
                        radius="sm"
                        display="flex"
                        withBorder
                        className="items-center"
                    >
                        <Box mr="xl">
                            <ActionIcon size="xl" variant="light">
                                <IconInvoice />
                            </ActionIcon>
                        </Box>
                        <Box>
                            <Text size="lg" fw={500}>
                                Invoices
                            </Text>
                            <Text size="sm">
                                # {dashboardDetails?.invoicesCount}
                            </Text>
                        </Box>
                    </Paper>
                </Grid.Col>

                {/* Customers Card */}
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                    <Paper
                        shadow="md"
                        p="md"
                        radius="sm"
                        display="flex"
                        withBorder
                        className="items-center"
                    >
                        <Box mr="xl">
                            <ActionIcon size="xl" variant="light">
                                <IconUsersGroup />
                            </ActionIcon>
                        </Box>
                        <Box>
                            <Text size="lg" fw={500}>
                                Customers
                            </Text>
                            <Text size="sm">
                                # {dashboardDetails?.customersCount}
                            </Text>
                        </Box>
                    </Paper>
                </Grid.Col>

                {/* Products Card */}
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                    <Paper
                        shadow="md"
                        p="md"
                        radius="sm"
                        display="flex"
                        withBorder
                        className="items-center"
                    >
                        <Box mr="xl">
                            <ActionIcon size="xl" variant="light">
                                <IconPackages />
                            </ActionIcon>
                        </Box>
                        <Box>
                            <Text size="lg" fw={500}>
                                Products
                            </Text>
                            <Text size="sm">
                                # {dashboardDetails?.productsCount}
                            </Text>
                        </Box>
                    </Paper>
                </Grid.Col>

            </Grid>
            <Grid mt="md">

            </Grid>
        </Paper>
    );
};

export default DashboardPage;
