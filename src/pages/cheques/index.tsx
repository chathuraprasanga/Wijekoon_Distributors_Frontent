import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Badge, Button, Group, Menu, Pagination, Table } from "@mantine/core";
import { IconDatabaseOff, IconDotsVertical } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { changeStatusCheque, getCheques } from "../../store/chequeSlice/chequeSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";

const Cheques = () => {
    const {setLoading} = useLoading();
    const dispatch = useDispatch<AppDispatch|any>();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const cheques = useSelector(
        (state: RootState) => state.cheque.cheques
    );

    useEffect(() => {
        fetchCheques();
        setPage();
    }, []);

    const setPage = () => {
        setCurrentPage(Number(sessionStorage.getItem("pageIndex") || 1));
        sessionStorage.clear();
    };

    const fetchCheques = async () => {
        setLoading(true);
        await dispatch(getCheques({}));
        setLoading(false);
    };


    const totalPages = Math.ceil(cheques?.length / pageSize);
    const paginatedData: any = cheques?.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const chequeStatusUpdate = async ( id: string,status: string) => {
        setLoading(true);
        const payload = {
            id,
            values: { chequeStatus: status },
        };
        const response = await dispatch(changeStatusCheque(payload));
        if (response.type === "cheque/changeStatus/fulfilled") {
            await fetchCheques();
            setLoading(false);
            toNotify("Success", "Cheque status changed successfully", "SUCCESS");
        } else if (response.type === "cheque/changeStatus/rejected") {
            const error: any = response.payload.error;
            setLoading(false);
            toNotify("Error", `${error}`, "ERROR");
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
                    <span className="text-lg font-semibold">Cheques</span>
                </div>
                <div>
                    <Button
                        size="xs"
                        color="dark"
                        onClick={() => navigate("/app/cheques/add-cheque")}
                    >
                        Add Cheque
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
                            <Table.Th>Customer</Table.Th>
                            <Table.Th>Cheque Number</Table.Th>
                            <Table.Th>Bank</Table.Th>
                            <Table.Th>Amount</Table.Th>
                            <Table.Th>Deposit Date</Table.Th>
                            <Table.Th>Cheque Status</Table.Th>
                            <Table.Th></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {paginatedData?.length !== 0 ? (
                            paginatedData?.map((c: any, i: number) => (
                                <Table.Tr key={i}>
                                    <Table.Td>{c.customer}</Table.Td>
                                    <Table.Td>{c.number}</Table.Td>
                                    <Table.Td>{c.bank}</Table.Td>
                                    <Table.Td>{c.amount}</Table.Td>
                                    <Table.Td>{c.depositDate}</Table.Td>
                                    <Table.Td>
                                        <Badge
                                            size="md"
                                            radius="xs"
                                            color={
                                                c.chequeStatus === "PENDING"
                                                    ? "yellow"
                                                    : c.chequeStatus ===
                                                        "DEPOSITED"
                                                      ? "blue"
                                                      : c.chequeStatus ===
                                                          "RETURNED"
                                                        ? "red"
                                                        : "green"
                                            }
                                        >
                                            {c.chequeStatus}
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
                                                    onClick={() => {
                                                        navigate(
                                                            `/app/cheques/view-cheque/${c._id}`
                                                        );
                                                        sessionStorage.setItem(
                                                            "pageIndex",
                                                            String(currentPage)
                                                        );
                                                    }}
                                                >
                                                    View
                                                </Menu.Item>
                                                <Menu.Item
                                                    disabled={
                                                        c.chequeStatus !==
                                                        "PENDING"
                                                    }
                                                    onClick={() => {
                                                        navigate(
                                                            `/app/cheques/edit-cheque/${c._id}`
                                                        );
                                                        sessionStorage.setItem(
                                                            "pageIndex",
                                                            String(currentPage)
                                                        );
                                                    }}
                                                >
                                                    Edit
                                                </Menu.Item>
                                                {c.chequeStatus !== "COMPLETED" && c.chequeStatus !== "RETURNED" && (
                                                    <>
                                                        <Menu.Item
                                                            color="green"
                                                            onClick={() => chequeStatusUpdate(c._id, "COMPLETED")}
                                                        >
                                                            <span>Completed</span>
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            color="red"
                                                            onClick={() => chequeStatusUpdate(c._id, "RETURNED")}
                                                        >
                                                            <span>Returned</span>
                                                        </Menu.Item>
                                                    </>
                                                )}
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
                            <p className="font-semibold">
                                Customer: {c.customer}
                            </p>
                            <p>Cheque Number: {c.chequeNumber}</p>
                            <p>Bank: {c.bank}</p>
                            <p>Amount: {c.amount}</p>
                            <p>Deposit Date: {c.depositDate}</p>
                            <Badge
                                size="md"
                                radius="xs"
                                color={
                                    c.chequeStatus === "PENDING"
                                        ? "yellow"
                                        : c.chequeStatus === "DEPOSITED"
                                          ? "blue"
                                          : c.chequeStatus === "RETURNED"
                                            ? "red"
                                            : "green"
                                }
                                className="mt-2"
                            >
                                {c.chequeStatus}
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
                                                    `/app/cheques/view-cheque/${c._id}`
                                                );
                                                sessionStorage.setItem(
                                                    "pageIndex",
                                                    String(currentPage)
                                                );
                                            }}
                                        >
                                            View
                                        </Menu.Item>
                                        <Menu.Item
                                            disabled={
                                                c.chequeStatus !==
                                                "PENDING"
                                            }
                                            onClick={() => {
                                                navigate(
                                                    `/app/cheques/edit-cheque/${c._id}`
                                                );
                                                sessionStorage.setItem(
                                                    "pageIndex",
                                                    String(currentPage)
                                                );
                                            }}
                                        >
                                            Edit
                                        </Menu.Item>
                                        {c.chequeStatus !== "COMPLETED" && c.chequeStatus !== "RETURNED" && (
                                            <>
                                                <Menu.Item
                                                    color="green"
                                                    onClick={() => chequeStatusUpdate(c._id, "COMPLETED")}
                                                >
                                                    <span>Completed</span>
                                                </Menu.Item>
                                                <Menu.Item
                                                    color="red"
                                                    onClick={() => chequeStatusUpdate(c._id, "RETURNED")}
                                                >
                                                    <span>Returned</span>
                                                </Menu.Item>
                                            </>
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

export default Cheques;
