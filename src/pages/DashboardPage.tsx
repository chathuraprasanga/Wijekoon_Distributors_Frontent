import {
    IconCashBanknote,
    IconInvoice,
    IconPackages,
    IconUsersGroup,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store.ts";
import { useEffect } from "react";
import { useLoading } from "../helpers/loadingContext.tsx";
import { getDashboardDetails } from "../store/dashboardSlice/dashboardSlice.ts";
import toNotify from "../helpers/toNotify.tsx";

const DashboardPage = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const user = useSelector((state: RootState) => state.auth.user);
    const dashboardDetails = useSelector((state: RootState) => state.dashboard);

    useEffect(() => {
        fetchDashboardDetails();
    }, [dispatch]);

    const fetchDashboardDetails = async () => {
        setLoading(true);
        const response = await dispatch(
            getDashboardDetails({ userId: user._id })
        );
        if (response.type === "dashboard/getDetails/fulfilled") {
            setLoading(false);
        } else {
            setLoading(false);
            toNotify(
                "Warning",
                "Something went wrong, Please contact Admin",
                "WARNING"
            );
        }
    };

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded shadow flex items-center">
                    <div className="mr-4">
                        <IconCashBanknote />
                    </div>
                    <div>
                        <div className="text-lg font-semibold">Cheques</div>
                        <div className="text-sm">
                            # {dashboardDetails?.chequesCount}
                        </div>
                    </div>
                </div>

                <div className=" p-6 rounded shadow flex items-center">
                    <div className="mr-4">
                        <IconInvoice />
                    </div>
                    <div>
                        <div className="text-lg font-semibold">Invoices</div>
                        <div className="text-sm">
                            # {dashboardDetails?.invoicesCount}
                        </div>
                    </div>
                </div>

                <div className=" p-6 rounded shadow flex items-center">
                    <div className="mr-4">
                        <IconUsersGroup />
                    </div>
                    <div>
                        <div className="text-lg font-semibold">Customers</div>
                        <div className="text-sm">
                            # {dashboardDetails?.customersCount}
                        </div>
                    </div>
                </div>

                <div className=" p-6 rounded shadow flex items-center">
                    <div className="mr-4">
                        <IconPackages />
                    </div>
                    <div>
                        <div className="text-lg font-semibold">Products</div>
                        <div className="text-sm">
                            # {dashboardDetails?.productsCount}
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-full mt-12 flex flex-col lg:flex-row">
                {/* First Chart */}
                <div className="w-full lg:w-1/2 p-4 shadow">

                </div>
                {/* Second Chart */}
                <div className="w-full lg:w-1/2 p-4">
                    <div></div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
