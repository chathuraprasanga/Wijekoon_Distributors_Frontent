import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
    Badge,
    Box,
    Card,
    Group,
    Menu,
    Pagination,
    Table,
    Text,
} from "@mantine/core";
import {
    IconArrowLeft,
    IconDatabaseOff,
    IconDotsVertical,
    IconEye,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store.ts";
import { useLoading } from "../../../helpers/loadingContext.tsx";
import { getPagedBulkInvoicePayments } from "../../../store/invoiceSlice/invoiceSlice.ts";
import { amountPreview, datePreview, pageRange } from "../../../helpers/preview.tsx";

import { getSuppliers } from "../../../store/supplierSlice/supplierSlice.ts";
import { PAYMENT_STATUS_COLORS } from "../../../helpers/types.ts";
import { DynamicSearchBar } from "../../../components/DynamicSearchBar.tsx";

const PreviousBulkInvoicePayments = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();

    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 5;
    const [supplier, setSupplier] = useState<string>("");
    const sort = -1;
    const [metadata, setMetadata] = useState<any>();

    const bulkInvoicePayments = useSelector(
        (state: RootState) => state.invoice.bulkInvoicePayments
    );
    const suppliers = useSelector(
        (state: RootState) => state.supplier.suppliers
    );

    useEffect(() => {
        fetchBulkInvoicePayments();
    }, [dispatch, pageIndex, supplier]);

    const fetchBulkInvoicePayments = async () => {
        setLoading(true);
        await dispatch(getSuppliers({}));
        const filters = {
            pageSize,
            pageIndex,
            supplier,
            sort,
        };
        const response = await dispatch(
            getPagedBulkInvoicePayments({ filters: filters })
        );
        setMetadata(response.payload.result.metadata);
        setLoading(false);
    };

    const selectableSuppliers = suppliers.map((c: any) => {
        return {
            label: c?.name,
            value: c?._id,
        };
    });

    const getInvoiceIds = (invoices: any[]) =>
        invoices.map((i: any) => i.invoiceNumber);

    const getInvoiceAmount = (invoices: any[]) => {
        return invoices.reduce((total, i) => total + (i?.amount || 0), 0);
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
                        Bulk Invoice Payments
                    </span>
                </Group>
            </Box>

            {/* Search Input */}
            <DynamicSearchBar
                fields={[
                    {
                        type: "select",
                        placeholder: "Select a supplier",
                        options: selectableSuppliers, // Should be an array of strings or objects with label/value properties
                        searchable: true,
                        clearable: true,
                        onChange: (value: string | null) => {
                            if (value) {
                                setSupplier(value); // Update the supplier
                            } else {
                                setSupplier(""); // Clear the supplier
                            }
                            setPageIndex(1); // Reset the page index to 1
                        },
                    },
                ]}
            />

            {/* Desktop Table */}
            <Box visibleFrom="lg" mx="lg" my="lg" className="overflow-x-auto">
                <Table
                    striped
                    highlightOnHover
                    withTableBorder
                    withColumnBorders
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th style={{ width: "10%" }}>
                                Payment Id
                            </Table.Th>
                            <Table.Th style={{ width: "25%" }}>
                                Supplier
                            </Table.Th>
                            <Table.Th style={{ width: "15%" }}>
                                Payment Date
                            </Table.Th>
                            <Table.Th style={{ width: "15%" }}>
                                Invoice Numbers
                            </Table.Th>
                            <Table.Th style={{ width: "20%" }}>Amount</Table.Th>
                            <Table.Th style={{ width: "20%" }}>
                                Payment Status
                            </Table.Th>
                            <Table.Th style={{ width: "5%" }}></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {bulkInvoicePayments?.length !== 0 ? (
                            bulkInvoicePayments?.map((c: any, i: number) => (
                                <Table.Tr key={i}>
                                    <Table.Td style={{ width: "10%" }}>
                                        {c.paymentId || "-"}
                                    </Table.Td>
                                    <Table.Td style={{ width: "30%" }}>
                                        {c.supplier?.name}
                                    </Table.Td>
                                    <Table.Td style={{ width: "15%" }}>
                                        {datePreview(c.createdAt)}
                                    </Table.Td>
                                    <Table.Td style={{ width: "20%" }}>
                                        {getInvoiceIds(c.invoices).join(", ")}
                                    </Table.Td>
                                    <Table.Td style={{ width: "20%" }}>
                                        {amountPreview(
                                            getInvoiceAmount(c.invoices)
                                        )}
                                    </Table.Td>
                                    <Table.Td style={{ width: "10%" }}>
                                        <Badge
                                            size="sm"
                                            radius="xs"
                                            color={
                                                PAYMENT_STATUS_COLORS[
                                                    c.paymentStatus as keyof typeof PAYMENT_STATUS_COLORS
                                                ] || "gray"
                                            }
                                        >
                                            {c.paymentStatus}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td style={{ width: "5%" }}>
                                        <Menu width={150}>
                                            <Menu.Target>
                                                <IconDotsVertical
                                                    size="16"
                                                    className="cursor-pointer"
                                                />
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <Menu.Label>Actions</Menu.Label>
                                                <Menu.Item
                                                    onClick={() => {
                                                        navigate(
                                                            `/app/invoices/bulk-invoice-payments/${c._id}`
                                                        );
                                                        sessionStorage.setItem(
                                                            "pageIndex",
                                                            String(pageIndex)
                                                        );
                                                    }}
                                                    rightSection={
                                                        <IconEye size={16} />
                                                    }
                                                >
                                                    View
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </Table.Td>
                                </Table.Tr>
                            ))
                        ) : (
                            <Table.Tr>
                                <Table.Td colSpan={6} className="text-center">
                                    <div className="flex justify-center items-center">
                                        <IconDatabaseOff
                                            color="red"
                                            size="24"
                                            className="mr-2 self-center"
                                        />
                                        No data available
                                    </div>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </Box>

            {/* Mobile Cards */}
            <Box my="lg" mx="sm" hiddenFrom="lg">
                {bulkInvoicePayments?.length !== 0 ? (
                    bulkInvoicePayments?.map((c: any, i: number) => (
                        <Card key={i} shadow="sm" withBorder mx="xs" my="lg">
                            <Text className="font-semibold">
                                payment Id: {c.paymentId || "-"}
                            </Text>
                            <Text className="font-semibold">
                                Supplier: {c.supplier?.name}
                            </Text>
                            <Text>
                                Payment Date: {datePreview(c.createdAt)}
                            </Text>
                            <Text>
                                Invoice Numbers:{" "}
                                {getInvoiceIds(c.invoices).join(", ")}
                            </Text>
                            <Text>
                                Amount:{" "}
                                {amountPreview(getInvoiceAmount(c.invoices))}
                            </Text>
                            <Badge
                                size="sm"
                                radius="xs"
                                color={
                                    PAYMENT_STATUS_COLORS[
                                        c.paymentStatus as keyof typeof PAYMENT_STATUS_COLORS
                                    ] || "gray"
                                }
                                className="mt-2"
                            >
                                {c.paymentStatus}
                            </Badge>
                            <Group mt="md">
                                <Menu width={150}>
                                    <Menu.Target>
                                        <IconDotsVertical
                                            size="16"
                                            className="cursor-pointer"
                                        />
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Label>Actions</Menu.Label>
                                        <Menu.Item
                                            onClick={() => {
                                                navigate(
                                                    `/app/invoices/bulk-invoice-payments/${c._id}`
                                                );
                                                sessionStorage.setItem(
                                                    "pageIndex",
                                                    String(pageIndex)
                                                );
                                            }}
                                            rightSection={<IconEye size={16} />}
                                        >
                                            View
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </Group>
                        </Card>
                    ))
                ) : (
                    <Group mx="xs" my="lg">
                        <IconDatabaseOff color="red" size={24} />
                        <Text>No data available</Text>
                    </Group>
                )}
            </Box>

            {/* Pagination */}
            <Group my="md" ms="md" px="lg" justify="space-between">
                <Group>
                    {pageRange(metadata?.pageIndex, pageSize, metadata?.total)}
                </Group>
                <Pagination.Root
                    total={Math.ceil(metadata?.total / pageSize)}
                    value={pageIndex}
                    onChange={setPageIndex}
                    size="sm"
                    siblings={1}
                    boundaries={0}
                >
                    <Group gap={5} justify="center">
                        <Pagination.First />
                        <Pagination.Previous />
                        <Pagination.Items />
                        <Pagination.Next />
                        <Pagination.Last />
                    </Group>
                </Pagination.Root>
            </Group>
        </>
    );
};

export default PreviousBulkInvoicePayments;
