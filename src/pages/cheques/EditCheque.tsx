import { Button, NumberInput, Select, TextInput } from "@mantine/core";
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
import { useEffect, useState } from "react";
import {
    isValidBankCode,
    isValidBranchCode,
    isValidChequeNumber,
} from "../../utils/inputValidators.ts";
import { getCustomers } from "../../store/customerSlice/customerSlice.ts";

const EditCheque = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const id = useParams().id;
    const navigate = useNavigate();
    const selectedCheque = useSelector(
        (state: RootState) => state.cheque.selectedCheque
    );
    const [selectableCustomers, setSelectableCustomers] = useState<any[]>([]);
    const customerData = selectableCustomers.map((data: any) => {
        return { label: data.name, value: data._id };
    });

    useEffect(() => {
        fetchCustomers();
    }, [dispatch]);

    const fetchCustomers = async () => {
        setLoading(true);
        const response = await dispatch(
            getCustomers({ filters: { status: true } })
        );
        if (response.type === "customer/getCustomers/fulfilled") {
            setLoading(false);
            setSelectableCustomers(response.payload.result);
        } else {
            setLoading(false);
            toNotify(
                "Something went wrong",
                `Please contact system admin`,
                "WARNING"
            );
        }
    };

    useEffect(() => {
        fetchCheque();
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedCheque) {
            chequeEditForm.setValues({
                ...selectedCheque,
                customer: selectedCheque.customer?._id || "", // Use only the customer ID
            });
            chequeEditForm.resetDirty();
        }
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
            number: (value) => {
                if (!value || !value.trim()) {
                    return "Cheque number is required";
                }
                return isValidChequeNumber(value)
                    ? null
                    : "Enter valid cheque number";
            },
            bank: (value) => {
                if (!value || !value.trim()) {
                    return "Bank code is required";
                }
                return isValidBankCode(value) ? null : "Enter valid bank code";
            },
            branch: (value) => {
                if (!value || !value.trim()) {
                    return "Branch code is required";
                }
                return isValidBranchCode(value)
                    ? null
                    : "Enter valid branch code";
            },
            amount: (value) => {
                if (!value) {
                    return "Cheque amount is required";
                }
                if (value <= 0) {
                    return "Cheque amount should be greater than Rs. 0";
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
                        Edit Cheque
                    </span>
                </div>
            </div>
            <div className="mx-4 my-4 lg:w-1/2">
                <form onSubmit={chequeEditForm.onSubmit(handleChequeEdit)}>
                    <Select
                        label="Customer"
                        withAsterisk
                        placeholder="Select Customer"
                        searchable
                        data={customerData}
                        key={chequeEditForm.key("customer")}
                        {...chequeEditForm.getInputProps("customer")}
                    />
                    <TextInput
                        label="Cheque Number"
                        placeholder="Enter Branch Code"
                        withAsterisk
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
                        withAsterisk
                        key={chequeEditForm.key("branch")}
                        {...chequeEditForm.getInputProps("branch")}
                    />
                    <NumberInput
                        hideControls
                        allowNegative={false}
                        prefix="Rs. "
                        label="Cheque Amount"
                        withAsterisk
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
                        withAsterisk
                        type="date"
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
