import {
    Box,
    Button,
    Card,
    Group,
    Modal,
    MultiSelect,
    NumberInput,
    Table,
    Text,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getWarehouse } from "../../store/warehouseSlice/warehouseSlice.ts";
import { amountPreview } from "../../helpers/preview.tsx";
import { useDisclosure } from "@mantine/hooks";
import { getProducts } from "../../store/productSlice/productSlice.ts";

const ViewWarehouse = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const id: any = useParams().id ?? null;
    const warehouse = useSelector(
        (state: RootState) => state.warehouses.selectedWarehouse
    );
    const selectableProducts = warehouse.products.filter(
        (p: any) => p.product.status === true
    );

    const productData = selectableProducts.map((p: any) => ({
        label: p.product.name,
        value: p._id,
    }));

    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    console.log("selectedProducts", selectedProducts);

    const [stockUpdateModalOpened, handleStockUpdateModal] =
        useDisclosure(false);
    const [products, setProducts] = useState<any[]>([]);
    console.log("products", products);

    useEffect(() => {
        if (id) {
            fetchSelectedWarehouse();
        }
    }, [dispatch]);

    const fetchSelectedWarehouse = async () => {
        setLoading(true);
        await dispatch(getWarehouse(id));
        const response = await dispatch(
            getProducts({ filters: { status: true } })
        );
        setProducts(response.payload.result);
        setLoading(false);
    };

    const stockUpdateModal = () => {
        return (
            <Modal
                opened={stockUpdateModalOpened}
                onClose={handleStockUpdateModal.close}
                title={<Text size="lg">Stock Update</Text>}
                size="sm"
            >
                <div>
                    <MultiSelect
                        data={productData}
                        size="xs"
                        label="Selected Products"
                        onChange={(value: any) => setSelectedProducts(value)}
                    />
                </div>
                <form className="mt-4">
                    <div>
                        {selectedProducts?.map((p: any, i: any) => (
                            <div key={i} className="flex flex-row">
                                <div className="w-1/2">{p.name}</div>
                                <div className="w-1/2">
                                    <NumberInput size="xs" hideControls />
                                </div>
                            </div>
                        ))}
                        <Button mt="md" fullWidth>
                            Submit
                        </Button>
                    </div>
                </form>
            </Modal>
        );
    };

    return (
        <>
            <Group p="lg" display="flex" justify="space-between" align="center">
                <Group display="flex">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <Text size="lg" fw={500} ml="md">
                        {warehouse?.id} {warehouse?.city}
                    </Text>
                </Group>
                <Group>
                    <Button
                        size="xs"
                        onClick={handleStockUpdateModal.open}
                        disabled
                    >
                        Update Stocks
                    </Button>
                </Group>
            </Group>

            <Box mx="md" my="md">
                <Card shadow="md" withBorder w={{ sm: "100%", lg: "50%" }}>
                    <div>
                        <Text fw="bold">Warehouse Details</Text>
                    </div>
                    <div className="mt-4">
                        <div className="flex flex-row">
                            <div className="hidden lg:block lg:w-1/4">
                                Warehouse Id:
                            </div>
                            <div>{warehouse?.id}</div>
                        </div>
                        <div className="flex flex-row">
                            <div className="hidden lg:block lg:w-1/4">
                                City:
                            </div>
                            <div>{warehouse?.city}</div>
                        </div>
                    </div>
                </Card>
            </Box>

            <Box mx="md" my="md">
                <Card shadow="md" withBorder w={{ sm: "100%", lg: "50%" }}>
                    <div>
                        <Text fw="bold">Product Details</Text>
                    </div>
                    <div className="mt-4">
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Product</Table.Th>
                                    <Table.Th>Amount</Table.Th>
                                    <Table.Th>Price</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {warehouse?.products?.length > 0 &&
                                    warehouse?.products.map(
                                        (p: any, i: any) => (
                                            <Table.Tr key={i}>
                                                <Table.Td>
                                                    {p?.product?.name}
                                                </Table.Td>
                                                <Table.Td>{p?.count}</Table.Td>
                                                <Table.Td>
                                                    {amountPreview(
                                                        p?.product.unitPrice
                                                    )}
                                                </Table.Td>
                                            </Table.Tr>
                                        )
                                    )}
                            </Table.Tbody>
                        </Table>
                    </div>
                </Card>
            </Box>
            {stockUpdateModal()}
        </>
    );
};

export default ViewWarehouse;
