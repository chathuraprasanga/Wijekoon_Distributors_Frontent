import { Badge, Box, Button, Group, Table, Text } from "@mantine/core";
import { IconArrowLeft, IconFile } from "@tabler/icons-react";
import { useLoading } from "../../../helpers/loadingContext.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store.ts";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import {
    DOWNLOAD_TYPES, ORDER_STATUS_COLORS,
} from "../../../helpers/types.ts";
import { amountPreview, datePreview } from "../../../helpers/preview.tsx";
import { useMediaQuery } from "@mantine/hooks";
import { getOrder } from "../../../store/orderSlice/orderSlice.ts";

const ViewOrder = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const navigate = useNavigate();
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const id: any = useParams().id ?? null;
    const order = useSelector(
        (state: RootState) => state.orders.selectedSalesOrder
    );

    useEffect(() => {
        if (id) {
            fetchSelectedOrder();
        }
    }, [dispatch]);

    const fetchSelectedOrder = async () => {
        setLoading(true);
        await dispatch(getOrder(id));
        setLoading(false);
    };

    const gotoPdfView = (data: any) => {
        navigate("/app/pdf/view", {
            state: { data: data, type: DOWNLOAD_TYPES.ORDER },
        });
    };

    return (
        <>
            <Group p="lg" display="flex" justify="space-between" align="center">
                <Group display="flex">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <Text size="lg" fw={500} ml={"md"}>
                        View Order
                    </Text>
                </Group>
                <Group>
                    <Button
                        size="xs"
                        leftSection={<IconFile size={16} />}
                        onClick={() => gotoPdfView(order)}
                        disabled={isMobile}
                    >
                        PDF View
                    </Button>
                </Group>
            </Group>

            <Box
                display="flex"
                p="lg"
                w={{ sm: "100%", lg: "75%" }}
                className="justify-between"
            >
                <Table
                    withTableBorder={false}
                    withRowBorders={false}
                    withColumnBorders={false}
                >
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td w={{ lg: "30%", sm: "50%" }} fw={600}>
                                Order Id:
                            </Table.Td>
                            <Table.Td w={{ lg: "70%", sm: "50%" }}>
                                {order?.orderId}
                            </Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td fw={600}>Customer:</Table.Td>
                            <Table.Td>{order?.customer?.name}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td fw={600}>Wxpected Date:</Table.Td>
                            <Table.Td>
                                {datePreview(order?.expectedDate)}
                            </Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td fw={600}>Amount:</Table.Td>
                            <Table.Td>
                                {amountPreview(
                                    order?.orderDetails?.reduce((acc:any, o:any) => acc + o.lineTotal, 0)
                                )}
                            </Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td fw={600}>Payment Status:</Table.Td>
                            <Table.Td>
                                <Badge
                                    radius="xs"
                                    size="sm"
                                    color={
                                        ORDER_STATUS_COLORS[
                                            order?.orderStatus as keyof typeof ORDER_STATUS_COLORS
                                        ] || "gray"
                                    }
                                >
                                    {order?.orderStatus}
                                </Badge>
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Box>

            <Box px={"lg"} pb="lg" w={{ sm: "100%", lg: "75%" }}>
                <Table
                    withTableBorder
                    withColumnBorders
                    highlightOnHover
                    striped
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th w="20">Product</Table.Th>
                            <Table.Th w="15">Size</Table.Th>
                            <Table.Th w="20">Unit Price</Table.Th>
                            <Table.Th w="20">Quantity</Table.Th>
                            <Table.Th w="25">Amount</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {order?.orderDetails?.map((o: any, i: number) => (
                            <Table.Tr key={i}>
                                <Table.Td>{o?.product?.name}</Table.Td>
                                <Table.Td>{o?.product?.size} KG</Table.Td>
                                <Table.Td>
                                    {amountPreview(o?.product?.unitPrice)}
                                </Table.Td>
                                <Table.Td>{o?.amount}</Table.Td>
                                <Table.Td>
                                    {amountPreview(o?.lineTotal)}
                                </Table.Td>
                            </Table.Tr>
                        ))}
                        <Table.Tr fw={600}>
                            <Table.Td colSpan={5}>
                                Notes: {order?.notes}
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Box>
        </>
    );
};

export default ViewOrder;
