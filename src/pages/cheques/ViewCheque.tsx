import { IconArrowLeft, } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Badge, Button, Card } from "@mantine/core";
import {
    changeStatusCheque,
    getCheque,
} from "../../store/chequeSlice/chequeSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";

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
            toNotify("Success", "Cheque status changed successfully", "SUCCESS");
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
            <div className="items-center flex flex-row justify-between p-4">
                <div className="flex flex-row items-center">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <span className="text-lg font-semibold ml-4">
                        View Cheque
                    </span>
                </div>
            </div>
            <div className="mx-4 my-4 lg:w-1/2">
                <Card shadow="md" withBorder>
                    <div className="flex flex-row">
                        <div className="w-2/4 lg:w-1/4">Customer:</div>
                        <div>{cheque?.customer}</div>
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
                        <div>{cheque?.depositDate}</div>
                    </div>
                    <div className="flex items-end mt-4">
                        <Badge
                            color={
                                colorsForCheque[
                                    cheque?.chequeStatus as ChequeStatus
                                ] || "gray"
                            }
                            radius="sm"
                        >
                            {cheque?.chequeStatus}
                        </Badge>
                    </div>
                </Card>
                <div className="mt-4 flex justify-end">
                    {cheque?.chequeStatus === "DEPOSITED" && (
                        <>
                            <Button
                                color="red"
                                radius="sm"
                                ml={10}
                                onClick={() => chequeStatusUpdate("RETURNED")}
                            >
                                Returned
                            </Button>
                            <Button
                                color="green"
                                radius="sm"
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
                            ml={10}
                            onClick={() => chequeStatusUpdate("DEPOSITED")}
                        >
                            Re-Deposit
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
};

export default ViewCheque;
