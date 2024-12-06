import { Button, NumberInput, TextInput } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store.ts";
import { useNavigate } from "react-router";
import { isNotEmpty, useForm } from "@mantine/form";
import toNotify from "../../helpers/toNotify.tsx";
import { addCheque } from "../../store/chequeSlice/chequeSlice.ts";

const AddCheque = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();

    const chequeAddForm = useForm({
        mode: "uncontrolled",
        initialValues: {
            customer: "",
            number: "",
            bank: "",
            branch: "",
            amount: 0,
            depositDate: "",
        },
        validate: {
            customer: isNotEmpty("Customer name is required"),
            number: isNotEmpty("Cheque number is required"),
            bank: isNotEmpty("Bank is required"),
            branch: isNotEmpty("Branch code is required"),
            amount: (value) => {
                if (!value) {
                    return "Amount is required";
                }
                if (value <= 0) {
                    return "Amount should be greater than 0";
                }
                return null;
            },
            depositDate: isNotEmpty("Deposit date is required"),
        },
    });

    const handleChequeAdd = async (values: typeof chequeAddForm.values) => {
        setLoading(true);
        const response = await dispatch(addCheque(values));
        if (response.type === "cheque/addCheque/fulfilled") {
            setLoading(false);
            toNotify("Success", "Cheque added successfully", "SUCCESS");
            navigate("/app/cheques");
        } else if (response.type === "cheque/addCheque/rejected") {
            const error: any = response.payload.error;
            setLoading(false);
            toNotify("Error", `${error}`, "ERROR");
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
                        Add Cheque
                    </span>
                </div>
            </div>
            <div className="mx-4 my-4 lg:w-1/2">
                <form onSubmit={chequeAddForm.onSubmit(handleChequeAdd)}>
                    <TextInput
                        label="Name"
                        withAsterisk
                        placeholder="Enter Customer Name"
                        key={chequeAddForm.key("customer")}
                        {...chequeAddForm.getInputProps("customer")}
                    />
                    <TextInput
                        label="Cheque Number"
                        placeholder="Enter Branch Code"
                        withAsterisk
                        key={chequeAddForm.key("number")}
                        {...chequeAddForm.getInputProps("number")}
                    />
                    <TextInput
                        label="Bank"
                        withAsterisk
                        placeholder="Enter Customer Bank Name"
                        key={chequeAddForm.key("bank")}
                        {...chequeAddForm.getInputProps("bank")}
                    />
                    <TextInput
                        label="Branch"
                        placeholder="Enter Customer Bank Branch Code"
                        withAsterisk
                        key={chequeAddForm.key("branch")}
                        {...chequeAddForm.getInputProps("branch")}
                    />
                    <NumberInput
                        hideControls
                        allowNegative={false}
                        withAsterisk
                        prefix="Rs. "
                        label="Cheque Amount"
                        decimalSeparator="."
                        decimalScale={2}
                        fixedDecimalScale
                        placeholder="Enter Cheque Amount"
                        key={chequeAddForm.key("amount")}
                        {...chequeAddForm.getInputProps("amount")}
                    />
                    <TextInput
                        label="Deposit Date"
                        placeholder="Enter Deposit Date"
                        withAsterisk
                        key={chequeAddForm.key("depositDate")}
                        {...chequeAddForm.getInputProps("depositDate")}
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

export default AddCheque;
