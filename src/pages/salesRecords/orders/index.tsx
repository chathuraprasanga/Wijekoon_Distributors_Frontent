import {
    Badge,
    Box,
    Button,
    Card,
    Flex,
    Group,
    Menu,
    Pagination,
    Table,
    Text,
} from "@mantine/core";
import { useNavigate } from "react-router";
import {
    IconArrowLeft,
    IconDatabaseOff,
    IconDotsVertical,
    IconEdit,
    IconEye,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useLoading } from "../../../helpers/loadingContext.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store.ts";
import {
    amountPreview,
    datePreview,
    pageRange,
} from "../../../helpers/preview.tsx";
import { ORDER_STATUS_COLORS, USER_ROLES } from "../../../helpers/types.ts";
import { hasAnyPrivilege } from "../../../helpers/previlleges.ts";
import { getPagedOrders } from "../../../store/orderSlice/orderSlice.ts";
import { DynamicSearchBar } from "../../../components/DynamicSearchBar.tsx";

const Orders = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();

    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 5;
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [status, setStatus] = useState<string | null>(null);

    const [metadata, setMetadata] = useState<any>();
    const orders = useSelector((state: RootState) => state.orders.orders);
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        fetchOrders();
    }, [pageIndex, searchQuery, status]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await dispatch(
                getPagedOrders({
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
                    <Group className="flex items-center">
                        <IconArrowLeft
                            className="cursor-pointer"
                            onClick={() => history.back()}
                        />
                        <Text fw={500} ml="md" size="lg">
                            Purchase Orders
                        </Text>
                    </Group>
                </Box>
                <Flex gap="sm" wrap="wrap">
                    <Button
                        size="xs"
                        onClick={() =>
                            navigate("/app/sales-records/orders/add-order")
                        }
                    >
                        Add Purchase Order
                    </Button>
                </Flex>
            </Box>

            {/* Search & Filter */}
            <DynamicSearchBar
                fields={[
                    {
                        type: "text",
                        placeholder: "Customer Name or Number",
                        value: searchQuery,
                    },
                    {
                        type: "select",
                        placeholder: "Select a status",
                        value: status,
                        options: ["PENDING", "COMPLETE", "INCOMPLETE"],
                        clearable: true,
                    },
                ]}
                onSearch={(values) => {
                    setSearchQuery(values[0]);
                    setStatus(values[1] || null);
                    setPageIndex(1);
                }}
                onClear={() => {
                    setSearchQuery("");
                    setStatus(null);
                    setPageIndex(1);
                }}
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
                            <Table.Th style={{ width: "15%" }}>PO Id</Table.Th>
                            <Table.Th style={{ width: "15%" }}>
                                Expected Date
                            </Table.Th>
                            <Table.Th style={{ width: "25%" }}>
                                Customer
                            </Table.Th>
                            <Table.Th style={{ width: "15%" }}>
                                Quantity
                            </Table.Th>
                            <Table.Th style={{ width: "15%" }}>Amount</Table.Th>
                            <Table.Th style={{ width: "10%" }}>Status</Table.Th>
                            <Table.Th style={{ width: "5%" }}></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {orders?.length ? (
                            orders.map((c: any, i: number) => (
                                <Table.Tr key={i}>
                                    <Table.Td>{c?.orderId}</Table.Td>
                                    <Table.Td>
                                        {datePreview(c?.expectedDate)}
                                    </Table.Td>
                                    <Table.Td>{c?.customer?.name}</Table.Td>
                                    <Table.Td>
                                        {c?.orderDetails?.reduce(
                                            (acc: any, o: any) =>
                                                acc + o.amount,
                                            0
                                        )}{" "}
                                        Bags
                                    </Table.Td>
                                    <Table.Td>
                                        {amountPreview(
                                            c?.orderDetails?.reduce(
                                                (acc: any, o: any) =>
                                                    acc + o.lineTotal,
                                                0
                                            )
                                        )}
                                    </Table.Td>

                                    <Table.Td>
                                        <Badge
                                            color={
                                                ORDER_STATUS_COLORS[
                                                    c.orderStatus as keyof typeof ORDER_STATUS_COLORS
                                                ] || "gray"
                                            }
                                            size="sm"
                                            radius="xs"
                                        >
                                            {c.orderStatus}
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
                                                            `/app/sales-records/orders/view-order/${c?._id}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </Menu.Item>
                                                <Menu.Item
                                                    disabled={
                                                        c.orderStatus ===
                                                            "COMPLETE" &&
                                                        hasAnyPrivilege(
                                                            user.role,
                                                            [
                                                                USER_ROLES.SUPER_ADMIN,
                                                                USER_ROLES.SALES_MANAGER,
                                                                USER_ROLES.SALES_REP,
                                                            ]
                                                        )
                                                    }
                                                    rightSection={
                                                        <IconEdit size={16} />
                                                    }
                                                    onClick={() =>
                                                        navigate(
                                                            `/app/sales-records/orders/edit-order/${c._id}`
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </Table.Td>
                                </Table.Tr>
                            ))
                        ) : (
                            <Table.Tr>
                                <Table.Td colSpan={7} className="text-center">
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
                {orders?.length ? (
                    orders.map((c: any, i: number) => (
                        <Card key={i} shadow="sm" withBorder mx="xs" my="lg">
                            <Text className="font-semibold">
                                Order Id: {c?.orderId}
                            </Text>
                            <Text>Customer: {c?.customer?.name}</Text>
                            <Text>
                                Quantity:{" "}
                                {c?.orderDetails?.reduce(
                                    (acc: any, o: any) => acc + o.amount,
                                    0
                                )}{" "}
                                Bags
                            </Text>
                            <Text>
                                Amount:{" "}
                                {amountPreview(
                                    c?.orderDetails?.reduce(
                                        (acc: any, o: any) => acc + o.lineTotal,
                                        0
                                    )
                                )}
                            </Text>
                            <Badge
                                color={
                                    ORDER_STATUS_COLORS[
                                        c.orderStatus as keyof typeof ORDER_STATUS_COLORS
                                    ] || "gray"
                                }
                                size="sm"
                                radius="xs"
                                className="mt-2"
                            >
                                {c.orderStatus}
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
                                                    `/app/sales-records/orders/view-order/${c?._id}`
                                                )
                                            }
                                        >
                                            View
                                        </Menu.Item>
                                        <Menu.Item
                                            disabled={
                                                c.orderStatus === "COMPLETE" &&
                                                hasAnyPrivilege(user.role, [
                                                    USER_ROLES.SUPER_ADMIN,
                                                    USER_ROLES.SALES_MANAGER,
                                                    USER_ROLES.SALES_REP,
                                                ])
                                            }
                                            rightSection={
                                                <IconEdit size={16} />
                                            }
                                            onClick={() =>
                                                navigate(
                                                    `/app/sales-records/orders/edit-order/${c._id}`
                                                )
                                            }
                                        >
                                            Edit
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

export default Orders;
