import { useLocation } from "react-router";
import { Box, Button, Group } from "@mantine/core";
import { IconArrowLeft, IconDownload } from "@tabler/icons-react";
import { DOWNLOAD_TYPES } from "../helpers/types.ts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import BulkInvoicePDF from "../pdf/BulkInvoicePDF.tsx";
import SalesRecordPDF from "../pdf/SalesRecordPDF.tsx";
import OrderPDF from "../pdf/OrderPDF.tsx";

const PdfViewPage = () => {
    const location = useLocation();
    const data = location.state?.data;
    const type = location.state?.type;

    const generatePdfToBulkInvoicePayments = (data: any) => {
        const element: any = document.querySelector("#pdf");

        if (!element) {
            console.error("Invoice element not found!");
            return;
        }

        html2canvas(element, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let yPosition = 0; // Y coordinate for placing the image
            let remainingHeight = imgHeight;

            while (remainingHeight > 0) {
                pdf.addImage(imgData, "PNG", 0, yPosition, imgWidth, imgHeight);
                remainingHeight -= pageHeight;
                yPosition -= pageHeight; // Move up for next slice

                if (remainingHeight > 0) {
                    pdf.addPage(); // Add a new page if content overflows
                }
            }

            pdf.save(`${data?.paymentId || data?.orderId}.pdf`);
        });
    };


    return (
        <>
            {/* Header */}
            <Box display="flex" p="lg" className="items-center justify-between">
                <Group display="flex">
                    <IconArrowLeft
                        className="cursor-pointer"
                        onClick={() => history.back()}
                    />
                    <span className="text-lg font-semibold ml-4">
                        PDF View
                    </span>
                </Group>
                <Group>
                    <Button
                        size="xs"
                        leftSection={<IconDownload size={16} />}
                        onClick={() => generatePdfToBulkInvoicePayments(data)}
                    >
                        Download
                    </Button>
                </Group>
            </Box>

            <Box w={{ sm: "100%", lg: "75%" }}>
                {type === DOWNLOAD_TYPES.BULK_INVOICE_PAYMENT && (
                    <BulkInvoicePDF data={data} />
                )}
                {type === DOWNLOAD_TYPES.SALES_RECORD && (
                    <SalesRecordPDF data={data} />
                )}
                {type === DOWNLOAD_TYPES.ORDER && (
                    <OrderPDF data={data} />
                )}
            </Box>
        </>
    );
};
export default PdfViewPage;
