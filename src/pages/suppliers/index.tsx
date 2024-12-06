import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Badge, Button, Group, Menu, Pagination, Table } from "@mantine/core";
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
import { changeStatusSupplier, getSuppliers } from "../../store/supplierSlice/supplierSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";

const Suppliers = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const suppliers = useSelector(
        (state: RootState) => state.supplier.suppliers
    );

    useEffect(() => {
        fetchSuppliers();
        setPage();
    }, []);

    const setPage = () => {
        setCurrentPage(Number(sessionStorage.getItem("pageIndex") || 1));
        sessionStorage.clear();
    };

    const fetchSuppliers = async () => {
        setLoading(true);
        await dispatch(getSuppliers({}));
        setLoading(false);
    };

    const totalPages = Math.ceil(suppliers?.length / pageSize);
    const paginatedData: any = suppliers?.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleChangeStatus = async (supplier: any) => {
        setLoading(true);
        const response = await dispatch(
            changeStatusSupplier({
                id: supplier._id,
                values: { status: !supplier.status },
            })
        );
        if (response.type === "supplier/changeStatus/fulfilled") {
            dispatch(getSuppliers({}));
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
            <div className="items-center flex flex-row justify-between p-4">
                <div>
                    <span className="text-lg font-semibold">Suppliers</span>
                </div>
                <div>
                    <Button
                        size="xs"
                        color="dark"
                        onClick={() => navigate("/app/suppliers/add-supplier")}
                    >
                        Add Supplier
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
                            <Table.Th style={{width: "20%"}}>Name</Table.Th>
                            <Table.Th style={{width: "15%"}}>Phone</Table.Th>
                            <Table.Th style={{width: "20%"}}>Email</Table.Th>
                            <Table.Th style={{width: "25%"}}>Address</Table.Th>
                            <Table.Th style={{width: "10%"}}>Status</Table.Th>
                            <Table.Th style={{width: "5%"}}></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {paginatedData?.length !== 0 ? (
                            paginatedData?.map((c: any, i: number) => (
                                <Table.Tr key={i}>
                                    <Table.Td style={{width: "20%"}}>{c.name}</Table.Td>
                                    <Table.Td style={{width: "15%"}}>{c.phone}</Table.Td>
                                    <Table.Td style={{width: "20%"}}>{c.email}</Table.Td>
                                    <Table.Td style={{width: "25%"}}>{c.address}</Table.Td>
                                    <Table.Td style={{width: "10%"}}>
                                        <Badge
                                            color={c.status ? "green" : "red"}
                                            size="sm"
                                            radius="xs"
                                        >
                                            {c.status ? "ACTIVE" : "INACTIVE"}
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
                                                            `/app/suppliers/view-supplier/${c._id}`
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
                                                    onClick={() => {
                                                        navigate(
                                                            `/app/suppliers/edit-supplier/${c._id}`
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
                                                <Menu.Item
                                                    color={
                                                        c.status
                                                            ? "red"
                                                            : "green"
                                                    }
                                                    onClick={() =>
                                                        handleChangeStatus(c)
                                                    }
                                                    rightSection={c.status ? <IconMobiledataOff size={16} /> : <IconMobiledata size={16}/> }
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
            </div>

            {/* Mobile Cards */}
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
                                        <Menu.Item
                                            onClick={() => {
                                                navigate(
                                                    `/app/suppliers/view-supplier/${c._id}`
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
                                            onClick={() => {
                                                navigate(
                                                    `/app/suppliers/edit-supplier/${c._id}`
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
                                        <Menu.Item
                                            color={c.status ? "red" : "green"}
                                            onClick={() =>
                                                handleChangeStatus(c)
                                            }
                                            rightSection={c.status ? <IconMobiledataOff size={16} /> : <IconMobiledata size={16}/> }
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

export default Suppliers;
