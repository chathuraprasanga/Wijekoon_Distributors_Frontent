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
} from "@mantine/core";
import {
    IconDatabaseOff,
    IconDotsVertical,
    IconEdit,
    IconEye,
    IconMobiledata,
    IconMobiledataOff, IconSearch,
    IconX,
} from "@tabler/icons-react";
// import customers from "./customer_data.json";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import {
    changeStatusCustomer,
    getCustomers, getPagedCustomers,
} from "../../store/customerSlice/customerSlice.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import toNotify from "../../helpers/toNotify.tsx";

const Customers = () => {
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch | any>();

    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 5;
    const [searchQuery, setSearchQuery] = useState<string>("");
    const sort = -1;
    const [metadata, setMetadata] = useState<any>();

    const customers = useSelector(
        (state: RootState) => state.customer.customers
    );

    useEffect(() => {
        fetchCustomers();
    }, [dispatch, pageIndex, searchQuery]);



    const fetchCustomers = async () => {
        setLoading(true);
        const filters = { pageSize, pageIndex, searchQuery, sort };
        const response = await dispatch(getPagedCustomers({ filters: filters }));
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
            dispatch(getCustomers({}));
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
                <Box>
                    <Button
                        size="xs"
                        onClick={() => navigate("/app/customers/add-customer")}
                    >
                        Add Customer
                    </Button>
                </Box>
            </Box>

            {/* Search Input */}
            <Box px="lg">
                <Group w={{ lg: "60%", sm: "100%" }}>
                    <TextInput
                        className="w-full lg:w-1/4"
                        size="xs"
                        placeholder="Name, Phone, Email"
                        onChange={(event) => setSearchQuery(event.target.value)}
                        value={searchQuery}
                        rightSection={searchQuery ? <IconX className="cursor-pointer" onClick={() => setSearchQuery("")} size={14}/> : ""}
                        leftSection={<IconSearch size={14}/>}
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
                            <Table.Th style={{ width: "15%" }}>Phone</Table.Th>
                            <Table.Th style={{ width: "25%" }}>Email</Table.Th>
                            <Table.Th style={{ width: "25%" }}>
                                Address
                            </Table.Th>
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
                                    <Table.Td style={{ width: "15%" }}>
                                        {c.phone}
                                    </Table.Td>
                                    <Table.Td style={{ width: "25%" }}>
                                        {c.email || "-"}
                                    </Table.Td>
                                    <Table.Td style={{ width: "25%" }}>
                                        {c.address || "-"}
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
                                                >
                                                    Edit
                                                </Menu.Item>
                                                <Menu.Item
                                                    color={
                                                        c.status
                                                            ? "red"
                                                            : "green"
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
                            <Badge
                                color={c.status ? "green" : "red"}
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
                                        >
                                            Edit
                                        </Menu.Item>
                                        <Menu.Item
                                            color={c.status ? "red" : "green"}
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

export default Customers;
