import { IconArrowLeft } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Badge, Box, Card, Group, Text } from "@mantine/core";
import { getSupplier } from "../../store/supplierSlice/supplierSlice.ts";
import { BASIC_STATUS_COLORS } from "../../helpers/types.ts";

const Viewvehicle = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const id: any = useParams().id ?? null;
    const vehicle = useSelector(
        (state: RootState) => state.vehicles.selectedVehicle
    );

    useEffect(() => {
        if (id) {
            fetchVehicle();
        }
    }, [dispatch]);

    const fetchVehicle = async () => {
        setLoading(true);
        await dispatch(getSupplier(id));
        setLoading(false);
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
                        View Vehicle
                    </Text>
                </Group>
            </Group>
            <Box mx="md" my="md">
                <Card shadow="md" withBorder w={{ sm: "100%", lg: "50%" }}>
                    <div className="flex flex-row">
                        <div className="hidden lg:block lg:w-1/4">Type:</div>
                        <div>{vehicle?.type}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="hidden lg:block lg:w-1/4">Brand:</div>
                        <div>{vehicle?.brand}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="hidden lg:block lg:w-1/4">Number:</div>
                        <div>{vehicle?.number}</div>
                    </div>
                    <div className="flex items-end mt-4">
                        <Badge
                            color={
                                BASIC_STATUS_COLORS[
                                    vehicle.status as keyof typeof BASIC_STATUS_COLORS
                                    ] || "gray"
                            }
                            radius="xs"
                            size="sm"
                        >
                            {vehicle?.status ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                    </div>
                </Card>
            </Box>
        </>
    );
};

export default Viewvehicle;
