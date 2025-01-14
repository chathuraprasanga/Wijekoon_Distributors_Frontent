import {
    Button,
    Group,
    NumberInput,
    Select,
    TextInput,
    Text,
    Box,
} from "@mantine/core";
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
import { DatePickerInput } from "@mantine/dates";

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
                depositDate: new Date(selectedCheque?.depositDate || new Date()),
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
            depositDate: new Date(),
        },
        validate: {
            customer: isNotEmpty("Customer name is required"),
            number: (value) => {
                if (!value) {
                    return "Cheque number is required";
                }
                return isValidChequeNumber(value)
                    ? null
                    : "Enter valid cheque number";
            },
            bank: (value) => {
                if (!value) {
                    return "Bank code is required";
                }
                return isValidBankCode(value) ? null : "Enter valid bank code";
            },
            branch: (value) => {
                if (!value) {
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
            <Group p="lg" display="flex" justify="space-between" align="center">
                <Group display="flex">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <Text fw={500} ml="md" size="lg">
                        Edit Cheque
                    </Text>
                </Group>
            </Group>
            <Box w={{ sm: "100%", lg: "50%" }} px="lg">
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
                        thousandSeparator=","
                        placeholder="Enter Cheque Amount"
                        key={chequeEditForm.key("amount")}
                        {...chequeEditForm.getInputProps("amount")}
                    />
                    <DatePickerInput
                        label="Deposit Date"
                        placeholder="Enter Deposit Date"
                        withAsterisk
                        key={chequeEditForm.key("depositDate")}
                        {...chequeEditForm.getInputProps("depositDate")}
                    />
                    <Group justify="flex-end" display="flex" pb="md" mt="md">
                        <Button
                            size="xs"
                            type="submit"
                            disabled={!chequeEditForm.isDirty()}
                        >
                            Submit
                        </Button>
                    </Group>
                </form>
            </Box>
        </>
    );
};

export default EditCheque;
