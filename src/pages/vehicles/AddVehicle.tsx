import {
    Box,
    Button,
    Group,
    TextInput,
    Text,
    Select,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store.ts";
import toNotify from "../../helpers/toNotify.tsx";
import { useNavigate } from "react-router";
import { addVehicle } from "../../store/vehicleSlice/vehicleSlice.ts";

const AddVehicle = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();

    const vehicleAddForm = useForm({
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

    const handleVehicleAdd = async (values: typeof vehicleAddForm.values) => {
        setLoading(true);
        const response = await dispatch(addVehicle(values));
        if (response.type === "vehicle/addVehicle/fulfilled") {
            setLoading(false);
            toNotify("Successs", "Vehicle added successfully", "SUCCESS");
            navigate("/app/vehicles");
        } else if (response.type === "vehicle/addVehicle/rejected") {
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
                    <Text size="lg" fw={500} ml="md">
                        Add Vehicle
                    </Text>
                </Group>
            </Group>
            <Box w={{ sm: "100%", lg: "50%" }} px="lg">
                <form onSubmit={vehicleAddForm.onSubmit(handleVehicleAdd)}>
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
                        key={vehicleAddForm.key("type")}
                        {...vehicleAddForm.getInputProps("type")}
                    />
                    <TextInput
                        label="Brand"
                        withAsterisk
                        placeholder="Enter Vehicle Brand"
                        key={vehicleAddForm.key("brand")}
                        {...vehicleAddForm.getInputProps("brand")}
                    />
                    <TextInput
                        label="Number"
                        placeholder="Enter Number"
                        withAsterisk
                        key={vehicleAddForm.key("number")}
                        {...vehicleAddForm.getInputProps("number")}
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

export default AddVehicle;
