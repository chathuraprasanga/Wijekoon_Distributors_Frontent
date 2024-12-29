import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
    Badge,
    Box,
    Button,
    Card,
    Group,
    Menu,
    Pagination, Select,
    Table,
    Text,
} from "@mantine/core";
import { IconCertificate, IconDatabaseOff, IconDotsVertical, IconEdit, IconEye } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import {
    changeStatusInvoice, getPagedInvoices,
} from "../../store/invoiceSlice/invoiceSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";
import { datePreview } from "../../helpers/preview.tsx";
import { DateInput } from "@mantine/dates";

import { getSuppliers } from "../../store/supplierSlice/supplierSlice.ts";

const Invoices = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();

    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 5;
    const [supplier, setSupplier] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [invoicedDate, setInvoicedDate] = useState<any>();
    const sort = -1;
    const [metadata, setMetadata] = useState<any>();

    const invoices = useSelector((state: RootState) => state.invoice.invoices);
    const suppliers = useSelector(
        (state: RootState) => state.supplier.suppliers
    );

    useEffect(() => {
        fetchInvoices();
    }, [dispatch, pageIndex, status, supplier, invoicedDate]);

    const fetchInvoices = async () => {
        setLoading(true);
        await dispatch(getSuppliers({}));
        const filters = { pageSize, pageIndex, supplier, sort, status, invoicedDate };
        const response = await dispatch(getPagedInvoices({ filters: filters }));
        setMetadata(response.payload.result.metadata);
        setLoading(false);
    };

    const invoiceStatusUpdate = async (id: string, status: string) => {
        setLoading(true);
        const payload = {
            id,
            values: { invoiceStatus: status },
        };
        const response = await dispatch(changeStatusInvoice(payload));
        if (response.type === "invoice/changeStatus/fulfilled") {
            await fetchInvoices();
            setLoading(false);
            toNotify(
                "Success",
                "Invoice status changed successfully",
                "SUCCESS"
            );
        } else if (response.type === "invoice/changeStatus/rejected") {
            const error: any = response.payload.error;
            setLoading(false);
            toNotify("Error", `${error}`, "ERROR");
        } else {
            setLoading(false);
            toNotify(
                "Something went wrong",
                `Please contact system admin`,
                "WARNING"
            );
        }
    };

    const selectableSuppliers = suppliers.map((c: any) => {
        return {
            label: c?.name,
            value: c?._id,
        };
    });

    return (
        <>
            {/* Header */}
            <Box display="flex" p="lg" className="items-center justify-between">
                <Box>
                    <Text size="lg" fw={500}>Invoices</Text>
                </Box>
                <Box>
                    <Button
                        size="xs"
                        onClick={() => navigate("/app/invoices/add-invoice")}
                    >
                        Add Invoice
                    </Button>
                </Box>
            </Box>

            {/* Search Input */}
            <Box px="lg">
                <Group w={{ lg: "60%", sm: "100%" }}>
                    <Select
                        className="w-full lg:w-1/4"
                        size="xs"
                        placeholder="Select a supplier"
                        data={selectableSuppliers}
                        searchable
                        clearable
                        onChange={(value: string | null) => {
                            if (value) {
                                setSupplier(value);
                            } else {
                                setSupplier("");
                            }
                        }}
                    />

                    <Select
                        className="w-full lg:w-1/4"
                        size="xs"
                        placeholder="Select a status"
                        data={["PAID", "NOT PAID"]}
                        clearable
                        onChange={(value: string | null) => {
                            if (value) {
                                setStatus(value);
                            } else {
                                setStatus("");
                            }
                        }}
                    />

                    <DateInput
                        className="w-full lg:w-1/4"
                        size="xs"
                        placeholder="Select invoice date"
                        clearable
                        onChange={(e:any) => setInvoicedDate(e)}
                    />
                </Group>
            </Box>

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
                            <Table.Th style={{width: "30%"}}>Supplier</Table.Th>
                            <Table.Th style={{width: "15%"}}>Invoiced Date</Table.Th>
                            <Table.Th style={{width: "20%"}}>Invoice Number</Table.Th>
                            <Table.Th style={{width: "20%"}}>Amount</Table.Th>
                            <Table.Th style={{width: "10%"}}>Invoice Status</Table.Th>
                            <Table.Th style={{width: "5%"}}></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {invoices?.length !== 0 ? (
                            invoices?.map((c: any, i: number) => (
                                <Table.Tr key={i}>
                                    <Table.Td style={{width: "30%"}}>{c.supplier?.name}</Table.Td>
                                    <Table.Td style={{width: "15%"}}>{datePreview(c.invoiceDate)}</Table.Td>
                                    <Table.Td style={{width: "20%"}}>{c.invoiceNumber}</Table.Td>
                                    <Table.Td style={{width: "20%"}}>{c.amount}</Table.Td>
                                    <Table.Td style={{width: "10%"}}>
                                        <Badge
                                            size="sm"
                                            radius="xs"
                                            color={
                                                c.invoiceStatus === "PAID"
                                                    ? "green"
                                                    : "red"
                                            }
                                        >
                                            {c.invoiceStatus}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td style={{width: "5%"}}>
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
                                                            `/app/invoices/view-invoice/${c._id}`
                                                        );
                                                        sessionStorage.setItem(
                                                            "pageIndex",
                                                            String(pageIndex)
                                                        );
                                                    }}
                                                    rightSection={<IconEye size={16}/>}
                                                >
                                                    View
                                                </Menu.Item>
                                                <Menu.Item
                                                    disabled={
                                                        c.invoiceStatus ===
                                                        "PAID"
                                                    }
                                                    onClick={() => {
                                                        navigate(
                                                            `/app/invoices/edit-invoice/${c._id}`
                                                        );
                                                        sessionStorage.setItem(
                                                            "pageIndex",
                                                            String(pageIndex)
                                                        );
                                                    }}
                                                    rightSection={<IconEdit size={16}/>}
                                                >
                                                    Edit
                                                </Menu.Item>
                                                {c.invoiceStatus ===
                                                    "NOT PAID" && (
                                                    <Menu.Item
                                                        color="green"
                                                        onClick={() =>
                                                            invoiceStatusUpdate(
                                                                c._id,
                                                                "PAID"
                                                            )
                                                        }
                                                        rightSection={<IconCertificate size={16}/>}
                                                    >
                                                        Paid
                                                    </Menu.Item>
                                                )}
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
                {invoices?.length !== 0 ? (
                    invoices?.map((c: any, i: number) => (
                        <Card key={i} shadow="sm" withBorder mx="xs" my="lg">
                            <Text className="font-semibold">
                                Supplier: {c.supplier?.name}
                            </Text>
                            <Text>Invoiced Date: {datePreview(c.invoiceDate)}</Text>
                            <Text>Invoice Number: {c.invoiceNumber}</Text>
                            <Text>Amount: {c.amount}</Text>
                            <Badge
                                size="sm"
                                radius="xs"
                                color={
                                    c.invoiceStatus === "PAID" ? "green" : "red"
                                }
                                className="mt-2"
                            >
                                {c.invoiceStatus}
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
                                                    `/app/invoices/view-invoice/${c._id}`
                                                );
                                                sessionStorage.setItem(
                                                    "pageIndex",
                                                    String(pageIndex)
                                                );
                                            }}
                                            rightSection={<IconEye size={16}/>}
                                        >
                                            View
                                        </Menu.Item>
                                        <Menu.Item
                                            disabled={
                                                c.invoiceStatus === "PAID"
                                            }
                                            onClick={() => {
                                                navigate(
                                                    `/app/invoices/edit-invoice/${c._id}`
                                                );
                                                sessionStorage.setItem(
                                                    "pageIndex",
                                                    String(pageIndex)
                                                );
                                            }}
                                            rightSection={<IconEdit size={16}/>}
                                        >
                                            Edit
                                        </Menu.Item>
                                        {c.invoiceStatus === "NOT PAID" && (
                                            <Menu.Item
                                                color="green"
                                                onClick={() =>
                                                    invoiceStatusUpdate(
                                                        c._id,
                                                        "PAID"
                                                    )
                                                }
                                                rightSection={<IconCertificate size={16}/>}
                                            >
                                                Paid
                                            </Menu.Item>
                                        )}
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
            <Group my="md" ms="md" px="lg" justify="flex-end">
                <Pagination.Root
                    total={Math.ceil( metadata?.total / pageSize)}
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

export default Invoices;
