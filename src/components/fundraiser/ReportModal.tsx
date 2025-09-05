import { motion } from "framer-motion";
import { useState } from "react";
import { Loader, Download } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "react-hot-toast";
import { fundraiserService } from "../../api/services/fundraiser";

const ReportModal = ({ showModal, setShowModal }) => {
  const [reportType, setReportType] = useState("campaigns");
  const [reportFormat, setReportFormat] = useState("pdf");
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    endDate: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await fundraiserService.getFundraiserReports(
        reportType,
        reportFormat,
        dateRange.startDate,
        dateRange.endDate
      );

      if (!response) {
        throw new Error("No data received from the report API");
      }

      if (response.fileUrl) {
        window.open(response.fileUrl, "_blank");
      } else if (response.fileData) {
        const blob = new Blob([response.fileData], {
          type: reportFormat === "pdf" ? "application/pdf" : "text/csv",
        });
        const url = URL.createObjectURL(blob);

        if (reportFormat === "pdf") {
          window.open(url, "_blank");
        } else {
          const a = document.createElement("a");
          a.href = url;
          a.download = `${reportType}-report-${dateRange.startDate}-to-${dateRange.endDate}.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } else {
        console.log("Report data received:", response);
        toast.success("Report data received. See console for details.");
      }

      toast.success(`Report generated successfully`);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error(
        "Failed to generate report: " + (error.message || "Unknown error")
      );
    } finally {
      setAnalyticsLoading(false);
      setShowModal(false);
    }
  };

  if (!showModal) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
          Generate Fundraising Report
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
              Report Type
            </label>
            <select
              className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="campaigns">Campaigns Report</option>
              <option value="donations">Donations Report</option>
              <option value="payouts">Payouts Report</option>
              <option value="fraud">Fraud Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
              Format
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-primary-600"
                  checked={reportFormat === "pdf"}
                  onChange={() => setReportFormat("pdf")}
                />
                <span className="ml-2 text-slate-700 dark:text-gray-300">
                  PDF
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-primary-600"
                  checked={reportFormat === "csv"}
                  onChange={() => setReportFormat("csv")}
                />
                <span className="ml-2 text-slate-700 dark:text-gray-300">
                  CSV
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 dark:text-gray-400 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange({
                      ...dateRange,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-gray-400 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange({
                      ...dateRange,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            className="px-4 py-2 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-600 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center"
            onClick={handleGenerateReport}
            disabled={analyticsLoading}
          >
            {analyticsLoading ? (
              <>
                <Loader size={16} className="animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Download size={16} className="mr-2" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReportModal;