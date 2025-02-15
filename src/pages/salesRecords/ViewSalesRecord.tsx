import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Flex,
    Group,
    Modal,
    NumberInput,
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

    console.log("salesRecord", salesRecord);

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
                                                            value: b.ID.toString(),
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
                                                value: b.ID.toString(),
                                            })) ?? []
                                        }
                                        value={cheque.bank}
                                        onChange={(val) =>
                                            updateCheque(index, "bank", val)
                                        }
                                        placeholder="Select Bank"
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
                <Group p="lg">
                    <Text fw={"bold"}>Payment Details</Text>
                </Group>

                <Box px="lg">
                    <Table
                        withTableBorder={false}
                        withRowBorders={false}
                        withColumnBorders={false}
                    >
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Td>Cash Amount</Table.Td>
                                <Table.Td></Table.Td>
                                <Table.Td>
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
                            <Table.Tr>
                                <Table.Td>Cheque Amount</Table.Td>
                                <Table.Td>
                                    <Button
                                        size="compact-xs"
                                        variant="light"
                                        onClick={() =>
                                            chequeAddModalOpenedGHandler.open()
                                        }
                                    >
                                        Manage Cheques
                                    </Button>
                                </Table.Td>
                                <Table.Td>
                                    {amountPreview(chequeTotal)}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>Credit Amount</Table.Td>
                                <Table.Td></Table.Td>
                                <Table.Td>{amountPreview(credit)}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td colSpan={3}>
                                    {credit < 0 && (
                                        <Flex className="flex-row">
                                            <IconInfoCircle
                                                color="red"
                                                size={16}
                                            />
                                            <Text c="red" size="xs" ml={"xs"}>
                                                Customer is paying more than
                                                credit
                                            </Text>
                                        </Flex>
                                    )}
                                </Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                    <Group my="md">
                        <Button
                            size="xs"
                            className="ml-auto"
                            onClick={() => handleSalesPayments()}
                        >
                            Save
                        </Button>
                    </Group>
                </Box>
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
                <Table withTableBorder withColumnBorders highlightOnHover striped>
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
                        {salesRecord?.orderDetails?.map((o: any, i: number) => (
                            <Table.Tr key={i}>
                                <Table.Td>{o?.product?.name}</Table.Td>
                                <Table.Td>{o?.product?.size} KG</Table.Td>
                                <Table.Td>
                                    {amountPreview(o?.product?.unitPrice)}
                                </Table.Td>
                                <Table.Td>{o?.amount}</Table.Td>
                                <Table.Td>
                                    {amountPreview(o?.lineTotal)}
                                </Table.Td>
                            </Table.Tr>
                        ))}
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
                                {amountPreview(salesRecord?.amountDetails?.tax)}
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
                            Notes: {salesRecord?.notes}
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Box>

            <Box px={"lg"} pb="lg" w={{ sm: "100%", lg: "50%" }}>
                <Table
                    withTableBorder={false}
                    withRowBorders={false}
                    withColumnBorders={false}
                >
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td w="33%" fw={600}>
                                Total Amount:{" "}
                            </Table.Td>
                            <Table.Td w="33%">
                                {amountPreview(
                                    salesRecord?.paymentDetails?.totalAmount
                                )}
                            </Table.Td>
                            <Table.Td w="33%"></Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td w="33%" fw={600}>
                                Cash Amount:{" "}
                            </Table.Td>
                            <Table.Td w="33%">
                                {amountPreview(
                                    salesRecord?.paymentDetails?.cashPayment
                                )}
                            </Table.Td>
                            <Table.Td w="33%"></Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td w="33%" fw={600}>
                                Cheque Amount:{" "}
                            </Table.Td>
                            <Table.Td w="33%">
                                {amountPreview(
                                    salesRecord?.paymentDetails?.chequePayment
                                )}
                            </Table.Td>
                            <Table.Td w="33%"></Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td w="33%" fw={600}>
                                Credit Amount:{" "}
                            </Table.Td>
                            <Table.Td w="33%">
                                {amountPreview(
                                    salesRecord?.paymentDetails?.creditAmount
                                )}
                            </Table.Td>
                            <Table.Td w="33%">
                                {salesRecord?.paymentDetails?.creditAmount >
                                    0 && (
                                    <Button
                                        size="xs"
                                        onClick={
                                            makePaymentsElementOpen
                                                ? makePaymentElementHandler.close
                                                : makePaymentElementHandler.open
                                        }
                                        color={
                                            makePaymentsElementOpen
                                                ? "red"
                                                : "blue"
                                        }
                                    >
                                        {makePaymentsElementOpen
                                            ? "Close"
                                            : "New Payment"}
                                    </Button>
                                )}
                            </Table.Td>
                        </Table.Tr>
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
