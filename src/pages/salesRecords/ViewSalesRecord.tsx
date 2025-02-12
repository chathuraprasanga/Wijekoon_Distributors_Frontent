import { Button, Group, Text } from "@mantine/core";
import { IconArrowLeft, IconFile } from "@tabler/icons-react";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { getSalesRecord } from "../../store/salesRecordSlice/salesRecordSlice.ts";
import { DOWNLOAD_TYPES } from "../../helpers/types.ts";

const ViewSalesRecord = () => {
    const navigate = useNavigate();
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const id: any = useParams().id ?? null;
    const salesRecord = useSelector(
        (state: RootState) => state.salesRecords.selectedSalesRecord
    );

    useEffect(() => {
        if (id) {
            fetchSelectedSalesRecord();
        }
    }, [dispatch]);

    const fetchSelectedSalesRecord = async () => {
        setLoading(true);
        await dispatch(getSalesRecord(id));
        setLoading(false);
    };

    const gotoPdfView = (data:any) => {
        navigate("/app/pdf/view", { state: { data: data, type: DOWNLOAD_TYPES.SALES_RECORD } });
    };

    return (
        <>
            <Group p="lg" display="flex" justify="space-between" align="center">
                <Group display="flex">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <Text size="lg" fw={500} ml={"md"}>
                        View Sales Record
                    </Text>
                </Group>
                <Group>
                    <Button size="xs" leftSection={<IconFile size={16} />} onClick={() => gotoPdfView(salesRecord)}>
                        PDF View
                    </Button>
                </Group>
            </Group>
        </>
    );
};

export default ViewSalesRecord;
