import { IconArrowLeft } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { Badge, Box, Button, Card, Group } from "@mantine/core";
import toNotify from "../../helpers/toNotify.tsx";
import {
    changeStatusInvoice,
    getInvoice,
} from "../../store/invoiceSlice/invoiceSlice.ts";
import { amountPreview, datePreview } from "../../helpers/preview.tsx";
import { PAYMENT_STATUS_COLORS, USER_ROLES } from "../../helpers/types.ts";
import { hasPrivilege } from "../../helpers/previlleges.ts";

const ViewInvoice = () => {
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch | any>();
    const id: any = useParams().id ?? null;
    const invoice = useSelector(
        (state: RootState) => state.invoice.selectedInvoice
    );
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        if (id) {
            fetchSelectedInvoice();
        }
    }, [dispatch]);

    const fetchSelectedInvoice = async () => {
        setLoading(true);
        await dispatch(getInvoice(id));
        setLoading(false);
    };

    const chequeStatusUpdate = async (status: string) => {
        setLoading(true);
        const payload = {
            id,
            values: { invoiceStatus: status },
        };
        const response = await dispatch(changeStatusInvoice(payload));
        if (response.type === "invoice/changeStatus/fulfilled") {
            await fetchSelectedInvoice();
            setLoading(false);
            toNotify(
                "Success",
                "Invoice status changed successfully",
                "SUCCESS"
            );
        } else if (response.type === "invoice/changeStatus/rejected") {
            const error: any = response.payload.error;
            setLoading(false);
            toNotify("Error", `${error}`, "ERROR");
        } else {
            setLoading(false);
            toNotify(
                "Something went wrong",
                `Please contact system admin`,
                "WARNING"
            );
        }
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
                        View Invoice
                    </span>
                </Group>
            </Group>
            <Box mx="md" my="md">
                <Card shadow="md" withBorder w={{ sm: "100%", lg: "50%" }}>
                    <div className="flex flex-row">
                        <div className="w-2/4 lg:w-1/4">Supplier:</div>
                        <div>{invoice?.supplier?.name}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="w-2/4 lg:w-1/4">Invoice Date:</div>
                        <div>{datePreview(invoice?.invoiceDate)}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="w-2/4 lg:w-1/4">Invoice Number:</div>
                        <div>{invoice?.invoiceNumber}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="w-2/4 lg:w-1/4">Amount:</div>
                        <div>{amountPreview(invoice?.amount)}</div>
                    </div>
                    <div className="flex items-end mt-4">
                        <Badge
                            color={
                                PAYMENT_STATUS_COLORS[
                                    invoice?.invoiceStatus as keyof typeof PAYMENT_STATUS_COLORS
                                ] || "gray"
                            }
                            radius="xs"
                            size="sm"
                        >
                            {invoice?.invoiceStatus}
                        </Badge>
                    </div>
                </Card>
                <Group
                    display="flex"
                    justify="flex-end"
                    w={{ sm: "100%", lg: "50%" }}
                    mt="md"
                >
                    {invoice?.invoiceStatus === "NOT PAID" &&
                        hasPrivilege(user.role, USER_ROLES.SUPER_ADMIN) && (
                            <Button
                                color="violet"
                                radius="sm"
                                size="xs"
                                ml={10}
                                onClick={() => chequeStatusUpdate("PAID")}
                            >
                                Paid
                            </Button>
                        )}
                    {invoice?.invoiceStatus === "NOT PAID" && (
                        <Button
                            color="green"
                            radius="sm"
                            size="xs"
                            ml={10}
                            onClick={() =>
                                navigate("/app/invoices/bulk-invoice-payment")
                            }
                        >
                            Make Payments
                        </Button>
                    )}
                </Group>
            </Box>
        </>
    );
};

export default ViewInvoice;
