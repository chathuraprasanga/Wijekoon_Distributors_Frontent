import {
    Badge,
    Box,
    Button,
    Card,
    Group,
    Pagination,
    Select,
    Table,
    Text,
    TextInput,
} from "@mantine/core";
import {
    IconDatabaseOff,
    IconEye,
    IconSearch,
    IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { BASIC_STATUS_COLORS } from "../../helpers/types.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useNavigate } from "react-router";
import { getPagedWarehouses } from "../../store/warehouseSlice/warehouseSlice.ts";

const Warehouses = () => {
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch | any>();

    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 5;
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [status, setStatus] = useState("");
    const sort = -1;
    const filters = { pageSize, pageIndex, searchQuery, sort, status };

    const [metadata, setMetadata] = useState<any>();

    const warehouses = useSelector(
        (state: RootState) => state.warehouses.warehouses
    );

    useEffect(() => {
        fetchWarehouses();
    }, [dispatch, pageIndex, searchQuery, status]);

    const fetchWarehouses = async () => {
        setLoading(true);
        const response = await dispatch(
            getPagedWarehouses({ filters: filters })
        );
        setMetadata(response.payload.result.metadata);
        setLoading(false);
    };

    return (
        <>
            {/* Header */}
            <Box display="flex" p="lg" className="items-center justify-between">
                <Box>
                    <Text size="lg" fw={500}>
                        Warehouses
                    </Text>
                </Box>
                <Box></Box>
            </Box>

            <Box px="lg">
                <Group w={{ lg: "60%", sm: "100%" }}>
                    <TextInput
                        className="w-full lg:w-1/4"
                        size="xs"
                        placeholder="City or Warehose Id"
                        onChange={(event) => {
                            setSearchQuery(event.target.value); // Update the search query
                            setPageIndex(1); // Reset the page index to 1
                        }}
                        value={searchQuery}
                        rightSection={
                            searchQuery ? (
                                <IconX
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setSearchQuery(""); // Clear the search query
                                        setPageIndex(1); // Reset the page index to 1
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
                        data={["ACTIVE", "INACTIVE"]}
                        clearable
                        onChange={(value: string | null) => {
                            setStatus(value || ""); // Update the status
                            setPageIndex(1); // Reset the page index to 1
                        }}
                    />
                </Group>
            </Box>

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
                                Warehouse Id
                            </Table.Th>
                            <Table.Th style={{ width: "60%" }}>City</Table.Th>
                            <Table.Th style={{ width: "10%" }}>Status</Table.Th>
                            <Table.Th style={{ width: "10%" }}></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {warehouses?.length !== 0 ? (
                            warehouses?.map((c: any, i: number) => (
                                <Table.Tr key={i}>
                                    <Table.Td style={{ width: "20%" }}>
                                        {c?.id}
                                    </Table.Td>
                                    <Table.Td style={{ width: "15%" }}>
                                        {c.city}
                                    </Table.Td>
                                    <Table.Td style={{ width: "10%" }}>
                                        <Badge
                                            color={c.status ? "green" : "red"}
                                            size="sm"
                                            radius="xs"
                                        >
                                            {c.status ? "ACTIVE" : "INACTIVE"}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td style={{ width: "5%" }}>
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

            {/* Mobile Table */}
            <Box my="lg" mx="sm" hiddenFrom="lg">
                {warehouses?.length !== 0 ? (
                    warehouses?.map((c: any, i: number) => (
                        <Card key={i} shadow="sm" withBorder mx="xs" my="lg">
                            <Text className="font-semibold">
                                Warehouse Id: {c.id}
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
            <Group my="md" ms="md" px="lg" justify="flex-end">
                <Pagination.Root
                    total={Math.ceil(metadata?.total / pageSize)}
                    value={metadata?.pageIndex}
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
