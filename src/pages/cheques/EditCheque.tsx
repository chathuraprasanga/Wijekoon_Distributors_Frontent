import { Button, NumberInput, TextInput } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useNavigate, useParams } from "react-router";
import { isNotEmpty, useForm } from "@mantine/form";
import toNotify from "../../helpers/toNotify.tsx";
import {
    getCheque,
    updateCheque,
} from "../../store/chequeSlice/chequeSlice.ts";
import { useEffect } from "react";

const EditCheque = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const id = useParams().id;
    const navigate = useNavigate();
    const selectedCheque = useSelector(
        (state: RootState) => state.cheque.selectedCheque
    );

    useEffect(() => {
        fetchCheque();
    }, [dispatch, id]);

    useEffect(() => {
        chequeEditForm.setValues(selectedCheque);
        chequeEditForm.resetDirty();
    }, [selectedCheque]);

    const fetchCheque = async () => {
        setLoading(false);
        await dispatch(getCheque(id));
        setLoading(false);
    };

    const chequeEditForm = useForm({
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

    const handleChequeEdit = async (values: typeof chequeEditForm.values) => {
        setLoading(true);
        const response = await dispatch(updateCheque({ id, values }));
        if (response.type === "cheque/updateCheque/fulfilled") {
            setLoading(false);
            toNotify("Success", "Cheque updated successfully", "SUCCESS");
            navigate("/app/cheques");
        } else if (response.type === "cheque/updateCheque/rejected") {
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
                <form onSubmit={chequeEditForm.onSubmit(handleChequeEdit)}>
                    <TextInput
                        label="Name"
                        withAsterisk
                        placeholder="Enter Customer Name"
                        key={chequeEditForm.key("customer")}
                        {...chequeEditForm.getInputProps("customer")}
                    />
                    <TextInput
                        label="Cheque Number"
                        placeholder="Enter Branch Code"
                        key={chequeEditForm.key("number")}
                        {...chequeEditForm.getInputProps("number")}
                    />
                    <TextInput
                        label="Bank"
                        withAsterisk
                        placeholder="Enter Customer Bank Name"
                        key={chequeEditForm.key("bank")}
                        {...chequeEditForm.getInputProps("bank")}
                    />
                    <TextInput
                        label="Branch"
                        placeholder="Enter Customer Bank Branch Code"
                        key={chequeEditForm.key("branch")}
                        {...chequeEditForm.getInputProps("branch")}
                    />
                    <NumberInput
                        hideControls
                        allowNegative={false}
                        prefix="Rs. "
                        label="Cheque Amount"
                        decimalSeparator="."
                        decimalScale={2}
                        fixedDecimalScale
                        placeholder="Enter Cheque Amount"
                        key={chequeEditForm.key("amount")}
                        {...chequeEditForm.getInputProps("amount")}
                    />
                    <TextInput
                        label="Deposit Date"
                        placeholder="Enter Deposit Date"
                        key={chequeEditForm.key("depositDate")}
                        {...chequeEditForm.getInputProps("depositDate")}
                    />
                    <div className="mt-4 flex justify-end">
                        <Button
                            size="xs"
                            color="dark"
                            type="submit"
                            disabled={!chequeEditForm.isDirty()}
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditCheque;
