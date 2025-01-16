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
import { isValidChequeNumber } from "../../utils/inputValidators.ts";
import { useEffect, useState } from "react";
import { DatePickerInput } from "@mantine/dates";
import { getBankDetails } from "../../store/bankDetailSlice/bankDetailSlice.ts";
import { bankPreview } from "../../helpers/preview.tsx";
import {
    addChequePayment,
    getAllSystemPayees,
} from "../../store/chequePaymentSlice/chequePaymentSlice.ts";

const AddChequePayment = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();
    const [bankDetails, setBankDetails] = useState<any[]>([]);
    const bankAccounts = bankDetails.map((b: any) => ({
        label: `${bankPreview(b.bank)} - ${b.accountNumber}`,
        value: b._id,
    }));
    const [forAddedUsers, setForAddedUsers] = useState<boolean | null>(null);
    const [selectablePayees, setSelectablePayees] = useState<any[]>([]);

    const payeeData = [...new Set(selectablePayees)].map((payee) => ({
        label: payee,
        value: payee
    }));

    useEffect(() => {
        fetchBankDetails();
        fetchSystemAddedUsers();
    }, [dispatch]);

    const fetchBankDetails = async () => {
        setLoading(true);
        const response = await dispatch(
            getBankDetails({ filters: { status: true } })
        );
        if (response.type === "bankDetail/getBankDetails/fulfilled") {
            setLoading(false);
            setBankDetails(response.payload.result);
        } else {
            setLoading(false);
            toNotify(
                "Something went wrong",
                `Please contact system admin`,
                "WARNING"
            );
        }
    };

    const fetchSystemAddedUsers = async () => {
        try {
            setLoading(true);
            const response = await dispatch(getAllSystemPayees());
            if (
                response.type === "chequePayment/getAllSystemPayees/fulfilled"
            ) {
                setLoading(false);
                setSelectablePayees(response.payload.result);
            } else if (
                response.type === "chequePayment/getAllSystemPayees/rejected"
            ) {
                setLoading(false);
                toNotify("Error", `${response.payload.error}`, "ERROR");
                setForAddedUsers(false);
            } else {
                setLoading(false);
                toNotify("Warning", "Please contact system admin", "WARNING");
            }
        } catch (e: any) {
            setLoading(false);
            console.error(e.message);
            toNotify("Warning", "Please contact system admin", "WARNING");
        }
    };

    const chequePaymentAddForm = useForm({
        mode: "uncontrolled",
        initialValues: {
            payFor: "",
            number: "",
            bankAccount: "",
            amount: 0,
            date: null,
        },
        validate: {
            payFor: isNotEmpty("Receiver is required"),
            number: (value) => {
                if (!value) {
                    return "Cheque number is required";
                }
                return isValidChequeNumber(value)
                    ? null
                    : "Enter valid cheque number";
            },
            bankAccount: isNotEmpty("Bank Account is required"),
            amount: (value) => {
                if (!value) {
                    return "Cheque amount is required";
                }
                if (value <= 0) {
                    return "Cheque amount should be greater than Rs. 0";
                }
                return null;
            },
            date: isNotEmpty("Deposit date is required"),
        },
    });

    const handleChequePaymentAdd = async (
        values: typeof chequePaymentAddForm.values
    ) => {
        setLoading(true);
        const response = await dispatch(addChequePayment(values));
        if (response.type === "chequePayment/addChequePayment/fulfilled") {
            setLoading(false);
            toNotify("Success", "Cheque payment added successfully", "SUCCESS");
            navigate("/app/cheque-payments");
        } else if (
            response.type === "chequePayment/addChequePayment/rejected"
        ) {
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
                        Add Cheque Payment
                    </Text>
                </Group>
            </Group>
            <Box w={{ sm: "100%", lg: "50%" }} px="lg">
                <form
                    onSubmit={chequePaymentAddForm.onSubmit(
                        handleChequePaymentAdd
                    )}
                >
                    {forAddedUsers ? (
                        <Select
                            label="Payment For"
                            placeholder="Selectt Receiver"
                            withAsterisk
                            data={payeeData}
                            searchable
                            clearable
                            key={chequePaymentAddForm.key("payFor")}
                            {...chequePaymentAddForm.getInputProps("payFor")}
                        />
                        ) : (
                        <TextInput
                            label="Payment For"
                            placeholder="Enter Receiver Name"
                            withAsterisk
                            key={chequePaymentAddForm.key("payFor")}
                            {...chequePaymentAddForm.getInputProps("payFor")}
                        />
                    )}
                    <Text
                        className="text-end cursor-pointer"
                        size="xs"
                        mt="xs"
                        c="blue"
                        td="underline"
                        onClick={() => setForAddedUsers(!forAddedUsers)}
                    >
                        {forAddedUsers
                            ? "Payment for new users"
                            : "Payment for system customers, suppliers, and previous payees "}
                    </Text>
                    <Select
                        label="Bank"
                        withAsterisk
                        placeholder="Select Bank Account"
                        searchable
                        data={bankAccounts}
                        key={chequePaymentAddForm.key("bankAccount")}
                        {...chequePaymentAddForm.getInputProps("bankAccount")}
                    />
                    <TextInput
                        label="Cheque Number"
                        placeholder="Enter Cheque Number"
                        withAsterisk
                        key={chequePaymentAddForm.key("number")}
                        {...chequePaymentAddForm.getInputProps("number")}
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
                        thousandSeparator=","
                        placeholder="Enter Cheque Amount"
                        key={chequePaymentAddForm.key("amount")}
                        {...chequePaymentAddForm.getInputProps("amount")}
                    />
                    <DatePickerInput
                        label="Date"
                        placeholder="Enter Date"
                        withAsterisk
                        clearable
                        defaultValue={new Date()}
                        key={chequePaymentAddForm.key("date")}
                        {...chequePaymentAddForm.getInputProps("date")}
                    />
                    <Group justify="flex-end" display="flex" pb="md" mt="md">
                        <Button
                            size="xs"
                            type="submit"
                            onClick={() =>
                                console.log(chequePaymentAddForm.values)
                            }
                        >
                            Submit
                        </Button>
                    </Group>
                </form>
            </Box>
        </>
    );
};

export default AddChequePayment;
