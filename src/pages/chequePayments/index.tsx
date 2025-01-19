import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
    Alert,
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
    IconInfoCircle,
    IconSearch,
    IconX,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import toNotify from "../../helpers/toNotify.tsx";
import {
    amountPreview,
    bankPreview,
    datePreview,
} from "../../helpers/preview.tsx";
import { DateInput } from "@mantine/dates";
import {
    changeStatusChequePayment,
    getPagedChequePayments,
} from "../../store/chequePaymentSlice/chequePaymentSlice.ts";
import { getBankDetails } from "../../store/bankDetailSlice/bankDetailSlice.ts";
import { CHEQUES_STATUS_COLORS } from "../../helpers/types.ts";

const ChequePayments = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();

    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 5;
    const [status, setStatus] = useState<string>("");
    const [date, setDate] = useState<any>();
    const sort = -1;
    const [metadata, setMetadata] = useState<any>();
    const [fromDate, setFromDate] = useState<any>();
    const [toDate, setToDate] = useState<any>();

    const chequePayments = useSelector(
        (state: RootState) => state.chequePayments.chequePayments
    );
    const bankDetails = useSelector(
        (state: RootState) => state.bankDetails.bankDetails
    );
    const isBankDetailsAdded = bankDetails.length >= 1;
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        fetchChequePaymentsWithoutSearch();
    }, [dispatch]);

    const fetchChequePaymentsWithoutSearch = async () => {
        setLoading(true);
        await dispatch(getBankDetails({}));
        const filters = {
            pageSize,
            pageIndex,
            sort,
            status,
            date,
            searchQuery,
            toDate,
            fromDate
        };
        const response = await dispatch(
            getPagedChequePayments({ filters: filters })
        );
        setMetadata(response.payload.result.metadata);
        setLoading(false);
    };

    useEffect(() => {
        fetchChequePayments();
    }, [pageIndex, status, date, searchQuery, fromDate, toDate]);

    const fetchChequePayments = async () => {
        setLoading(true);
        const filters = {
            pageSize,
            pageIndex,
            sort,
            status,
            date,
            searchQuery,
            toDate,
            fromDate
        };
        const response = await dispatch(
            getPagedChequePayments({ filters: filters })
        );
        setMetadata(response.payload.result.metadata);
        setLoading(false);
    };

    const chequePaymentStatusUpdate = async (id: string, status: string) => {
        setLoading(true);
        const payload = {
            id,
            values: { chequeStatus: status },
        };
        const response = await dispatch(changeStatusChequePayment(payload));
        if (response.type === "chequePayment/changeStatus/fulfilled") {
            await fetchChequePayments();
            setLoading(false);
            toNotify(
                "Success",
                "Cheque payment status changed successfully",
                "SUCCESS"
            );
        } else if (response.type === "chequePayment/changeStatus/rejected") {
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
            <Box display="flex" p="lg" className="items-center justify-between">
                <Box>
                    <Text size="lg" fw={500}>
                        Cheque Payments
                    </Text>
                </Box>
                <Box>
                    <Button
                        size="xs"
                        onClick={() =>
                            navigate("/app/cheque-payments/add-cheque-payment")
                        }
                        disabled={!isBankDetailsAdded}
                    >
                        Add Payment
                    </Button>
                </Box>
            </Box>
            <>
                {!isBankDetailsAdded && (
                    <Box mx="xs" p="sm" my="lg">
                        <Alert
                            icon={<IconInfoCircle size={24} />}
                            color="red"
                            radius="sm"
                            variant="light"
                            className="w-full"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Group className="flex justify-between">
                                <Text size="sm" c="red" style={{ flex: 1 }}>
                                    Please Add Bank Account Details First.
                                </Text>
                                <Button
                                    size="compact-xs"
                                    variant="outline"
                                    color="red"
                                    onClick={() => navigate("/app/settings")}
                                >
                                    Click here
                                </Button>
                            </Group>
                        </Alert>
                    </Box>
                )}

                {/* Search Input */}
                <Box px="lg">
                    <Group w={{ lg: "60%", sm: "100%" }}>
                        <TextInput
                            className="w-full lg:w-1/4"
                            size="xs"
                            placeholder="Receiver"
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
                            data={["PENDING", "RETURNED", "COMPLETED"]}
                            clearable
                            onChange={(value: string | null) => {
                                if (value) {
                                    setStatus(value); // Update the status
                                } else {
                                    setStatus(""); // Clear the status
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
                                setDate(e); // Update the date
                                setPageIndex(1); // Reset the page index to 1
                            }}
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
                <Box
                    visibleFrom="lg"
                    mx="lg"
                    my="lg"
                    className="overflow-x-auto"
                >
                    <Table
                        striped
                        highlightOnHover
                        withTableBorder
                        withColumnBorders
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th style={{ width: "20%" }}>
                                    Payment For
                                </Table.Th>
                                <Table.Th style={{ width: "20%" }}>
                                    Bank
                                </Table.Th>
                                <Table.Th style={{ width: "15%" }}>
                                    Cheque Number
                                </Table.Th>
                                <Table.Th style={{ width: "15%" }}>
                                    Amount
                                </Table.Th>
                                <Table.Th style={{ width: "10%" }}>
                                    Date
                                </Table.Th>
                                <Table.Th style={{ width: "10%" }}>
                                    Cheque Status
                                </Table.Th>
                                <Table.Th style={{ width: "5%" }}></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {chequePayments?.length !== 0 ? (
                                chequePayments?.map((c: any, i: number) => (
                                    <Table.Tr key={i}>
                                        <Table.Td style={{ width: "20%" }}>
                                            {c.payFor}
                                        </Table.Td>
                                        <Table.Td style={{ width: "15%" }}>
                                            {bankPreview(c.bankAccount.bank)}
                                        </Table.Td>
                                        <Table.Td style={{ width: "15%" }}>
                                            {c.number}
                                        </Table.Td>
                                        <Table.Td style={{ width: "15%" }}>
                                            {amountPreview(c.amount)}
                                        </Table.Td>
                                        <Table.Td style={{ width: "10%" }}>
                                            {datePreview(c.date)}
                                        </Table.Td>
                                        <Table.Td style={{ width: "10%" }}>
                                            <Badge
                                                size="sm"
                                                radius="xs"
                                                color={CHEQUES_STATUS_COLORS[c.paymentStatus as keyof typeof CHEQUES_STATUS_COLORS] || "gray"}
                                            >
                                                {c.paymentStatus}
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
                                                    <Menu.Label>
                                                        Actions
                                                    </Menu.Label>
                                                    <Menu.Item
                                                        onClick={() => {
                                                            navigate(
                                                                `/app/cheque-payments/view-cheque-payment/${c._id}`
                                                            );
                                                            sessionStorage.setItem(
                                                                "pageIndex",
                                                                String(
                                                                    pageIndex
                                                                )
                                                            );
                                                        }}
                                                        rightSection={
                                                            <IconEye
                                                                size={16}
                                                            />
                                                        }
                                                    >
                                                        View
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        disabled={
                                                            c.paymentStatus !==
                                                            "PENDING"
                                                        }
                                                        onClick={() => {
                                                            navigate(
                                                                `/app/cheque-payments/edit-cheque-payment/${c._id}`
                                                            );
                                                            sessionStorage.setItem(
                                                                "pageIndex",
                                                                String(
                                                                    pageIndex
                                                                )
                                                            );
                                                        }}
                                                        rightSection={
                                                            <IconEdit
                                                                size={16}
                                                            />
                                                        }
                                                    >
                                                        Edit
                                                    </Menu.Item>
                                                    {c.chequeStatus !==
                                                        "COMPLETED" &&
                                                        c.chequeStatus !==
                                                            "RETURNED" && (
                                                            <>
                                                                <Menu.Item
                                                                    color="green"
                                                                    onClick={() =>
                                                                        chequePaymentStatusUpdate(
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
                                                                        chequePaymentStatusUpdate(
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
                                    <Table.Td
                                        colSpan={7}
                                        className="text-center"
                                    >
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
                    {chequePayments?.length !== 0 ? (
                        chequePayments?.map((c: any, i: number) => (
                            <Card
                                key={i}
                                shadow="sm"
                                withBorder
                                mx="xs"
                                my="lg"
                            >
                                <Text className="font-semibold">
                                    Payment For: {c.payFor}
                                </Text>
                                <Text>
                                    Bank: {bankPreview(c.bankAccount.bank)}
                                </Text>
                                <Text>Cheque Number: {c.number}</Text>
                                <Text>Amount: {amountPreview(c.amount)}</Text>
                                <Text>Date: {datePreview(c.date)}</Text>
                                <Badge
                                    size="sm"
                                    radius="xs"
                                    color={CHEQUES_STATUS_COLORS[c.paymentStatus as keyof typeof CHEQUES_STATUS_COLORS] || "gray"}
                                    className="mt-2"
                                >
                                    {c.paymentStatus}
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
                                                        `/app/cheque-payments/view-cheque-payment/${c._id}`
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
                                                    c.paymentStatus !==
                                                    "PENDING"
                                                }
                                                onClick={() => {
                                                    navigate(
                                                        `/app/cheque-payments/edit-cheque-payment/${c._id}`
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
                                                c.chequeStatus !==
                                                    "RETURNED" && (
                                                    <>
                                                        <Menu.Item
                                                            color="green"
                                                            onClick={() =>
                                                                chequePaymentStatusUpdate(
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
                                                            <span>
                                                                Completed
                                                            </span>
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            color="red"
                                                            onClick={() =>
                                                                chequePaymentStatusUpdate(
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
                                                            <span>
                                                                Returned
                                                            </span>
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
                <Group my="md" ms="md" px="lg" justify="flex-end">
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
        </>
    );
};

export default ChequePayments;
