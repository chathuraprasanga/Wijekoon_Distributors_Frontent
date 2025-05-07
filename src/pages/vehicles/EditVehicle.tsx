import { Box, Button, Group, Select, TextInput } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import toNotify from "../../helpers/toNotify.tsx";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { getVehicle, updateVehicle } from "../../store/vehicleSlice/vehicleSlice.ts";

const EdiVehicle = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();
    const id = useParams().id;
    const selectedVehicle = useSelector(
        (state: RootState) => state.vehicles.selectedVehicle
    );

    useEffect(() => {
        fetchSupplier();
    }, [dispatch, id]);

    useEffect(() => {
        vehicleEdiForm.setValues(selectedVehicle);
        vehicleEdiForm.resetDirty();
    }, [selectedVehicle]);

    const fetchSupplier = async () => {
        setLoading(false);
        await dispatch(getVehicle(id));
        setLoading(false);
    };

    const vehicleEdiForm = useForm({
        mode: "uncontrolled",
        initialValues: {
            type: "",
            brand: "",
            number: "",
        },
        validate: {
            type: isNotEmpty("Type is required"),
            brand: isNotEmpty("Brand is required"),
            number: isNotEmpty("Number is required"),
        },
    });

    const handleVehicleEdit = async (
        values: typeof vehicleEdiForm.values
    ) => {
        setLoading(true);
        const response = await dispatch(updateVehicle({ id, values }));
        if (response.type === "vehicle/updateVehicle/fulfilled") {
            setLoading(false);
            toNotify("Successs", "Supplier updated successfully", "SUCCESS");
            navigate("/app/suppliers");
        } else if (response.type === "vehicle/updateVehicle/rejected") {
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
                    <Group display="flex">Edit Supplier</Group>
                </Group>
            </Group>
            <Box w={{ sm: "100%", lg: "50%" }} px="lg">
                <form onSubmit={vehicleEdiForm.onSubmit(handleVehicleEdit)}>
                    <Select
                        label="Type"
                        withAsterisk
                        placeholder="Select Vehicle Type"
                        data={[
                            "Car",
                            "Van",
                            "Bus",
                            "Lorry",
                            "Truck",
                            "Bike",
                            "Three Wheeler",
                        ]}
                        key={vehicleEdiForm.key("type")}
                        {...vehicleEdiForm.getInputProps("type")}
                    />
                    <TextInput
                        label="Brand"
                        withAsterisk
                        placeholder="Enter Vehicle Brand"
                        key={vehicleEdiForm.key("brand")}
                        {...vehicleEdiForm.getInputProps("brand")}
                    />
                    <TextInput
                        label="Number"
                        placeholder="Enter Number"
                        withAsterisk
                        key={vehicleEdiForm.key("number")}
                        {...vehicleEdiForm.getInputProps("number")}
                    />

                    <Group justify="flex-end" display="flex" pb="md" mt="md">
                        <Button size="xs" type="submit" disabled={!vehicleEdiForm.isDirty()}>
                            Submit
                        </Button>
                    </Group>
                </form>
            </Box>
        </>
    );
};

export default EdiVehicle;
