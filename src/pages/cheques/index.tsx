import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
    Badge,
    Box,
    Button,
    Card,
    Group,
    Menu,
    Pagination,
    Select,
    Table,
    Text,
    TextInput,
} from "@mantine/core";
import {
    IconCertificate,
    IconCertificateOff,
    IconDatabaseOff,
    IconDotsVertical,
    IconEdit,
    IconEye,
    IconSearch,
    IconTruck,
    IconX,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import {
    changeStatusCheque,
    getPagedCheques,
} from "../../store/chequeSlice/chequeSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";
import { getCustomers } from "../../store/customerSlice/customerSlice.ts";
import { DateInput } from "@mantine/dates";
import {
    amountPreview,
    datePreview,
    pageRange,
} from "../../helpers/preview.tsx";
import { CHEQUES_STATUS_COLORS, USER_ROLES } from "../../helpers/types.ts";
import { hasAnyPrivilege, hasPrivilege } from "../../helpers/previlleges.ts";

const Cheques = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();

    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 5;
    const [customer, setCustomer] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [depositDate, setDepositDate] = useState<any>();
    const [fromDate, setFromDate] = useState<any>();
    const [toDate, setToDate] = useState<any>();
    const [searchQuery, setSearchQuery] = useState<string>("");

    const sort = -1;
    const [metadata, setMetadata] = useState<any>();

    const cheques = useSelector((state: RootState) => state.cheque.cheques);
    const customers = useSelector(
        (state: RootState) => state.customer.customers
    );
    const user = useSelector((state: RootState) => state.auth.user);
    const role = user.role;

    useEffect(() => {
        fetchCheques();
    }, [
        dispatch,
        pageIndex,
        customer,
        status,
        depositDate,
        fromDate,
        toDate,
        searchQuery,
    ]);

    const fetchCheques = async () => {
        setLoading(true);
        await dispatch(getCustomers({}));
        const filters = {
            pageSize,
            pageIndex,
            customer,
            sort,
            status,
            depositDate,
            fromDate,
            toDate,
            searchQuery,
        };
        const response = await dispatch(getPagedCheques({ filters: filters }));
        setMetadata(response.payload.result.metadata);
        setLoading(false);
    };

    const chequeStatusUpdate = async (id: string, status: string) => {
        setLoading(true);
        const payload = {
            id,
            values: { chequeStatus: status },
        };
        const response = await dispatch(changeStatusCheque(payload));
        if (response.type === "cheque/changeStatus/fulfilled") {
            await fetchCheques();
            setLoading(false);
            toNotify(
                "Success",
                "Cheque status changed successfully",
                "SUCCESS"
            );
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

    const selectableCustomers = customers.map((c: any) => {
        return {
            label: c?.name,
            value: c?._id,
        };
    });

    return (
        <>
            {/* Header */}
            <Box display="flex" p="lg" className="items-center justify-between">
                <Box>
                    <Text size="lg" fw={500}>
                        Cheques
                    </Text>
                </Box>
                <Box>
                    <Button
                        size="xs"
                        onClick={() => navigate("/app/cheques/add-cheque")}
                        disabled={
                            !hasAnyPrivilege(role, [
                                USER_ROLES.ADMIN,
                                USER_ROLES.SUPER_ADMIN,
                                USER_ROLES.OWNER,
                            ])
                        }
                    >
                        Add Cheque
                    </Button>
                </Box>
            </Box>

            {/* Search Input */}
            <Box px="lg">
                <Group w={{ lg: "60%", sm: "100%" }}>
                    <Select
                        className="w-full lg:w-1/4"
                        size="xs"
                        placeholder="Select a customer"
                        data={selectableCustomers}
                        searchable
                        clearable
                        onChange={(value: string | null) => {
                            if (value) {
                                setCustomer(value); // Update the selected customer
                            } else {
                                setCustomer(""); // Clear the selected customer
                            }
                            setPageIndex(1); // Reset the page index to 1
                        }}
                    />

                    <Select
                        className="w-full lg:w-1/4"
                        size="xs"
                        placeholder="Select a status"
                        data={[
                            "PENDING",
                            "SEND TO SUPPLIER",
                            "DEPOSITED",
                            "RETURNED",
                            "COMPLETED",
                        ]}
                        clearable
                        onChange={(value: string | null) => {
                            if (value) {
                                setStatus(value); // Update the selected status
                            } else {
                                setStatus(""); // Clear the selected status
                            }
                            setPageIndex(1); // Reset the page index to 1
                        }}
                    />

                    <DateInput
                        className="w-full lg:w-1/4"
                        size="xs"
                        placeholder="Select deposit date"
                        clearable
                        onChange={(e: any) => {
                            setDepositDate(e); // Update the deposit date
                            setPageIndex(1); // Reset the page index to 1
                        }}
                    />

                    <TextInput
                        className="w-full lg:w-1/4"
                        size="xs"
                        placeholder="Cheque Number"
                        type="number"
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

                    <DateInput
                        className="w-full lg:w-1/4"
                        size="xs"
                        placeholder="Date range from"
                        clearable
                        onChange={(e: any) => {
                            setFromDate(e); // Update the deposit date
                            setPageIndex(1); // Reset the page index to 1
                        }}
                        maxDate={toDate}
                    />

                    <DateInput
                        className="w-full lg:w-1/4"
                        size="xs"
                        placeholder="Date range to"
                        clearable
                        onChange={(e: any) => {
                            setToDate(e); // Update the deposit date
                            setPageIndex(1); // Reset the page index to 1
                        }}
                        minDate={fromDate}
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
                            <Table.Th style={{ width: "20%" }}>
                                Customer
                            </Table.Th>
                            <Table.Th style={{ width: "15%" }}>
                                Cheque Number
                            </Table.Th>
                            <Table.Th style={{ width: "15%" }}>Bank</Table.Th>
                            <Table.Th style={{ width: "10%" }}>Branch</Table.Th>
                            <Table.Th style={{ width: "15%" }}>Amount</Table.Th>
                            <Table.Th style={{ width: "10%" }}>
                                Deposit Date
                            </Table.Th>
                            <Table.Th style={{ width: "10%" }}>
                                Cheque Status
                            </Table.Th>
                            <Table.Th style={{ width: "5%" }}></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {cheques?.length !== 0 ? (
                            cheques?.map((c: any, i: number) => (
                                <Table.Tr key={i}>
                                    <Table.Td style={{ width: "20%" }}>
                                        {c.customer?.name}
                                    </Table.Td>
                                    <Table.Td style={{ width: "15%" }}>
                                        {c.number}
                                    </Table.Td>
                                    <Table.Td style={{ width: "15%" }}>
                                        {c.bank}
                                    </Table.Td>
                                    <Table.Td style={{ width: "10%" }}>
                                        {c.branch}
                                    </Table.Td>
                                    <Table.Td style={{ width: "15%" }}>
                                        {amountPreview(c.amount)}
                                    </Table.Td>
                                    <Table.Td style={{ width: "10%" }}>
                                        {datePreview(c.depositDate)}
                                    </Table.Td>
                                    <Table.Td style={{ width: "10%" }}>
                                        <Badge
                                            size="sm"
                                            radius="xs"
                                            color={
                                                CHEQUES_STATUS_COLORS[
                                                    c.chequeStatus as keyof typeof CHEQUES_STATUS_COLORS
                                                ] || "gray"
                                            }
                                        >
                                            {c.chequeStatus}
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
                                                            `/app/cheques/view-cheque/${c._id}`
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
                                                            String(pageIndex)
                                                        );
                                                    }}
                                                    rightSection={
                                                        <IconEdit size={16} />
                                                    }
                                                >
                                                    Edit
                                                </Menu.Item>
                                                {c.chequeStatus !==
                                                    "COMPLETED" &&
                                                    c.chequeStatus !==
                                                        "RETURNED" &&
                                                    hasPrivilege(
                                                        user.role,
                                                        USER_ROLES.SUPER_ADMIN
                                                    ) && (
                                                        <>
                                                            {c.chequeStatus !==
                                                                "SEND TO SUPPLIER" && (
                                                                <Menu.Item
                                                                    color="blue"
                                                                    onClick={() =>
                                                                        chequeStatusUpdate(
                                                                            c._id,
                                                                            "SEND TO SUPPLIER"
                                                                        )
                                                                    }
                                                                    rightSection={
                                                                        <IconTruck
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    }
                                                                >
                                                                    <span>
                                                                        Send to
                                                                        Supplier
                                                                    </span>
                                                                </Menu.Item>
                                                            )}
                                                            <Menu.Item
                                                                color="green"
                                                                onClick={() =>
                                                                    chequeStatusUpdate(
                                                                        c._id,
                                                                        "COMPLETED"
                                                                    )
                                                                }
                                                                rightSection={
                                                                    <IconCertificate
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                }
                                                            >
                                                                <span>
                                                                    Completed
                                                                </span>
                                                            </Menu.Item>
                                                            <Menu.Item
                                                                color="red"
                                                                onClick={() =>
                                                                    chequeStatusUpdate(
                                                                        c._id,
                                                                        "RETURNED"
                                                                    )
                                                                }
                                                                rightSection={
                                                                    <IconCertificateOff
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                }
                                                            >
                                                                <span>
                                                                    Returned
                                                                </span>
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
                                <Table.Td colSpan={8} className="text-center">
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
                {cheques?.length !== 0 ? (
                    cheques?.map((c: any, i: number) => (
                        <Card key={i} shadow="sm" withBorder mx="xs" my="lg">
                            <Text className="font-semibold">
                                Customer: {c.customer?.name}
                            </Text>
                            <Text>Cheque Number: {c.number}</Text>
                            <Text>Bank: {c.bank}</Text>
                            <Text>Branch: {c.branch}</Text>
                            <Text>Amount: {amountPreview(c.amount)}</Text>
                            <Text>
                                Deposit Date: {datePreview(c.depositDate)}
                            </Text>
                            <Badge
                                size="sm"
                                radius="xs"
                                color={
                                    CHEQUES_STATUS_COLORS[
                                        c.chequeStatus as keyof typeof CHEQUES_STATUS_COLORS
                                    ] || "gray"
                                }
                                className="mt-2"
                            >
                                {c.chequeStatus}
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
                                                    `/app/cheques/view-cheque/${c._id}`
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
                                            disabled={
                                                c.chequeStatus !== "PENDING"
                                            }
                                            onClick={() => {
                                                navigate(
                                                    `/app/cheques/edit-cheque/${c._id}`
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
                                        {c.chequeStatus !== "COMPLETED" &&
                                            c.chequeStatus !== "RETURNED" &&
                                            hasPrivilege(
                                                user.role,
                                                USER_ROLES.SUPER_ADMIN
                                            ) && (
                                                <>
                                                    {c.chequeStatus !==
                                                        "SEND TO SUPPLIER" && (
                                                        <Menu.Item
                                                            color="blue"
                                                            onClick={() =>
                                                                chequeStatusUpdate(
                                                                    c._id,
                                                                    "SEND TO SUPPLIER"
                                                                )
                                                            }
                                                            rightSection={
                                                                <IconTruck
                                                                    size={16}
                                                                />
                                                            }
                                                        >
                                                            <span>
                                                                Send to Supplier
                                                            </span>
                                                        </Menu.Item>
                                                    )}
                                                    <Menu.Item
                                                        color="green"
                                                        onClick={() =>
                                                            chequeStatusUpdate(
                                                                c._id,
                                                                "COMPLETED"
                                                            )
                                                        }
                                                        rightSection={
                                                            <IconCertificate
                                                                size={16}
                                                            />
                                                        }
                                                    >
                                                        <span>Completed</span>
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        color="red"
                                                        onClick={() =>
                                                            chequeStatusUpdate(
                                                                c._id,
                                                                "RETURNED"
                                                            )
                                                        }
                                                        rightSection={
                                                            <IconCertificateOff
                                                                size={16}
                                                            />
                                                        }
                                                    >
                                                        <span>Returned</span>
                                                    </Menu.Item>
                                                </>
                                            )}
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

export default Cheques;
