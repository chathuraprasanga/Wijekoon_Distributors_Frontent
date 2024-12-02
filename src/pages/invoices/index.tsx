import { useNavigate } from "react-router";
import { useState } from "react";
import { Badge, Button, Group, Menu, Pagination, Table } from "@mantine/core";
import { IconDatabaseOff, IconDotsVertical } from "@tabler/icons-react";
import invoices from "./invoice_data.json";

const Invoices = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const totalPages = Math.ceil(invoices.length / pageSize);
    const paginatedData: any = invoices.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <>
            {/* Header */}
            <div className="items-center flex flex-row justify-between p-4">
                <div>
                    <span className="text-lg font-semibold">Invoices</span>
                </div>
                <div>
                    <Button
                        size="xs"
                        color="dark"
                        onClick={() => navigate("/app/invoices/add-invoice")}
                    >
                        Add Invoice
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
                            <Table.Th>Supplier</Table.Th>
                            <Table.Th>Invoiced Date</Table.Th>
                            <Table.Th>Invoice Number</Table.Th>
                            <Table.Th>Amount</Table.Th>
                            <Table.Th>Invoice Status</Table.Th>
                            <Table.Th></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {paginatedData.length !== 0 ? (
                            paginatedData.map((c: any, i: number) => (
                                <Table.Tr key={i}>
                                    <Table.Td>{c.supplier}</Table.Td>
                                    <Table.Td>{c.invoiceDate}</Table.Td>
                                    <Table.Td>{c.invoiceNumber}</Table.Td>
                                    <Table.Td>{c.amount}</Table.Td>
                                    <Table.Td>
                                        <Badge
                                            size="md"
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
                                                <Menu.Item>
                                                    <span>View</span>
                                                </Menu.Item>
                                                <Menu.Item
                                                    disabled={
                                                        c.invoiceStatus ===
                                                        "PAID"
                                                    }
                                                >
                                                    Edit
                                                </Menu.Item>
                                                {c.invoiceStatus ===
                                                    "NOT PAID" && (
                                                    <Menu.Item color="green">
                                                        Payment Done
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
            </div>

            {/* Mobile Cards */}
            <div className="block lg:hidden mx-4 my-4">
                {paginatedData.length !== 0 ? (
                    paginatedData.map((c: any, i: number) => (
                        <div
                            key={i}
                            className="border border-gray-300 rounded-md mb-4 p-4 bg-white shadow-sm"
                        >
                            <p className="font-semibold">
                                Supplier: {c.supplier}
                            </p>
                            <p>Invoiced Date: {c.invoiceDate}</p>
                            <p>Invoice Number: {c.invoiceNumber}</p>
                            <p>Amount: {c.amount}</p>
                            <Badge
                                size="md"
                                radius="xs"
                                color={
                                    c.invoiceStatus === "PAID" ? "green" : "red"
                                }
                                className="mt-2"
                            >
                                {c.invoiceStatus}
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
                                            disabled={
                                                c.invoiceStatus === "PAID"
                                            }
                                        >
                                            Edit
                                        </Menu.Item>
                                        {c.invoiceStatus === "NOT PAID" && (
                                            <Menu.Item color="green">
                                                Payment Done
                                            </Menu.Item>
                                        )}
                                    </Menu.Dropdown>
                                </Menu>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center">
                        <IconDatabaseOff
                            color="red"
                            size="24"
                            className="mr-2 self-center"
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

export default Invoices;
