import { Badge, Button, Group, Menu, Pagination, Table } from "@mantine/core";
import { IconDatabaseOff, IconDotsVertical } from "@tabler/icons-react";
// import customers from "./customer_data.json";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { getCustomers } from "../../store/customerSlice/customerSlice.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";

const Customers = () => {
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch | any>();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const customers = useSelector(
        (state: RootState) => state.customer.customers
    );


    useEffect(() => {
        fetchCustomers();
        setPage();
    }, []);

    const setPage =() => {
        setCurrentPage(Number(sessionStorage.getItem("pageIndex") || 1));
        sessionStorage.clear()
    }

    const fetchCustomers = async () => {
        setLoading(true);
        await dispatch(getCustomers({}));
        setLoading(false);
    };

    const totalPages = Math.ceil(customers?.length / pageSize);
    const paginatedData: any = customers?.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <>
            {/* Header */}
            <div className="items-center flex flex-row justify-between p-4">
                <div>
                    <span className="text-lg font-semibold">Customers</span>
                </div>
                <div>
                    <Button
                        size="xs"
                        color="dark"
                        onClick={() => navigate("/app/customers/add-customer")}
                    >
                        Add Customer
                    </Button>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block mx-4 my-4 overflow-x-auto">
                <Table
                    striped
                    highlightOnHover
                    withTableBorder
                    withColumnBorders
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Phone</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Address</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {paginatedData?.length !== 0 ? (
                            paginatedData?.map((c: any, i: number) => (
                                <Table.Tr key={i}>
                                    <Table.Td>{c.name}</Table.Td>
                                    <Table.Td>{c.phone}</Table.Td>
                                    <Table.Td>{c.email || "-"}</Table.Td>
                                    <Table.Td>{c.address || "-"}</Table.Td>
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
                                        <Menu width={150}>
                                            <Menu.Target>
                                                <IconDotsVertical
                                                    size="16"
                                                    className="cursor-pointer"
                                                />
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <Menu.Label>Actions</Menu.Label>
                                                <Menu.Item>View</Menu.Item>
                                                <Menu.Item
                                                    onClick={() => {
                                                        navigate(`/app/customers/edit-customer/${c._id}`);
                                                        sessionStorage.setItem("pageIndex", String(currentPage));
                                                    }}
                                                >
                                                    Edit
                                                </Menu.Item>
                                                <Menu.Item>
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
            </div>

            {/* Mobile Table */}
            <div className="block lg:hidden mx-4 my-4">
                {paginatedData?.length !== 0 ? (
                    paginatedData?.map((c: any, i: number) => (
                        <div
                            key={i}
                            className="border border-gray-300 rounded-md mb-4 p-4 bg-white shadow-sm"
                        >
                            <p className="font-semibold">Name: {c.name}</p>
                            <p>Phone: {c.phone}</p>
                            <p>Email: {c.email}</p>
                            <p>Address: {c.address}</p>
                            <Badge
                                color={c.status ? "green" : "red"}
                                size="sm"
                                radius="xs"
                                className="mt-2"
                            >
                                {c.status ? "ACTIVE" : "INACTIVE"}
                            </Badge>
                            <div className="mt-2">
                                <Menu width={150}>
                                    <Menu.Target>
                                        <IconDotsVertical
                                            size="16"
                                            className="cursor-pointer"
                                        />
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Label>Actions</Menu.Label>
                                        <Menu.Item>View</Menu.Item>
                                        <Menu.Item
                                            onClick={() => {
                                                navigate(`/app/customers/edit-customer/${c._id}`);
                                                sessionStorage.setItem("pageIndex", String(currentPage));
                                            }}
                                        >
                                            Edit
                                        </Menu.Item>
                                        <Menu.Item>
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
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center">
                        <IconDatabaseOff
                            color="red"
                            size="24"
                        />
                        <p>No data available</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="my-4 mx-4 flex justify-end">
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
            </div>
        </>
    );
};

export default Customers;
