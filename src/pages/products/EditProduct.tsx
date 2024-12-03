import { IconArrowLeft } from "@tabler/icons-react";
import { Button, NumberInput, TextInput } from "@mantine/core";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import {
    getProduct,
    updateProduct,
} from "../../store/productSlice/productSlice.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { isNotEmpty, useForm } from "@mantine/form";
import toNotify from "../../helpers/toNotify.tsx";

interface productEditValues {
    name: string,
    productCode: string,
    size: string,
    unitPrice: number,
}

const EditProduct = () => {
    const navigate = useNavigate();
    const { setLoading } = useLoading();
    const id = useParams().id;
    const dispatch = useDispatch<AppDispatch | any>();
    const selectedProduct = useSelector(
        (state: RootState) => state.product.selectedProduct
    );

    useEffect(() => {
        fetchProduct();
    }, [dispatch, id]);

    useEffect(() => {
        productEditForm.setValues(selectedProduct);
        productEditForm.resetDirty();
    }, [selectedProduct]);

    const fetchProduct = async () => {
        setLoading(false);
        await dispatch(getProduct(id));
        setLoading(false);
    };

    const productEditForm = useForm<productEditValues>({
        mode: "uncontrolled",
        initialValues: {
            name: "",
            productCode: "",
            size: "",
            unitPrice: 0,
        },
        validate: {
            name: isNotEmpty("Product name is required"),
            productCode: isNotEmpty("Product code is required"),
            size: isNotEmpty("Product size is required"),
            unitPrice: (value) =>
                value > 0 ? null : "Product price must be greater than 0",
        },
    });

    const handleProductUpdate = async (
        values: typeof productEditForm.values
    ) => {
        setLoading(true);
        const response = await dispatch(updateProduct({ id, values }));
        if (response.type === "product/updateProduct/fulfilled") {
            setLoading(false);
            toNotify("Success", "Product updated successfully", "SUCCESS");
            navigate("/app/products");
        } else if (response.type === "product/updateProduct/rejected") {
            setLoading(false);
            toNotify("Error", `${response.payload.error}`, "ERROR");
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
            <div className="items-center flex flex-row justify-between p-4">
                <div className="flex flex-row items-center">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <span className="text-lg font-semibold ml-4">
                        Edit Product
                    </span>
                </div>
            </div>
            <div className="mx-4 my-4 lg:w-1/2">
                <form onSubmit={productEditForm.onSubmit(handleProductUpdate)}>
                    <TextInput
                        label="Product Name"
                        withAsterisk
                        placeholder="Enter Product Name"
                        key={productEditForm.key("name")}
                        {...productEditForm.getInputProps("name")}
                    />
                    <TextInput
                        label="Product Code"
                        withAsterisk
                        placeholder="Enter Product Code"
                        key={productEditForm.key("productCode")}
                        {...productEditForm.getInputProps("productCode")}
                    />
                    <TextInput
                        label="Size"
                        placeholder="Enter Product Size"
                        withAsterisk
                        rightSection={"KG"}
                        key={productEditForm.key("size")}
                        {...productEditForm.getInputProps("size")}
                    />
                    <NumberInput
                        label="Unit Price"
                        placeholder="Enter Product Price"
                        withAsterisk
                        decimalSeparator="."
                        decimalScale={2}
                        fixedDecimalScale
                        hideControls
                        type="text"
                        allowNegative={false}
                        prefix="Rs."
                        key={productEditForm.key("unitPrice")}
                        {...productEditForm.getInputProps("unitPrice")}
                    />
                    <div className="mt-4 flex justify-end">
                        <Button size="xs" color="dark" type="submit" disabled={!productEditForm.isDirty()}>
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditProduct;
