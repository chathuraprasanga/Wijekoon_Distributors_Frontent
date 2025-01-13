import {
    ActionIcon,
    Alert,
    Box,
    Button,
    Chip,
    Flex,
    Group,
    Modal,
    MultiSelect,
    NumberInput,
    Select,
    Table,
    Text,
    Textarea,
    TextInput,
} from "@mantine/core";
import {
    IconArrowLeft,
    IconClock,
    IconInfoCircle,
    IconTrash,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { getSuppliers } from "../../store/supplierSlice/supplierSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";
import {
    addBulkInvoicePayment,
    getInvoices,
} from "../../store/invoiceSlice/invoiceSlice.ts";
import {
    amountPreview,
    bankPreview,
    datePreview,
} from "../../helpers/preview.tsx";
import { getCheques } from "../../store/chequeSlice/chequeSlice.ts";
import { getBankDetails } from "../../store/bankDetailSlice/bankDetailSlice.ts";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { DatePickerInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { isValidChequeNumber } from "../../utils/inputValidators.ts";
import { useNavigate } from "react-router";

const today = new Date(); // Get today's date in local time
const utcToday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())); // Set the time to 00:00:00 UTC

const BulkInvoicePayment = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const today = new Date().toISOString();
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const [createChequeModalOpened, createChequeModalHandler] =
        useDisclosure(false);
    const [selectableSuppliers, setSelectableSuppliers] = useState<any[]>([]);
    const [selectableInvoices, setSelectableInvoices] = useState<any[]>([]);
    const [selectableCheques, setSelectableCheques] = useState<any[]>([]);
    const [selectableBankDetails, setSelectableBankDetails] = useState<any[]>(
        []
    );
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
    const bankDetailsData = selectableBankDetails.map((data: any) => {
        return {
            label: `${bankPreview(data.bank)} | ${data.accountNumber} `,
            value: data._id,
        };
    });

    const [selectedSupplier, setSelectedSupplier] = useState<string | null>();
    const [selectedInvoices, setSelectedInvoices] = useState<any[]>([]);
    const [selectedCustomersCheques, setSelectedCustomersCheques] = useState<
        any[]
    >([]);
    const [createdCheques, setCreatedCheques] = useState<any[]>([]);
    const [savedAddedCash, setSavedAddedCash] = useState<any[]>([]);
    const [selectedNotes, setSelectedNotes] = useState<any[]>([]);
    const [emails, setEmails] = useState<string[]>([]);

    // Available notes
    const noteValues = [5000, 1000, 500, 100, 50, 20, 10, 5, 2, 1];

    useEffect(() => {
        fetchSuppliers();
        fetchCustomerCheques();
        fetchBankAccountDetails();
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
                filters: {
                    status: true,
                    supplier: selectedSupplier,
                    invoiceStatus: "NOT PAID",
                },
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

    const fetchBankAccountDetails = async () => {
        setLoading(true);
        const response = await dispatch(
            getBankDetails({
                filters: {
                    status: true,
                },
            })
        );
        if (response.type === "bankDetail/getBankDetails/fulfilled") {
            setLoading(false);
            setSelectableBankDetails(response.payload.result);
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

    // Calculate total customer cheque amount
    const totalAmountOfCreatedCheques = useMemo(() => {
        return createdCheques.reduce((total, cheque) => {
            return total + (cheque?.amount || 0);
        }, 0);
    }, [createdCheques]);

    const handleDeleteCheque = (index: number) => {
        setCreatedCheques((prevCheques) =>
            prevCheques.filter((_, i) => i !== index)
        );
    };

    // Calculate balance after applying created cheques
    const balanceAfterCreatedCheques = useMemo(() => {
        return (
            totalAmount -
            (totalAmountOfCreatedCheques + totalAmountOfCustomerCheques)
        ); // Fixed typo here
    }, [
        totalAmount,
        totalAmountOfCreatedCheques,
        totalAmountOfCustomerCheques,
    ]);

    const totalAmountOfCash = useMemo(() => {
        return savedAddedCash.reduce((total, cash) => {
            // Calculate amount by multiplying note and count
            return total + (cash?.note * cash?.count || 0);
        }, 0);
    }, [savedAddedCash]);

    const balanceAfterAddedCash = useMemo(() => {
        return (
            totalAmount -
            (totalAmountOfCreatedCheques +
                totalAmountOfCustomerCheques +
                totalAmountOfCash)
        ); // Subtract the total added cash from the total amount
    }, [
        totalAmount,
        totalAmountOfCash,
        totalAmountOfCustomerCheques,
        totalAmountOfCreatedCheques,
    ]);

    const finaleBalance = useMemo(() => {
        return (
            totalAmount -
            (totalAmountOfCreatedCheques +
                totalAmountOfCustomerCheques +
                totalAmountOfCash)
        ); // Subtract the total added cash from the total amount
    }, [
        totalAmount,
        balanceAfterAddedCash,
        totalAmountOfCreatedCheques,
        totalAmountOfCustomerCheques,
        totalAmountOfCash,
    ]);

    const chequeCreateForm = useForm({
        initialValues: {
            bankAccount: "",
            chequeNumber: "",
            date: utcToday, // Use the adjusted UTC date
            amount: 0,
        },
        validate: {
            bankAccount: isNotEmpty("Bank is required."),
            chequeNumber: (value) => {
                if (!value) {
                    return "Cheque number is required";
                }
                return isValidChequeNumber(value)
                    ? null
                    : "Enter valid cheque number";
            },
            date: isNotEmpty("Date is required"),
            amount: (value) => {
                if (!value) {
                    return "Cheque amount is required";
                }
                if (value <= 0) {
                    return "Cheque amount should be greater than Rs. 0";
                }
                return null;
            },
        },
    });

    const bulkInvoicePaymentForm = useForm({
        initialValues: {
            supplier: "",
            invoices: [],
            notes: "",
        },
        validate: {
            supplier: isNotEmpty("Supplier is required"),
            invoices: isNotEmpty("Invoices are required"),
        },
    });

    useEffect(() => {
        setSelectedSupplier(bulkInvoicePaymentForm.values.supplier);
    }, [bulkInvoicePaymentForm.values.supplier]);

    useEffect(() => {
        setSelectedInvoices(bulkInvoicePaymentForm.values.invoices);
    }, [bulkInvoicePaymentForm.values.invoices]);

    const handleCreateCheque = (values: typeof chequeCreateForm.values) => {
        console.log("hit");
        const data = {
            bankAccount: values.bankAccount,
            bankDetails: selectableBankDetails.find(
                (b) => b._id === values.bankAccount
            ),
            chequeNumber: values.chequeNumber,
            date: values?.date?.toISOString(),
            amount: values.amount,
        };
        console.log("data", data);
        setCreatedCheques((prevCheques) => [...prevCheques, data]);
        createChequeModalHandler.close();
        chequeCreateForm.reset();
    };

    const createChequeModal = () => (
        <Modal
            opened={createChequeModalOpened}
            onClose={() => {
                createChequeModalHandler.close();
                chequeCreateForm.reset();
            }}
            title={<Text size="lg">Create Cheque</Text>}
        >
            <form onSubmit={chequeCreateForm.onSubmit(handleCreateCheque)}>
                <Select
                    label="Bank Account"
                    placeholder="Select Bank Account"
                    data={bankDetailsData}
                    withAsterisk
                    {...chequeCreateForm.getInputProps("bankAccount")}
                />
                <TextInput
                    label="Cheque Number"
                    mt="sm"
                    placeholder="Enter Cheque Number"
                    withAsterisk
                    {...chequeCreateForm.getInputProps("chequeNumber")}
                />
                <DatePickerInput
                    label="Date"
                    mt="sm"
                    placeholder="Enter Date"
                    withAsterisk
                    {...chequeCreateForm.getInputProps("date")}
                />
                <NumberInput
                    label="Amount"
                    mt="sm"
                    placeholder="Enter Amount"
                    withAsterisk
                    prefix="Rs. "
                    decimalSeparator="."
                    thousandSeparator=","
                    decimalScale={2}
                    fixedDecimalScale={true}
                    hideControls
                    allowNegative={false}
                    {...chequeCreateForm.getInputProps("amount")}
                />
                <Button mt="md" fullWidth variant="filled" type="submit">
                    Save
                </Button>
            </form>
        </Modal>
    );

    // Function to handle adding/removing chips
    const handleChipClick = (note: number) => {
        if (selectedNotes.includes(note)) {
            // Remove note if it's already selected
            setSelectedNotes((prev) => prev.filter((n) => n !== note));
            setSavedAddedCash((prev) =>
                prev.filter((cash) => cash.note !== note)
            );
        } else {
            // Add note to selected list and savedAddedCash state
            setSelectedNotes((prev) => [...prev, note]);
            setSavedAddedCash((prev) => [...prev, { note, count: 0 }]);
        }
    };

    // Handle the change of count for a specific note
    const handleCountChange = (index: number, value: any) => {
        const updatedCash = [...savedAddedCash];
        updatedCash[index].count = value;
        setSavedAddedCash(updatedCash);
    };

    const handleBulkInvoicePayment = async (
        values: typeof bulkInvoicePaymentForm.values
    ) => {
        setLoading(true); // Start loading
        try {
            const payload = {
                supplier: values.supplier,
                invoices: values.invoices,
                notes: values.notes,
                customerCheques: selectedCustomersCheques,
                createdCheques: createdCheques,
                addedCash: savedAddedCash,
                additionalEmails: emails,
            };

            const response = await dispatch(addBulkInvoicePayment(payload)); // Dispatch the action

            if (response.type === "invoice/addBulkInvoicePayment/fulfilled") {
                // Successful response
                toNotify(
                    "Success",
                    "Bulk Invoice Payment added successfully",
                    "SUCCESS"
                );
                resetStatus();
                navigate("/app/invoices");
            } else if (
                response.type === "invoice/addBulkInvoicePayment/rejected"
            ) {
                setLoading(false);
                toNotify("Error", `${response.payload.error}`, "ERROR");
            } else {
                // Any other response
                toNotify(
                    "Something went wrong",
                    `Please contact system admin`,
                    "WARNING"
                );
            }

            console.log("payload", payload);
        } catch (e) {
            console.error(e);
            toNotify(
                "Something went wrong",
                `Please contact system admin`,
                "WARNING"
            );
        }
    };

    const resetStatus = () => {
        setSelectedSupplier(null);
        setSelectedInvoices([]);
        setSelectedCustomersCheques([]);
        setCreatedCheques([]);
        setSavedAddedCash([]);
        setSelectedNotes([]);
        setEmails([]);
        createChequeModalHandler.close();
    };

    const handleAddEmail = () => {
        setEmails((prevEmails) => [...prevEmails, ""]); // Add an empty string for the new email input
    };

    // Function to delete an email input field
    const handleDeleteEmail = (index: number) => {
        setEmails((prevEmails) => prevEmails.filter((_, i) => i !== index)); // Remove the email at the specified index
    };

    // Function to handle changes in the email input fields
    const handleEmailChange = (value: string, index: number) => {
        const updatedEmails = [...emails];
        updatedEmails[index] = value; // Update the email at the specified index
        setEmails(updatedEmails);
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
                        Bulk Invoice Payment
                    </span>
                </Group>
                <Group>
                    <Button size="xs" leftSection={<IconClock size={16}/>} onClick={() => navigate("/app/invoices/previous-bulk-invoice-payments")}>
                        Previous Bulk Payments
                    </Button>
                </Group>
            </Group>
            <Box w={{ sm: "100%", lg: "100%" }} px="lg" py="lg">
                <form
                    className="lg:flex "
                    onSubmit={bulkInvoicePaymentForm.onSubmit(
                        handleBulkInvoicePayment
                    )}
                >
                    <Box w={{ sm: "100%", lg: "50%" }}>
                        <Select
                            label="Supplier"
                            withAsterisk
                            searchable
                            data={supplierData}
                            placeholder="Enter Supplier Name"
                            {...bulkInvoicePaymentForm.getInputProps(
                                "supplier"
                            )}
                        />
                        <MultiSelect
                            disabled={!selectedSupplier}
                            multiple
                            label="Invoices"
                            withAsterisk
                            searchable
                            data={invoiceData}
                            placeholder="Select Invoices"
                            {...bulkInvoicePaymentForm.getInputProps(
                                "invoices"
                            )}
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
                            <Button
                                size="xs"
                                color="violet"
                                disabled={bankDetailsData.length < 1}
                                onClick={createChequeModalHandler.open}
                            >
                                Create Cheque
                            </Button>
                            {bankDetailsData.length < 1 && (
                                <Alert
                                    title="Notice"
                                    color="yellow"
                                    withCloseButton
                                >
                                    Please Add Your Bank Details First
                                </Alert>
                            )}
                        </Group>
                        {createdCheques.length > 0 ? (
                            <Table mt="sm">
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Bank</Table.Th>
                                        <Table.Th>Number</Table.Th>
                                        <Table.Th>Date</Table.Th>
                                        <Table.Th>Amount</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {createdCheques.map((cheque, index) => (
                                        <Table.Tr key={index}>
                                            <Table.Td>
                                                {bankPreview(
                                                    cheque?.bankDetails?.bank
                                                )}
                                            </Table.Td>
                                            <Table.Td>
                                                {cheque?.chequeNumber}
                                            </Table.Td>
                                            <Table.Td>
                                                {datePreview(cheque?.date)}
                                            </Table.Td>
                                            <Table.Td>
                                                {amountPreview(cheque?.amount)}
                                            </Table.Td>
                                            <Table.Td>
                                                <ActionIcon
                                                    color="red"
                                                    variant="light"
                                                    onClick={() =>
                                                        handleDeleteCheque(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <IconTrash size={16} />
                                                </ActionIcon>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        ) : (
                            <Table
                                withRowBorders={false}
                                withTableBorder={false}
                                withColumnBorders={false}
                            >
                                <Table.Tbody>
                                    <Table.Tr>
                                        <Table.Td colSpan={4}>
                                            <Group p="center" align="center">
                                                <IconInfoCircle size={16} />
                                                <Text size="sm">
                                                    No Created Cheques
                                                </Text>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>
                        )}
                        <Text mt="md" size="sm" fw="bold">
                            Add Cash
                        </Text>
                        <Text size="sm">Notes & Coins</Text>
                        <Group mt="sm">
                            {noteValues.map((note) => (
                                <Chip
                                    key={note}
                                    onClick={() => handleChipClick(note)}
                                    variant={
                                        selectedNotes.includes(note)
                                            ? "filled"
                                            : "light"
                                    }
                                >
                                    {`Rs. ${note}.00/=`}
                                </Chip>
                            ))}
                        </Group>

                        <Text size="sm" mt="md">
                            Added Notes
                        </Text>

                        {savedAddedCash.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table className="min-w-full table-auto">
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th className="w-36 text-left py-2 px-4">
                                                Note
                                            </Table.Th>
                                            <Table.Th className="w-32 text-left py-2 px-4">
                                                Count
                                            </Table.Th>
                                            <Table.Th className="w-36 text-left py-2 px-4">
                                                Amount
                                            </Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {savedAddedCash.map((c, index) => (
                                            <Table.Tr
                                                key={index}
                                                className="border-t"
                                            >
                                                <Table.Td className="w-36 text-left py-2 px-4">{`Rs. ${c.note}`}</Table.Td>
                                                <Table.Td className="w-32 text-left py-2 px-4">
                                                    <NumberInput
                                                        value={c.count}
                                                        onChange={(value) =>
                                                            handleCountChange(
                                                                index,
                                                                value ?? 0
                                                            )
                                                        } // Handle undefined as 0
                                                        size="xs"
                                                        hideControls
                                                        allowNegative={false}
                                                    />
                                                </Table.Td>
                                                <Table.Td className="w-36 text-left py-2 px-4">
                                                    {amountPreview(
                                                        c.note * c.count
                                                    )}
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </div>
                        ) : (
                            <Table
                                withRowBorders={false}
                                withTableBorder={false}
                                withColumnBorders={false}
                            >
                                <Table.Tbody>
                                    <Table.Tr>
                                        <Table.Td colSpan={4}>
                                            <Group p="center" align="center">
                                                <IconInfoCircle size={16} />
                                                <Text size="sm">
                                                    No Cash Added
                                                </Text>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>
                        )}
                        <Textarea
                            mt="lg"
                            label="Notes"
                            placeholder="Enter any special notes here"
                            {...bulkInvoicePaymentForm.getInputProps("notes")}
                        />
                        <Button
                            mt="md"
                            size="xs"
                            color="violet"
                            onClick={handleAddEmail}
                        >
                            Add Additional Email
                        </Button>
                        <Table
                            mt="md"
                            withColumnBorders={false}
                            withTableBorder={false}
                            withRowBorders={false}
                        >
                            <Table.Tbody>
                                {emails.map((email, index) => (
                                    <Table.Tr key={index}>
                                        <Table.Td w="80%">
                                            <TextInput
                                                value={email}
                                                onChange={(e) =>
                                                    handleEmailChange(
                                                        e.target.value,
                                                        index
                                                    )
                                                } // Update the email on change
                                                placeholder="Enter email"
                                            />
                                        </Table.Td>
                                        <Table.Td>
                                            <ActionIcon
                                                color="red"
                                                variant="light"
                                                onClick={() =>
                                                    handleDeleteEmail(index)
                                                } // Delete the email on click
                                            >
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                        <Flex justify="end" mt="lg">
                            <Button size="sm" type="submit">
                                Submit
                            </Button>
                        </Flex>
                    </Box>
                    {!isMobile ? (
                        <Box
                            w={{ sm: "100%", lg: "50%" }}
                            px={{ lg: "lg" }}
                            py={{ lg: "lg" }}
                            className="mt-4 lg:mt-0"
                        >
                            <Group className="justify-between">
                                <Text fw="bold">
                                    Bulk Invoice Payment Details
                                </Text>
                                <Text fw="bold">{datePreview(today)}</Text>
                            </Group>
                            <Table className="table-auto w-full max-w-4xl mx-auto mt-6 bg-white border-collapse">
                                <Table.Tbody>
                                    {/* Supplier Row */}
                                    <Table.Tr>
                                        <Table.Td
                                            colSpan={2}
                                            className="px-4 py-2 text-left font-semibold text-sm bg-gray-100"
                                        >
                                            Supplier
                                        </Table.Td>
                                        <Table.Td
                                            colSpan={2}
                                            className="px-4 py-2 text-left text-sm"
                                        >
                                            {selectableSuppliers.find(
                                                (supplier) =>
                                                    supplier._id ===
                                                    selectedSupplier
                                            )?.name || "No supplier selected"}
                                        </Table.Td>
                                    </Table.Tr>

                                    {/* Invoices Header */}
                                    <Table.Tr>
                                        <Table.Td
                                            colSpan={4}
                                            className="px-4 py-2 text-center font-semibold text-sm bg-gray-100"
                                        >
                                            Invoices
                                        </Table.Td>
                                    </Table.Tr>

                                    {/* Invoices Table Rows */}
                                    {selectedInvoices?.length > 0 ? (
                                        selectedInvoices?.map(
                                            (invoiceId, index) => {
                                                const invoice =
                                                    selectableInvoices.find(
                                                        (inv) =>
                                                            inv._id ===
                                                            invoiceId
                                                    );
                                                return (
                                                    <Table.Tr key={index}>
                                                        <Table.Td
                                                            colSpan={2}
                                                            className="px-4 py-2 border-t text-sm"
                                                        >
                                                            {invoice
                                                                ? `${invoice.invoiceNumber}`
                                                                : "Invoice not found"}
                                                        </Table.Td>
                                                        <Table.Td className="px-4 py-2 border-t text-right text-sm">
                                                            {invoice
                                                                ? `${amountPreview(invoice.amount)}`
                                                                : ""}
                                                        </Table.Td>
                                                        <Table.Td className="px-4 py-2 border-t text-sm"></Table.Td>
                                                    </Table.Tr>
                                                );
                                            }
                                        )
                                    ) : (
                                        <Table.Tr>
                                            <Table.Td
                                                colSpan={4}
                                                className="px-4 py-2 text-center text-sm"
                                            >
                                                No invoices selected
                                            </Table.Td>
                                        </Table.Tr>
                                    )}

                                    {/* Total Invoices Row */}
                                    <Table.Tr>
                                        <Table.Td
                                            colSpan={3}
                                            className="px-4 py-2 font-semibold text-sm text-left"
                                        >
                                            Total Invoice Amount
                                        </Table.Td>
                                        <Table.Td className="px-4 py-2 text-right text-sm">
                                            {amountPreview(totalAmount)}
                                        </Table.Td>
                                    </Table.Tr>

                                    {/* Customer Cheques Header */}
                                    <Table.Tr>
                                        <Table.Td
                                            colSpan={4}
                                            className="px-4 py-2 text-center font-semibold text-sm bg-gray-100"
                                        >
                                            Customers Cheques
                                        </Table.Td>
                                    </Table.Tr>

                                    {/* Customer Cheques Rows */}
                                    {selectedCustomersCheques?.length > 0 ? (
                                        selectedCustomersCheques?.map(
                                            (chequeId, index) => {
                                                const cheque =
                                                    selectableCheques.find(
                                                        (cheque) =>
                                                            cheque._id ===
                                                            chequeId
                                                    );
                                                return (
                                                    <Table.Tr key={index}>
                                                        <Table.Td
                                                            colSpan={2}
                                                            className="px-4 py-2 border-t text-sm"
                                                        >
                                                            {cheque
                                                                ? `${cheque.number}`
                                                                : "Cheque not found"}
                                                        </Table.Td>
                                                        <Table.Td className="px-4 py-2 border-t text-right text-sm">
                                                            {cheque
                                                                ? `${amountPreview(cheque.amount)}`
                                                                : ""}
                                                        </Table.Td>
                                                    </Table.Tr>
                                                );
                                            }
                                        )
                                    ) : (
                                        <Table.Tr>
                                            <Table.Td
                                                colSpan={4}
                                                className="px-4 py-2 text-center text-sm"
                                            >
                                                No Customers Cheques selected
                                            </Table.Td>
                                        </Table.Tr>
                                    )}

                                    {/* Total Customer Cheques */}
                                    <Table.Tr>
                                        <Table.Td
                                            colSpan={3}
                                            className="px-4 py-2 text-left font-semibold text-sm"
                                        >
                                            Total Customer Cheque Amount
                                        </Table.Td>
                                        <Table.Td className="px-4 py-2 text-right text-sm">
                                            {amountPreview(
                                                totalAmountOfCustomerCheques
                                            )}
                                        </Table.Td>
                                    </Table.Tr>

                                    {/* Balance After Customer Cheques */}
                                    <Table.Tr>
                                        <Table.Td
                                            colSpan={3}
                                            className="px-4 py-2 text-left font-semibold text-sm"
                                        >
                                            Balance
                                        </Table.Td>
                                        <Table.Td className="px-4 py-2 text-right text-sm">
                                            {amountPreview(
                                                balanceAfterCustomerCheques
                                            )}
                                        </Table.Td>
                                    </Table.Tr>

                                    {/* Created Cheques Header */}
                                    <Table.Tr>
                                        <Table.Td
                                            colSpan={4}
                                            className="px-4 py-2 text-center font-semibold text-sm bg-gray-100"
                                        >
                                            Created Cheques
                                        </Table.Td>
                                    </Table.Tr>

                                    {/* Created Cheques Rows */}
                                    {createdCheques?.length > 0 ? (
                                        createdCheques?.map((cheque, index) => {
                                            return (
                                                <Table.Tr key={index}>
                                                    <Table.Td
                                                        colSpan={2}
                                                        className="px-4 py-2 border-t text-sm"
                                                    >
                                                        {cheque
                                                            ? `${cheque.chequeNumber}`
                                                            : "Cheque not found"}
                                                    </Table.Td>
                                                    <Table.Td className="px-4 py-2 border-t text-right text-sm">
                                                        {cheque
                                                            ? `${amountPreview(cheque.amount)}`
                                                            : ""}
                                                    </Table.Td>
                                                </Table.Tr>
                                            );
                                        })
                                    ) : (
                                        <Table.Tr>
                                            <Table.Td
                                                colSpan={4}
                                                className="px-4 py-2 text-center text-sm"
                                            >
                                                No Created Cheques selected
                                            </Table.Td>
                                        </Table.Tr>
                                    )}

                                    {/* Total Created Cheques */}
                                    <Table.Tr>
                                        <Table.Td
                                            colSpan={3}
                                            className="px-4 py-2 text-left font-semibold text-sm"
                                        >
                                            Total Created Cheque Amount
                                        </Table.Td>
                                        <Table.Td className="px-4 py-2 text-right text-sm">
                                            {amountPreview(
                                                totalAmountOfCreatedCheques
                                            )}
                                        </Table.Td>
                                    </Table.Tr>

                                    {/* Balance After Created Cheques */}
                                    <Table.Tr>
                                        <Table.Td
                                            colSpan={3}
                                            className="px-4 py-2 text-left font-semibold text-sm"
                                        >
                                            Balance
                                        </Table.Td>
                                        <Table.Td className="px-4 py-2 text-right text-sm">
                                            {amountPreview(
                                                balanceAfterCreatedCheques
                                            )}
                                        </Table.Td>
                                    </Table.Tr>

                                    {/* Cash Header */}
                                    <Table.Tr>
                                        <Table.Td
                                            colSpan={4}
                                            className="px-4 py-2 text-center font-semibold text-sm bg-gray-100"
                                        >
                                            Cash
                                        </Table.Td>
                                    </Table.Tr>

                                    {/* Cash Rows */}
                                    {savedAddedCash?.length > 0 ? (
                                        savedAddedCash.map((cash, index) => {
                                            const amount =
                                                cash?.note * cash?.count;
                                            return (
                                                <Table.Tr key={index}>
                                                    <Table.Td className="px-4 py-2 border-t text-sm">
                                                        {cash
                                                            ? `Rs. ${cash.note}.00`
                                                            : "Cash not found"}
                                                    </Table.Td>
                                                    <Table.Td className="px-4 py-2 border-t text-sm">
                                                        {cash
                                                            ? `${cash.count}`
                                                            : ""}
                                                    </Table.Td>
                                                    <Table.Td className="px-4 py-2 border-t text-right text-sm">
                                                        {cash
                                                            ? amountPreview(
                                                                  amount
                                                              )
                                                            : ""}
                                                    </Table.Td>
                                                </Table.Tr>
                                            );
                                        })
                                    ) : (
                                        <Table.Tr>
                                            <Table.Td
                                                colSpan={4}
                                                className="px-4 py-2 text-center text-sm"
                                            >
                                                No Cash Added
                                            </Table.Td>
                                        </Table.Tr>
                                    )}

                                    {/* Total Cash */}
                                    <Table.Tr>
                                        <Table.Td
                                            colSpan={3}
                                            className="px-4 py-2 text-left font-semibold text-sm"
                                        >
                                            Total Cash Amount
                                        </Table.Td>
                                        <Table.Td className="px-4 py-2 text-right text-sm">
                                            {amountPreview(totalAmountOfCash)}
                                        </Table.Td>
                                    </Table.Tr>

                                    {/* Balance After Cash */}
                                    <Table.Tr>
                                        <Table.Td
                                            colSpan={3}
                                            className="px-4 py-2 text-left font-semibold text-sm"
                                        >
                                            Balance
                                        </Table.Td>
                                        <Table.Td className="px-4 py-2 text-right text-sm">
                                            {amountPreview(
                                                balanceAfterAddedCash
                                            )}
                                        </Table.Td>
                                    </Table.Tr>

                                    {/* Final Balance */}
                                    <Table.Tr>
                                        <Table.Td
                                            colSpan={3}
                                            className="px-4 py-2 text-left font-semibold text-sm"
                                        >
                                            Finale Balance
                                        </Table.Td>
                                        <Table.Td className="px-4 py-2 text-right text-sm">
                                            {amountPreview(finaleBalance)}
                                        </Table.Td>
                                    </Table.Tr>

                                    {/* Notes Section */}
                                    <Table.Tr>
                                        <Table.Td
                                            colSpan={4}
                                            className="px-4 py-2 text-left font-semibold text-sm"
                                        >
                                            Notes:
                                        </Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Td
                                            colSpan={4}
                                            className="px-4 py-2 text-sm"
                                        >
                                            {
                                                bulkInvoicePaymentForm.values
                                                    .notes
                                            }
                                        </Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>
                        </Box>
                    ) : (
                        <Box mt="md">
                            <Group>
                                <Table
                                    withRowBorders={false}
                                    withTableBorder={false}
                                    withColumnBorders={false}
                                >
                                    <Table.Tbody>
                                        <Table.Tr>
                                            <Table.Td colSpan={2} fw="bold">
                                                Summary
                                            </Table.Td>{" "}
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td>Invoice Amount:</Table.Td>{" "}
                                            <Table.Td>
                                                {amountPreview(totalAmount)}
                                            </Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td>Cheque Amount:</Table.Td>{" "}
                                            <Table.Td>
                                                {amountPreview(
                                                    totalAmountOfCustomerCheques +
                                                        totalAmountOfCreatedCheques
                                                )}
                                            </Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td>Cash Amount:</Table.Td>{" "}
                                            <Table.Td>
                                                {amountPreview(
                                                    totalAmountOfCash
                                                )}
                                            </Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td>Balance:</Table.Td>{" "}
                                            <Table.Td>
                                                {amountPreview(finaleBalance)}
                                            </Table.Td>
                                        </Table.Tr>
                                    </Table.Tbody>
                                </Table>
                            </Group>
                            <Alert
                                color="red"
                                title="Notice"
                                className="flex items-center mt-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <IconInfoCircle size={16} color="red" />
                                    <Text color="red">
                                        Calculations not supported for mobile
                                        view
                                    </Text>
                                </div>
                            </Alert>
                        </Box>
                    )}
                </form>
            </Box>
            {createChequeModal()}
        </>
    );
};

export default BulkInvoicePayment;
