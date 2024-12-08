import { Box, Button, Group, Textarea, TextInput } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store.ts";
import { addSupplier } from "../../store/supplierSlice/supplierSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";
import { useNavigate } from "react-router";
import { isValidEmail, isValidPhone } from "../../utils/inputValidators.ts";

const AddSupplier = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();

    const supplierAddForm = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: "",
            phone: "",
            email: "",
            address: "",
        },
        validate: {
            name: isNotEmpty("Supplier name is required"),
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

    const handleSupplierAdd = async (values: typeof supplierAddForm.values) => {
        setLoading(true);
        const response = await dispatch(addSupplier(values));
        if (response.type === "supplier/addSupplier/fulfilled") {
            setLoading(false);
            toNotify("Successs", "Supplier added successfully", "SUCCESS");
            navigate("/app/suppliers");
        } else if (response.type === "supplier/addSupplier/rejected") {
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
                    <Group display="flex">Add Supplier</Group>
                </Group>
            </Group>
            <Box w={{ sm: "100%", lg: "50%" }} px="lg">
                <form onSubmit={supplierAddForm.onSubmit(handleSupplierAdd)}>
                    <TextInput
                        label="Name"
                        withAsterisk
                        placeholder="Enter Supplier Name"
                        key={supplierAddForm.key("name")}
                        {...supplierAddForm.getInputProps("name")}
                    />
                    <TextInput
                        label="Phone"
                        withAsterisk
                        placeholder="Enter Supplier Phone Number"
                        key={supplierAddForm.key("phone")}
                        {...supplierAddForm.getInputProps("phone")}
                    />
                    <TextInput
                        label="Email"
                        placeholder="Enter Supplier Email"
                        key={supplierAddForm.key("email")}
                        {...supplierAddForm.getInputProps("email")}
                    />
                    <Textarea
                        label="Address"
                        placeholder="Enter Supplier Address"
                        key={supplierAddForm.key("address")}
                        {...supplierAddForm.getInputProps("address")}
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

export default AddSupplier;
