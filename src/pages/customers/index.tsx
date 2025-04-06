import {
    Badge,
    Box,
    Button,
    Group,
    Menu,
    Pagination,
    Text,
    Table,
    Card,
    TextInput,
    Select,
    Checkbox, Flex,
} from "@mantine/core";
import {
    IconDatabaseOff,
    IconDotsVertical,
    IconEdit,
    IconEye,
    IconMobiledata,
    IconMobiledataOff,
    IconSearch,
    IconX,
} from "@tabler/icons-react";
// import customers from "./customer_data.json";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import {
    changeStatusCustomer,
    getPagedCustomers,
} from "../../store/customerSlice/customerSlice.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import toNotify from "../../helpers/toNotify.tsx";
import { BASIC_STATUS_COLORS, USER_ROLES } from "../../helpers/types.ts";
import { amountPreview, pageRange } from "../../helpers/preview.tsx";
import { hasAnyPrivilege } from "../../helpers/previlleges.ts";

const Customers = () => {
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
    const [showCredit, setShowCredit] = useState<boolean>(false);

    const customers = useSelector(
        (state: RootState) => state.customer.customers
    );

    const user = useSelector((state: RootState) => state.auth.user);
    const role = user.role;

    useEffect(() => {
        fetchCustomers();
    }, [dispatch, pageIndex, searchQuery, status]);

    const fetchCustomers = async () => {
        setLoading(true);
        const response = await dispatch(
            getPagedCustomers({ filters: filters })
        );
        setMetadata(response.payload.result.metadata);
        setLoading(false);
    };

    const handleChangeStatus = async (customer: any) => {
        setLoading(true);
        const response = await dispatch(
            changeStatusCustomer({
                id: customer._id,
                values: { status: !customer.status },
            })
        );
        if (response.type === "customer/changeStatus/fulfilled") {
            dispatch(getPagedCustomers({ filters: filters }));
            setLoading(false);
            toNotify(
                "Success",
                "Customer status changed successfully",
                "SUCCESS"
            );
        } else if (response.type === "customer/changeStatus/rejected") {
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
                        Customers
                    </Text>
                </Box>
                <Flex gap="sm" wrap="wrap">
                    <Button
                        size="xs"
                        onClick={() => navigate("/app/customers/add-customer")}
                        disabled={!hasAnyPrivilege(role, [
                            USER_ROLES.ADMIN,
                            USER_ROLES.SUPER_ADMIN,
                            USER_ROLES.OWNER,
                            USER_ROLES.SALES_MANAGER,
                            USER_ROLES.WAREHOUSE_MANAGER,
                        ])}
                    >
                        Add Customer
                    </Button>
                </Flex>
            </Box>

            {/* Search Input */}
            <Box px="lg">
                <Group w={{ lg: "60%", sm: "100%" }}>
                    <TextInput
                        className="w-full lg:w-1/4"
                        size="xs"
                        placeholder="Name, Phone, Email"
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
                    <Checkbox
                        label="Show Credit Amounts"
                        onChange={() => setShowCredit(!showCredit)}
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
                            <Table.Th style={{ width: "20%" }}>Name</Table.Th>
                            <Table.Th style={{ width: "10%" }}>Phone</Table.Th>
                            <Table.Th style={{ width: "15%" }}>Email</Table.Th>
                            <Table.Th style={{ width: "20%" }}>
                                Address
                            </Table.Th>
                            {showCredit && (
                                <Table.Th style={{ width: "15%" }}>
                                    Credit
                                </Table.Th>
                            )}
                            <Table.Th style={{ width: "10%" }}>Status</Table.Th>
                            <Table.Th style={{ width: "5%" }}></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {customers?.length !== 0 ? (
                            customers?.map((c: any, i: number) => (
                                <Table.Tr key={i}>
                                    <Table.Td style={{ width: "20%" }}>
                                        {c?.name}
                                    </Table.Td>
                                    <Table.Td style={{ width: "10%" }}>
                                        {c.phone}
                                    </Table.Td>
                                    <Table.Td style={{ width: "15%" }}>
                                        {c.email || "-"}
                                    </Table.Td>
                                    <Table.Td style={{ width: "20%" }}>
                                        {c.address || "-"}
                                    </Table.Td>
                                    {showCredit && (
                                        <Table.Td style={{ width: "15%" }}>
                                            {amountPreview(c.creditAmount || 0)}
                                        </Table.Td>
                                    )}
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
                                                            `/app/customers/view-customer/${c._id}`
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
                                                            `/app/customers/edit-customer/${c._id}`
                                                        );
                                                        sessionStorage.setItem(
                                                            "pageIndex",
                                                            String(pageIndex)
                                                        );
                                                    }}
                                                    rightSection={
                                                        <IconEdit size={16} />
                                                    }
                                                    disabled={!hasAnyPrivilege(role, [
                                                        USER_ROLES.ADMIN,
                                                        USER_ROLES.SUPER_ADMIN,
                                                        USER_ROLES.OWNER,
                                                        USER_ROLES.SALES_MANAGER,
                                                        USER_ROLES.WAREHOUSE_MANAGER,
                                                    ])}
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
                                                    disabled={!hasAnyPrivilege(role, [
                                                        USER_ROLES.ADMIN,
                                                        USER_ROLES.SUPER_ADMIN,
                                                        USER_ROLES.OWNER,
                                                        USER_ROLES.SALES_MANAGER,
                                                    ])}
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

            {/* Mobile Table */}
            <Box my="lg" mx="sm" hiddenFrom="lg">
                {customers?.length !== 0 ? (
                    customers?.map((c: any, i: number) => (
                        <Card key={i} shadow="sm" withBorder mx="xs" my="lg">
                            <Text className="font-semibold">
                                Name: {c.name}
                            </Text>
                            <Text>Phone: {c.phone}</Text>
                            <Text>Email: {c.email}</Text>
                            <Text>Address: {c.address}</Text>
                            {showCredit && (
                                <Text>
                                    Credit: {amountPreview(c.creditAmount || 0)}
                                </Text>
                            )}
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
                                                    `/app/customers/view-customer/${c._id}`
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
                                                    `/app/customers/edit-customer/${c._id}`
                                                );
                                                sessionStorage.setItem(
                                                    "pageIndex",
                                                    String(pageIndex)
                                                );
                                            }}
                                            rightSection={
                                                <IconEdit size={16} />
                                            }
                                            disabled={!hasAnyPrivilege(role, [
                                                USER_ROLES.ADMIN,
                                                USER_ROLES.SUPER_ADMIN,
                                                USER_ROLES.OWNER,
                                                USER_ROLES.SALES_MANAGER,
                                                USER_ROLES.WAREHOUSE_MANAGER,
                                            ])}
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
                                            disabled={!hasAnyPrivilege(role, [
                                                USER_ROLES.ADMIN,
                                                USER_ROLES.SUPER_ADMIN,
                                                USER_ROLES.OWNER,
                                                USER_ROLES.SALES_MANAGER,
                                            ])}
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

export default Customers;
