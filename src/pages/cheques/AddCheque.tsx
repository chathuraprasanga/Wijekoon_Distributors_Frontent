import {
    Button,
    NumberInput,
    Select,
    TextInput,
    Group,
    Text,
    Box,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store.ts";
import { useNavigate } from "react-router";
import { isNotEmpty, useForm } from "@mantine/form";
import toNotify from "../../helpers/toNotify.tsx";
import { addCheque } from "../../store/chequeSlice/chequeSlice.ts";
import {
    isValidBankCode,
    isValidBranchCode,
    isValidChequeNumber,
} from "../../utils/inputValidators.ts";
import { useEffect, useState } from "react";
import { getCustomers } from "../../store/customerSlice/customerSlice.ts";
import { DatePickerInput } from "@mantine/dates";

const AddCheque = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();
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

    const chequeAddForm = useForm({
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
            <Group p="lg" display="flex" justify="space-between" align="center">
                <Group display="flex">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <Text fw={500} ml="md" size="lg">
                        Add Cheque
                    </Text>
                </Group>
            </Group>
            <Box w={{ sm: "100%", lg: "50%" }} px="lg">
                <form onSubmit={chequeAddForm.onSubmit(handleChequeAdd)}>
                    <Select
                        label="Customer"
                        withAsterisk
                        placeholder="Select Customer"
                        searchable
                        data={customerData}
                        key={chequeAddForm.key("customer")}
                        {...chequeAddForm.getInputProps("customer")}
                    />
                    <TextInput
                        label="Cheque Number"
                        placeholder="Enter Cheque Number"
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
                    <DatePickerInput
                        label="Deposit Date"
                        placeholder="Enter Deposit Date"
                        withAsterisk
                        clearable
                        defaultValue={new Date()}
                        key={chequeAddForm.key("depositDate")}
                        {...chequeAddForm.getInputProps("depositDate")}
                    />
                    <Group justify="flex-end" display="flex" pb="md" mt="md">
                        <Button
                            size="xs"
                            color="dark"
                            type="submit"
                            onClick={() => console.log(chequeAddForm.values)}
                        >
                            Submit
                        </Button>
                    </Group>
                </form>
            </Box>
        </>
    );
};

export default AddCheque;
