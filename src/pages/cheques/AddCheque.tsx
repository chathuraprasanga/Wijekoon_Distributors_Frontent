import {
    Button,
    NumberInput,
    Select,
    TextInput,
    Group,
    Text,
    Box,
    Modal,
    Textarea,
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
    isValidBranchCode,
    isValidChequeNumber,
    isValidPhone,
} from "../../utils/inputValidators.ts";
import { useEffect, useState } from "react";
import {
    addCustomer,
    getCustomers,
} from "../../store/customerSlice/customerSlice.ts";
import { DatePickerInput } from "@mantine/dates";
import banks from "../../helpers/banks.json";
import { useDisclosure } from "@mantine/hooks";

const AddCheque = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();
    const [selectableCustomers, setSelectableCustomers] = useState<any[]>([]);
    const customerData = selectableCustomers.map((data: any) => {
        return { label: data.name, value: data._id };
    });
    const [isBranchDisabled, setIsBranchDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [customerAddModalOpened, customerAddModalHandler] =
        useDisclosure(false);

    const banksList = banks.map((b) => ({
        label: b.name,
        value: b.name,
    }));

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
            depositDate: null,
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
                    return "Bank is required";
                }
                return null;
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

    const customerAddForm = useForm({
        initialValues: {
            name: "",
            phone: "",
            email: "",
            address: "",
        },
        validate: {
            name: (value) =>
                value.trim() ? null : "Customer name is required.",
            phone: (value) => {
                if (!value.trim()) {
                    return "Phone number is required.";
                }
                if (!isValidPhone(value)) {
                    return "Please add a valid phone number.";
                }
                return null;
            },
        },
    });

    const customerAddFormHandler = async (
        values: typeof customerAddForm.values
    ) => {
        try {
            setIsLoading(true);
            const response = await dispatch(addCustomer(values));
            if (response.type === "customer/addCustomer/fulfilled") {
                setIsLoading(false);
                toNotify("Success", "Customer created successfully", "SUCCESS");
                customerAddModalHandler.close();
                customerAddForm.reset();
                fetchCustomers();
            } else if (response.type === "customer/addCustomer/rejected") {
                setIsLoading(false);
                toNotify("Error", `${response.payload.error}`, "ERROR");
            } else {
                setIsLoading(false);
                toNotify("Warning", `Please contact system admin`, "WARNING");
                customerAddModalHandler.close();
                customerAddForm.reset();
            }
        } catch (e: any) {
            console.error(e.message);
            setIsLoading(false);
            setIsLoading(false);
            toNotify("Warning", `Please contact system admin`, "WARNING");
            customerAddModalHandler.close();
            customerAddForm.reset();
        }
    };

    const customerAddModal = () => {
        return (
            <Modal
                opened={customerAddModalOpened}
                onClose={() => {
                    customerAddModalHandler.close();
                    customerAddForm.reset();
                }}
                title={<Text>Add Customer</Text>}
            >
                <form onSubmit={customerAddForm.onSubmit(customerAddFormHandler)}>
                    <TextInput
                        label="Name"
                        withAsterisk
                        placeholder="Customer Name"
                        {...customerAddForm.getInputProps("name")}
                    />
                    <TextInput
                        label="Phone"
                        withAsterisk
                        placeholder="Customer Phone"
                        {...customerAddForm.getInputProps("phone")}
                    />
                    <TextInput
                        label="Email"
                        placeholder="Customer Email"
                        {...customerAddForm.getInputProps("email")}
                    />
                    <Textarea
                        label="Address"
                        placeholder="Customer Address"
                        {...customerAddForm.getInputProps("address")}
                    />
                    <Button mt="md" fullWidth loading={isLoading} type="submit">
                        Save
                    </Button>
                </form>
            </Modal>
        );
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
                    <Text
                        mt="xs"
                        size="xs"
                        className="text-end underline cursor-pointer"
                        c="blue"
                        td="underline"
                        onClick={() => customerAddModalHandler.open()}
                    >
                        Create New User
                    </Text>
                    <TextInput
                        label="Cheque Number"
                        placeholder="Enter Cheque Number"
                        withAsterisk
                        key={chequeAddForm.key("number")}
                        {...chequeAddForm.getInputProps("number")}
                    />
                    <Select
                        label="Bank"
                        withAsterisk
                        placeholder="Select Customer Bank Name"
                        searchable
                        key={chequeAddForm.key("bank")}
                        data={banksList}
                        {...chequeAddForm.getInputProps("bank")}
                        onChange={(value) => {
                            chequeAddForm.getInputProps("bank").onChange(value); // Bind to form state
                            setIsBranchDisabled(false); // Update branches
                        }}
                    />
                    <TextInput
                        label="Branch"
                        placeholder="Enter Customer Bank Branch Code"
                        withAsterisk
                        key={chequeAddForm.key("branch")}
                        {...chequeAddForm.getInputProps("branch")}
                        disabled={isBranchDisabled} // Disable branch field if no bank is selected
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
                            type="submit"
                            onClick={() => console.log(chequeAddForm.values)}
                        >
                            Submit
                        </Button>
                    </Group>
                </form>
            </Box>
            {customerAddModal()}
        </>
    );
};

export default AddCheque;
