import {
    Badge,
    Box,
    Button,
    Card,
    Group,
    Pagination,
    Table,
    Text,
} from "@mantine/core";
import {
    IconDatabaseOff,
    IconEye,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { BASIC_STATUS_COLORS, USER_ROLES } from "../../helpers/types.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useNavigate } from "react-router";
import { getPagedWarehouses } from "../../store/warehouseSlice/warehouseSlice.ts";
import { pageRange } from "../../helpers/preview.tsx";
import { hasAnyPrivilege } from "../../helpers/previlleges.ts";
import { DynamicSearchBar } from "../../components/DynamicSearchBar.tsx";

const Warehouses = () => {
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch | any>();

    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 5;
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [status, setStatus] = useState<string | null>(null);

    const [metadata, setMetadata] = useState<any>();
    const warehouses = useSelector(
        (state: RootState) => state.warehouses.warehouses
    );
    const user = useSelector((state: RootState) => state.auth.user);
    const role = user.role;

    useEffect(() => {
        if (
            hasAnyPrivilege(role, [
                USER_ROLES.ADMIN,
                USER_ROLES.SUPER_ADMIN,
                USER_ROLES.OWNER,
                USER_ROLES.WAREHOUSE_MANAGER,
                USER_ROLES.SALES_MANAGER,
                USER_ROLES.STOCK_KEEPER,
            ])
        )
            fetchWarehouses();
    }, [pageIndex, searchQuery, status]);

    const fetchWarehouses = async () => {
        setLoading(true);
        try {
            const response = await dispatch(
                getPagedWarehouses({
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
                <Text size="lg" fw={500}>
                    Warehouses
                </Text>
            </Box>

            {/* Search & Filter */}
            <DynamicSearchBar
                fields={[
                    {
                        type: "text",
                        placeholder: "City or Warehouse ID",
                        value: searchQuery,
                    },
                    {
                        type: "select",
                        placeholder: "Select a status",
                        value: status,
                        options: ["ACTIVE", "INACTIVE"],
                        clearable: true,
                    },
                ]}
                onSearch={(values) => {
                    setSearchQuery(values[0] || "");
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
                            <Table.Th style={{ width: "20%" }}>
                                Warehouse ID
                            </Table.Th>
                            <Table.Th style={{ width: "60%" }}>City</Table.Th>
                            <Table.Th style={{ width: "10%" }}>Status</Table.Th>
                            <Table.Th style={{ width: "10%" }}></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {warehouses?.length ? (
                            warehouses.map((c: any, i: number) => (
                                <Table.Tr key={i}>
                                    <Table.Td>{c?.id}</Table.Td>
                                    <Table.Td>{c.city}</Table.Td>
                                    <Table.Td>
                                        <Badge
                                            color={c.status ? "green" : "red"}
                                            size="sm"
                                            radius="xs"
                                        >
                                            {c.status ? "ACTIVE" : "INACTIVE"}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Button
                                            size="xs"
                                            radius="sm"
                                            variant="light"
                                            color="violet"
                                            leftSection={<IconEye size={16} />}
                                            onClick={() =>
                                                navigate(
                                                    `/app/warehouses/view-warehouse/${c._id}`
                                                )
                                            }
                                        >
                                            View
                                        </Button>
                                    </Table.Td>
                                </Table.Tr>
                            ))
                        ) : (
                            <Table.Tr>
                                <Table.Td colSpan={4} className="text-center">
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
                {warehouses?.length ? (
                    warehouses.map((c: any, i: number) => (
                        <Card key={i} shadow="sm" withBorder mx="xs" my="lg">
                            <Text className="font-semibold">
                                Warehouse ID: {c.id}
                            </Text>
                            <Text>City: {c.city}</Text>
                            <Badge
                                color={
                                    BASIC_STATUS_COLORS[
                                        c.status as keyof typeof BASIC_STATUS_COLORS
                                    ] || "gray"
                                }
                                size="sm"
                                radius="xs"
                                className="mt-2"
                            >
                                {c.status ? "ACTIVE" : "INACTIVE"}
                            </Badge>
                            <Group mt="md">
                                <Button
                                    size="xs"
                                    radius="sm"
                                    variant="light"
                                    color="violet"
                                    leftSection={<IconEye size={16} />}
                                    onClick={() =>
                                        navigate(
                                            `/app/warehouses/view-warehouse/${c._id}`
                                        )
                                    }
                                >
                                    View
                                </Button>
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

export default Warehouses;
