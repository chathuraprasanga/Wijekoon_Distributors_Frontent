import { Box, Divider, Flex, Grid, Group, Table, Text } from "@mantine/core";
import logo from "../assets/logo1.png";
import { amountPreview, datePreview } from "../helpers/preview.tsx";

const OrderPDF = ({ data }: any) => {
    console.log("data", data);

    const amount = data?.orderDetails?.reduce(
        (acc: number, o: { lineTotal: number }) => acc + o.lineTotal,
        0
    );


    const orderDetails = data.orderDetails;
    // const amountDetails = data.amountDetails;
    // const payments = data.metadata.paymets;
    const customer = data.customer;

    return (
        <>
            <div className="w-full h-full py-10 px-16 bg-white" id="pdf">
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
                                <Text fw={700} size="xl" c="black">
                                    WIJEKOON DISTRIBUTORS
                                </Text>
                                <Text size="sm" c="dimmed">
                                    BOI Junction, Mawathagama.
                                </Text>
                                <Text size="sm" c="dimmed">
                                    wijekoondistributor@gmail.com
                                </Text>
                                <Text size="sm" c="dimmed">
                                    +94 77 41 39 758
                                </Text>
                            </Box>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span="auto">
                        <Box style={{ textAlign: "right" }}>
                            <Text fw={700} size="xl" c="blue">
                                PURCHASE ORDER
                            </Text>
                        </Box>
                    </Grid.Col>
                </Grid>

                <Divider my="md" />

                {/* Supplier and Payment Details */}
                <Grid mx="md">
                    <Grid.Col span="auto">
                        <Text fw={500} size="lg" c="black">
                            Customer:
                        </Text>
                        <Text c="black">{customer?.name}</Text>
                        <Text c="black">{customer?.address}</Text>
                        <Text c="black">{customer?.email}</Text>
                        <Text c="black">{customer?.phone}</Text>
                    </Grid.Col>
                    <Grid.Col span="auto">
                        <Flex direction="column" align="flex-end" gap="xs">
                            <Flex justify="flex-end">
                                <Text fw={600} c="black">
                                    Sales Record ID:
                                </Text>
                                <Text ml="md" c="black">
                                    {data?.orderId}
                                </Text>
                            </Flex>
                            <Flex justify="flex-end">
                                <Text fw={600} c="black">
                                    Date:
                                </Text>
                                <Text ml="md" c="black">
                                    {datePreview(data?.createdAt)}
                                </Text>
                            </Flex>
                            <Flex justify="flex-end">
                                <Text fw={600} c="black">
                                    Amount:
                                </Text>
                                <Text ml="md" c="black">
                                    {amountPreview(amount)}
                                </Text>
                            </Flex>
                        </Flex>
                    </Grid.Col>
                </Grid>

                <Divider my="md" />

                {/* Invoice Table */}
                <Table
                    withTableBorder
                    withColumnBorders
                    withRowBorders
                    c="black"
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Product</Table.Th>
                            <Table.Th>Product Code</Table.Th>
                            <Table.Th>Size</Table.Th>
                            <Table.Th>Unit Price</Table.Th>
                            <Table.Th>Quantity</Table.Th>
                            <Table.Th>Line Total</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {orderDetails?.map((o: any, i: number) => (
                            <Table.Tr key={i}>
                                <Table.Td>{o?.product?.name}</Table.Td>
                                <Table.Td>{o?.product?.productCode}</Table.Td>
                                <Table.Td>{o?.product?.size} KG</Table.Td>
                                <Table.Td>
                                    {amountPreview(o?.product?.unitPrice)}
                                </Table.Td>
                                <Table.Td>{o?.amount} Bags</Table.Td>
                                <Table.Td>
                                    {amountPreview(o?.lineTotal)}
                                </Table.Td>
                            </Table.Tr>
                        ))}
                        <Table.Tr>
                            <Table.Td colSpan={4}></Table.Td>
                            <Table.Td>Sub total: </Table.Td>
                            <Table.Td>
                                {amountPreview(amount)}
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>

                <Divider my="md" />

                {/* Notes */}
                <Box>
                    <Text fw={600} size="md" c="black">
                        Notes:
                    </Text>
                    <Text c="black">{data?.notes}</Text>
                </Box>

                <br />

                {/* Signature Section */}
                <Flex justify="flex-end" mt="lg" c="black">
                    <Box>
                        <Divider my="sm" w={150} />
                        <Text fw={600} size="sm" ta="right">
                            Authorized Signature
                        </Text>
                    </Box>
                </Flex>

                <br />

                {/* Terms & Conditions */}
                <Box c="black">
                    <Text fw={600} size="md">
                        Terms & Conditions:
                    </Text>
                    <Text size="sm" c="dimmed">
                        1. Payment should be made within the agreed credit
                        period.
                    </Text>
                    <Text size="sm" c="dimmed">
                        2. Any discrepancies should be reported within 7 days.
                    </Text>
                    <Text size="sm" c="dimmed">
                        3. Discounts and Taxes may added when create sales record.
                    </Text>
                    <Text size="sm" c="dimmed">
                        4. This invoice serves as a legal document for all
                        financial transactions.
                    </Text>
                </Box>
            </div>
        </>
    );
};

export default OrderPDF;
