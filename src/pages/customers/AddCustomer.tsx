import { Button, Group, Textarea, TextInput, Text, Box } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import {
    addCustomer,
} from "../../store/customerSlice/customerSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";
import { useNavigate } from "react-router";
import { useForm } from "@mantine/form";
import { isValidEmail, isValidPhone } from "../../utils/inputValidators.ts";

const AddCustomer = () => {
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch | any>();


    const customerAddForm = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: "",
            phone: "",
            email: "",
            address: "",
        },
        validate: {
            name: (value) => (value.trim() ? null : "Name is required"),
            phone: (value: string) => {
                if (!value) {
                    return "Phone number is required";
                }
                return isValidPhone(value)
                    ? null
                    : "Enter a valid phone number";
            },
            email: (value) => {
                if (!value.trim()) return null;
                return isValidEmail(value)
                    ? null
                    : "Enter a valid email address";
            },
        },
    });

    const handleAddCustomer = async (values: typeof customerAddForm.values) => {
        setLoading(true);
        const response = await dispatch(addCustomer(values));
        console.log(response);
        if (response.type === "customer/addCustomer/fulfilled"){
            setLoading(false);
            toNotify("Success", "Customer created successfully", "SUCCESS");
            navigate("/app/customers");
        } else if (response.type === "customer/addCustomer/rejected"){
            setLoading(false);
            toNotify("Error", `${response.payload.error}`, "ERROR");
        } else {
            setLoading(false);
            toNotify("Something went wrong", `Please contact system admin`, "WARNING");
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
                        Add Customer
                    </Text>
                </Group>
            </Group>
            <Box w={{  sm: "100%", lg: "50%" }} px="lg">
                <form onSubmit={customerAddForm.onSubmit(handleAddCustomer)}>
                    <TextInput
                        label="Name"
                        withAsterisk
                        placeholder="Enter Customer Name"
                        {...customerAddForm.getInputProps("name")}
                    />
                    <TextInput
                        label="Phone"
                        withAsterisk
                        placeholder="Enter Customer Phone Number"
                        {...customerAddForm.getInputProps("phone")}
                    />
                    <TextInput
                        label="Email"
                        placeholder="Enter Customer Email"
                        {...customerAddForm.getInputProps("email")}
                    />
                    <Textarea
                        label="Address"
                        placeholder="Enter Customer Address"
                        {...customerAddForm.getInputProps("address")}
                    />
                    <Group justify="flex-end" display="flex" pb="md" mt="md">
                        <Button size="xs" color="dark" type="submit">
                            Submit
                        </Button>
                    </Group>
                </form>
            </Box>
        </>
    );
};

export default AddCustomer;
