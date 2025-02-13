import {
    IconArrowLeft,
    IconCalendar,
    IconTableMinus,
    IconTablePlus,
    IconTrash,
} from "@tabler/icons-react";
import {
    Group,
    Text,
    Box,
    Select,
    Button,
    Table,
    NumberInput,
    Textarea,
    Modal,
    ActionIcon,
    TextInput,
    Stack,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { getProducts } from "../../store/productSlice/productSlice.ts";
import { useEffect, useMemo, useRef, useState } from "react";
import { getCustomers } from "../../store/customerSlice/customerSlice.ts";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { amountPreview } from "../../helpers/preview.tsx";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router";
import banks from "../../helpers/banks.json";
import { useLoading } from "../../helpers/loadingContext.tsx";
import toNotify from "../../helpers/toNotify.tsx";
import { addSalesRecord } from "../../store/salesRecordSlice/salesRecordSlice.ts";

const AddSalesRecord = () => {
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const products = useSelector((state: RootState) => state.product.products);
    const customers = useSelector(
        (state: RootState) => state.customer.customers
    );
    const [productSelectModalOpened, productSelectModalHandler] =
        useDisclosure(false);
    const [chequeAddModalOpened, chequeAddModalOpenedGHandler] =
        useDisclosure(false);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(false);
    const paymentDetailsRef = useRef<HTMLDivElement | null>(null);
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
        fetchRelatedDetails();
    }, []);

    const fetchRelatedDetails = async () => {
        await dispatch(getCustomers({ status: true }));
        await dispatch(getProducts({ status: true }));
    };

    const salesRecordForm = useForm({
        initialValues: {
            customer: "",
            date: null,
            discount: 0,
            tax: 0,
            otherCost: 0,
            notes: "",
        },

        validate: {
            customer: (value) => (!value ? "Customer is required" : null),
            date: (value) => (!value ? "Date is required" : null),
        },
    });

    const updateSelectedProducts = (product: any) => {
        setSelectedProducts((prev) => {
            const exists = prev.some((p) => p.product._id === product._id);
            if (!exists) {
                return [...prev, { product, amount: 0, lineTotal: 0 }];
            }
            return prev;
        });
    };

    const removeSelectedProduct = (productId: string) => {
        setSelectedProducts((prev) =>
            prev.filter((p) => p.product._id !== productId)
        );
    };

    const productSelectModal = () => (
        <Modal
            opened={productSelectModalOpened}
            onClose={productSelectModalHandler.close}
            title={<Text>Select Products</Text>}
            size={isMobile ? "100%" : "50%"}
        >
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Product Name</Table.Th>
                        <Table.Th>Product Code</Table.Th>
                        <Table.Th>Size (KG)</Table.Th>
                        <Table.Th>Unit Price</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {products.map((p: any, i: any) => (
                        <Table.Tr key={i}>
                            <Table.Td>{p.name}</Table.Td>
                            <Table.Td>{p.productCode}</Table.Td>
                            <Table.Td>{p.size}</Table.Td>
                            <Table.Td>{amountPreview(p.unitPrice)}</Table.Td>
                            <Table.Td>
                                <Group
                                    onClick={() =>
                                        selectedProducts.some(
                                            (prod) => prod.product._id === p._id
                                        )
                                            ? removeSelectedProduct(p._id)
                                            : updateSelectedProducts(p)
                                    }
                                >
                                    {selectedProducts.some(
                                        (prod) => prod.product._id === p._id
                                    ) ? (
                                        <ActionIcon color="red">
                                            <IconTableMinus size={16} />
                                        </ActionIcon>
                                    ) : (
                                        <ActionIcon>
                                            <IconTablePlus size={16} />
                                        </ActionIcon>
                                    )}
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
            <Group>
                <Button
                    size="xs"
                    mt="sm"
                    color="violet"
                    className="ml-auto"
                    onClick={productSelectModalHandler.close}
                >
                    Done
                </Button>
            </Group>
        </Modal>
    );

    const calculateLineTotal = (index: number, amount: number) => {
        setSelectedProducts((prev) =>
            prev.map((p, i) =>
                i === index
                    ? {
                        ...p,
                        amount: amount || 0,
                        lineTotal: (p.product.unitPrice || 0) * (amount || 0),
                    }
                    : p
            )
        );
    };

    const subTotal = useMemo(
        () => selectedProducts.reduce((sum, p) => sum + (p.lineTotal || 0), 0),
        [selectedProducts]
    );

    const netTotal = useMemo(
        () =>
            subTotal -
            (salesRecordForm.values.discount || 0) +
            (salesRecordForm.values.tax || 0) +
            (salesRecordForm.values.otherCost || 0),
        [
            subTotal,
            salesRecordForm.values.discount,
            salesRecordForm.values.tax,
            salesRecordForm.values.otherCost,
        ]
    );

    const chequeTotal = useMemo(
        () =>
            paymentDetails.cheques.reduce(
                (sum, cheque) => sum + (cheque.amount || 0),
                0
            ),
        [paymentDetails.cheques]
    );

    const credit = useMemo(() => {
        return netTotal - (paymentDetails.cash || 0) - chequeTotal;
    }, [paymentDetails.cash, chequeTotal, netTotal]);

    const handleSalesRecordSubmit = () => {
        setPaymentDetailsOpen(true);
        setPaymentDetails({ cash: 0, cheques: [], credit: netTotal });

        navigate("/app/sales-records/add-sales-record#payment-details");

        setTimeout(() => {
            paymentDetailsRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 100);
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
                                {paymentDetails.cheques.map((cheque, index) => (
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
                                ))}
                            </Table.Tbody>
                        </Table>
                    ) : (
                        <Stack gap="sm">
                            {paymentDetails.cheques.map((cheque, index) => (
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

    const paymentDetailsElement = () => {
        return (
            <div ref={paymentDetailsRef} id="payment-details">
                <Group p="lg">
                    <Text fw={"bold"}>Payment Details</Text>
                </Group>

                <Box w={{ sm: "100%", lg: "50%" }} px="lg">
                    <Table>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Td>Total Amount</Table.Td>
                                <Table.Td></Table.Td>
                                <Table.Td>{amountPreview(netTotal)}</Table.Td>
                            </Table.Tr>
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
                                        value={paymentDetails.cash}
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
                                        onClick={
                                            chequeAddModalOpenedGHandler.open
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
                        </Table.Tbody>
                    </Table>
                    {credit < 0 && (
                        <Text size="xs" c="red">
                            Credit amount should not be negative
                        </Text>
                    )}
                    <Group my="md">
                        <Button
                            size="xs"
                            className="ml-auto"
                            disabled={credit < 0}
                            onClick={() => handleSaveSalesRecord()}
                        >
                            Save
                        </Button>
                    </Group>
                </Box>
            </div>
        );
    };

    const handleSaveSalesRecord = async () => {
        setLoading(true);
        try {
            const payload = {
                customer: salesRecordForm.values.customer,
                date: salesRecordForm.values.date
                    ? new Date(salesRecordForm.values.date).toISOString()
                    : null,
                products: selectedProducts,
                subTotal: subTotal,
                discount: salesRecordForm.values.discount,
                tax: salesRecordForm.values.tax,
                otherCost: salesRecordForm.values.otherCost,
                netTotal: netTotal,
                notes: salesRecordForm.values.notes,
                payments: {
                    cash: paymentDetails.cash,
                    cheques: paymentDetails.cheques.map((cheque) => ({
                        ...cheque,
                        date: cheque.depositDate
                            ? new Date(cheque.depositDate).toISOString()
                            : null,
                    })),
                    credit: credit,
                },
            };

            console.log("PAYLOAD", payload);
            const response = await dispatch(addSalesRecord(payload));

            if (response.type === "salesRecord/addSalesRecord/fulfilled") {
                toNotify(
                    "Success",
                    "Sales record created successfully",
                    "SUCCESS"
                );
                navigate("/app/sales-records");
            } else if (
                response.type === "salesRecord/addSalesRecord/rejected"
            ) {
                toNotify("Error", `${response.payload.error}`, "ERROR");
            } else {
                toNotify("Warning", "Please contact system admin", "WARNING");
            }
        } catch (e) {
            console.error(e);
            toNotify("Warning", "Please contact system admin", "WARNING");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Group
                p="lg"
                className="flex flex-col md:flex-row justify-between items-center"
            >
                <Group className="flex items-center">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <Text fw={500} ml="md" size="lg">
                        Add Sales Record
                    </Text>
                </Group>
            </Group>

            <Group px="lg">
                <Text fw={"bold"}>Order Details</Text>
            </Group>

            <Box w={{ sm: "100%", lg: "50%" }} px="lg">
                <form
                    onSubmit={salesRecordForm.onSubmit(handleSalesRecordSubmit)}
                >
                    <Group w="100%">
                        <Select
                            label="Customer"
                            placeholder="Select Customer"
                            data={customers.map((c: any) => ({
                                label: c.name,
                                value: c._id,
                            }))}
                            withAsterisk
                            style={{ width: "45%" }}
                            size="xs"
                            disabled={paymentDetailsOpen}
                            {...salesRecordForm.getInputProps("customer")}
                        />
                        <DatePickerInput
                            style={{ width: "45%" }}
                            label="Date"
                            placeholder="Select Date"
                            rightSection={<IconCalendar size={16} />}
                            size="xs"
                            maxDate={new Date()}
                            disabled={paymentDetailsOpen}
                            {...salesRecordForm.getInputProps("date")}
                        />
                    </Group>

                    <Box mt="md">
                        {selectedProducts.length > 0 && (
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th w="50%">Product</Table.Th>
                                        <Table.Th w="25%">Amount</Table.Th>
                                        <Table.Th w="25%">Line Total</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {selectedProducts.map((p, i) => (
                                        <Table.Tr key={i}>
                                            <Table.Td>
                                                {p.product.name}
                                            </Table.Td>
                                            <Table.Td>
                                                <NumberInput
                                                    size="xs"
                                                    hideControls
                                                    value={p.amount}
                                                    onChange={(v: any) =>
                                                        calculateLineTotal(i, v)
                                                    }
                                                    disabled={
                                                        paymentDetailsOpen
                                                    }
                                                />
                                            </Table.Td>
                                            <Table.Td>
                                                {amountPreview(p.lineTotal)}
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        )}
                        <Button
                            size="xs"
                            mt="md"
                            onClick={productSelectModalHandler.open}
                            disabled={paymentDetailsOpen}
                        >
                            Manage Products
                        </Button>
                    </Box>

                    <Group>
                        <Table
                            withTableBorder={false}
                            withRowBorders={false}
                            withColumnBorders={false}
                        >
                            <Table.Tbody>
                                <Table.Tr>
                                    <Table.Td w="33%"></Table.Td>
                                    <Table.Td w="33%">
                                        <Text size="sm" fw="bold">
                                            Sub Total
                                        </Text>
                                    </Table.Td>
                                    <Table.Td w="33%">
                                        {amountPreview(subTotal)}
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td w="33%"></Table.Td>
                                    <Table.Td w="33%">
                                        <Text size="sm" fw="bold">
                                            Discount
                                        </Text>
                                    </Table.Td>
                                    <Table.Td w="33%">
                                        <NumberInput
                                            size="xs"
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                            thousandSeparator=","
                                            hideControls
                                            allowNegative={false}
                                            prefix="Rs. "
                                            disabled={paymentDetailsOpen}
                                            {...salesRecordForm.getInputProps(
                                                "discount"
                                            )}
                                        />
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td w="33%"></Table.Td>
                                    <Table.Td w="33%">
                                        <Text size="sm" fw="bold">
                                            Tax
                                        </Text>
                                    </Table.Td>
                                    <Table.Td w="33%">
                                        <NumberInput
                                            size="xs"
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                            thousandSeparator=","
                                            hideControls
                                            allowNegative={false}
                                            prefix="Rs. "
                                            disabled={paymentDetailsOpen}
                                            {...salesRecordForm.getInputProps(
                                                "tax"
                                            )}
                                        />
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td w="33%"></Table.Td>
                                    <Table.Td w="33%">
                                        <Text size="sm" fw="bold">
                                            Other Cost
                                        </Text>
                                    </Table.Td>
                                    <Table.Td w="33%">
                                        <NumberInput
                                            size="xs"
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                            thousandSeparator=","
                                            hideControls
                                            allowNegative={false}
                                            prefix="Rs. "
                                            disabled={paymentDetailsOpen}
                                            {...salesRecordForm.getInputProps(
                                                "otherCost"
                                            )}
                                        />
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td w="33%"></Table.Td>
                                    <Table.Td w="33%">
                                        <Text size="sm" fw="bold">
                                            Net Total
                                        </Text>
                                    </Table.Td>
                                    <Table.Td w="33%">
                                        {amountPreview(netTotal)}
                                    </Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                    </Group>

                    <Textarea
                        label="Notes"
                        placeholder="Additional information"
                        disabled={paymentDetailsOpen}
                        {...salesRecordForm.getInputProps("notes")}
                    />

                    <Group>
                        <Button
                            size="xs"
                            color="violet"
                            my="md"
                            className="ml-auto"
                            type="submit"
                            disabled={
                                selectedProducts.length === 0 ||
                                selectedProducts.some(
                                    (p) => !p.amount || p.amount <= 0
                                ) ||
                                paymentDetailsOpen
                            }
                        >
                            Next
                        </Button>
                    </Group>
                </form>
            </Box>
            {paymentDetailsOpen && paymentDetailsElement()}
            {productSelectModal()}
            {chequeAddModal()}
        </>
    );
};

export default AddSalesRecord;
