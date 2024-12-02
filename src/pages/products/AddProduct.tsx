import { IconArrowLeft } from "@tabler/icons-react";
import { Button, TextInput } from "@mantine/core";

const AddProduct = () => {
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
                <form>
                    <TextInput
                        label="Product Name"
                        withAsterisk
                        placeholder="Enter Product Name"
                    />
                    <TextInput
                        label="Product Code"
                        withAsterisk
                        placeholder="Enter Product Code"
                    />
                    <TextInput
                        label="Size"
                        placeholder="Enter Product Size"
                        rightSection={"KG"}
                    />
                    <TextInput
                        label="Unit Price"
                        placeholder="Enter Product Price"
                        leftSection={"Rs."}
                    />
                    <div className="mt-4 flex justify-end">
                        <Button size="xs" color="dark">
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddProduct;
