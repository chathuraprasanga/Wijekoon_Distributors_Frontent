import { Button, TextInput } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

const AddCheque = () => {
    return (
        <>
            <div className="items-center flex flex-row justify-between p-4">
                <div className="flex flex-row items-center">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <span className="text-lg font-semibold ml-4">
                        Add Cheque
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
                        label="Cheque Number"
                        placeholder="Enter Branch Code"
                    />
                    <TextInput
                        label="Bank"
                        withAsterisk
                        placeholder="Enter Customer Bank Name"
                    />
                    <TextInput
                        label="Branch"
                        placeholder="Enter Customer Bank Branch Code"
                    />
                    <TextInput
                        label="Cheque Amount"
                        placeholder="Enter Cheque Amount"
                    />
                    <TextInput
                        label="Deposit Date"
                        placeholder="Enter Deposit Date"
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

export default AddCheque;
