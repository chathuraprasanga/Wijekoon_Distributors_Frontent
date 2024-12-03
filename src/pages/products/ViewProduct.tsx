import { IconArrowLeft } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Badge, Card } from "@mantine/core";
import { getProduct } from "../../store/productSlice/productSlice.ts";

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
            <div className="items-center flex flex-row justify-between p-4">
                <div className="flex flex-row items-center">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <span className="text-lg font-semibold ml-4">
                        View Product
                    </span>
                </div>
            </div>
            <div className="mx-4 my-4 lg:w-1/2">
                <Card shadow="md" withBorder>
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
                        <div>Rs. {product?.unitPrice?.toFixed(2)}</div>
                    </div>
                    <div className="flex items-end mt-4">
                        <Badge
                            color={product?.status ? "green" : "red"}
                            radius="sm"
                        >
                            {product?.status ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default ViewProduct;
