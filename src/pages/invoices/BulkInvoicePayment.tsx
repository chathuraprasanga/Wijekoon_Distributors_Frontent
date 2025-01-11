import {
    Alert,
    Box,
    Button, Flex,
    Group,
    MultiSelect,
    Select,
    Table,
    Text, Textarea,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { getSuppliers } from "../../store/supplierSlice/supplierSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";
import { getInvoices } from "../../store/invoiceSlice/invoiceSlice.ts";
import { amountPreview, datePreview } from "../../helpers/preview.tsx";
import { getCheques } from "../../store/chequeSlice/chequeSlice.ts";

const BulkInvoicePayment = () => {
    const today = new Date().toISOString();
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const [selectableSuppliers, setSelectableSuppliers] = useState<any[]>([]);
    const [selectableInvoices, setSelectableInvoices] = useState<any[]>([]);
    const [selectableCheques, setSelectableCheques] = useState<any[]>([]);
    const supplierData = selectableSuppliers.map((data: any) => {
        return { label: data.name, value: data._id };
    });
    const invoiceData = selectableInvoices.map((data: any) => {
        return {
            label: `${data.invoiceNumber} | ${amountPreview(data.amount)}`,
            value: data._id,
        };
    });
    const chequeData = selectableCheques.map((data: any) => {
        return {
            label: `${data.number} | ${amountPreview(data.amount)} | ${data.chequeStatus}`,
            value: data._id,
        };
    });

    const [selectedSupplier, setSelectedSupplier] = useState<string | null>();
    const [selectedInvoices, setSelectedInvoices] = useState<any[]>([]);
    const [selectedCustomersCheques, setSelectedCustomersCheques] = useState<
        any[]
    >([]);

    useEffect(() => {
        fetchSuppliers();
        fetchCustomerCheques();
    }, [dispatch]);

    useEffect(() => {
        fetchInvoices();
    }, [selectedSupplier]);

    const fetchSuppliers = async () => {
        setLoading(true);
        const response = await dispatch(
            getSuppliers({ filters: { status: true } })
        );
        if (response.type === "supplier/getSuppliers/fulfilled") {
            setLoading(false);
            setSelectableSuppliers(response.payload.result);
        } else {
            setLoading(false);
            toNotify(
                "Something went wrong",
                `Please contact system admin`,
                "WARNING"
            );
        }
    };

    const fetchInvoices = async () => {
        setLoading(true);
        const response = await dispatch(
            getInvoices({
                filters: { status: true, supplier: selectedSupplier },
            })
        );
        if (response.type === "invoice/getInvoices/fulfilled") {
            setLoading(false);
            setSelectableInvoices(response.payload.result);
        } else {
            setLoading(false);
            toNotify(
                "Something went wrong",
                `Please contact system admin`,
                "WARNING"
            );
        }
    };

    const fetchCustomerCheques = async () => {
        setLoading(true);
        const response = await dispatch(
            getCheques({
                filters: {
                    chequeStatus: ["PENDING", "RETURNED"],
                    status: true,
                },
            })
        );
        if (response.type === "cheque/getCheques/fulfilled") {
            setLoading(false);
            setSelectableCheques(response.payload.result);
        } else {
            setLoading(false);
            toNotify(
                "Something went wrong",
                `Please contact system admin`,
                "WARNING"
            );
        }
    };

    // Calculate total invoice amount
    const totalAmount = useMemo(() => {
        return selectedInvoices.reduce((total, invoiceId) => {
            const invoice = selectableInvoices.find(
                (inv) => inv._id === invoiceId
            );
            return total + (invoice?.amount || 0);
        }, 0);
    }, [selectedInvoices, selectableInvoices]);

    // Calculate total customer cheque amount
    const totalAmountOfCustomerCheques = useMemo(() => {
        return selectedCustomersCheques.reduce((total, chequeId) => {
            const cheque = selectableCheques.find((c) => c._id === chequeId);
            return total + (cheque?.amount || 0);
        }, 0);
    }, [selectedCustomersCheques, selectableCheques]);

    // Calculate balance after applying customer cheques
    const balanceAfterCustomerCheques = useMemo(() => {
        return totalAmount - totalAmountOfCustomerCheques;
    }, [totalAmount, totalAmountOfCustomerCheques]);

    return (
        <>
            <Group p="lg" display="flex" justify="space-between" align="center">
                <Group display="flex">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <span className="text-lg font-semibold ml-4">
                        Bulk Invoice Payment
                    </span>
                </Group>
            </Group>
            <Box w={{ sm: "100%", lg: "100%" }} px="lg" py="lg">
                <form className="lg:flex ">
                    <Box w={{ sm: "100%", lg: "50%" }}>
                        <Select
                            label="Supplier"
                            withAsterisk
                            searchable
                            data={supplierData}
                            placeholder="Enter Supplier Name"
                            onChange={(value) => setSelectedSupplier(value)}
                        />
                        <MultiSelect
                            disabled={!selectedSupplier}
                            multiple
                            label="Invoices"
                            withAsterisk
                            searchable
                            data={invoiceData}
                            placeholder="Enter Supplier Name"
                            onChange={(value) => setSelectedInvoices(value)}
                        />

                        <MultiSelect
                            data={chequeData}
                            label="Customers Cheques"
                            placeholder="Select cheques"
                            searchable
                            onChange={(value) =>
                                setSelectedCustomersCheques(value)
                            }
                        />
                        <Group p="center" className="flex" mt="md">
                            <Button size="xs" color="violet">
                                Create Cheque
                            </Button>
                            <Alert
                                title="Notice"
                                color="yellow"
                                withCloseButton
                            >
                                Please Add Your Bank Details First
                            </Alert>
                        </Group>
                        <Table mt="sm">
                            <Table.Tr>
                                <Table.Th>Bank</Table.Th>
                                <Table.Th>Number</Table.Th>
                                <Table.Th>Date</Table.Th>
                                <Table.Th>Amount</Table.Th>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>Peoples Bank</Table.Td>
                                <Table.Td>123456</Table.Td>
                                <Table.Td>2025-10-10</Table.Td>
                                <Table.Td>Rs. 450000.00</Table.Td>
                            </Table.Tr>
                        </Table>
                        <Button mt="md" size="xs" color="violet">
                            Add Cash
                        </Button>
                        <Table mt="sm">
                            <Table.Tr>
                                <Table.Th>Note</Table.Th>
                                <Table.Th>Count</Table.Th>
                                <Table.Th>Amount</Table.Th>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>5000</Table.Td>
                                <Table.Td>10</Table.Td>
                                <Table.Td>Rs. 50000.00</Table.Td>
                            </Table.Tr>
                        </Table>
                        <Textarea
                            mt="lg"
                            label="Notes"
                            placeholder="Enter any special notes here"
                        />
                        <Flex justify="end" mt="lg">
                            <Button size="sm">Submit</Button>
                        </Flex>
                    </Box>
                    <Box
                        w={{ sm: "100%", lg: "50%" }}
                        px={{ lg: "lg" }}
                        py={{ lg: "lg" }}
                        className="mt-4 lg:mt-0"
                    >
                        <Group className="justify-between">
                            <Text fw="bold">Bulk Invoice Payment Details</Text>
                            <Text fw="bold">{datePreview(today)}</Text>
                        </Group>
                        <Table
                            withRowBorders={false}
                            withTableBorder={false}
                            withColumnBorders={false}
                        >
                            <Table.Tr>
                                <Table.Td colSpan={2} style={{ width: "50%" }}>
                                    Supplier
                                </Table.Td>
                                <Table.Td colSpan={2} style={{ width: "50%" }}>
                                    {selectableSuppliers.find(
                                        (supplier) =>
                                            supplier._id === selectedSupplier
                                    )?.name || "No supplier selected"}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td colSpan={4}>Invoices</Table.Td>
                            </Table.Tr>
                            {selectedInvoices?.length > 0 ? (
                                selectedInvoices?.map((invoiceId, index) => {
                                    const invoice = selectableInvoices.find(
                                        (inv) => inv._id === invoiceId
                                    );
                                    return (
                                        <Table.Tr key={index}>
                                            <Table.Td>
                                                {invoice
                                                    ? `${invoice.invoiceNumber}`
                                                    : "Invoice not found"}
                                            </Table.Td>
                                            <Table.Td>
                                                {invoice
                                                    ? `${amountPreview(
                                                          invoice.amount
                                                      )}`
                                                    : ""}
                                            </Table.Td>
                                        </Table.Tr>
                                    );
                                })
                            ) : (
                                <Table.Tr>
                                    <Table.Td colSpan={4}>
                                        No invoices selected
                                    </Table.Td>
                                </Table.Tr>
                            )}
                            <Table.Tr>
                                <Table.Td colSpan={2}>
                                    Total Invoice Amount
                                </Table.Td>
                                <Table.Td colSpan={2}>
                                    {amountPreview(totalAmount)}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td colSpan={4}>
                                    Customers Cheques
                                </Table.Td>
                            </Table.Tr>
                            {selectedCustomersCheques?.length > 0 ? (
                                selectedCustomersCheques?.map(
                                    (chequeId, index) => {
                                        const cheque = selectableCheques.find(
                                            (cheque) => cheque._id === chequeId
                                        );
                                        return (
                                            <Table.Tr key={index}>
                                                <Table.Td>
                                                    {cheque
                                                        ? `${cheque.number}`
                                                        : "Invoice not found"}
                                                </Table.Td>
                                                <Table.Td>
                                                    {cheque
                                                        ? `${amountPreview(
                                                              cheque.amount
                                                          )}`
                                                        : ""}
                                                </Table.Td>
                                            </Table.Tr>
                                        );
                                    }
                                )
                            ) : (
                                <Table.Tr>
                                    <Table.Td colSpan={4}>
                                        No Customers Cheques selected
                                    </Table.Td>
                                </Table.Tr>
                            )}
                            <Table.Tr>
                                <Table.Td colSpan={2}>
                                    Total Customer Cheque Amount
                                </Table.Td>
                                <Table.Td colSpan={2}>
                                    {amountPreview(
                                        totalAmountOfCustomerCheques
                                    )}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td colSpan={2}>Balance</Table.Td>
                                <Table.Td colSpan={2}>
                                    {amountPreview(balanceAfterCustomerCheques)}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td colSpan={4}>
                                    Created Cheques
                                </Table.Td>
                            </Table.Tr>
                            {/*{createdCheques?.length > 0 ? (*/}
                            {/*    createdCheques?.map(*/}
                            {/*        (cheque, index) => {*/}
                            {/*            return (*/}
                            {/*                <Table.Tr key={index}>*/}
                            {/*                    <Table.Td>*/}
                            {/*                        {cheque*/}
                            {/*                            ? `${cheque.number}`*/}
                            {/*                            : "Invoice not found"}*/}
                            {/*                    </Table.Td>*/}
                            {/*                    <Table.Td>*/}
                            {/*                        {cheque*/}
                            {/*                            ? `${amountPreview(*/}
                            {/*                                cheque.amount*/}
                            {/*                            )}`*/}
                            {/*                            : ""}*/}
                            {/*                    </Table.Td>*/}
                            {/*                </Table.Tr>*/}
                            {/*            );*/}
                            {/*        }*/}
                            {/*    )*/}
                            {/*) : (*/}
                            {/*    <Table.Tr>*/}
                            {/*        <Table.Td colSpan={4}>*/}
                            {/*            No Created Cheques selected*/}
                            {/*        </Table.Td>*/}
                            {/*    </Table.Tr>*/}
                            {/*)}*/}
                            <Table.Tr>
                                <Table.Td colSpan={2}>
                                    Total Created Cheque Amount
                                </Table.Td>
                                <Table.Td colSpan={2}>
                                    {/*{amountPreview(*/}
                                    {/*    totalAmountOfCreatedCheques*/}
                                    {/*)}*/}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td colSpan={2}>Balance</Table.Td>
                                <Table.Td colSpan={2}>
                                    {/*{amountPreview(balanceAfterCreatedCheques)}*/}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td colSpan={4}>
                                    Created Cheques
                                </Table.Td>
                            </Table.Tr>
                            {/*{cashAmounts?.length > 0 ? (*/}
                            {/*    cashAmounts?.map(*/}
                            {/*        (cash, index) => {*/}
                            {/*            return (*/}
                            {/*                <Table.Tr key={index}>*/}
                            {/*                    <Table.Td>*/}
                            {/*                        {cash*/}
                            {/*                            ? `${cash.note}`*/}
                            {/*                            : "Invoice not found"}*/}
                            {/*                    </Table.Td>*/}
                            {/*                    <Table.Td>*/}
                            {/*                        {cash*/}
                            {/*                            ? `${amountPreview(*/}
                            {/*                                cash.amount*/}
                            {/*                            )}`*/}
                            {/*                            : ""}*/}
                            {/*                    </Table.Td>*/}
                            {/*                    <Table.Td>*/}
                            {/*                        {cash*/}
                            {/*                            ? `${amountPreview(*/}
                            {/*                                cash.amount * cash.count*/}
                            {/*                            )}`*/}
                            {/*                            : ""}*/}
                            {/*                    </Table.Td>*/}
                            {/*                </Table.Tr>*/}
                            {/*            );*/}
                            {/*        }*/}
                            {/*    )*/}
                            {/*) : (*/}
                            {/*    <Table.Tr>*/}
                            {/*        <Table.Td colSpan={4}>*/}
                            {/*            No Cash Added*/}
                            {/*        </Table.Td>*/}
                            {/*    </Table.Tr>*/}
                            {/*)}*/}
                            <Table.Tr>
                                <Table.Td colSpan={2}>
                                    Total Cash Amount
                                </Table.Td>
                                <Table.Td colSpan={2}>
                                    {/*{amountPreview(*/}
                                    {/*    totalAmountOfCash*/}
                                    {/*)}*/}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td colSpan={2}>Balance</Table.Td>
                                <Table.Td colSpan={2}>
                                    {/*{amountPreview(balanceAfterAddedCash)}*/}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td colSpan={2}>Finale Balance</Table.Td>
                                <Table.Td colSpan={2}>
                                    {/*{amountPreview(finaleBalance)}*/}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                            </Table.Tr>
                            <Table.Tr>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td colSpan={4}>Notes:</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                {/*<Table.Td colSpan={4}>{notes}</Table.Td>*/}
                            </Table.Tr>
                        </Table>
                    </Box>
                </form>
            </Box>


        </>
    );
};

export default BulkInvoicePayment;
