import { IconArrowLeft } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Badge, Box, Card, Group, Text } from "@mantine/core";
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
                <Card shadow="md" withBorder w={{sm: "100%", lg: "50%"}} >
                    <div className="flex flex-row">
                        <div className="w-1/4">Name:</div>
                        <div>{product?.name}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="w-1/4">Code:</div>
                        <div>{product?.productCode}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="w-1/4">Size:</div>
                        <div>{product?.size} KG</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="w-1/4">Unit Price:</div>
                        <div>{amountPreview(product?.unitPrice)}</div>
                    </div>
                    <div className="flex items-end mt-4">
                        <Badge
                            color={BASIC_STATUS_COLORS[product.status as keyof typeof BASIC_STATUS_COLORS] || "gray"}
                            radius="xs"
                            size="sm"
                        >
                            {product?.status ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                    </div>
                </Card>
            </Box>
        </>
    );
};

export default ViewProduct;
