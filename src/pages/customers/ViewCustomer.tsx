import { IconArrowLeft, IconMail, IconPhone } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { getCustomer } from "../../store/customerSlice/customerSlice.ts";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Badge, Button, Card } from "@mantine/core";

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
            <div className="items-center flex flex-row justify-between p-4">
                <div className="flex flex-row items-center">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <span className="text-lg font-semibold ml-4">
                        View Customer
                    </span>
                </div>
            </div>
            <div className="mx-4 my-4 lg:w-1/2">
                <Card shadow="md" withBorder>
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
                <div className="mt-4 space-x-4 flex justify-end">
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
                </div>
            </div>
        </>
    );
};

export default ViewCustomer;
