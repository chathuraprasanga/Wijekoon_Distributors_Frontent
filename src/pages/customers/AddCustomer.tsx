import { Button, Textarea, TextInput } from "@mantine/core";
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
            <div className="items-center flex flex-row justify-between p-4">
                <div className="flex flex-row items-center">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <span className="text-lg font-semibold ml-4">
                        Add Customer
                    </span>
                </div>
            </div>
            <div className="mx-4 my-4 lg:w-1/2">
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

export default AddCustomer;
