import { IconArrowLeft } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Badge, Box, Card, Flex, Group, Text,Stack } from "@mantine/core";
import { getProduct } from "../../store/productSlice/productSlice.ts";
import { amountPreview } from "../../helpers/preview.tsx";
import { BASIC_STATUS_COLORS } from "../../helpers/types.ts";

const ViewProduct = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const id: any = useParams().id ?? null;
    const product = useSelector(
        (state: RootState) => state.product.selectedProduct
    );

    useEffect(() => {
        if (id) {
            fetchSelectedProduct();
        }
    }, [dispatch]);

    const fetchSelectedProduct = async () => {
        setLoading(true);
        await dispatch(getProduct(id));
        setLoading(false);
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
                        View Product
                    </Text>
                </Group>
            </Group>
            <Box mx="md" my="md">
                <Card shadow="md" withBorder w={{ base: "100%", lg: "50%" }}>
                    <Stack gap={"xs"}>
                        <Flex justify="space-between" wrap="wrap">
                            <Text w={{ base: "100%", sm: "25%" }} fw={500}>Name:</Text>
                            <Text>{product?.name}</Text>
                        </Flex>

                        <Flex justify="space-between" wrap="wrap">
                            <Text w={{ base: "100%", sm: "25%" }} fw={500}>Supplier:</Text>
                            <Text>{product?.supplier?.name || "-"}</Text>
                        </Flex>

                        <Flex justify="space-between" wrap="wrap">
                            <Text w={{ base: "100%", sm: "25%" }} fw={500}>Code:</Text>
                            <Text>{product?.productCode}</Text>
                        </Flex>

                        <Flex justify="space-between" wrap="wrap">
                            <Text w={{ base: "100%", sm: "25%" }} fw={500}>Size:</Text>
                            <Text>{product?.size} KG</Text>
                        </Flex>

                        <Flex justify="space-between" wrap="wrap">
                            <Text w={{ base: "100%", sm: "25%" }} fw={500}>Selling Price:</Text>
                            <Text>{amountPreview(product?.unitPrice)}</Text>
                        </Flex>

                        <Flex justify="space-between" wrap="wrap">
                            <Text w={{ base: "100%", sm: "25%" }} fw={500}>Buying Price:</Text>
                            <Text>{amountPreview(product?.buyingPrice)}</Text>
                        </Flex>

                        <Flex justify="flex-start" mt="sm">
                            <Badge
                                color={
                                    BASIC_STATUS_COLORS[product?.status as keyof typeof BASIC_STATUS_COLORS] || "gray"
                                }
                                radius="xs"
                                size="sm"
                            >
                                {product?.status ? "ACTIVE" : "INACTIVE"}
                            </Badge>
                        </Flex>
                    </Stack>
                </Card>
            </Box>
        </>
    );
};

export default ViewProduct;
