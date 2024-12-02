import { IconCashBanknote, IconInvoice, IconPackages, IconUsersGroup } from "@tabler/icons-react";
import { BarChart } from "@mantine/charts";
import { Button, Group } from "@mantine/core";
import toNotify from "../helpers/toNotify.tsx";

const DashboardPage = () => {
    const data = [
        {
            month: "January",
            "Keshara Super Lime": 1200,
            "Keshara Skim Coat": 900,
            "Keshara Tile Master": 200,
            "Keshara Dollamite Fertilizer": 300,
        },
        {
            month: "February",
            "Keshara Super Lime": 1900,
            "Keshara Skim Coat": 1200,
            "Keshara Tile Master": 400,
            "Keshara Dollamite Fertilizer": 500,
        },
        {
            month: "March",
            "Keshara Super Lime": 400,
            "Keshara Skim Coat": 1000,
            "Keshara Tile Master": 200,
            "Keshara Dollamite Fertilizer": 600,
        },
        {
            month: "April",
            "Keshara Super Lime": 1000,
            "Keshara Skim Coat": 200,
            "Keshara Tile Master": 800,
            "Keshara Dollamite Fertilizer": 700,
        },
        {
            month: "May",
            "Keshara Super Lime": 800,
            "Keshara Skim Coat": 1400,
            "Keshara Tile Master": 1200,
            "Keshara Dollamite Fertilizer": 1000,
        },
        {
            month: "June",
            "Keshara Super Lime": 750,
            "Keshara Skim Coat": 600,
            "Keshara Tile Master": 1000,
            "Keshara Dollamite Fertilizer": 1200,
        },
    ];

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded shadow flex items-center">
                    <div className="mr-4">
                        <IconCashBanknote />
                    </div>
                    <div>
                        <div className="text-lg font-semibold">Cheques</div>
                        <div className="text-sm"># 155</div>
                    </div>
                </div>

                <div className=" p-6 rounded shadow flex items-center">
                    <div className="mr-4">
                        <IconInvoice />
                    </div>
                    <div>
                        <div className="text-lg font-semibold">Invoices</div>
                        <div className="text-sm"># 155</div>
                    </div>
                </div>

                <div className=" p-6 rounded shadow flex items-center">
                    <div className="mr-4">
                        <IconUsersGroup />
                    </div>
                    <div>
                        <div className="text-lg font-semibold">Customers</div>
                        <div className="text-sm"># 155</div>
                    </div>
                </div>

                <div className=" p-6 rounded shadow flex items-center">
                    <div className="mr-4">
                        <IconPackages />
                    </div>
                    <div>
                        <div className="text-lg font-semibold">Products</div>
                        <div className="text-sm"># 155</div>
                    </div>
                </div>
            </div>
            <div className="w-full h-full mt-12 flex flex-col lg:flex-row">
                {/* First Chart */}
                <div className="w-full lg:w-1/2 p-4 shadow">
                    <BarChart
                        h={300}
                        data={data}
                        dataKey="month"
                        series={[
                            { name: "Keshara Super Lime", color: "lime.6" },
                            { name: "Keshara Skim Coat", color: "gray.6" },
                            { name: "Keshara Tile Master", color: "orange.6" },
                            { name: "Keshara Dollamite Fertilizer", color: "green.6" },
                        ]}
                        tickLine="y"
                    />
                </div>

                {/* Second Chart */}
                <div className="w-full lg:w-1/2 p-4">
                    <div>
                        <Group mt="xl">
                            <Button
                                color="green"
                                onClick={() => toNotify("Success", "This is a success message", "SUCCESS")}
                            >
                                Show Success
                            </Button>
                            <Button
                                color="red"
                                onClick={() => toNotify("Error", "This is an error message", "ERROR")}
                            >
                                Show Error
                            </Button>
                            <Button
                                color="blue"
                                onClick={() => toNotify("Loading", "Loading in progress...", "LOADING")}
                            >
                                Show Loading
                            </Button>
                            <Button
                                color="yellow"
                                onClick={() => toNotify("Warning", "This is a warning message", "WARNING")}
                            >
                                Show Warning
                            </Button>
                        </Group>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DashboardPage;
