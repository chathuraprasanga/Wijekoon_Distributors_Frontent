import { IconArrowLeft } from "@tabler/icons-react";
import {
    Box,
    Button,
    Group,
    NumberInput,
    TextInput,
    Text, Select,
} from "@mantine/core";
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
import { getSuppliers } from "../../store/supplierSlice/supplierSlice.ts";

interface ProductEditValues {
    name: string;
    supplier:string,
    productCode: string;
    size: number;
    unitPrice: number;
    buyingPrice:number;
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
        fetchSuppliers();
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

    const suppliers = useSelector(
        (state: RootState) => state.supplier.suppliers
    );
    const selectableSuppliers = suppliers?.map((s: any) => ({
        label: s.name,
        value: s._id,
    }));

    const fetchSuppliers = async () => {
        const response = await dispatch(getSuppliers({ status: true }));
        console.log(response);
        if (response.type === "supplier/getSuppliers/fulfilled") {
            setLoading(false);
        } else if (response.type === "supplier/getSuppliers/rejected") {
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

    const productEditForm = useForm<ProductEditValues>({
        mode: "uncontrolled",
        initialValues: {
            name: "",
            supplier: "",
            productCode: "",
            size: 0,
            unitPrice: 0.0,
            buyingPrice: 0.0,
        },
        validate: {
            name: (value) => (value.trim() ? null : "Product name is required"),
            supplier: isNotEmpty("Supplier is required"),
            productCode: (value) =>
                value.trim() ? null : "Product code is required",
            size: (value) =>
                value > 0 ? null : "Product size must be greater than 0 KG",
            unitPrice: (value) =>
                value > 0 ? null : "Product selling price must be greater than Rs. 0",
            buyingPrice: (value) =>
                value > 0 ? null : "Product buying price must be greater than Rs. 0",
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
            <Group p="lg" display="flex" justify="space-between" align="center">
                <Group display="flex">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <Text size={"lg"} fw={500} ml={"md"}>
                        Edit Product
                    </Text>
                </Group>
            </Group>
            <Box w={{ sm: "100%", lg: "50%" }} px="lg">
                <form onSubmit={productEditForm.onSubmit(handleProductUpdate)}>
                    <TextInput
                        label="Product Name"
                        withAsterisk
                        placeholder="Enter Product Name"
                        key={productEditForm.key("name")}
                        {...productEditForm.getInputProps("name")}
                    />
                    <Select
                        label="Supplier"
                        withAsterisk
                        data={selectableSuppliers}
                        placeholder="Select Supplier"
                        key={productEditForm.key("supplier")}
                        {...productEditForm.getInputProps("supplier")}
                    />
                    <TextInput
                        label="Product Code"
                        withAsterisk
                        placeholder="Enter Product Code"
                        key={productEditForm.key("productCode")}
                        {...productEditForm.getInputProps("productCode")}
                    />
                    <NumberInput
                        label="Size"
                        placeholder="Enter Product Size"
                        withAsterisk
                        hideControls
                        allowNegative={false}
                        rightSection={"KG"}
                        key={productEditForm.key("size")}
                        {...productEditForm.getInputProps("size")}
                    />
                    <NumberInput
                        label="Selling Price"
                        placeholder="Enter Product Selling Price"
                        withAsterisk
                        decimalSeparator="."
                        decimalScale={2}
                        fixedDecimalScale
                        hideControls
                        allowNegative={false}
                        prefix="Rs."
                        thousandSeparator=","
                        key={productEditForm.key("unitPrice")}
                        {...productEditForm.getInputProps("unitPrice")}
                    />
                    <NumberInput
                        label="Buying Price"
                        placeholder="Enter Product Buying Price"
                        withAsterisk
                        decimalSeparator="."
                        decimalScale={2}
                        fixedDecimalScale
                        hideControls
                        allowNegative={false}
                        prefix="Rs."
                        thousandSeparator=","
                        key={productEditForm.key("buyingPrice")}
                        {...productEditForm.getInputProps("buyingPrice")}
                    />
                    <Group justify="flex-end" display="flex" pb="md" mt="md">
                        <Button
                            size="xs"
                            type="submit"
                            disabled={!productEditForm.isDirty()}
                        >
                            Submit
                        </Button>
                    </Group>
                </form>
            </Box>
        </>
    );
};

export default EditProduct;
