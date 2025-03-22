import {
    Box,
    Button,
    Card,
    Chip,
    Group,
    Modal,
    NumberInput,
    Table,
    Text,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import {
    getWarehouse,
    updateStockDetailsForWarehouse,
} from "../../store/warehouseSlice/warehouseSlice.ts";
import { amountPreview } from "../../helpers/preview.tsx";
import { useDisclosure } from "@mantine/hooks";
import toNotify from "../../helpers/toNotify.tsx";
import { hasAnyPrivilege } from "../../helpers/previlleges.ts";
import { USER_ROLES } from "../../helpers/types.ts";

const ViewWarehouse = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const id: any = useParams().id ?? null;
    const warehouse = useSelector(
        (state: RootState) => state.warehouses.selectedWarehouse
    );
    const navigate = useNavigate();
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [stockUpdatedProducts, setStockUpdatedProducts] = useState<any[]>([]);
    const [stockUpdateModalOpened, handleStockUpdateModal] =
        useDisclosure(false);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const user = useSelector((state: RootState) => state.auth.user);
    const role = user.role;

    useEffect(() => {
        if (
            id &&
            hasAnyPrivilege(role, [
                USER_ROLES.ADMIN,
                USER_ROLES.SUPER_ADMIN,
                USER_ROLES.OWNER,
                USER_ROLES.WAREHOUSE_MANAGER,
                USER_ROLES.SALES_MANAGER,
                USER_ROLES.STOCK_KEEPER,
            ])
        ) {
            fetchSelectedWarehouse();
        }
    }, [dispatch]);

    useEffect(() => {
        if (warehouse) {
            const activeProducts = warehouse.products?.filter(
                (prod: any) => prod.product.status === true
            );
            setProducts(activeProducts);
        }
    }, [warehouse]);

    const fetchSelectedWarehouse = async () => {
        setLoading(true);
        await dispatch(getWarehouse(id));
        setLoading(false);
    };

    const handleChipClick = (product: any) => {
        const isSelected = selectedProducts.some((p) => p._id === product._id);

        if (isSelected) {
            // Remove product from selected list
            setSelectedProducts((prev) =>
                prev.filter((p) => p._id !== product._id)
            );
            setStockUpdatedProducts((prev) =>
                prev.filter((prod) => prod.id !== product._id)
            );
        } else {
            // Add product to selected list
            setSelectedProducts((prev) => [...prev, product]);
            setStockUpdatedProducts((prev) => [
                ...prev,
                { id: product._id, amount: 0 },
            ]);
        }
    };

    const stockUpdateModal = () => {
        // Check if at least one product has amount === 0
        const isSubmitDisabled = stockUpdatedProducts.some(
            (item) => item.amount === 0
        );

        return (
            <Modal
                opened={stockUpdateModalOpened}
                onClose={() => {
                    handleStockUpdateModal.close();
                    setSelectedProducts([]);
                    setStockUpdatedProducts([]); // Reset stock updates on close
                }}
                title={<Text size="lg">Stock Update</Text>}
                size="sm"
            >
                {/* Display Selectable Chips */}
                <div className="flex flex-row flex-wrap gap-2">
                    {products?.map((product: any) => (
                        <Chip
                            key={product._id}
                            style={{ margin: "4px" }}
                            checked={selectedProducts.some(
                                (p) => p._id === product._id
                            )}
                            onClick={() => handleChipClick(product)}
                        >
                            {product.product.name}
                        </Chip>
                    ))}
                </div>

                {/* Form for Stock Update */}
                <form className="mt-4">
                    <div>
                        {selectedProducts?.map((p: any, i: number) => {
                            const stockItem = stockUpdatedProducts.find(
                                (item) => item.id === p._id
                            );

                            return (
                                <div
                                    key={i}
                                    className="flex flex-row items-center gap-2"
                                >
                                    <div className="w-1/2">
                                        {p.product.name}
                                    </div>
                                    <div className="w-1/2">
                                        <NumberInput
                                            size="xs"
                                            hideControls
                                            mt="sm"
                                            allowNegative={false}
                                            value={stockItem?.amount ?? 0} // Ensure default value
                                            onChange={(value: any) => {
                                                setStockUpdatedProducts(
                                                    (prev) =>
                                                        prev.map((item) =>
                                                            item.id === p._id
                                                                ? {
                                                                      ...item,
                                                                      amount:
                                                                          value ||
                                                                          0,
                                                                  }
                                                                : item
                                                        )
                                                );
                                            }}
                                        />
                                        {stockItem?.amount === 0 && (
                                            <Text c="red" size="xs">
                                                Updated amount cannot be 0
                                            </Text>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        <Button
                            mt="md"
                            fullWidth
                            onClick={handleStockUpdate}
                            disabled={
                                isSubmitDisabled || selectedProducts.length < 1
                            }
                            loading={isLoading}
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </Modal>
        );
    };

    const handleStockUpdate = async () => {
        setIsLoading(true);
        try {
            const payload = { id: warehouse._id, values: stockUpdatedProducts };
            const response = await dispatch(
                updateStockDetailsForWarehouse(payload)
            );
            if (
                response.type ===
                "warehouse/updateStockDetailsForWarehouse/fulfilled"
            ) {
                toNotify("Success", "Stock updated successfully", "SUCCESS");
                fetchSelectedWarehouse();
                setStockUpdatedProducts([]);
                setSelectedProducts([]);
                handleStockUpdateModal.close();
            } else if (
                response.type ===
                "warehouse/updateStockDetailsForWarehouse/rejected"
            ) {
                toNotify("Error", "Stock updated successfully", "ERROR");
            } else {
                toNotify("Warning", "Please contact system admin", "WARNING");
                setStockUpdatedProducts([]);
                setSelectedProducts([]);
                handleStockUpdateModal.close();
            }
        } catch (e) {
            console.error(e);
            toNotify("Warning", "Please contact system admin", "WARNING");
            setStockUpdatedProducts([]);
            setSelectedProducts([]);
            handleStockUpdateModal.close();
        } finally {
            setIsLoading(false);
        }
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
                        color="violet"
                        onClick={() =>
                            navigate(
                                `/app/sales-records/add-sales-record?warehouseId=${warehouse._id}`
                            )
                        }
                        disabled={
                            !hasAnyPrivilege(role, [
                                USER_ROLES.ADMIN,
                                USER_ROLES.SUPER_ADMIN,
                                USER_ROLES.OWNER,
                                USER_ROLES.WAREHOUSE_MANAGER,
                                USER_ROLES.STOCK_KEEPER,
                            ])
                        }
                    >
                        Sales
                    </Button>
                    <Button
                        size="xs"
                        onClick={handleStockUpdateModal.open}
                        disabled={
                            !hasAnyPrivilege(role, [
                                USER_ROLES.ADMIN,
                                USER_ROLES.SUPER_ADMIN,
                                USER_ROLES.OWNER,
                                USER_ROLES.WAREHOUSE_MANAGER,
                                USER_ROLES.STOCK_KEEPER,
                            ])
                        }
                    >
                        Update Stocks
                    </Button>
                </Group>
            </Group>

            <Box mx="md" my="md">
                <Card shadow="md" withBorder w={{ sm: "100%", lg: "50%" }}>
                    <Text fw="bold">Warehouse Details</Text>
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
                    <Text fw="bold">Product Details</Text>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Product</Table.Th>
                                <Table.Th>Amount</Table.Th>
                                <Table.Th>Unit Price</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {products?.map((p: any, i: number) => (
                                <Table.Tr key={i}>
                                    <Table.Td>{p?.product?.name}</Table.Td>
                                    <Table.Td>{p?.count}</Table.Td>
                                    <Table.Td>
                                        {amountPreview(p?.product.unitPrice)}
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Card>
            </Box>
            {stockUpdateModal()}
        </>
    );
};

export default ViewWarehouse;
