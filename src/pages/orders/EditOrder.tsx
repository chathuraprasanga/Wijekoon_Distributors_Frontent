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
    TextInput,
    Flex, ScrollArea,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useNavigate, useParams } from "react-router";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { AppDispatch, RootState } from "../../store/store.ts";
import {
    addCustomer,
    getCustomers,
} from "../../store/customerSlice/customerSlice.ts";
import { amountPreview } from "../../helpers/preview.tsx";
import { getOrder, updateOrder } from "../../store/orderSlice/orderSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";
import { isValidPhone } from "../../utils/inputValidators.ts";
import { getProducts } from "../../store/productSlice/productSlice.ts";

const EditOrder = () => {
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const products = useSelector((state: RootState) => state.product.products);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const customers = useSelector(
        (state: RootState) => state.customer?.customers
    );
    const [productSelectModalOpened, productSelectModalHandler] =
        useDisclosure(false);
    const [customerAddModalOpened, customerAddModalHandler] =
        useDisclosure(false);
    const [isLoading, setIsLoading] = useState(false);

    const id: any = useParams().id ?? null;
    const order = useSelector(
        (state: RootState) => state.orders.selectedSalesOrder
    );
    const metadata = order?.metadata;

    useEffect(() => {
        if (id) {
            fetchSelectedOrder();
        }
    }, [dispatch]);

    const fetchSelectedOrder = async () => {
        setLoading(true);
        await dispatch(getOrder(id));
        setLoading(false);
    };

    const orderForm = useForm({
        initialValues: {
            customer: "",
            expectedDate: new Date(),
            notes: "",
        },

        validate: {
            customer: (value) => (!value ? "Customer is required" : null),
            expectedDate: (value) =>
                !value ? "Expected date is required" : null,
        },
    });

    useEffect(() => {
        if (order) {
            orderForm.setValues({
                customer: metadata?.customer,
                expectedDate: new Date(metadata?.expectedDate),
                notes: metadata?.notes,
            });
            setSelectedProducts(metadata?.products);
            orderForm.resetDirty();
        }
    }, [metadata]);

    const updateSelectedProducts = (product: any) => {
        setSelectedProducts((prev) => {
            const exists = prev?.some((p) => p.product._id === product._id);
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
            title={
                <Text size="lg" fw="bold">
                    Select Products
                </Text>
            }
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
                                        selectedProducts?.some(
                                            (prod) => prod.product._id === p._id
                                        )
                                            ? removeSelectedProduct(p._id)
                                            : updateSelectedProducts(p)
                                    }
                                >
                                    {selectedProducts?.some(
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
        () => selectedProducts?.reduce((sum, p) => sum + (p.lineTotal || 0), 0),
        [selectedProducts]
    );

    const handleUpdateOrder = async () => {
        setLoading(true);
        try {
            const payload = {
                id: id,
                values: {
                    customer: orderForm.values?.customer,
                    expectedDate: orderForm.values?.expectedDate
                        ? new Date(orderForm.values?.expectedDate).toISOString()
                        : null,
                    products: selectedProducts,
                    subTotal: subTotal,
                    notes: orderForm.values?.notes,
                },
            };

            console.log("PAYLOAD", payload);
            const response = await dispatch(updateOrder(payload));

            if (response.type === "order/updateOrder/fulfilled") {
                toNotify("Success", "Order Updated successfully", "SUCCESS");
                navigate("/app/sales-records/orders");
            } else if (response.type === "order/updateOrder/rejected") {
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

    const fetchRelatedDetails = async () => {
        await dispatch(getCustomers({ status: true }));
        await dispatch(getProducts({ status: true }));
    };

    const isFormEdited = () => {
        const { customer, expectedDate, notes } = orderForm.values;

        const isDateChanged =
            new Date(expectedDate).getTime() !==
            new Date(metadata?.expectedDate).getTime();

        const areProductsChanged =
            selectedProducts?.length !== metadata?.products?.length ||
            selectedProducts?.some(
                (p, index) =>
                    p.id !== metadata?.products[index].id ||
                    p.amount !== metadata?.products[index].amount
            );

        return (
            customer !== metadata?.customer ||
            isDateChanged ||
            notes !== metadata.notes ||
            areProductsChanged
        );
    };

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
                title={
                    <Text size={"lg"} fw={"bold"}>
                        Add Customer
                    </Text>
                }
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
                        Edit Purchase Order
                    </Text>
                </Group>
            </Group>

            <Group px="lg">
                <Text fw={"bold"}>Order Details</Text>
            </Group>

            <Box w={{ sm: "100%", lg: "75%" }} px="lg">
                <form onSubmit={orderForm.onSubmit(handleUpdateOrder)}>
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
                            w={{ base: "100%", md: "49%" }}
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
                            w={{ base: "100%", md: "49%" }}
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
                        {selectedProducts?.length > 0 && (
                            <ScrollArea>
                                <Table>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th w="50%">Product</Table.Th>
                                            <Table.Th w="25%">Amount</Table.Th>
                                            <Table.Th w="25%">
                                                Line Total
                                            </Table.Th>
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
                                                            calculateLineTotal(
                                                                i,
                                                                v
                                                            )
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
                            </ScrollArea>
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
                                selectedProducts?.length === 0 ||
                                selectedProducts?.some(
                                    (p) => !p.amount || p.amount <= 0
                                ) ||
                                !isFormEdited()
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

export default EditOrder;
