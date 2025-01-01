import { IconArrowLeft } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Badge, Box, Button, Card, Group, Text } from "@mantine/core";
import {
    changeStatusCheque,
} from "../../store/chequeSlice/chequeSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";
import { amountPreview, bankPreview, datePreview } from "../../helpers/preview.tsx";
import { getChequePayment } from "../../store/chequePaymentSlice/chequePaymentSlice.ts";

type ChequePaymentStatus = "PENDING" | "RETURNED" | "COMPLETED";

const ViewChequePayment = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const id: any = useParams().id ?? null;
    const chequePayment = useSelector(
        (state: RootState) => state.chequePayments.selectedChequePayment
    );

    useEffect(() => {
        if (id) {
            fetchSelectedChequePayment();
        }
    }, [dispatch]);

    const fetchSelectedChequePayment = async () => {
        setLoading(true);
        await dispatch(getChequePayment(id));
        setLoading(false);
    };

    const colorsForCheque: Record<ChequePaymentStatus, string> = {
        PENDING: "yellow",
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
        if (response.type === "chequePayment/changeStatus/fulfilled") {
            await fetchSelectedChequePayment();
            setLoading(false);
            toNotify(
                "Success",
                "Cheque payment status changed successfully",
                "SUCCESS"
            );
        } else if (response.type === "chequePayment/changeStatus/rejected") {
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
                        <div>{chequePayment?.payFor}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="w-2/4 lg:w-1/4">Bank:</div>
                        <div>{bankPreview(chequePayment?.bankAccount?.bank)}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="w-2/4 lg:w-1/4">Branch:</div>
                        <div>{chequePayment?.number}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="w-2/4 lg:w-1/4">Amount:</div>
                        <div>{amountPreview(chequePayment?.amount)}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="w-2/4 lg:w-1/4">Deposit Date:</div>
                        <div>{datePreview(chequePayment?.date)}</div>
                    </div>
                    <div className="flex items-end mt-4">
                        <Badge
                            color={
                                colorsForCheque[
                                    chequePayment?.paymentStatus as ChequePaymentStatus
                                    ] || "gray"
                            }
                            radius="xs"
                            size="sm"
                        >
                            {chequePayment?.paymentStatus}
                        </Badge>
                    </div>
                </Card>
                <Group
                    display="flex"
                    justify="flex-end"
                    w={{ sm: "100%", lg: "50%" }}
                    mt="md"
                >
                    {chequePayment?.paymentStatus === "PENDING" && (
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
                    {chequePayment?.chequeStatus === "RETURNED" && (
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

export default ViewChequePayment;
