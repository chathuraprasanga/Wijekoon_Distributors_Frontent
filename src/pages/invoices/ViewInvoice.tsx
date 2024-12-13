import { IconArrowLeft, } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Badge, Box, Button, Card, Group } from "@mantine/core";
import toNotify from "../../helpers/toNotify.tsx";
import { changeStatusInvoice, getInvoice } from "../../store/invoiceSlice/invoiceSlice.ts";
import datePreview from "../../helpers/datePreview.tsx";

type ChequeStatus = "PAID" | "NOT PAID";

const ViewInvoice = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const id: any = useParams().id ?? null;
    const invoice = useSelector(
        (state: RootState) => state.invoice.selectedInvoice
    );

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

    const colorsForInvoice: Record<ChequeStatus, string> = {
        PAID: "green",
        "NOT PAID": "red",
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
            toNotify("Success", "Invoice status changed successfully", "SUCCESS");
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
                <Card shadow="md" withBorder w={{ sm: "100%", lg: "50%"}}>
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
                        <div>Rs. {invoice?.amount?.toFixed(2)}</div>
                    </div>
                    <div className="flex items-end mt-4">
                        <Badge
                            color={
                                colorsForInvoice[
                                    invoice?.invoiceStatus as ChequeStatus
                                    ] || "gray"
                            }
                            radius="xs"
                            size="sm"
                        >
                            {invoice?.invoiceStatus}
                        </Badge>
                    </div>
                </Card>
                <Group display="flex" justify="flex-end" w={{sm: "100%", lg: "50%"}} mt="md" >
                    {invoice?.invoiceStatus === "NOT PAID" && (
                        <Button
                            color="green"
                            radius="sm"
                            size="xs"
                            ml={10}
                            onClick={() => chequeStatusUpdate("PAID")}
                        >
                            Paid
                        </Button>
                    )}
                </Group>
            </Box>
        </>
    );
};

export default ViewInvoice;
