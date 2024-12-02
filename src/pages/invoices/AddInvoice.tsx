import { IconArrowLeft } from "@tabler/icons-react";
import { Button, TextInput } from "@mantine/core";

const AddInvoice = () => {
    return (
        <>
            <div className="items-center flex flex-row justify-between p-4">
                <div className="flex flex-row items-center">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <span className="text-lg font-semibold ml-4">
                        Add Invoice
                    </span>
                </div>
            </div>
            <div className="mx-4 my-4 lg:w-1/2">
                <form>
                    <TextInput
                        label="Supplier"
                        withAsterisk
                        placeholder="Enter Supplier Name"
                    />
                    <TextInput
                        label="Invoice Date"
                        withAsterisk
                        placeholder="Enter Invoice Date"
                    />
                    <TextInput
                        label="Invoice Number"
                        placeholder="Enter Invoice Number"
                    />
                    <TextInput
                        label="Amount"
                        placeholder="Enter Invoice Amount"
                        leftSection={"Rs. "}
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

export default AddInvoice;
