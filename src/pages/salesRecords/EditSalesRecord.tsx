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
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { getProducts } from "../../store/productSlice/productSlice.ts";
import { useEffect, useMemo, useState } from "react";
import { getCustomers } from "../../store/customerSlice/customerSlice.ts";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { amountPreview } from "../../helpers/preview.tsx";
import { useForm } from "@mantine/form";
import { useNavigate, useParams } from "react-router";
import { useLoading } from "../../helpers/loadingContext.tsx";
import toNotify from "../../helpers/toNotify.tsx";
import {
    getSalesRecord,
    updateSalesRecord,
} from "../../store/salesRecordSlice/salesRecordSlice.ts";

const EditSalesRecord = () => {
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const products = useSelector((state: RootState) => state.product?.products);
    const customers = useSelector(
        (state: RootState) => state.customer?.customers
    );
    const [productSelectModalOpened, productSelectModalHandler] =
        useDisclosure(false);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const id: any = useParams().id ?? null;
    const salesRecord = useSelector(
        (state: RootState) => state.salesRecords.selectedSalesRecord
    );
    const metadata = salesRecord?.metadata;

    useEffect(() => {
        if (id) {
            fetchSelectedSalesRecord();
        }
    }, [id]);

    const fetchSelectedSalesRecord = async () => {
        setLoading(true);
        await dispatch(getSalesRecord(id));
        setLoading(false);
    };

    useEffect(() => {
        fetchRelatedDetails();
    }, []);

    const fetchRelatedDetails = async () => {
        await dispatch(getCustomers({ status: true }));
        await dispatch(getProducts({ status: true }));
    };

    // Set up the form with a default valid date
    const salesRecordForm = useForm({
        initialValues: {
            customer: "",
            date: new Date(),
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

    useEffect(() => {
        salesRecordForm.setValues({
            customer: metadata?.customer || "",
            date: metadata?.date && !isNaN(new Date(metadata.date).getTime())
                ? new Date(metadata.date)
                : new Date(),
            discount: metadata?.discount || 0,
            tax: metadata?.tax || 0,
            otherCost: metadata?.otherCost || 0,
            notes: metadata?.notes || "",
        });
        setSelectedProducts(metadata?.products || []);
        salesRecordForm.resetDirty();
    }, [metadata]);

    const isFormEdited = () => {
        const { customer, date, discount, tax, otherCost, notes } =
            salesRecordForm.values;

        const isDateChanged =
            new Date(date).getTime() !== new Date(metadata?.date).getTime();

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
            discount !== metadata?.discount ||
            tax !== metadata?.tax ||
            otherCost !== metadata?.otherCost ||
            notes !== metadata?.notes ||
            areProductsChanged
        );
    };

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

    const handleUpdateSalesRecord = async () => {
        setLoading(true);
        try {
            const formDate = salesRecordForm.values?.date;
            const dateObj = new Date(formDate);
            const isoDate =
                formDate && !isNaN(dateObj.getTime()) ? dateObj.toISOString() : null;

            const payload = {
                id: id,
                values: {
                    isUpdatePayments: false,
                    customer: salesRecordForm.values?.customer,
                    date: isoDate,
                    products: selectedProducts,
                    subTotal: subTotal,
                    discount: salesRecordForm.values?.discount,
                    tax: salesRecordForm.values?.tax,
                    otherCost: salesRecordForm.values?.otherCost,
                    netTotal: netTotal,
                    notes: salesRecordForm.values?.notes,
                },
            };

            const response = await dispatch(updateSalesRecord(payload));

            if (response.type === "salesRecord/updateSalesRecord/fulfilled") {
                toNotify(
                    "Success",
                    "Sales record updated successfully",
                    "SUCCESS"
                );
                navigate("/app/sales-records");
            } else if (
                response.type === "salesRecord/updateSalesRecord/rejected"
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
                        Edit Sales Record
                    </Text>
                </Group>
            </Group>

            <Group px="lg">
                <Text fw={"bold"}>Order Details</Text>
            </Group>

            <Box w={{ sm: "100%", lg: "50%" }} px="lg">
                <form onSubmit={salesRecordForm.onSubmit(handleUpdateSalesRecord)}>
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
                            {...salesRecordForm.getInputProps("customer")}
                        />
                        <DatePickerInput
                            style={{ width: "45%" }}
                            label="Date"
                            placeholder="Select Date"
                            rightSection={<IconCalendar size={16} />}
                            size="xs"
                            maxDate={new Date()}
                            {...salesRecordForm.getInputProps("date")}
                            withAsterisk
                        />
                    </Group>

                    <Box mt="md">
                        {selectedProducts?.length > 0 && (
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th w="50%">Product</Table.Th>
                                        <Table.Th w="25%">Amount</Table.Th>
                                        <Table.Th w="25%">Line Total</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {selectedProducts?.map((p, i) => (
                                        <Table.Tr key={i}>
                                            <Table.Td>{p.product.name}</Table.Td>
                                            <Table.Td>
                                                <NumberInput
                                                    size="xs"
                                                    hideControls
                                                    value={p.amount}
                                                    onChange={(v: any) => calculateLineTotal(i, v)}
                                                />
                                            </Table.Td>
                                            <Table.Td>{amountPreview(p.lineTotal)}</Table.Td>
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
                                    <Table.Td w="33%">{amountPreview(subTotal)}</Table.Td>
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
                                            {...salesRecordForm.getInputProps("discount")}
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
                                            {...salesRecordForm.getInputProps("tax")}
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
                                            {...salesRecordForm.getInputProps("otherCost")}
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
                                    <Table.Td w="33%">{amountPreview(netTotal)}</Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                    </Group>

                    <Textarea
                        label="Notes"
                        placeholder="Additional information"
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
                                selectedProducts?.length === 0 ||
                                selectedProducts?.some((p) => !p.amount || p.amount <= 0) ||
                                !isFormEdited() // Disable when the form is NOT edited
                            }
                        >
                            Update
                        </Button>
                    </Group>
                </form>
            </Box>
            {productSelectModal()}
        </>
    );
};

export default EditSalesRecord;
