import { Button, Textarea, TextInput } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

const AddCustomer = () => {
    return (
        <>
            <div className="items-center flex flex-row justify-between p-4">
                <div className="flex flex-row items-center">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <span className="text-lg font-semibold ml-4">
                        Add Customer
                    </span>
                </div>
            </div>
            <div className="mx-4 my-4 lg:w-1/2">
                <form>
                    <TextInput
                        label="Name"
                        withAsterisk
                        placeholder="Enter Customer Name"
                    />
                    <TextInput
                        label="Phone"
                        withAsterisk
                        placeholder="Enter Customer Phone Number"
                    />
                    <TextInput
                        label="Email"
                        placeholder="Enter Customer Email"
                    />
                    <Textarea
                        label="Address"
                        placeholder="Enter Customer Address"
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

export default AddCustomer;
