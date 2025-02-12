import { useNavigate, useParams } from "react-router";
import { Box, Button, Group, Table } from "@mantine/core";
import { IconArrowLeft, IconFile } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store.ts";
import { useLoading } from "../../../helpers/loadingContext.tsx";
import { useEffect } from "react";
import toNotify from "../../../helpers/toNotify.tsx";
import { getBulkInvoicePayment } from "../../../store/invoiceSlice/invoiceSlice.ts";
import { amountPreview } from "../../../helpers/preview.tsx";
import { DOWNLOAD_TYPES } from "../../../helpers/types.ts";

const BulkInvoicePaymentView = () => {
    const navigate = useNavigate();
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const data = useSelector(
        (state: RootState) => state.invoice.selectedBulkInvoicePayment
    );
    const { id } = useParams();

    useEffect(() => {
        fetchBulkInvoicePayment();
    }, [id]);

    const fetchBulkInvoicePayment = async () => {
        try {
            setLoading(true);
            const response = await dispatch(getBulkInvoicePayment(id));
            if (response.type === "invoice/getBulkInvoicePayment/fulfilled") {
                setLoading(false);
            } else if (
                response.type === "invoice/getBulkInvoicePayment/rejected"
            ) {
                setLoading(false);
                toNotify("Error", `${response.payload.error}`, "ERROR");
            } else {
                setLoading(false);
                toNotify("Warning", "Please contact system admin", "WARNING");
            }
        } catch (e: any) {
            setLoading(false);
            console.error(e.mesage);
            toNotify("Error", `${e.message}`, "ERROR");
        }
    };
    const invoices = data.invoices;
    const invoiceAmount = invoices?.reduce(
        (total: number, i: any) => total + i.amount,
        0
    );
    const customerCheques = data.customerCheques;
    const customerChequeAmount = customerCheques?.reduce(
        (total: number, i: any) => total + i.amount,
        0
    );
    const createdCheques = data.createdCheques;
    const createdChequeAmount = createdCheques?.reduce(
        (total: number, i: any) => total + i.amount,
        0
    );
    const addedCash = data.addedCash;
    const addedCashAmount = addedCash?.reduce(
        (total: number, i: any) => total + i.note * i.count,
        0
    );

    const gotoPdfView = (data:any) => {
        navigate("/app/pdf/view", { state: { data: data, type: DOWNLOAD_TYPES.BULK_INVOICE_PAYMENT } });
    };


    return (
        <>
            {/* Header */}
            <Box display="flex" p="lg" className="items-center justify-between">
                <Group display="flex">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <span className="text-lg font-semibold ml-4">
                        {data.paymentId || "W-Payment"}
                    </span>
                </Group>
                <Group>
                    <Button
                        size="xs"
                        leftSection={<IconFile size={16} />}
                        onClick={() => gotoPdfView(data)}
                    >
                        PDF View
                    </Button>
                </Group>
            </Box>

            <Box display="flex" p="lg" className="justify-between">
                <Table className="table-auto w-full max-w-4xl">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Item</Table.Th>
                            <Table.Th>Amount</Table.Th>
                            <Table.Th>Amount</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {/* Invoices Section */}
                        <Table.Tr>
                            <Table.Td
                                colSpan={3}
                                className="text-center p-3 text-md font-bold"
                            >
                                Invoices
                            </Table.Td>
                        </Table.Tr>
                        {invoices?.map((i: any, idx: any) => (
                            <Table.Tr key={idx}>
                                <Table.Td className="p-3 border-t border-gray-300 text-sm">
                                    {i.invoiceNumber}
                                </Table.Td>
                                <Table.Td className="p-3 border-t border-gray-300 text-sm text-right">
                                    {amountPreview(i.amount)}
                                </Table.Td>
                                <Table.Td className="p-3 border-t border-gray-300 text-sm"></Table.Td>
                            </Table.Tr>
                        ))}
                        <Table.Tr>
                            <Table.Td
                                colSpan={2}
                                className="p-3 font-bold text-sm"
                            >
                                Total Invoices Amount
                            </Table.Td>
                            <Table.Td className="p-3 font-bold text-sm text-right">
                                {amountPreview(invoiceAmount)}
                            </Table.Td>
                        </Table.Tr>

                        {/* Customers Cheques Section */}
                        <Table.Tr>
                            <Table.Td
                                colSpan={3}
                                className="text-center p-3 text-md font-bold"
                            >
                                Customers Cheques
                            </Table.Td>
                        </Table.Tr>
                        {customerCheques?.map((c: any, idx: any) => (
                            <Table.Tr key={idx}>
                                <Table.Td className="p-3 border-t border-gray-300 text-sm">
                                    {c.number}
                                </Table.Td>
                                <Table.Td className="p-3 border-t border-gray-300 text-sm text-right">
                                    {amountPreview(c.amount)}
                                </Table.Td>
                                <Table.Td className="p-3 border-t border-gray-300 text-sm"></Table.Td>
                            </Table.Tr>
                        ))}
                        <Table.Tr>
                            <Table.Td
                                colSpan={2}
                                className="p-3 font-bold text-sm"
                            >
                                Total Customer Cheques
                            </Table.Td>
                            <Table.Td className="p-3 font-bold text-sm text-right">
                                {amountPreview(customerChequeAmount)}
                            </Table.Td>
                        </Table.Tr>

                        {/* Company Cheques Section */}
                        <Table.Tr>
                            <Table.Td
                                colSpan={3}
                                className="text-center p-3 text-md font-bold"
                            >
                                Company Cheques
                            </Table.Td>
                        </Table.Tr>
                        {createdCheques?.map((c: any, idx: any) => (
                            <Table.Tr key={idx}>
                                <Table.Td className="p-3 border-t border-gray-300 text-sm">
                                    {c.number}
                                </Table.Td>
                                <Table.Td className="p-3 border-t border-gray-300 text-sm text-right">
                                    {amountPreview(c.amount)}
                                </Table.Td>
                                <Table.Td className="p-3 border-t border-gray-300 text-sm"></Table.Td>
                            </Table.Tr>
                        ))}
                        <Table.Tr>
                            <Table.Td
                                colSpan={2}
                                className="p-3 font-bold text-sm"
                            >
                                Total Company Cheques
                            </Table.Td>
                            <Table.Td className="p-3 font-bold text-sm text-right">
                                {amountPreview(createdChequeAmount)}
                            </Table.Td>
                        </Table.Tr>

                        {/* Cash Section */}
                        <Table.Tr>
                            <Table.Td
                                colSpan={3}
                                className="text-center p-3 text-md font-bold"
                            >
                                Cash
                            </Table.Td>
                        </Table.Tr>
                        {addedCash?.map((n: any, idx: any) => (
                            <Table.Tr key={idx}>
                                <Table.Td className="p-3 border-t border-gray-300 text-sm">
                                    {amountPreview(n.note)} * {n.count}
                                </Table.Td>
                                <Table.Td className="p-3 border-t border-gray-300 text-sm text-right">
                                    {amountPreview(n.note * n.count)}
                                </Table.Td>
                                <Table.Td className="p-3 border-t border-gray-300 text-sm"></Table.Td>
                            </Table.Tr>
                        ))}
                        <Table.Tr>
                            <Table.Td
                                colSpan={2}
                                className="p-3 font-bold text-sm"
                            >
                                Total Cash
                            </Table.Td>
                            <Table.Td className="p-3 font-bold text-sm text-right">
                                {amountPreview(addedCashAmount)}
                            </Table.Td>
                        </Table.Tr>

                        {/* Final Balance Section */}
                        <Table.Tr>
                            <Table.Td className="p-3 font-bold text-sm">
                                Balance
                            </Table.Td>
                            <Table.Td className="p-3"></Table.Td>
                            <Table.Td className="p-3 font-bold text-sm text-right">
                                {amountPreview(
                                    invoiceAmount -
                                        (customerChequeAmount +
                                            createdChequeAmount +
                                            addedCashAmount)
                                )}
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Box>
        </>
    );
};

export default BulkInvoicePaymentView;
