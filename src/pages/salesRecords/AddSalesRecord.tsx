import { IconArrowLeft } from "@tabler/icons-react";
import {
    Group,
    Text,
    Box,
} from "@mantine/core";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store.ts";
import {  getProducts } from "../../store/productSlice/productSlice.ts";
import { useEffect } from "react";
import { getCustomers } from "../../store/customerSlice/customerSlice.ts";

const AddSalesRecord = () => {
    const dispatch = useDispatch<AppDispatch | any>();

    useEffect(() => {
        fetchRelatedDetails();
    }, [dispatch]);

    const fetchRelatedDetails = async () => {
        await dispatch(getCustomers({ status: true }));
        await dispatch(getProducts({ status: true }));
    };


    return (
        <>
            <Group p="lg" className="flex flex-col md:flex-row justify-between items-center">
                <Group className="flex items-center">
                    <IconArrowLeft className="cursor-pointer" onClick={() => history.back()} />
                    <Text fw={500} ml="md" size="lg">
                        Add Sales Record
                    </Text>
                </Group>
            </Group>

            <Box px="lg" className="w-full">

            </Box>
        </>
    );
};

export default AddSalesRecord;
