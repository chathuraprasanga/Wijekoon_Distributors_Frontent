import { IconArrowLeft } from "@tabler/icons-react";
import { Button, NumberInput, TextInput } from "@mantine/core";
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
            size: "",
            unitPrice: 0.00,
        },
        validate: {
            name: (value) => (value.trim() ? null : "Product name is required"),
            productCode: (value) => (value.trim() ? null : "Product code is required"),
            size: (value) => (value.trim() ? null : "Product size is required"),
            unitPrice: (value) =>
                value > 0 ? null : "Product price must be greater than 0",
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
            <div className="items-center flex flex-row justify-between p-4">
                <div className="flex flex-row items-center">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <span className="text-lg font-semibold ml-4">
                        Add Product
                    </span>
                </div>
            </div>
            <div className="mx-4 my-4 lg:w-1/2">
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
                    <TextInput
                        label="Size"
                        placeholder="Enter Product Size"
                        withAsterisk
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
                    <div className="mt-4 flex justify-end">
                        <Button size="xs" color="dark" type="submit">
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddProduct;
