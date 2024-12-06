import { Button, Textarea, TextInput } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import {
    getSupplier,
    updateSupplier,
} from "../../store/supplierSlice/supplierSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { isValidEmail, isValidPhone } from "../../utils/inputValidators.ts";

const EditSupplier = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();
    const id = useParams().id;
    const selectedSupplier = useSelector(
        (state: RootState) => state.supplier.selectedSupplier
    );
    console.log("ss", selectedSupplier);

    useEffect(() => {
        fetchSupplier();
    }, [dispatch, id]);

    useEffect(() => {
        supplierEditForm.setValues(selectedSupplier);
        supplierEditForm.resetDirty();
    }, [selectedSupplier]);

    const fetchSupplier = async () => {
        setLoading(false);
        await dispatch(getSupplier(id));
        setLoading(false);
    };

    const supplierEditForm = useForm({
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
        }
    });

    const handleSupplierEdit = async (
        values: typeof supplierEditForm.values
    ) => {
        setLoading(true);
        const response = await dispatch(updateSupplier({ id, values }));
        if (response.type === "supplier/updateSupplier/fulfilled") {
            setLoading(false);
            toNotify("Successs", "Supplier updated successfully", "SUCCESS");
            navigate("/app/suppliers");
        } else if (response.type === "supplier/updateSupplier/rejected") {
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
            <div className="items-center flex flex-row justify-between p-4">
                <div className="flex flex-row items-center">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <span className="text-lg font-semibold ml-4">
                        Edit Supplier
                    </span>
                </div>
            </div>
            <div className="mx-4 my-4 lg:w-1/2">
                <form onSubmit={supplierEditForm.onSubmit(handleSupplierEdit)}>
                    <TextInput
                        label="Name"
                        withAsterisk
                        placeholder="Enter Supplier Name"
                        key={supplierEditForm.key("name")}
                        {...supplierEditForm.getInputProps("name")}
                    />
                    <TextInput
                        label="Phone"
                        withAsterisk
                        placeholder="Enter Supplier Phone Number"
                        key={supplierEditForm.key("phone")}
                        {...supplierEditForm.getInputProps("phone")}
                    />
                    <TextInput
                        label="Email"
                        placeholder="Enter Supplier Email"
                        key={supplierEditForm.key("email")}
                        {...supplierEditForm.getInputProps("email")}
                    />
                    <Textarea
                        label="Address"
                        placeholder="Enter Supplier Address"
                        key={supplierEditForm.key("address")}
                        {...supplierEditForm.getInputProps("address")}
                    />
                    <div className="mt-4 flex justify-end">
                        <Button
                            size="xs"
                            color="dark"
                            type="submit"
                            disabled={!supplierEditForm.isDirty()}
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditSupplier;
