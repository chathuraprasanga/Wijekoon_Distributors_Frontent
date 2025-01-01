import { IconArrowLeft } from "@tabler/icons-react";
import {
    Box,
    Button,
    Group,
    NumberInput,
    Select,
    TextInput,
} from "@mantine/core";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store.ts";
import { useNavigate } from "react-router";
import { isNotEmpty, useForm } from "@mantine/form";
import toNotify from "../../helpers/toNotify.tsx";
import { addInvoice } from "../../store/invoiceSlice/invoiceSlice.ts";
import { useEffect, useState } from "react";
import { getSuppliers } from "../../store/supplierSlice/supplierSlice.ts";
import { DatePickerInput } from "@mantine/dates";

const AddInvoice = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();
    const [selectableSuppliers, setSelectableSuppliers] = useState<any[]>([])
    const supplierData =  selectableSuppliers.map((data:any) => {return {label: data.name, value: data._id }})

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
            setSelectableSuppliers(response.payload.result);
        } else {
            setLoading(false);
            toNotify(
                "Something went wrong",
                `Please contact system admin`,
                "WARNING"
            );
        }
    };

    const invoiceAddFrom = useForm({
        mode: "uncontrolled",
        initialValues: {
            supplier: "",
            invoiceDate:  null,
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
                <form onSubmit={invoiceAddFrom.onSubmit(handleInvoiceAdd)}>
                    <Select
                        label="Supplier"
                        withAsterisk
                        searchable
                        data={supplierData}
                        placeholder="Enter Supplier Name"
                        key={invoiceAddFrom.key("supplier")}
                        {...invoiceAddFrom.getInputProps("supplier")}
                    />
                    <DatePickerInput
                        label="Invoice Date"
                        withAsterisk
                        placeholder="Enter Invoice Date"
                        clearable
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
                    <Group justify="flex-end" display="flex" pb="md" mt="md">
                        <Button size="xs" type="submit">
                            Submit
                        </Button>
                    </Group>
                </form>
            </Box>
        </>
    );
};

export default AddInvoice;
