import { Button, Textarea, TextInput } from "@mantine/core";
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
                if (!value || !value.trim()) {
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
        } else if (response.type === "supplier/addSupplier/rejected") {
            const error: any = response.payload.error;
            setLoading(false);
            toNotify("Error", `${error}`, "ERROR");
            navigate("/app/suppliers")
        } else {
            setLoading(false);
            toNotify("Something went wrong", `Please contact system admin`, "WARNING");
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
                        Add Supplier
                    </span>
                </div>
            </div>
            <div className="mx-4 my-4 lg:w-1/2">
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
                    <div className="mt-4 flex justify-end">
                        <Button size="xs" color="dark" type="submit">
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddSupplier;
