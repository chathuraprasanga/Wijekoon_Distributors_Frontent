import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
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
import {
    IconDatabaseOff,
    IconDotsVertical,
    IconEdit,
    IconEye,
    IconMobiledata,
    IconMobiledataOff,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import {
    changeStatusSupplier,
    getPagedSuppliers,
} from "../../store/supplierSlice/supplierSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";
import { BASIC_STATUS_COLORS } from "../../helpers/types.ts";
import { pageRange } from "../../helpers/preview.tsx";
import { DynamicSearchBar } from "../../components/DynamicSearchBar.tsx";

const Suppliers = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();

    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 5;
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [status, setStatus] = useState<string>();
    const sort = -1;
    const filters = { pageSize, pageIndex, searchQuery, sort, status };

    const [metadata, setMetadata] = useState<any>();

    const suppliers = useSelector(
        (state: RootState) => state.supplier.suppliers
    );

    useEffect(() => {
        fetchSuppliers();
    }, [dispatch, pageIndex, searchQuery, status]);

    const fetchSuppliers = async () => {
        setLoading(true);
        const response = await dispatch(
            getPagedSuppliers({ filters: filters })
        );
        setMetadata(response.payload.result.metadata);
        setLoading(false);
    };

    const handleChangeStatus = async (supplier: any) => {
        setLoading(true);
        const response = await dispatch(
            changeStatusSupplier({
                id: supplier._id,
                values: { status: !supplier.status },
            })
        );
        if (response.type === "supplier/changeStatus/fulfilled") {
            dispatch(getPagedSuppliers({ filters: filters }));
            setLoading(false);
            toNotify(
                "Success",
                "Supplier status changed successfully",
                "SUCCESS"
            );
        } else if (response.type === "supplier/changeStatus/rejected") {
            setLoading(false);
            toNotify("Error", `${response.payload.error}`, "ERROR");
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
                    <Text size="lg" fw={500}>
                        Suppliers
                    </Text>
                </Box>
                <Flex gap="sm" wrap="wrap">
                    <Button
                        size="xs"
                        onClick={() => navigate("/app/suppliers/add-supplier")}
                    >
                        Add Supplier
                    </Button>
                </Flex>
            </Box>

            {/* Search Input */}
            <DynamicSearchBar
                fields={[
                    {
                        type: "text",
                        placeholder: "Name, Phone, Email",
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
                    setSearchQuery(values[0]);
                    setStatus(values[1] || "");
                    setPageIndex(1);
                }}
                onClear={() => {
                    setSearchQuery("");
                    setStatus("");
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
                            <Table.Th style={{ width: "20%" }}>Name</Table.Th>
                            <Table.Th style={{ width: "15%" }}>Phone</Table.Th>
                            <Table.Th style={{ width: "20%" }}>Email</Table.Th>
                            <Table.Th style={{ width: "25%" }}>
                                Address
                            </Table.Th>
                            <Table.Th style={{ width: "10%" }}>Status</Table.Th>
                            <Table.Th style={{ width: "5%" }}></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {suppliers?.length !== 0 ? (
                            suppliers?.map((c: any, i: number) => (
                                <Table.Tr key={i}>
                                    <Table.Td style={{ width: "20%" }}>
                                        {c.name}
                                    </Table.Td>
                                    <Table.Td style={{ width: "15%" }}>
                                        {c.phone}
                                    </Table.Td>
                                    <Table.Td style={{ width: "20%" }}>
                                        {c.email || "-"}
                                    </Table.Td>
                                    <Table.Td style={{ width: "25%" }}>
                                        {c.address || "-"}
                                    </Table.Td>
                                    <Table.Td style={{ width: "10%" }}>
                                        <Badge
                                            color={
                                                BASIC_STATUS_COLORS[
                                                    c.status as keyof typeof BASIC_STATUS_COLORS
                                                ] || "gray"
                                            }
                                            size="sm"
                                            radius="xs"
                                        >
                                            {c.status ? "ACTIVE" : "INACTIVE"}
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
                                                            `/app/suppliers/view-supplier/${c._id}`
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
                                                <Menu.Item
                                                    onClick={() => {
                                                        navigate(
                                                            `/app/suppliers/edit-supplier/${c._id}`
                                                        );
                                                        sessionStorage.setItem(
                                                            "pageIndex",
                                                            String(pageIndex)
                                                        );
                                                    }}
                                                    rightSection={
                                                        <IconEdit size={16} />
                                                    }
                                                >
                                                    Edit
                                                </Menu.Item>
                                                <Menu.Item
                                                    color={
                                                        BASIC_STATUS_COLORS[
                                                            c.status
                                                                ? "false"
                                                                : ("true" as keyof typeof BASIC_STATUS_COLORS)
                                                        ] || "gray"
                                                    }
                                                    onClick={() =>
                                                        handleChangeStatus(c)
                                                    }
                                                    rightSection={
                                                        c.status ? (
                                                            <IconMobiledataOff
                                                                size={16}
                                                            />
                                                        ) : (
                                                            <IconMobiledata
                                                                size={16}
                                                            />
                                                        )
                                                    }
                                                >
                                                    {c.status ? (
                                                        <span className="text-red-700">
                                                            Deactivate
                                                        </span>
                                                    ) : (
                                                        <span className="text-green-700">
                                                            Activate
                                                        </span>
                                                    )}
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
                {suppliers?.length !== 0 ? (
                    suppliers?.map((c: any, i: number) => (
                        <Card key={i} shadow="sm" withBorder mx="xs" my="lg">
                            <Text className="font-semibold">
                                Name: {c.name}
                            </Text>
                            <Text>Phone: {c.phone}</Text>
                            <Text>Email: {c.email}</Text>
                            <Text>Address: {c.address}</Text>
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
                                                    `/app/suppliers/view-supplier/${c._id}`
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
                                        <Menu.Item
                                            onClick={() => {
                                                navigate(
                                                    `/app/suppliers/edit-supplier/${c._id}`
                                                );
                                                sessionStorage.setItem(
                                                    "pageIndex",
                                                    String(pageIndex)
                                                );
                                            }}
                                            rightSection={
                                                <IconEdit size={16} />
                                            }
                                        >
                                            Edit
                                        </Menu.Item>
                                        <Menu.Item
                                            color={
                                                BASIC_STATUS_COLORS[
                                                    c.status
                                                        ? "false"
                                                        : ("true" as keyof typeof BASIC_STATUS_COLORS)
                                                ] || "gray"
                                            }
                                            onClick={() =>
                                                handleChangeStatus(c)
                                            }
                                            rightSection={
                                                c.status ? (
                                                    <IconMobiledataOff
                                                        size={16}
                                                    />
                                                ) : (
                                                    <IconMobiledata size={16} />
                                                )
                                            }
                                        >
                                            {c.status ? (
                                                <span className="text-red-700">
                                                    Deactivate
                                                </span>
                                            ) : (
                                                <span className="text-green-700">
                                                    Activate
                                                </span>
                                            )}
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

export default Suppliers;
