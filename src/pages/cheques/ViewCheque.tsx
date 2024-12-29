import { IconArrowLeft } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Badge, Box, Button, Card, Group, Text } from "@mantine/core";
import {
    changeStatusCheque,
    getCheque,
} from "../../store/chequeSlice/chequeSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";
import { datePreview } from "../../helpers/preview.tsx";

type ChequeStatus = "PENDING" | "DEPOSITED" | "RETURNED" | "COMPLETED";

const ViewCheque = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const id: any = useParams().id ?? null;
    const cheque = useSelector(
        (state: RootState) => state.cheque.selectedCheque
    );

    useEffect(() => {
        if (id) {
            fetchSelectedCheque();
        }
    }, [dispatch]);

    const fetchSelectedCheque = async () => {
        setLoading(true);
        await dispatch(getCheque(id));
        setLoading(false);
    };

    const colorsForCheque: Record<ChequeStatus, string> = {
        PENDING: "yellow",
        DEPOSITED: "blue",
        RETURNED: "red",
        COMPLETED: "green",
    };

    const chequeStatusUpdate = async (status: string) => {
        setLoading(true);
        const payload = {
            id,
            values: { chequeStatus: status },
        };
        const response = await dispatch(changeStatusCheque(payload));
        if (response.type === "cheque/changeStatus/fulfilled") {
            await fetchSelectedCheque();
            setLoading(false);
            toNotify(
                "Success",
                "Cheque status changed successfully",
                "SUCCESS"
            );
        } else if (response.type === "cheque/changeStatus/rejected") {
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
                    <Text ml="md" size="lg" fw={500}>
                        View Cheque
                    </Text>
                </Group>
            </Group>
            <Box mx="md" my="md">
                <Card shadow="md" withBorder w={{ sm: "100%", lg: "50%" }}>
                    <div className="flex flex-row">
                        <div className="w-2/4 lg:w-1/4">Customer:</div>
                        <div>{cheque?.customer?.name}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="w-2/4 lg:w-1/4">Bank:</div>
                        <div>{cheque?.bank}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="w-2/4 lg:w-1/4">Branch:</div>
                        <div>{cheque?.branch}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="w-2/4 lg:w-1/4">Cheque Number:</div>
                        <div>{cheque?.number}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="w-2/4 lg:w-1/4">Amount:</div>
                        <div>Rs. {cheque?.amount?.toFixed(2)}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="w-2/4 lg:w-1/4">Deposit Date:</div>
                        <div>{datePreview(cheque.depositDate)}</div>
                    </div>
                    <div className="flex items-end mt-4">
                        <Badge
                            color={
                                colorsForCheque[
                                    cheque?.chequeStatus as ChequeStatus
                                ] || "gray"
                            }
                            radius="xs"
                            size="sm"
                        >
                            {cheque?.chequeStatus}
                        </Badge>
                    </div>
                </Card>
                <Group
                    display="flex"
                    justify="flex-end"
                    w={{ sm: "100%", lg: "50%" }}
                    mt="md"
                >
                    {cheque?.chequeStatus === "DEPOSITED" && (
                        <>
                            <Button
                                color="red"
                                radius="sm"
                                size="xs"
                                ml={10}
                                onClick={() => chequeStatusUpdate("RETURNED")}
                            >
                                Returned
                            </Button>
                            <Button
                                color="green"
                                radius="sm"
                                size="xs"
                                ml={10}
                                onClick={() => chequeStatusUpdate("COMPLETED")}
                            >
                                Completed
                            </Button>
                        </>
                    )}

                    {cheque?.chequeStatus === "PENDING" && (
                        <Button
                            color="blue"
                            radius="sm"
                            size="xs"
                            ml={10}
                            onClick={() => chequeStatusUpdate("DEPOSITED")}
                        >
                            Deposited
                        </Button>
                    )}
                    {cheque?.chequeStatus === "RETURNED" && (
                        <Button
                            color="blue"
                            radius="sm"
                            size="xs"
                            ml={10}
                            onClick={() => chequeStatusUpdate("DEPOSITED")}
                        >
                            Re-Deposit
                        </Button>
                    )}
                </Group>
            </Box>
        </>
    );
};

export default ViewCheque;
