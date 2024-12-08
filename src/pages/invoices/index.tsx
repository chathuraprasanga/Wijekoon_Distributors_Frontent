import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
    Badge,
    Box,
    Button,
    Card,
    Group,
    Menu,
    Pagination,
    Table,
    Text
} from "@mantine/core";
import { IconCertificate, IconDatabaseOff, IconDotsVertical, IconEdit, IconEye } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import {
    changeStatusInvoice,
    getInvoices,
} from "../../store/invoiceSlice/invoiceSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";
import datePreview from "../../helpers/datePreview.tsx";

const Invoices = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const invoices = useSelector((state: RootState) => state.invoice.invoices);

    useEffect(() => {
        fetchInvoices();
        setPage();
    }, []);

    const setPage = () => {
        setCurrentPage(Number(sessionStorage.getItem("pageIndex") ?? 1));
        sessionStorage.clear();
    };

    const fetchInvoices = async () => {
        setLoading(true);
        await dispatch(getInvoices({}));
        setLoading(false);
    };

    const totalPages = Math.ceil(invoices?.length / pageSize);
    const paginatedData: any = invoices?.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

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

    return (
        <>
            {/* Header */}
            <Box display="flex" p="lg" className="items-center justify-between">
                <Box>
                    <span className="text-lg font-semibold">Invoices</span>
                </Box>
                <Box>
                    <Button
                        size="xs"
                        color="dark"
                        onClick={() => navigate("/app/invoices/add-invoice")}
                    >
                        Add Invoice
                    </Button>
                </Box>
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
                        {paginatedData?.length !== 0 ? (
                            paginatedData?.map((c: any, i: number) => (
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
                                                            String(currentPage)
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
                                                            String(currentPage)
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
                {paginatedData?.length !== 0 ? (
                    paginatedData?.map((c: any, i: number) => (
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
                                                    String(currentPage)
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
                                                    String(currentPage)
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
                    <Group display="flex" className="flex items-center">
                        <IconDatabaseOff
                            color="red"
                            size="24"
                        />
                        <p>No data available</p>
                    </Group>
                )}
            </Box>

            {/* Pagination */}
            <Group my="md" ms="md" px="lg" justify="flex-end">
                <Pagination.Root
                    total={totalPages}
                    value={currentPage}
                    onChange={setCurrentPage}
                    size="sm"
                    color="dark"
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
