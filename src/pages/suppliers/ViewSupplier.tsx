import { IconArrowLeft, IconMail, IconPhone } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Badge, Button, Card } from "@mantine/core";
import { getSupplier } from "../../store/supplierSlice/supplierSlice.ts";

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
            <div className="items-center flex flex-row justify-between p-4">
                <div className="flex flex-row items-center">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <span className="text-lg font-semibold ml-4">
                        View Supplier
                    </span>
                </div>
            </div>
            <div className="mx-4 my-4 lg:w-1/2">
                <Card shadow="md" withBorder>
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
                            color={supplier?.status ? "green" : "red"}
                            radius="sm"
                        >
                            {supplier?.status ? "ACTIVE" : "INACTIVE"}
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
                    {supplier?.email && (<Button
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

export default ViewSupplier;
