import { Button, Textarea, TextInput } from "@mantine/core";
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
            phone: (value) => {
                if (!value.trim()) return "Phone is required";
                const phoneRegex = /^[0-9]+$/; // Only digits
                return phoneRegex.test(value)
                    ? null
                    : "Phone must contain only numbers";
            },
            email: (value) => {
                if (!value.trim()) return null; // Skip validation if email is empty
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value)
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
            <div className="items-center flex flex-row justify-between p-4">
                <div className="flex flex-row items-center">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <span className="text-lg font-semibold ml-4">
                        Edit Customer
                    </span>
                </div>
            </div>
            <div className="mx-4 my-4 lg:w-1/2">
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
                    <div className="mt-4 flex justify-end">
                        <Button size="xs" color="dark"  disabled={!customerEditForm.isDirty()} type="submit">
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditCustomer;
