import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Flex,
    Group,
    Modal,
    NumberInput,
    ScrollArea,
    Select,
    Stack,
    Table,
    Text,
    TextInput,
} from "@mantine/core";
import {
    IconArrowLeft,
    IconFile,
    IconInfoCircle,
    IconTrash,
} from "@tabler/icons-react";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useNavigate, useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import {
    getSalesRecord,
    updateSalesRecord,
} from "../../store/salesRecordSlice/salesRecordSlice.ts";
import {
    DOWNLOAD_TYPES,
    SALES_RECORD_STATUS_COLORS,
} from "../../helpers/types.ts";
import { amountPreview, datePreview } from "../../helpers/preview.tsx";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import banks from "../../helpers/banks.json";
import { DatePickerInput } from "@mantine/dates";
import toNotify from "../../helpers/toNotify.tsx";

const ViewSalesRecord = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const navigate = useNavigate();
    const [makePaymentsElementOpen, makePaymentElementHandler] =
        useDisclosure(false);
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const id: any = useParams().id ?? null;
    const salesRecord = useSelector(
        (state: RootState) => state.salesRecords.selectedSalesRecord
    );
    const [chequeAddModalOpened, chequeAddModalOpenedGHandler] =
        useDisclosure(false);
    const [paymentDetails, setPaymentDetails] = useState<{
        cash: number;
        cheques: any[];
        credit: number;
    }>({
        cash: 0,
        cheques: [],
        credit: 0,
    });

    useEffect(() => {
        if (id) {
            fetchSelectedSalesRecord();
        }
    }, [dispatch]);

    const fetchSelectedSalesRecord = async () => {
        setLoading(true);
        await dispatch(getSalesRecord(id));
        setLoading(false);
    };

    const gotoPdfView = (data: any) => {
        navigate("/app/pdf/view", {
            state: { data: data, type: DOWNLOAD_TYPES.SALES_RECORD },
        });
    };

    const chequeAddModal = () => {
        return (
            <Modal
                opened={chequeAddModalOpened}
                onClose={chequeAddModalOpenedGHandler.close}
                title={<Text>Add Customer Cheques</Text>}
                size={isMobile ? "100%" : "70%"}
                styles={{
                    body: {
                        overflowY: "auto",
                        maxHeight: "80vh",
                    },
                }}
            >
                <Box>
                    {!isMobile ? (
                        <Table striped highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Bank</Table.Th>
                                    <Table.Th>Branch</Table.Th>
                                    <Table.Th>Cheque Number</Table.Th>
                                    <Table.Th>Amount</Table.Th>
                                    <Table.Th>Deposit Date</Table.Th>
                                    <Table.Th></Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {paymentDetails?.cheques.map(
                                    (cheque, index) => (
                                        <Table.Tr key={index}>
                                            <Table.Td>
                                                <Select
                                                    size="xs"
                                                    data={
                                                        banks?.map((b) => ({
                                                            label: b.name,
                                                            value: b.name,
                                                        })) ?? []
                                                    }
                                                    value={cheque.bank}
                                                    onChange={(val) =>
                                                        updateCheque(
                                                            index,
                                                            "bank",
                                                            val
                                                        )
                                                    }
                                                    placeholder="Select Bank"
                                                    searchable
                                                />
                                            </Table.Td>
                                            <Table.Td>
                                                <TextInput
                                                    size="xs"
                                                    placeholder="Enter Branch Code"
                                                    value={cheque.branch}
                                                    maxLength={3}
                                                    onChange={(e) =>
                                                        updateCheque(
                                                            index,
                                                            "branch",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Table.Td>
                                            <Table.Td>
                                                <TextInput
                                                    size="xs"
                                                    placeholder="Enter Cheque No"
                                                    value={cheque.number}
                                                    maxLength={6}
                                                    onChange={(e) =>
                                                        updateCheque(
                                                            index,
                                                            "number",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Table.Td>
                                            <Table.Td>
                                                <NumberInput
                                                    size="xs"
                                                    placeholder="Amount"
                                                    value={cheque.amount}
                                                    thousandSeparator=","
                                                    decimalScale={2}
                                                    fixedDecimalScale
                                                    allowNegative={false}
                                                    prefix="Rs. "
                                                    hideControls
                                                    onChange={(val) =>
                                                        updateCheque(
                                                            index,
                                                            "amount",
                                                            val
                                                        )
                                                    }
                                                />
                                            </Table.Td>
                                            <Table.Td>
                                                <DatePickerInput
                                                    size="xs"
                                                    placeholder="Deposite Date"
                                                    value={cheque.depositDate}
                                                    onChange={(date) =>
                                                        updateCheque(
                                                            index,
                                                            "depositDate",
                                                            date
                                                        )
                                                    }
                                                />
                                            </Table.Td>
                                            <Table.Td>
                                                <ActionIcon
                                                    color="red"
                                                    onClick={() =>
                                                        removeCheque(index)
                                                    }
                                                >
                                                    <IconTrash size={16} />
                                                </ActionIcon>
                                            </Table.Td>
                                        </Table.Tr>
                                    )
                                )}
                            </Table.Tbody>
                        </Table>
                    ) : (
                        <Stack gap="sm">
                            {paymentDetails?.cheques.map((cheque, index) => (
                                <Box
                                    key={index}
                                    p="sm"
                                    style={{
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "8px",
                                        backgroundColor: "#f9f9f9",
                                    }}
                                >
                                    <Select
                                        size="xs"
                                        label="Bank"
                                        data={
                                            banks?.map((b) => ({
                                                label: b.name,
                                                value: b.name,
                                            })) ?? []
                                        }
                                        value={cheque.bank}
                                        onChange={(val) =>
                                            updateCheque(index, "bank", val)
                                        }
                                        placeholder="Select Bank"
                                        searchable
                                    />
                                    <TextInput
                                        size="xs"
                                        label="Branch"
                                        placeholder="Enter Branch Code"
                                        value={cheque.branch}
                                        onChange={(e) =>
                                            updateCheque(
                                                index,
                                                "branch",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <TextInput
                                        size="xs"
                                        label="Cheque Number"
                                        placeholder="Enter Cheque No"
                                        value={cheque.number}
                                        onChange={(e) =>
                                            updateCheque(
                                                index,
                                                "number",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <NumberInput
                                        size="xs"
                                        label="Amount"
                                        placeholder="Enter Amount"
                                        hideControls
                                        prefix="Rs. "
                                        decimalScale={2}
                                        fixedDecimalScale
                                        thousandSeparator=","
                                        value={cheque.amount}
                                        onChange={(val) =>
                                            updateCheque(index, "amount", val)
                                        }
                                    />
                                    <DatePickerInput
                                        size="xs"
                                        label="Deposit Date"
                                        placeholder="Select Date"
                                        value={cheque.depositDate}
                                        onChange={(date) =>
                                            updateCheque(
                                                index,
                                                "depositDate",
                                                date
                                            )
                                        }
                                    />
                                    <Group justify="flex-end" mt="xs">
                                        <ActionIcon
                                            color="red"
                                            onClick={() => removeCheque(index)}
                                        >
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </Box>

                <Group justify="center" mt="md">
                    <Button fullWidth={isMobile} size="xs" onClick={addCheque}>
                        + New Cheque
                    </Button>
                </Group>

                <Group justify="flex-end" mt="md" wrap="wrap">
                    <Button
                        size="xs"
                        color="violet"
                        onClick={chequeAddModalOpenedGHandler.close}
                    >
                        Done
                    </Button>
                </Group>
            </Modal>
        );
    };

    const addCheque = () => {
        setPaymentDetails((prev) => ({
            ...prev,
            cheques: [
                ...prev.cheques,
                {
                    bank: "",
                    number: "",
                    branch: "",
                    amount: 0,
                    depositDate: null,
                },
            ],
        }));
    };

    const removeCheque = (index: number) => {
        setPaymentDetails((prev) => ({
            ...prev,
            cheques: prev.cheques.filter((_, i) => i !== index),
        }));
    };

    const updateCheque = (index: number, field: string, value: any) => {
        setPaymentDetails((prev) => ({
            ...prev,
            cheques: prev.cheques.map((cheque, i) =>
                i === index ? { ...cheque, [field]: value } : cheque
            ),
        }));
    };

    const chequeTotal = useMemo(
        () =>
            paymentDetails?.cheques?.reduce(
                (sum, cheque) => sum + (cheque.amount || 0),
                0
            ),
        [paymentDetails.cheques]
    );

    const credit = useMemo(() => {
        return (
            salesRecord?.paymentDetails?.creditAmount -
            (paymentDetails?.cash || 0) -
            chequeTotal
        );
    }, [paymentDetails.cash, chequeTotal, salesRecord]);

    const makePaymentsElement = () => {
        return (
            <div id="payment-details">
                <Group p={{ base: "sm", sm: "lg" }}>
                    <Text fw="bold" size="sm">
                        Payment Details
                    </Text>
                </Group>

                {isMobile ? (
                    // 🟦 Mobile View: Stacked layout
                    <Stack gap="sm" px="sm" py="sm">
                        <Box>
                            <Text size="sm" fw={500}>Cash Amount</Text>
                            <NumberInput
                                size="xs"
                                hideControls
                                allowNegative={false}
                                prefix="Rs. "
                                decimalScale={2}
                                fixedDecimalScale
                                thousandSeparator=","
                                placeholder="Enter Cash Amount"
                                onChange={(val: any) =>
                                    setPaymentDetails((prev) => ({
                                        ...prev,
                                        cash: Number(val) || 0,
                                    }))
                                }
                            />
                        </Box>

                        <Box>
                            <Group justify="space-between">
                                <Text size="sm" fw={500}>Cheque Amount</Text>
                                <Button
                                    size="compact-xs"
                                    variant="light"
                                    onClick={() => chequeAddModalOpenedGHandler.open()}
                                >
                                    Manage Cheques
                                </Button>
                            </Group>
                            <Text size="sm" mt="xs">{amountPreview(chequeTotal)}</Text>
                        </Box>

                        <Box>
                            <Text size="sm" fw={500}>Credit Amount</Text>
                            <Text size="sm">{amountPreview(credit)}</Text>
                        </Box>

                        {credit < 0 && (
                            <Flex align="center" gap="xs">
                                <IconInfoCircle color="red" size={16} />
                                <Text c="red" size="xs">Customer is paying more than credit</Text>
                            </Flex>
                        )}

                        <Group justify="flex-end" mt="sm">
                            <Button size="xs" fullWidth onClick={handleSalesPayments}>Save</Button>
                        </Group>
                    </Stack>
                ) : (

                <Box px={{ base: "sm", sm: "lg" }}>
                    <Table
                        withTableBorder={false}
                        withRowBorders={false}
                        withColumnBorders={false}
                        striped={false}
                        highlightOnHover={false}
                        horizontalSpacing="xs"
                        verticalSpacing="xs"
                    >
                        <Table.Tbody>
                            {/* Cash Amount */}
                            <Table.Tr>
                                <Table.Td className="text-sm w-1/3">
                                    Cash Amount
                                </Table.Td>
                                <Table.Td className="text-sm w-1/3">
                                </Table.Td>
                                <Table.Td className="w-2/3">
                                    <NumberInput
                                        size="xs"
                                        hideControls
                                        allowNegative={false}
                                        prefix="Rs. "
                                        decimalScale={2}
                                        fixedDecimalScale
                                        thousandSeparator=","
                                        placeholder="Enter Cash Amount"
                                        onChange={(val: any) =>
                                            setPaymentDetails((prev) => ({
                                                ...prev,
                                                cash: Number(val) || 0,
                                            }))
                                        }
                                    />
                                </Table.Td>
                            </Table.Tr>

                            {/* Cheque Amount */}
                            <Table.Tr>
                                <Table.Td className="text-sm w-1/3">
                                    Cheque Amount
                                </Table.Td>
                                <Table.Td className="w-1/3">
                                    <Button
                                        size="compact-xs"
                                        variant="light"
                                        onClick={() =>
                                            chequeAddModalOpenedGHandler.open()
                                        }
                                        fullWidth
                                    >
                                        Manage Cheques
                                    </Button>
                                </Table.Td>
                                <Table.Td className="text-sm w-1/3">
                                    {amountPreview(chequeTotal)}
                                </Table.Td>
                            </Table.Tr>

                            {/* Credit Amount */}
                            <Table.Tr>
                                <Table.Td className="text-sm w-1/3">
                                    Credit Amount
                                </Table.Td>
                                <Table.Td className="w-1/3"></Table.Td>
                                <Table.Td className="text-sm w-1/3">
                                    {amountPreview(credit)}
                                </Table.Td>
                            </Table.Tr>

                            {/* Warning Row */}
                            <Table.Tr>
                                <Table.Td colSpan={3}>
                                    {credit < 0 && (
                                        <Flex
                                            align="center"
                                            gap="xs"
                                            className="mt-2"
                                        >
                                            <IconInfoCircle
                                                color="red"
                                                size={16}
                                            />
                                            <Text c="red" size="xs">
                                                Customer is paying more than
                                                credit
                                            </Text>
                                        </Flex>
                                    )}
                                </Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>

                    <Group my="md" justify="flex-end">
                        <Button size="xs" onClick={handleSalesPayments}>
                            Save
                        </Button>
                    </Group>
                </Box>)}
            </div>
        );
    };

    const handleSalesPayments = async () => {
        setLoading(true);
        try {
            const payload = {
                values: {
                    isUpdatePayments: true,
                    customer: salesRecord?.customer._id,
                    paymentDetails: { ...paymentDetails, credit: credit },
                },
                id: salesRecord?._id,
            };
            const response = await dispatch(updateSalesRecord(payload));
            if (response.type === "salesRecord/updateSalesRecord/fulfilled") {
                setLoading(false);
                toNotify(
                    "Success",
                    "Sales record payments updated successfully.",
                    "SUCCESS"
                );
                setPaymentDetails({ cash: 0, cheques: [], credit: 0 });
                makePaymentElementHandler.close();
                await fetchSelectedSalesRecord();
            } else if (
                response.type === "salesRecord/updateSalesRecord/rejected"
            ) {
                setLoading(false);
                toNotify("Error", `${response.payload.error}`, "ERROR");
            } else {
                setLoading(false);
                toNotify("Warning", "Please contact system admin", "WARNING");
            }
            console.log("payload", payload);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
            toNotify("Warning", "Please contact system admin", "WARNING");
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
                    <Text size="lg" fw={500} ml={"md"}>
                        View Sales Record
                    </Text>
                </Group>
                <Group>
                    <Button
                        size="xs"
                        leftSection={<IconFile size={16} />}
                        onClick={() => gotoPdfView(salesRecord)}
                        disabled={isMobile}
                    >
                        PDF View
                    </Button>
                </Group>
            </Group>

            <Box
                display="flex"
                p="lg"
                w={{ sm: "100%", lg: "75%" }}
                className="justify-between"
            >
                <Table
                    withTableBorder={false}
                    withRowBorders={false}
                    withColumnBorders={false}
                >
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td w={{ lg: "30%", sm: "50%" }} fw={600}>
                                Sales Record Id:
                            </Table.Td>
                            <Table.Td w={{ lg: "70%", sm: "50%" }}>
                                {salesRecord?.orderId}
                            </Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td fw={600}>Customer:</Table.Td>
                            <Table.Td>{salesRecord?.customer?.name}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td fw={600}>Date:</Table.Td>
                            <Table.Td>
                                {datePreview(salesRecord?.date)}
                            </Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td fw={600}>Amount:</Table.Td>
                            <Table.Td>
                                {amountPreview(
                                    salesRecord?.amountDetails?.netTotal
                                )}
                            </Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td fw={600}>Payment Status:</Table.Td>
                            <Table.Td>
                                <Badge
                                    radius="xs"
                                    size="sm"
                                    color={
                                        SALES_RECORD_STATUS_COLORS[
                                            salesRecord?.paymentStatus as keyof typeof SALES_RECORD_STATUS_COLORS
                                        ] || "gray"
                                    }
                                >
                                    {salesRecord?.paymentStatus}
                                </Badge>
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Box>

            <Box px={"lg"} pb="lg" w={{ sm: "100%", lg: "75%" }}>
                <ScrollArea>
                    <Table
                        withTableBorder
                        withColumnBorders
                        highlightOnHover
                        striped
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th w="20">Product</Table.Th>
                                <Table.Th w="15">Size</Table.Th>
                                <Table.Th w="20">Unit Price</Table.Th>
                                <Table.Th w="20">Quantity</Table.Th>
                                <Table.Th w="25">Amount</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {salesRecord?.orderDetails?.map(
                                (o: any, i: number) => (
                                    <Table.Tr key={i}>
                                        <Table.Td>{o?.product?.name}</Table.Td>
                                        <Table.Td>
                                            {o?.product?.size} KG
                                        </Table.Td>
                                        <Table.Td>
                                            {amountPreview(
                                                o?.lineTotal / o?.amount
                                            )}
                                        </Table.Td>
                                        <Table.Td>{o?.amount}</Table.Td>
                                        <Table.Td>
                                            {amountPreview(o?.lineTotal)}
                                        </Table.Td>
                                    </Table.Tr>
                                )
                            )}
                            <Table.Tr>
                                <Table.Td colSpan={3}></Table.Td>
                                <Table.Td>Sub Total: </Table.Td>
                                <Table.Td>
                                    {amountPreview(
                                        salesRecord?.amountDetails?.subTotal
                                    )}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td colSpan={3}></Table.Td>
                                <Table.Td fw={600}>Discount: </Table.Td>
                                <Table.Td>
                                    {amountPreview(
                                        salesRecord?.amountDetails?.discount
                                    )}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td colSpan={3}></Table.Td>
                                <Table.Td fw={600}>Tax: </Table.Td>
                                <Table.Td>
                                    {amountPreview(
                                        salesRecord?.amountDetails?.tax
                                    )}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td colSpan={3}></Table.Td>
                                <Table.Td fw={600}>Other Decrements: </Table.Td>
                                <Table.Td>
                                    {amountPreview(
                                        salesRecord?.amountDetails?.otherDecrements
                                    )}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td colSpan={3}></Table.Td>
                                <Table.Td fw={600}>Other Cost: </Table.Td>
                                <Table.Td>
                                    {amountPreview(
                                        salesRecord?.amountDetails?.otherCost
                                    )}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td colSpan={3}></Table.Td>
                                <Table.Td fw={600}>Net Total: </Table.Td>
                                <Table.Td>
                                    {amountPreview(
                                        salesRecord?.amountDetails?.netTotal
                                    )}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr fw={600}>
                                <Table.Td colSpan={5}>
                                    Notes: {salesRecord?.notes}
                                </Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Box>

            <Box px={"lg"} pb="lg" w={{ sm: "100%", lg: "50%" }}>
                <Table
                    withTableBorder={false}
                    withRowBorders={false}
                    withColumnBorders={false}
                >
                    <Table.Tbody>
                        {/* Total Amount */}
                        <Table.Tr className="flex flex-wrap lg:table-row">
                            <Table.Td className="w-1/2 lg:w-1/3 font-semibold">Total Amount:</Table.Td>
                            <Table.Td className="w-1/2 lg:w-1/3">
                                {amountPreview(salesRecord?.paymentDetails?.totalAmount)}
                            </Table.Td>
                            <Table.Td className="hidden lg:table-cell lg:w-1/3"></Table.Td>
                        </Table.Tr>

                        {/* Cash Amount */}
                        <Table.Tr className="flex flex-wrap lg:table-row">
                            <Table.Td className="w-1/2 lg:w-1/3 font-semibold">Cash Amount:</Table.Td>
                            <Table.Td className="w-1/2 lg:w-1/3">
                                {amountPreview(salesRecord?.paymentDetails?.cashPayment)}
                            </Table.Td>
                            <Table.Td className="hidden lg:table-cell lg:w-1/3"></Table.Td>
                        </Table.Tr>

                        {/* Cheque Amount */}
                        <Table.Tr className="flex flex-wrap lg:table-row">
                            <Table.Td className="w-1/2 lg:w-1/3 font-semibold">Cheque Amount:</Table.Td>
                            <Table.Td className="w-1/2 lg:w-1/3">
                                {amountPreview(salesRecord?.paymentDetails?.chequePayment)}
                            </Table.Td>
                            <Table.Td className="hidden lg:table-cell lg:w-1/3"></Table.Td>
                        </Table.Tr>

                        {/* Credit Amount */}
                        <Table.Tr className="flex flex-wrap lg:table-row">
                            <Table.Td className="w-1/2 lg:w-1/3 font-semibold">Credit Amount:</Table.Td>
                            <Table.Td className="w-1/2 lg:w-1/3">
                                {amountPreview(salesRecord?.paymentDetails?.creditAmount)}
                            </Table.Td>
                            <Table.Td className="hidden lg:table-cell lg:w-1/3">
                                {salesRecord?.paymentDetails?.creditAmount > 0 && (
                                    <Button
                                        size="xs"
                                        onClick={
                                            makePaymentsElementOpen
                                                ? makePaymentElementHandler.close
                                                : makePaymentElementHandler.open
                                        }
                                        color={makePaymentsElementOpen ? "red" : "blue"}
                                    >
                                        {makePaymentsElementOpen ? "Close" : "New Payment"}
                                    </Button>
                                )}
                            </Table.Td>
                        </Table.Tr>

                        {/* Credit Button on small screens (new row) */}
                        {salesRecord?.paymentDetails?.creditAmount > 0 && (
                            <Table.Tr className="lg:hidden">
                                <Table.Td colSpan={2} className="pt-2">
                                    <Button
                                        size="xs"
                                        fullWidth
                                        onClick={
                                            makePaymentsElementOpen
                                                ? makePaymentElementHandler.close
                                                : makePaymentElementHandler.open
                                        }
                                        color={makePaymentsElementOpen ? "red" : "blue"}
                                    >
                                        {makePaymentsElementOpen ? "Close" : "New Payment"}
                                    </Button>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
                <br />
                {makePaymentsElementOpen && makePaymentsElement()}
            </Box>
            {chequeAddModal()}
        </>
    );
};

export default ViewSalesRecord;
