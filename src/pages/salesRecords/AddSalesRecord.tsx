import {
    IconArrowLeft,
    IconCalendar, IconInfoCircle,
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
    Stack, Flex,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { getProducts } from "../../store/productSlice/productSlice.ts";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    addCustomer,
    getCustomers,
} from "../../store/customerSlice/customerSlice.ts";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { amountPreview } from "../../helpers/preview.tsx";
import { useForm } from "@mantine/form";
import { useNavigate, useSearchParams } from "react-router";
import banks from "../../helpers/banks.json";
import { useLoading } from "../../helpers/loadingContext.tsx";
import toNotify from "../../helpers/toNotify.tsx";
import { addSalesRecord } from "../../store/salesRecordSlice/salesRecordSlice.ts";
import { getWarehouse } from "../../store/warehouseSlice/warehouseSlice.ts";
import { isValidPhone } from "../../utils/inputValidators.ts";
import { getOrder } from "../../store/orderSlice/orderSlice.ts";

const AddSalesRecord = () => {
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [products, setProducts] = useState<any[]>([]);
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
    const warehouseId = searchParams.get("warehouseId");
    const orderId = searchParams.get("orderId");
    const warehouse = useSelector(
        (state: RootState) => state.warehouses.selectedWarehouse
    );
    const order = useSelector(
        (state: RootState) => state.orders.selectedSalesOrder
    );
    const [warehouseStockModalOpened, warehouseStockModalHandler] =
        useDisclosure(false);
    const [customerAddModalOpened, customerAddModalHandler] =
        useDisclosure(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchRelatedDetails();
    }, []);

    const filters = { status: true };

    const fetchRelatedDetails = async () => {
        await dispatch(getCustomers({ filters }));

        if (warehouseId) {
            const response = await dispatch(getWarehouse(warehouseId));
            const productArray = response.payload.result.products.map(
                (item: any) => ({
                    ...item.product,
                    count: item.count,
                    mappingId: item._id,
                })
            );
            setProducts(productArray);
        } else if (orderId) {
            const response = await dispatch(getOrder(orderId));
            const productResponse = await dispatch(getProducts({ filters }));
            setProducts(productResponse.payload.result);
            const data: any = response.payload.result.metadata;
            salesRecordForm.setValues({
                customer: data.customer,
                date: null,
                notes: data.notes,
            });
            setSelectedProducts(data.products);
        } else {
            const response = await dispatch(getProducts({ filters }));
            setProducts(response.payload.result);
        }
    };

    const salesRecordForm = useForm({
        initialValues: {
            customer: "",
            date: null,
            discount: 0,
            tax: 0,
            otherDecrements:0,
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
            title={<Text size={"lg"} fw={"bold"}>Select Products</Text>}
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
                    {products?.map((p: any, i: any) => (
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
                        lineTotal: (p.unitPrice ?? p.product.unitPrice) * (amount || 0),
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
            (salesRecordForm.values.discount || 0) -
            (salesRecordForm.values.otherDecrements || 0) +
            (salesRecordForm.values.tax || 0) +
            (salesRecordForm.values.otherCost || 0),
        [
            subTotal,
            salesRecordForm.values.discount,
            salesRecordForm.values.tax,
            salesRecordForm.values.otherDecrements,
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

        navigate(
            warehouseId
                ? `/app/sales-records/add-sales-record?warehouseId=${warehouseId}#payment-details`
                : `/app/sales-records/add-sales-record?orderId=${orderId}#payment-details`
        );


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
                title={<Text size={"lg"} fw={"bold"}>Add Customer Cheques</Text>}
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

    const paymentDetailsElement = () => {
        return (
            <div ref={paymentDetailsRef} id="payment-details">
                <Group p="lg">
                    <Text fw={"bold"}>Payment Details</Text>
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
                            <Button size="xs" onClick={handleSaveSalesRecord}>Save</Button>
                        </Group>
                    </Stack>
                ) : (

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
                </Box>)}
            </div>
        );
    };

    const handleUnitPriceChange = (index: number, newUnitPrice: number) => {
        setSelectedProducts((prev) => {
            const updated = [...prev];
            const amount = updated[index].amount || 0;

            updated[index].unitPrice = newUnitPrice;
            updated[index].lineTotal = newUnitPrice * amount;

            return updated;
        });
    };

    const handleSaveSalesRecord = async () => {
        setLoading(true);
        console.log("orderId", orderId);
        try {
            const payload = {
                isOrdered: !!orderId,
                orderId: order._id,
                isWarehouseSale: !!warehouseId,
                warehouseId: warehouse._id,
                customer: salesRecordForm.values.customer,
                date: salesRecordForm.values.date
                    ? new Date(salesRecordForm.values.date).toISOString()
                    : null,
                products: selectedProducts,
                subTotal: subTotal,
                discount: salesRecordForm.values.discount,
                tax: salesRecordForm.values.tax,
                otherCost: salesRecordForm.values.otherCost,
                otherDecrements: salesRecordForm.values.otherDecrements,
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
    console.log("products", products);

    const warehouseStockModal = () => {
        return (
            <Modal
                opened={warehouseStockModalOpened}
                onClose={warehouseStockModalHandler.close}
                title={
                    <Text size={"lg"} fw={"bold"}>
                        Warehouse Stock Details
                    </Text>
                }
                size={isMobile ? "100%" : "50%"}
            >
                <Stack gap="xs">
                    <Text>Warehouse ID: {warehouse.id}</Text>
                    <Text>City: {warehouse.city}</Text>
                </Stack>
                <Group>
                    <Table withTableBorder withColumnBorders withRowBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Td>Product</Table.Td>
                                <Table.Td>Product Code</Table.Td>
                                <Table.Td>Size</Table.Td>
                                <Table.Td>Unit Price</Table.Td>
                                <Table.Td>Stock</Table.Td>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {products?.map((p, i) => (
                                <Table.Tr key={i}>
                                    <Table.Td>{p?.name}</Table.Td>
                                    <Table.Td>{p?.productCode}</Table.Td>
                                    <Table.Td>{p?.size} KG</Table.Td>
                                    <Table.Td>
                                        {amountPreview(p?.unitPrice)}
                                    </Table.Td>
                                    <Table.Td>{p?.count}</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Group>
            </Modal>
        );
    };

    const customerAddForm = useForm({
        initialValues: {
            name: "",
            phone: "",
            email: "",
            address: "",
            remarks: ""
        },
        validate: {
            name: (value) =>
                value.trim() ? null : "Customer name is required.",
            phone: (value) => {
                if (!value.trim()) {
                    // return "Phone number is required.";
                    return null;
                }
                if (!isValidPhone(value)) {
                    return "Please add a valid phone number.";
                }
                return null;
            },
        },
    });

    const customerAddFormHandler = async (
        values: typeof customerAddForm.values
    ) => {
        try {
            setIsLoading(true);
            const response = await dispatch(addCustomer(values));
            if (response.type === "customer/addCustomer/fulfilled") {
                setIsLoading(false);
                toNotify("Success", "Customer created successfully", "SUCCESS");
                customerAddModalHandler.close();
                customerAddForm.reset();
                fetchRelatedDetails();
            } else if (response.type === "customer/addCustomer/rejected") {
                setIsLoading(false);
                toNotify("Error", `${response.payload.error}`, "ERROR");
            } else {
                setIsLoading(false);
                toNotify("Warning", `Please contact system admin`, "WARNING");
                customerAddModalHandler.close();
                customerAddForm.reset();
            }
        } catch (e: any) {
            console.error(e.message);
            setIsLoading(false);
            setIsLoading(false);
            toNotify("Warning", `Please contact system admin`, "WARNING");
            customerAddModalHandler.close();
            customerAddForm.reset();
        }
    };

    const customerAddModal = () => {
        return (
            <Modal
                opened={customerAddModalOpened}
                onClose={() => {
                    customerAddModalHandler.close();
                    customerAddForm.reset();
                }}
                title={<Text size={"lg"} fw={"bold"}>Add Customer</Text>}
            >
                <form
                    onSubmit={customerAddForm.onSubmit(customerAddFormHandler)}
                >
                    <TextInput
                        label="Name"
                        withAsterisk
                        placeholder="Customer Name"
                        {...customerAddForm.getInputProps("name")}
                    />
                    <TextInput
                        label="Phone"
                        // withAsterisk
                        placeholder="Customer Phone"
                        {...customerAddForm.getInputProps("phone")}
                    />
                    <TextInput
                        label="Email"
                        placeholder="Customer Email"
                        {...customerAddForm.getInputProps("email")}
                    />
                    <Textarea
                        label="Address"
                        placeholder="Customer Address"
                        {...customerAddForm.getInputProps("address")}
                    />
                    <Textarea label="Remark" placeholder="Enter Remarks" {...customerAddForm.getInputProps("remarks")}/>

                    <Button mt="md" fullWidth loading={isLoading} type="submit">
                        Save
                    </Button>
                </form>
            </Modal>
        );
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

            <Box w={{ sm: "100%", lg: "75%" }} px="lg">
                <form
                    onSubmit={salesRecordForm.onSubmit(handleSalesRecordSubmit)}
                >
                    <Flex
                        direction={{ base: "column", sm: "column", md: "row" }}
                        gap="xs"
                        wrap="wrap"
                        w="100%"
                    >
                        <Select
                            label="Customer"
                            placeholder="Select Customer"
                            data={customers?.map((c: any) => ({
                                label: c.name,
                                value: c._id,
                            }))}
                            withAsterisk
                            w={{ base: "100%", md: "45%" }}
                            size="xs"
                            disabled={paymentDetailsOpen}
                            {...salesRecordForm.getInputProps("customer")}
                            searchable
                        />

                        <DatePickerInput
                            label="Date"
                            placeholder="Select Date"
                            rightSection={<IconCalendar size={16} />}
                            size="xs"
                            maxDate={new Date()}
                            disabled={paymentDetailsOpen}
                            w={{ base: "100%", md: "45%" }}
                            {...salesRecordForm.getInputProps("date")}
                            withAsterisk
                        />

                        <Text
                            size="xs"
                            className="cursor-pointer"
                            c="blue"
                            td="underline"
                            mt={{ base: "xs", md: 22 }}
                            onClick={() => customerAddModalHandler.open()}
                        >
                            Create New Customer
                        </Text>
                    </Flex>

                    <Box mt="md">
                        {selectedProducts.length > 0 && (
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th w="25%">Product</Table.Th>
                                        <Table.Th w="25%">Unit Price</Table.Th>
                                        <Table.Th w="25%">Amount</Table.Th>
                                        <Table.Th w="25%">Line Total</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {selectedProducts?.map((p, i) => (
                                        <Table.Tr key={i}>
                                            <Table.Td>
                                                {p.product.name}
                                            </Table.Td>
                                            <Table.Td>
                                                <NumberInput
                                                    size="xs"
                                                    hideControls
                                                    value={p.unitPrice ?? p.product.unitPrice}
                                                    onChange={(v: any) => handleUnitPriceChange(i, v)}
                                                    disabled={paymentDetailsOpen}
                                                    prefix="Rs. "
                                                    decimalScale={2}
                                                    fixedDecimalScale
                                                    thousandSeparator=","
                                                    allowNegative={false}
                                                />
                                            </Table.Td>
                                            <Table.Td>
                                                <NumberInput
                                                    size="xs"
                                                    hideControls
                                                    value={p.amount}
                                                    onChange={(v: any) =>
                                                        calculateLineTotal(i, v)
                                                    }
                                                    max={p.product.count}
                                                    disabled={
                                                        paymentDetailsOpen
                                                    }
                                                    error={
                                                        p.amount >
                                                        p.product.count
                                                            ? `Warehouse only have ${p.product.count} bags`
                                                            : ""
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
                        </Button>{" "}
                        {warehouseId && (
                            <Button
                                size="xs"
                                mt="md"
                                onClick={warehouseStockModalHandler.open}
                                color="violet"
                            >
                                Warehouse Stocks
                            </Button>
                        )}
                    </Box>

                    <Group>
                        <Table
                            withTableBorder={false}
                            withRowBorders={false}
                            withColumnBorders={false}
                        >
                            <Table.Tbody>
                                {/* Sub Total */}
                                <Table.Tr className="flex flex-wrap lg:table-row">
                                    <Table.Td className="hidden lg:table-cell lg:w-1/3" />
                                    <Table.Td className="w-1/2 lg:w-1/3">
                                        <Text size="sm" fw="bold">Sub Total</Text>
                                    </Table.Td>
                                    <Table.Td className="w-1/2 lg:w-1/3">
                                        {amountPreview(subTotal)}
                                    </Table.Td>
                                </Table.Tr>

                                {/* Discount */}
                                <Table.Tr className="flex flex-wrap lg:table-row">
                                    <Table.Td className="hidden lg:table-cell lg:w-1/3" />
                                    <Table.Td className="w-1/2 lg:w-1/3">
                                        <Text size="sm" fw="bold">Discount</Text>
                                    </Table.Td>
                                    <Table.Td className="w-1/2 lg:w-1/3">
                                        <NumberInput
                                            size="xs"
                                            decimalScale={2}
                                            fixedDecimalScale
                                            thousandSeparator=","
                                            hideControls
                                            allowNegative={false}
                                            prefix="Rs. "
                                            disabled={paymentDetailsOpen}
                                            {...salesRecordForm.getInputProps("discount")}
                                        />
                                    </Table.Td>
                                </Table.Tr>

                                {/* Tax */}
                                <Table.Tr className="flex flex-wrap lg:table-row">
                                    <Table.Td className="hidden lg:table-cell lg:w-1/3" />
                                    <Table.Td className="w-1/2 lg:w-1/3">
                                        <Text size="sm" fw="bold">Tax</Text>
                                    </Table.Td>
                                    <Table.Td className="w-1/2 lg:w-1/3">
                                        <NumberInput
                                            size="xs"
                                            decimalScale={2}
                                            fixedDecimalScale
                                            thousandSeparator=","
                                            hideControls
                                            allowNegative={false}
                                            prefix="Rs. "
                                            disabled={paymentDetailsOpen}
                                            {...salesRecordForm.getInputProps("tax")}
                                        />
                                    </Table.Td>
                                </Table.Tr>

                                {/* Other Cost */}
                                <Table.Tr className="flex flex-wrap lg:table-row">
                                    <Table.Td className="hidden lg:table-cell lg:w-1/3" />
                                    <Table.Td className="w-1/2 lg:w-1/3">
                                        <Text size="sm" fw="bold">Other Decrements</Text>
                                    </Table.Td>
                                    <Table.Td className="w-1/2 lg:w-1/3">
                                        <NumberInput
                                            size="xs"
                                            decimalScale={2}
                                            fixedDecimalScale
                                            thousandSeparator=","
                                            hideControls
                                            allowNegative={false}
                                            prefix="Rs. "
                                            disabled={paymentDetailsOpen}
                                            {...salesRecordForm.getInputProps("otherDecrements")}
                                        />
                                    </Table.Td>
                                </Table.Tr>

                                {/* Other Cost */}
                                <Table.Tr className="flex flex-wrap lg:table-row">
                                    <Table.Td className="hidden lg:table-cell lg:w-1/3" />
                                    <Table.Td className="w-1/2 lg:w-1/3">
                                        <Text size="sm" fw="bold">Other Cost</Text>
                                    </Table.Td>
                                    <Table.Td className="w-1/2 lg:w-1/3">
                                        <NumberInput
                                            size="xs"
                                            decimalScale={2}
                                            fixedDecimalScale
                                            thousandSeparator=","
                                            hideControls
                                            allowNegative={false}
                                            prefix="Rs. "
                                            disabled={paymentDetailsOpen}
                                            {...salesRecordForm.getInputProps("otherCost")}
                                        />
                                    </Table.Td>
                                </Table.Tr>

                                {/* Net Total */}
                                <Table.Tr className="flex flex-wrap lg:table-row">
                                    <Table.Td className="hidden lg:table-cell lg:w-1/3" />
                                    <Table.Td className="w-1/2 lg:w-1/3">
                                        <Text size="sm" fw="bold">Net Total</Text>
                                    </Table.Td>
                                    <Table.Td className="w-1/2 lg:w-1/3">
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
            {warehouseStockModal()}
            {customerAddModal()}
        </>
    );
};

export default AddSalesRecord;
