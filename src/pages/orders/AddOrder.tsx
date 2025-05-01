import {
    IconArrowLeft,
    IconCalendar,
    IconTableMinus,
    IconTablePlus,
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
    TextInput, Flex,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { AppDispatch, RootState } from "../../store/store.ts";
import {
    addCustomer,
    getCustomers,
} from "../../store/customerSlice/customerSlice.ts";
import { getProducts } from "../../store/productSlice/productSlice.ts";
import { amountPreview } from "../../helpers/preview.tsx";
import { addOrder } from "../../store/orderSlice/orderSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";
import { isValidPhone } from "../../utils/inputValidators.ts";

const AddOrder = () => {
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [products, setProducts] = useState<any[]>([]);
    const customers = useSelector(
        (state: RootState) => state.customer.customers
    );
    const [productSelectModalOpened, productSelectModalHandler] =
        useDisclosure(false);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [customerAddModalOpened, customerAddModalHandler] =
        useDisclosure(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchRelatedDetails();
    }, []);

    const filters = {status: true};
    const fetchRelatedDetails = async () => {
        await dispatch(getCustomers({ status: true }));
        const response = await dispatch(getProducts({filters: filters}));
        setProducts(response.payload.result);
    };

    const orderForm = useForm({
        initialValues: {
            customer: "",
            expectedDate: null,
            notes: "",
        },

        validate: {
            customer: (value) => (!value ? "Customer is required" : null),
            expectedDate: (value) => (!value ? "Expected date is required" : null),
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
            title={<Text size="lg" fw="bold">Select Products</Text>}
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

    const handleSaveOrder = async () => {
        setLoading(true);
        try {
            const payload = {
                customer: orderForm.values.customer,
                expectedDate: orderForm.values.expectedDate
                    ? new Date(orderForm.values.expectedDate).toISOString()
                    : null,
                products: selectedProducts,
                subTotal: subTotal,
                notes: orderForm.values.notes,
            };

            const response = await dispatch(addOrder(payload));

            if (response.type === "order/addOrder/fulfilled") {
                toNotify("Success", "Order created successfully", "SUCCESS");
                navigate("/app/sales-records/orders");
            } else if (response.type === "order/addOrder/rejected") {
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

    const customerAddForm = useForm({
        initialValues: {
            name: "",
            phone: "",
            email: "",
            address: "",
            remarks: "",
        },
        validate: {
            name: (value) =>
                value.trim() ? null : "Customer name is required.",
            phone: (value) => {
                if (!value.trim()) {
                    return "Phone number is required.";
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
            const response: any = await dispatch(addCustomer(values));
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
                title={<Text size="lg" fw="bold">Add Customer</Text>}
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
                        withAsterisk
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
                        Add Purchase Order
                    </Text>
                </Group>
            </Group>

            <Group px="lg">
                <Text fw={"bold"}>Order Details</Text>
            </Group>

            <Box w={{ sm: "100%", lg: "50%" }} px="lg">
                <form onSubmit={orderForm.onSubmit(handleSaveOrder)}>
                    <Flex
                        direction={{ base: "column", sm: "column", md: "row" }}
                        wrap="wrap"
                        gap="xs"
                        w="100%"
                        align="flex-start"
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
                            searchable
                            {...orderForm.getInputProps("customer")}
                        />

                        <DatePickerInput
                            label="Expected Date"
                            placeholder="Select Expected Date"
                            rightSection={<IconCalendar size={16} />}
                            size="xs"
                            minDate={new Date()}
                            w={{ base: "100%", md: "45%" }}
                            {...orderForm.getInputProps("expectedDate")}
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
                                                    max={p.product.count}
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
                            </Table.Tbody>
                        </Table>
                    </Group>

                    <Textarea
                        label="Notes"
                        placeholder="Additional information"
                        {...orderForm.getInputProps("notes")}
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
                                )
                            }
                        >
                            Save
                        </Button>
                    </Group>
                </form>
            </Box>
            {productSelectModal()}
            {customerAddModal()}
        </>
    );
};

export default AddOrder;
