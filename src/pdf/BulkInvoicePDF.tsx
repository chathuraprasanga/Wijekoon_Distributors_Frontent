import { Box, Flex, Grid, Group, Table, Text, Divider } from "@mantine/core";
import logo from "../assets/logo1.png";
import { amountPreview, datePreview } from "../helpers/preview.tsx";
import React, { useMemo } from "react";

const BulkInvoicePDF = ({data}:any) => {
    console.log("data", data);

    const amount = useMemo(() => {
        return data?.invoices?.reduce((acc: any, i: any) => acc + i.amount, 0);
    }, [data.invoices]);

    const invoices = data.invoices;
    const invoiceAmount = invoices?.reduce(
        (total: number, i: any) => total + i.amount,
        0
    );
    const customerCheques = data.customerCheques;
    const customerChequeAmount = customerCheques?.reduce(
        (total: number, i: any) => total + i.amount,
        0
    );
    const createdCheques = data.createdCheques;
    const createdChequeAmount = createdCheques?.reduce(
        (total: number, i: any) => total + i.amount,
        0
    );
    const addedCash = data.addedCash;
    const addedCashAmount = addedCash?.reduce(
        (total: number, i: any) => total + i.note * i.count,
        0
    );

    return (
        <>
            <div className="w-full h-full py-10 px-16" id="pdf">
                {/* Header Section */}
                <Grid>
                    <Grid.Col span="auto">
                        <Group>
                            <Box>
                                <img
                                    src={logo}
                                    alt="Company Logo"
                                    className="h-24 w-auto"
                                />
                            </Box>
                            <Box>
                                <Text fw={700} size="xl">
                                    WIJEKOON DISTRIBUTORS
                                </Text>
                                <Text size="sm" color="dimmed">
                                    BOI Junction, Mawathagama.
                                </Text>
                                <Text size="sm" color="dimmed">
                                    wijekoondistributor@gmail.com
                                </Text>
                                <Text size="sm" color="dimmed">
                                    +94 77 41 39 758
                                </Text>
                            </Box>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span="auto">
                        <Box style={{ textAlign: "right" }}>
                            <Text fw={700} size="xl" color="blue">
                                BULK INVOICE PAYMENT
                            </Text>
                        </Box>
                    </Grid.Col>
                </Grid>

                <Divider my="md" />

                {/* Supplier and Payment Details */}
                <Grid mx="md">
                    <Grid.Col span="auto">
                        <Text fw={500} size="lg">
                            Supplier:
                        </Text>
                        <Text>{data?.supplier?.name}</Text>
                        <Text>{data?.supplier?.address}</Text>
                        <Text>{data?.supplier?.email}</Text>
                        <Text>{data?.supplier?.phone}</Text>
                    </Grid.Col>
                    <Grid.Col span="auto">
                        <Flex direction="column" align="flex-end" gap="xs">
                            <Flex justify="flex-end">
                                <Text fw={600}>Payment ID:</Text>
                                <Text ml="md">{data?.paymentId}</Text>
                            </Flex>
                            <Flex justify="flex-end">
                                <Text fw={600}>Date:</Text>
                                <Text ml="md">
                                    {datePreview(data?.createdAt)}
                                </Text>
                            </Flex>
                            <Flex justify="flex-end">
                                <Text fw={600}>Amount:</Text>
                                <Text ml="md">{amountPreview(amount)}</Text>
                            </Flex>
                        </Flex>
                    </Grid.Col>
                </Grid>

                <Divider my="md" />

                {/* Invoice Table */}
                <Table striped highlightOnHover withTableBorder>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Item</Table.Th>
                            <Table.Th>Amount</Table.Th>
                            <Table.Th>Amount</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {/* Invoices Section */}
                        <Table.Tr>
                            <Table.Td
                                colSpan={3}
                                className="text-center font-bold"
                            >
                                Invoices
                            </Table.Td>
                        </Table.Tr>
                        {invoices?.map((i: any, idx: any) => (
                            <Table.Tr key={idx}>
                                <Table.Td>{i.invoiceNumber}</Table.Td>
                                <Table.Td className="text-right">
                                    {amountPreview(i.amount)}
                                </Table.Td>
                                <Table.Td></Table.Td>
                            </Table.Tr>
                        ))}
                        <Table.Tr>
                            <Table.Td className="font-bold">
                                Total Invoices Amount
                            </Table.Td>
                            <Table.Td></Table.Td>
                            <Table.Td className="font-bold text-right">
                                {amountPreview(invoiceAmount)}
                            </Table.Td>
                        </Table.Tr>

                        {/* Dynamic Iteration for Sections */}
                        {[
                            {
                                title: "Customer Cheques",
                                data: customerCheques,
                                total: customerChequeAmount,
                            },
                            {
                                title: "Company Cheques",
                                data: createdCheques,
                                total: createdChequeAmount,
                            },
                            {
                                title: "Cash",
                                data: addedCash,
                                total: addedCashAmount,
                            },
                        ].map((section, idx) => (
                            <React.Fragment key={idx}>
                                <Table.Tr>
                                    <Table.Td
                                        colSpan={3}
                                        className="text-center font-bold"
                                    >
                                        {section.title}
                                    </Table.Td>
                                </Table.Tr>
                                {section.data?.map((item: any, idx: any) => (
                                    <Table.Tr key={idx}>
                                        <Table.Td>
                                            {item.number ||
                                                `${amountPreview(item.note)} * ${item.count}`}
                                        </Table.Td>
                                        <Table.Td className="text-right">
                                            {amountPreview(
                                                item.amount ||
                                                    item.note * item.count
                                            )}
                                        </Table.Td>
                                        <Table.Td></Table.Td>
                                    </Table.Tr>
                                ))}
                                <Table.Tr>
                                    <Table.Td className="font-bold">
                                        Total {section.title}
                                    </Table.Td>
                                    <Table.Td></Table.Td>
                                    <Table.Td className="font-bold text-right">
                                        {amountPreview(section.total)}
                                    </Table.Td>
                                </Table.Tr>
                            </React.Fragment>
                        ))}

                        {/* Final Balance */}
                        <Table.Tr>
                            <Table.Td className="font-bold text-lg">
                                Balance
                            </Table.Td>
                            <Table.Td></Table.Td>
                            <Table.Td className="font-bold text-lg text-right text-red-600">
                                {amountPreview(
                                    invoiceAmount -
                                        (customerChequeAmount +
                                            createdChequeAmount +
                                            addedCashAmount)
                                )}
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>

                <Divider my="md" />

                {/* Notes */}
                <Box>
                    <Text fw={600} size="md">
                        Notes:
                    </Text>
                    <Text>{data?.notes}</Text>
                </Box>

                <br />

                {/* Signature Section */}
                <Flex justify="flex-end" mt="lg">
                    <Box>
                        <Divider my="sm" w={150} />
                        <Text fw={600} size="sm" ta="right">
                            Authorized Signature
                        </Text>
                    </Box>
                </Flex>

                <br />

                {/* Terms & Conditions */}
                <Box>
                    <Text fw={600} size="md">
                        Terms & Conditions:
                    </Text>
                    <Text size="sm" color="dimmed">
                        1. Payment should be made within the agreed credit
                        period.
                    </Text>
                    <Text size="sm" color="dimmed">
                        2. Any discrepancies should be reported within 7 days.
                    </Text>
                    <Text size="sm" color="dimmed">
                        3. Late payments may be subject to additional charges.
                    </Text>
                    <Text size="sm" color="dimmed">
                        4. This invoice serves as a legal document for all
                        financial transactions.
                    </Text>
                </Box>
            </div>
        </>
    );
};

export default BulkInvoicePDF;
