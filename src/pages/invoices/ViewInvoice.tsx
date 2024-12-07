import { IconArrowLeft, } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Badge, Button, Card } from "@mantine/core";
import toNotify from "../../helpers/toNotify.tsx";
import { changeStatusInvoice, getInvoice } from "../../store/invoiceSlice/invoiceSlice.ts";

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
            <div className="items-center flex flex-row justify-between p-4">
                <div className="flex flex-row items-center">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <span className="text-lg font-semibold ml-4">
                        View Invoice
                    </span>
                </div>
            </div>
            <div className="mx-4 my-4 lg:w-1/2">
                <Card shadow="md" withBorder>
                    <div className="flex flex-row">
                        <div className="w-2/4 lg:w-1/4">Supplier:</div>
                        <div>{invoice?.supplier?.name}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="w-2/4 lg:w-1/4">Invoice Date:</div>
                        <div>{invoice?.invoiceDate}</div>
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
                            radius="sm"
                        >
                            {invoice?.invoiceStatus}
                        </Badge>
                    </div>
                </Card>
                <div className="mt-4 flex justify-end">
                    {invoice?.invoiceStatus === "NOT PAID" && (
                        <Button
                            color="green"
                            radius="sm"
                            ml={10}
                            onClick={() => chequeStatusUpdate("PAID")}
                        >
                            Paid
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
};

export default ViewInvoice;
