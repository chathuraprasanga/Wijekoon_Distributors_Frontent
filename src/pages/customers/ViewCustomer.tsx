import { IconArrowLeft, IconMail, IconPhone } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { getCustomer } from "../../store/customerSlice/customerSlice.ts";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Badge, Box, Button, Card, Group } from "@mantine/core";

const ViewCustomer = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const id: any = useParams().id ?? null;
    const customer = useSelector(
        (state: RootState) => state.customer.selectedCustomer
    );

    useEffect(() => {
        if (id) {
            fetchSelectedCustomer();
        }
    }, [dispatch]);

    const fetchSelectedCustomer = async () => {
        setLoading(true);
        await dispatch(getCustomer(id));
        setLoading(false);
    };

    const handleCall = () => {
        window.location.href = `tel:${customer?.phone}`;
    };

    const handleEmail = () => {
        window.location.href = `mailto:${customer?.email}`;
    };

    return (
        <>
            <Group p="lg" display="flex" justify="space-between" align="center">
                <Group display="flex">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <span className="text-lg font-semibold ml-4">
                        View Customer
                    </span>
                </Group>
            </Group>
            <Box mx="md" my="md">
                <Card shadow="md" withBorder w={{sm: "100%", lg: "50%"}} >
                    <div className="flex flex-row">
                        <div className="hidden lg:block lg:w-1/4">Name:</div>
                        <div>{customer?.name}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="hidden lg:block lg:w-1/4">Phone:</div>
                        <div>{customer?.phone}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="hidden lg:block lg:w-1/4">Email:</div>
                        <div>{customer?.email}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="hidden lg:block lg:w-1/4">Address:</div>
                        <div>{customer?.address}</div>
                    </div>
                    <div className="flex items-end mt-4">
                        <Badge
                            color={customer?.status ? "green" : "red"}
                            radius="sm"
                        >
                            {customer?.status ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                    </div>
                </Card>
                <Group display="flex" justify="flex-end" w={{sm: "100%", lg: "50%"}} mt="md" >
                    {/* Call Now Button: Visible only on mobile */}
                    <Button
                        color="dark"
                        radius="sm"
                        onClick={handleCall}
                        hiddenFrom="lg"
                        leftSection={<IconPhone/>}
                    >
                        Call Now
                    </Button>

                    {/* Email Now Button: Visible on all devices */}
                    {customer?.email && (<Button
                        color="dark"
                        radius="sm"
                        onClick={handleEmail}
                        className="block"
                        leftSection={<IconMail/>}

                    >
                        Email Now
                    </Button>)}
                </Group>
            </Box>
        </>
    );
};

export default ViewCustomer;
