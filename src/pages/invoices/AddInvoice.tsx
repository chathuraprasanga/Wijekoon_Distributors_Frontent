import { IconArrowLeft } from "@tabler/icons-react";
import { Button, NumberInput, TextInput } from "@mantine/core";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store.ts";
import { useNavigate } from "react-router";
import { isNotEmpty, useForm } from "@mantine/form";
import toNotify from "../../helpers/toNotify.tsx";
import { addInvoice } from "../../store/invoiceSlice/invoiceSlice.ts";

const AddInvoice = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();

    const invoiceAddFrom = useForm({
        mode: "uncontrolled",
        initialValues: {
            supplier: "",
            invoiceDate: "",
            invoiceNumber: "",
            amount: 0,
        },
        validate: {
            supplier: isNotEmpty("Supplier name is required"),
            invoiceNumber: isNotEmpty("Invoice number is required"),
            amount: (value) => {
                if (!value) {
                    return "Amount is required";
                }
                if (value <= 0) {
                    return "Amount should be greater than Rs. 0";
                }
                return null;
            },
            invoiceDate: isNotEmpty("Invoice date is required"),
        },
    });

    const handleInvoiceAdd = async (values: typeof invoiceAddFrom.values) => {
        setLoading(true);
        const response = await dispatch(addInvoice(values));
        if (response.type === "invoice/addInvoice/fulfilled") {
            setLoading(false);
            toNotify("Success", "Invoice added successfully", "SUCCESS");
            navigate("/app/invoices");
        } else if (response.type === "invoice/addInvoice/rejected") {
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
                        Add Invoice
                    </span>
                </div>
            </div>
            <div className="mx-4 my-4 lg:w-1/2">
                <form onSubmit={invoiceAddFrom.onSubmit(handleInvoiceAdd)}>
                    <TextInput
                        label="Supplier"
                        withAsterisk
                        placeholder="Enter Supplier Name"
                        key={invoiceAddFrom.key("supplier")}
                        {...invoiceAddFrom.getInputProps("supplier")}
                    />
                    <TextInput
                        label="Invoice Date"
                        withAsterisk
                        type="date"
                        placeholder="Enter Invoice Date"
                        key={invoiceAddFrom.key("invoiceDate")}
                        {...invoiceAddFrom.getInputProps("invoiceDate")}
                    />
                    <TextInput
                        label="Invoice Number"
                        placeholder="Enter Invoice Number"
                        withAsterisk
                        key={invoiceAddFrom.key("invoiceNumber")}
                        {...invoiceAddFrom.getInputProps("invoiceNumber")}
                    />
                    <NumberInput
                        hideControls
                        allowNegative={false}
                        prefix="Rs. "
                        label="Cheque Amount"
                        decimalSeparator="."
                        decimalScale={2}
                        fixedDecimalScale
                        placeholder="Enter Cheque Amount"
                        key={invoiceAddFrom.key("amount")}
                        {...invoiceAddFrom.getInputProps("amount")}
                        withAsterisk
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

export default AddInvoice;
