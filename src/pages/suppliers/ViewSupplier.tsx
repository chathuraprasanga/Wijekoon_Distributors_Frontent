import { IconArrowLeft, IconMail, IconPhone } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Badge, Box, Button, Card, Group, Text } from "@mantine/core";
import { getSupplier } from "../../store/supplierSlice/supplierSlice.ts";
import { BASIC_STATUS_COLORS } from "../../helpers/types.ts";

const ViewSupplier = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const id: any = useParams().id ?? null;
    const supplier = useSelector(
        (state: RootState) => state.supplier.selectedSupplier
    );

    useEffect(() => {
        if (id) {
            fetchSelectedSupplier();
        }
    }, [dispatch]);

    const fetchSelectedSupplier = async () => {
        setLoading(true);
        await dispatch(getSupplier(id));
        setLoading(false);
    };

    const handleCall = () => {
        window.location.href = `tel:${supplier?.phone}`;
    };

    const handleEmail = () => {
        window.location.href = `mailto:${supplier?.email}`;
    };

    return (
        <>
            <Group p="lg" display="flex" justify="space-between" align="center">
                <Group display="flex">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <Text size="lg" fw={500} ml="md">
                        View Supplier
                    </Text>
                </Group>
            </Group>
            <Box mx="md" my="md">
                <Card shadow="md" withBorder w={{ sm: "100%", lg: "50%" }}>
                    <div className="flex flex-row">
                        <div className="hidden lg:block lg:w-1/4">Name:</div>
                        <div>{supplier?.name}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="hidden lg:block lg:w-1/4">Phone:</div>
                        <div>{supplier?.phone}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="hidden lg:block lg:w-1/4">Email:</div>
                        <div>{supplier?.email}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="hidden lg:block lg:w-1/4">Address:</div>
                        <div>{supplier?.address}</div>
                    </div>
                    <div className="flex items-end mt-4">
                        <Badge
                            color={
                                BASIC_STATUS_COLORS[
                                    supplier.status as keyof typeof BASIC_STATUS_COLORS
                                ] || "gray"
                            }
                            radius="xs"
                            size="sm"
                        >
                            {supplier?.status ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                    </div>
                </Card>
                <Group
                    display="flex"
                    justify="flex-end"
                    w={{ sm: "100%", lg: "50%" }}
                    mt="md"
                >
                    {/* Call Now Button: Visible only on mobile */}
                    <Button
                        radius="sm"
                        onClick={handleCall}
                        hiddenFrom="lg"
                        leftSection={<IconPhone />}
                        size="xs"
                    >
                        Call Now
                    </Button>

                    {/* Email Now Button: Visible on all devices */}
                    {supplier?.email && (
                        <Button
                            radius="sm"
                            onClick={handleEmail}
                            className="block"
                            leftSection={<IconMail />}
                            size="xs"
                        >
                            Email Now
                        </Button>
                    )}
                </Group>
            </Box>
        </>
    );
};

export default ViewSupplier;
