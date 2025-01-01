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
import { useEffect, useState } from "react";
import {
    isValidChequeNumber,
} from "../../utils/inputValidators.ts";
import { DatePickerInput } from "@mantine/dates";
import { bankPreview } from "../../helpers/preview.tsx";
import { getBankDetails } from "../../store/bankDetailSlice/bankDetailSlice.ts";
import { getChequePayment, updateChequePayment } from "../../store/chequePaymentSlice/chequePaymentSlice.ts";

const EditChequePayment = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const id = useParams().id;
    const navigate = useNavigate();
    const selectedChequePayment = useSelector(
        (state: RootState) => state.chequePayments.selectedChequePayment
    );
    const [bankDetails, setBankDetails] = useState<any[]>([]);
    const bankAccounts = bankDetails.map((b: any) => ({
        label: `${bankPreview(b.bank)} - ${b.accountNumber}`,
        value: b._id,
    }));

    useEffect(() => {
        fetchBankDetails();
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

    useEffect(() => {
        fetchChequePayment();
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedChequePayment) {
            chequePaymentEditForm.setValues({
                ...selectedChequePayment,
                bankAccount: selectedChequePayment?.bankAccount?._id,
                date: new Date(selectedChequePayment?.date || new Date()),
            });
            chequePaymentEditForm.resetDirty();
        }
    }, [selectedChequePayment]);

    const fetchChequePayment = async () => {
        setLoading(false);
        await dispatch(getChequePayment(id));
        setLoading(false);
    };

    const chequePaymentEditForm = useForm({
        mode: "uncontrolled",
        initialValues: {
            payFor: "",
            number: "",
            bankAccount: "",
            amount: 0,
            date: new Date(),
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

    const handleChequeEdit = async (values: typeof chequePaymentEditForm.values) => {
        setLoading(true);
        const response = await dispatch(updateChequePayment({ id, values }));
        if (response.type === "chequePayment/updateChequePayment/fulfilled") {
            setLoading(false);
            toNotify("Success", "Cheque payment updated successfully", "SUCCESS");
            navigate("/app/cheque-payments");
        } else if (response.type === "chequePayment/updateChequePayment/rejected") {
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
                        Edit Cheque Payment
                    </Text>
                </Group>
            </Group>
            <Box w={{ sm: "100%", lg: "50%" }} px="lg">
                <form onSubmit={chequePaymentEditForm.onSubmit(handleChequeEdit)}>
                    <TextInput
                        label="Payment For"
                        placeholder="Enter Receiver Name"
                        withAsterisk
                        key={chequePaymentEditForm.key("payFor")}
                        {...chequePaymentEditForm.getInputProps("payFor")}
                    />
                    <Select
                        label="Bank"
                        withAsterisk
                        placeholder="Select Bank Account"
                        searchable
                        data={bankAccounts}
                        key={chequePaymentEditForm.key("bankAccount")}
                        {...chequePaymentEditForm.getInputProps("bankAccount")}
                    />
                    <TextInput
                        label="Cheque Number"
                        placeholder="Enter Cheque Number"
                        withAsterisk
                        key={chequePaymentEditForm.key("number")}
                        {...chequePaymentEditForm.getInputProps("number")}
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
                        key={chequePaymentEditForm.key("amount")}
                        {...chequePaymentEditForm.getInputProps("amount")}
                    />
                    <DatePickerInput
                        label="Date"
                        placeholder="Enter Date"
                        withAsterisk
                        clearable
                        defaultValue={new Date()}
                        key={chequePaymentEditForm.key("date")}
                        {...chequePaymentEditForm.getInputProps("date")}
                    />
                    <Group justify="flex-end" display="flex" pb="md" mt="md">
                        <Button
                            size="xs"
                            type="submit"
                            disabled={!chequePaymentEditForm.isDirty()}
                        >
                            Submit
                        </Button>
                    </Group>
                </form>
            </Box>
        </>
    );
};

export default EditChequePayment;
