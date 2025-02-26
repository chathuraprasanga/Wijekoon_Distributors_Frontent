import { Button, Group, Textarea, TextInput, Box, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import {
    getCustomer,
    updateCustomer,
} from "../../store/customerSlice/customerSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";
import { useNavigate, useParams } from "react-router";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { isValidEmail, isValidPhone } from "../../utils/inputValidators.ts";

const EditCustomer = () => {
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch | any>();
    const id: any = useParams().id ?? null;
    const customer = useSelector(
        (state: RootState) => state.customer.selectedCustomer
    );

    useEffect(() => {
        if (id) {
            fetchSelectedCustomer();
        }
    }, [dispatch, id]);

    useEffect(() => {
        customerEditForm.setValues(customer);
        customerEditForm.resetDirty();
    }, [customer]);

    const fetchSelectedCustomer = async () => {
        setLoading(true);
        await dispatch(getCustomer(id));
        setLoading(false);
    };

    const customerEditForm = useForm({
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

    const handleUpdateCustomer = async (
        values: typeof customerEditForm.values
    ) => {
        setLoading(true);
        const response = await dispatch(updateCustomer({ id, values }));
        if (response.type === "customer/updateCustomer/fulfilled"){
            setLoading(false);
            toNotify("Success", "Customer updated successfully", "SUCCESS");
            navigate("/app/customers");
        } else if (response.type === "customer/updateCustomer/rejected"){
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
                    <Text fw={500} size={"lg"} ml={"md"}>
                        Edit Customer
                    </Text>
                </Group>
            </Group>
            <Box w={{  sm: "100%", lg: "50%" }} px="lg">
                <form
                    onSubmit={customerEditForm.onSubmit(handleUpdateCustomer)}
                >
                    <TextInput
                        label="Name"
                        withAsterisk
                        placeholder="Enter Customer Name"
                        {...customerEditForm.getInputProps("name")}
                    />
                    <TextInput
                        label="Phone"
                        withAsterisk
                        placeholder="Enter Customer Phone Number"
                        {...customerEditForm.getInputProps("phone")}
                    />
                    <TextInput
                        label="Email"
                        placeholder="Enter Customer Email"
                        {...customerEditForm.getInputProps("email")}
                    />
                    <Textarea
                        label="Address"
                        placeholder="Enter Customer Address"
                        {...customerEditForm.getInputProps("address")}
                    />
                    <Group justify="flex-end" display="flex" pb="md" mt="md">
                        <Button size="xs" disabled={!customerEditForm.isDirty()} type="submit">
                            Submit
                        </Button>
                    </Group>
                </form>
            </Box>
        </>
    );
};

export default EditCustomer;
