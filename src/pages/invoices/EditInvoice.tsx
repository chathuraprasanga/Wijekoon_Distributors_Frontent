import { IconArrowLeft } from "@tabler/icons-react";
import { Button, NumberInput, TextInput } from "@mantine/core";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useNavigate, useParams } from "react-router";
import { isNotEmpty, useForm } from "@mantine/form";
import toNotify from "../../helpers/toNotify.tsx";
import { getInvoice, updateInvoice } from "../../store/invoiceSlice/invoiceSlice.ts";
import { useEffect } from "react";

const EditInvoice = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();
    const id = useParams().id;

    const selectedInvoice = useSelector(
        (state: RootState) => state.invoice.selectedInvoice
    );

    useEffect(() => {
        fetchInvoice();
    }, [dispatch, id]);

    useEffect(() => {
        invoiceEditFrom.setValues(selectedInvoice);
        invoiceEditFrom.resetDirty();
    }, [selectedInvoice]);

    const fetchInvoice = async () => {
        setLoading(false);
        await dispatch(getInvoice(id));
        setLoading(false);
    };

    const invoiceEditFrom = useForm({
        mode: "uncontrolled",
        initialValues: {
            supplier: "",
            invoiceDate: "",
            invoiceNumber: "",
            amount: 0,
        },
        validate: {
            supplier: isNotEmpty("Supplier name is required"),
            invoiceNumber: isNotEmpty("Cheque number is required"),
            amount: (value) => {
                if (!value) {
                    return "Amount is required";
                }
                if (value <= 0) {
                    return "Amount should be greater than 0";
                }
                return null;
            },
            invoiceDate: isNotEmpty("Deposit date is required"),
        },
    });

    const handleInvoiceAdd = async (values: typeof invoiceEditFrom.values) => {
        setLoading(true);
        const response = await dispatch(updateInvoice({ id, values }));
        if (response.type === "invoice/updateInvoice/fulfilled") {
            setLoading(false);
            toNotify("Success", "Invoice updated successfully", "SUCCESS");
            navigate("/app/invoices");
        } else if (response.type === "invoice/updateInvoice/rejected") {
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
                <form onSubmit={invoiceEditFrom.onSubmit(handleInvoiceAdd)}>
                    <TextInput
                        label="Supplier"
                        withAsterisk
                        placeholder="Enter Supplier Name"
                        key={invoiceEditFrom.key("supplier")}
                        {...invoiceEditFrom.getInputProps("supplier")}
                    />
                    <TextInput
                        label="Invoice Date"
                        withAsterisk
                        placeholder="Enter Invoice Date"
                        key={invoiceEditFrom.key("invoiceDate")}
                        {...invoiceEditFrom.getInputProps("invoiceDate")}
                    />
                    <TextInput
                        label="Invoice Number"
                        placeholder="Enter Invoice Number"
                        withAsterisk
                        key={invoiceEditFrom.key("invoiceNumber")}
                        {...invoiceEditFrom.getInputProps("invoiceNumber")}
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
                        key={invoiceEditFrom.key("amount")}
                        {...invoiceEditFrom.getInputProps("amount")}
                    />
                    <div className="mt-4 flex justify-end">
                        <Button size="xs" color="dark" type="submit" disabled={!invoiceEditFrom.isDirty()}>
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditInvoice;
