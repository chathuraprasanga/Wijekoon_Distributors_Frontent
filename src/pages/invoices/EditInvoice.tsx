import { IconArrowLeft } from "@tabler/icons-react";
import {
    Box,
    Button, Checkbox,
    Group,
    NumberInput,
    Select,
    TextInput,
} from "@mantine/core";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useNavigate, useParams } from "react-router";
import { isNotEmpty, useForm } from "@mantine/form";
import toNotify from "../../helpers/toNotify.tsx";
import {
    getInvoice,
    updateInvoice,
} from "../../store/invoiceSlice/invoiceSlice.ts";
import { useEffect, useState } from "react";
import { getSuppliers } from "../../store/supplierSlice/supplierSlice.ts";
import { DatePickerInput } from "@mantine/dates";

const EditInvoice = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();
    const id = useParams().id;

    const selectedInvoice = useSelector(
        (state: RootState) => state.invoice.selectedInvoice
    );
    const [isCompanyCreated, setIsCompanyCreated] = useState(false);
    const [selectedSuppliers, setSelectedSuppliers] = useState<any[]>([]);
    const supplierData = selectedSuppliers.map((data: any) => {
        return { label: data.name, value: data._id };
    });

    useEffect(() => {
        fetchSuppliers();
    }, [dispatch]);

    const fetchSuppliers = async () => {
        setLoading(true);
        const response = await dispatch(
            getSuppliers({ filters: { status: true } })
        );
        if (response.type === "supplier/getSuppliers/fulfilled") {
            setLoading(false);
            setSelectedSuppliers(response.payload.result);
        } else {
            setLoading(false);
            toNotify(
                "Something went wrong",
                `Please contact system admin`,
                "WARNING"
            );
        }
    };

    useEffect(() => {
        fetchInvoice();
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedInvoice) {
            setIsCompanyCreated(selectedInvoice?.isCompanyCreated || false);
            invoiceEditFrom.setValues({
                ...selectedInvoice,
                supplier: selectedInvoice.supplier?._id || "", // Use only the customer ID
                invoiceDate: new Date(
                    selectedInvoice?.invoiceDate || new Date()
                ),
            });
            invoiceEditFrom.resetDirty();
        }
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
            invoiceDate: new Date(),
            invoiceNumber: "",
            amount: 0.0,
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
            <Group p="lg" display="flex" justify="space-between" align="center">
                <Group display="flex">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <span className="text-lg font-semibold ml-4">
                        Add Invoice
                    </span>
                </Group>
            </Group>
            <Box w={{ sm: "100%", lg: "50%" }} px="lg">
                <form onSubmit={invoiceEditFrom.onSubmit(handleInvoiceAdd)}>
                    <Select
                        label="Supplier"
                        withAsterisk
                        searchable
                        data={supplierData}
                        placeholder="Enter Supplier Name"
                        key={invoiceEditFrom.key("supplier")}
                        {...invoiceEditFrom.getInputProps("supplier")}
                    />
                    <DatePickerInput
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
                        disabled={isCompanyCreated}
                        key={invoiceEditFrom.key("invoiceNumber")}
                        {...invoiceEditFrom.getInputProps("invoiceNumber")}
                    />
                    <Checkbox
                        mt="xs"
                        checked={isCompanyCreated}
                        label="Create Invoice By Our End"
                        onChange={() => setIsCompanyCreated(!isCompanyCreated)}
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
                        key={invoiceEditFrom.key("amount")}
                        {...invoiceEditFrom.getInputProps("amount")}
                    />
                    <Group justify="flex-end" display="flex" pb="md" mt="md">
                        <Button
                            size="xs"
                            type="submit"
                            disabled={!invoiceEditFrom.isDirty()}
                        >
                            Submit
                        </Button>
                    </Group>
                </form>
            </Box>
        </>
    );
};

export default EditInvoice;
