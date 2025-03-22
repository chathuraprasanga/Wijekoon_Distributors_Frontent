import {
    Badge,
    Box,
    Button,
    Card,
    Group,
    Menu,
    Pagination,
    Select,
    Table,
    Text,
    TextInput,
} from "@mantine/core";
import {
    IconDatabaseOff,
    IconDotsVertical,
    IconEdit,
    IconEye,
    IconSearch,
    IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { SALES_RECORD_STATUS_COLORS, USER_ROLES } from "../../helpers/types.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { getPagedSalesRecords } from "../../store/salesRecordSlice/salesRecordSlice.ts";
import { useNavigate } from "react-router";
import { amountPreview, datePreview, pageRange } from "../../helpers/preview.tsx";
import { hasAnyPrivilege } from "../../helpers/previlleges.ts";

const SalesRecords = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();

    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 5;
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [status, setStatus] = useState<string | null>(null);

    const [metadata, setMetadata] = useState<any>();
    const salesRecords = useSelector(
        (state: RootState) => state.salesRecords.salesRecords
    );
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        fetchSalesRecords();
    }, [pageIndex, searchQuery, status]);

    const fetchSalesRecords = async () => {
        setLoading(true);
        try {
            const response = await dispatch(
                getPagedSalesRecords({
                    filters: {
                        pageSize,
                        pageIndex,
                        searchQuery,
                        sort: -1,
                        status,
                    },
                })
            );
            setMetadata(response.payload?.result?.metadata);
        } catch (error) {
            console.error("Error fetching warehouses:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Page Header */}
            <Box display="flex" p="lg" className="items-center justify-between">
                <Box>
                    <Text size="lg" fw={500}>
                        Sales Records
                    </Text>
                </Box>
                <Box>
                    <Button
                        size="xs"
                        onClick={() =>
                            navigate("/app/sales-records/orders")
                        }
                        color="violet"
                    >
                        Orders
                    </Button>{" "}
                    <Button
                        size="xs"
                        onClick={() =>
                            navigate("/app/sales-records/add-sales-record")
                        }
                    >
                        Add Sales Record
                    </Button>
                </Box>
            </Box>

            {/* Search & Filter */}
            <Box px="lg">
                <Group w={{ lg: "60%", sm: "100%" }}>
                    <TextInput
                        className="w-full lg:w-1/4"
                        size="xs"
                        placeholder="Customer Name or Number"
                        onChange={(event) => {
                            setSearchQuery(event.target.value);
                            setPageIndex(1);
                        }}
                        value={searchQuery}
                        rightSection={
                            searchQuery ? (
                                <IconX
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setPageIndex(1);
                                    }}
                                    size={14}
                                />
                            ) : (
                                ""
                            )
                        }
                        leftSection={<IconSearch size={14} />}
                    />
                    <Select
                        className="w-full lg:w-1/4"
                        size="xs"
                        placeholder="Select a status"
                        data={["PAID", "NOT PAID", "PARTIALLY PAID", "COMPLETE", "INCOMPLETE"]}
                        clearable
                        value={status}
                        onChange={(value) => {
                            setStatus(value || null);
                            setPageIndex(1);
                        }}
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
                            <Table.Th style={{ width: "15%" }}>
                                Order Id
                            </Table.Th>
                            <Table.Th style={{ width: "15%" }}>Date</Table.Th>
                            <Table.Th style={{ width: "40%" }}>
                                Customer
                            </Table.Th>
                            <Table.Th style={{ width: "15%" }}>Amount</Table.Th>
                            <Table.Th style={{ width: "10%" }}>Status</Table.Th>
                            <Table.Th style={{ width: "5%" }}></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {salesRecords?.length ? (
                            salesRecords.map((c: any, i: number) => (
                                <Table.Tr key={i}>
                                    <Table.Td>{c?.orderId}</Table.Td>
                                    <Table.Td>{datePreview(c?.date)}</Table.Td>
                                    <Table.Td>{c?.customer?.name}</Table.Td>
                                    <Table.Td>
                                        {amountPreview(
                                            c?.amountDetails?.netTotal
                                        )}
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge
                                            color={
                                                SALES_RECORD_STATUS_COLORS[
                                                    c.paymentStatus as keyof typeof SALES_RECORD_STATUS_COLORS
                                                    ] || "gray"
                                            }
                                            size="sm"
                                            radius="xs"
                                        >
                                            {c.paymentStatus}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
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
                                                    rightSection={
                                                        <IconEye size={16} />
                                                    }
                                                    onClick={() =>
                                                        navigate(
                                                            `/app/sales-records/view-sales-record/${c?._id}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </Menu.Item>
                                                {hasAnyPrivilege(user.role, [
                                                    USER_ROLES.SUPER_ADMIN,
                                                    USER_ROLES.SALES_MANAGER,
                                                    USER_ROLES.SALES_REP,
                                                ]) && (
                                                        <Menu.Item
                                                            disabled={
                                                                c.paymentStatus !==
                                                                "NOT PAID"
                                                            }
                                                            rightSection={
                                                                <IconEdit
                                                                    size={16}
                                                                />
                                                            }
                                                            onClick={() =>
                                                                navigate(
                                                                    `/app/sales-records/edit-sales-record/${c._id}`
                                                                )
                                                            }
                                                        >
                                                            Edit
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
                                            className="mr-2"
                                        />
                                        No data available
                                    </div>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </Box>

            {/* Mobile Table */}
            <Box my="lg" mx="sm" hiddenFrom="lg">
                {salesRecords?.length ? (
                    salesRecords.map((c: any, i: number) => (
                        <Card key={i} shadow="sm" withBorder mx="xs" my="lg">
                            <Text className="font-semibold">
                                Order Id: {c?.orderId}
                            </Text>
                            <Text>Customer: {c?.customer?.name}</Text>
                            <Text>
                                Amount:{" "}
                                {amountPreview(c?.amountDetails?.netTotal)}
                            </Text>
                            <Badge
                                color={
                                    SALES_RECORD_STATUS_COLORS[
                                        c.paymentStatus as keyof typeof SALES_RECORD_STATUS_COLORS
                                        ] || "gray"
                                }
                                size="sm"
                                radius="xs"
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
                                            rightSection={<IconEye size={16} />}
                                            onClick={() =>
                                                navigate(
                                                    `/app/sales-records/view-sales-record/${c?._id}`
                                                )
                                            }
                                        >
                                            View
                                        </Menu.Item>
                                        {hasAnyPrivilege(user.role, [
                                                USER_ROLES.SUPER_ADMIN,
                                                USER_ROLES.SALES_MANAGER,
                                                USER_ROLES.SALES_REP,]
                                        ) && (
                                                <Menu.Item
                                                    disabled={
                                                        c.paymentStatus !==
                                                        "NOT PAID"
                                                    }
                                                    rightSection={
                                                        <IconEdit size={16} />
                                                    }
                                                    onClick={() =>
                                                        navigate(
                                                            `/app/sales-records/edit-sales-record/${c._id}`
                                                        )
                                                    }
                                                >
                                                    Edit
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
            <Group my="md" ms="md" px="lg" justify="space-between">
                <Group>
                    {pageRange(metadata?.pageIndex, pageSize, metadata?.total)}
                </Group>
                <Pagination.Root
                    total={metadata ? Math.ceil(metadata?.total / pageSize) : 1}
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

export default SalesRecords;
