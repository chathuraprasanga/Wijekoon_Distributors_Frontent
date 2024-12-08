import { IconArrowLeft } from "@tabler/icons-react";
import {
    Button,
    NumberInput,
    TextInput,
    Group,
    Text,
    Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useLoading } from "../../helpers/loadingContext.tsx";
import toNotify from "../../helpers/toNotify.tsx";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { AppDispatch } from "../../store/store.ts";
import { addProduct } from "../../store/productSlice/productSlice.ts";

const AddProduct = () => {
    const {setLoading} = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();

    const productAddForm = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: "",
            productCode: "",
            size: 0,
            unitPrice: 0.00,
        },
        validate: {
            name: (value) => (value.trim() ? null : "Product name is required"),
            productCode: (value) => (value.trim() ? null : "Product code is required"),
            size: (value) => (value > 0 ? null : "Product size must be greater than 0 KG"),
            unitPrice: (value) =>
                value > 0 ? null : "Product price must be greater than Rs. 0",
        },
    });

    const handleProductAdd = async(values: typeof productAddForm.values) => {
        setLoading(true);
        const response = await dispatch(addProduct(values));
        console.log(response);
        if (response.type === "product/addProduct/fulfilled"){
            setLoading(false);
            toNotify("Success", "Product added successfully", "SUCCESS");
            navigate("/app/products");
        } else if (response.type === "product/addProduct/rejected"){
            setLoading(false);
            toNotify("Error", `${response.payload.error}`, "ERROR");
        } else {
            setLoading(false);
            toNotify("Something went wrong", `Please contact system admin`, "WARNING");
        }
    }

    return (
        <>
            <Group p="lg" display="flex" justify="space-between" align="center">
                <Group display="flex">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <Text fw={500} ml="md" size="lg">
                        Add Product
                    </Text>
                </Group>
            </Group>
            <Box w={{  sm: "100%", lg: "50%" }} px="lg">
                <form onSubmit={productAddForm.onSubmit(handleProductAdd)}>
                    <TextInput
                        label="Product Name"
                        withAsterisk
                        placeholder="Enter Product Name"
                        key={productAddForm.key("name")}
                        {...productAddForm.getInputProps("name")}
                    />
                    <TextInput
                        label="Product Code"
                        withAsterisk
                        placeholder="Enter Product Code"
                        key={productAddForm.key("productCode")}
                        {...productAddForm.getInputProps("productCode")}
                    />
                    <NumberInput
                        label="Size"
                        placeholder="Enter Product Size"
                        withAsterisk
                        hideControls
                        allowNegative={false}
                        rightSection={"KG"}
                        key={productAddForm.key("size")}
                        {...productAddForm.getInputProps("size")}
                    />
                    <NumberInput
                        label="Unit Price"
                        placeholder="Enter Product Price"
                        withAsterisk
                        decimalSeparator="."
                        decimalScale={2}
                        fixedDecimalScale
                        hideControls
                        allowNegative={false}
                        prefix="Rs."
                        key={productAddForm.key("unitPrice")}
                        {...productAddForm.getInputProps("unitPrice")}
                    />
                    <Group justify="flex-end" display="flex" pb="md" mt="md">
                        <Button size="xs" color="dark" type="submit">
                            Submit
                        </Button>
                    </Group>
                </form>
            </Box>
        </>
    );
};

export default AddProduct;
