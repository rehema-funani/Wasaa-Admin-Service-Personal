import { useState, useRef, useEffect } from "react";
import { Download, FileText, FileSpreadsheet, ChevronDown } from "lucide-react";
import { exportWalletData } from "./walletExportFunctions";
import toast from "react-hot-toast";

const ExportDropdown = ({ wallets, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleExport = (format) => {
    if (isLoading || !wallets || wallets.length === 0) {
      toast.error("No wallet data available for export");
      return;
    }

    // Start export process
    const loadingId = toast.loading(
      `Preparing ${format.toUpperCase()} export...`
    );

    try {
      const success = exportWalletData(wallets, format, "wallet_export");

      if (success) {
        toast.success(
          `Successfully exported wallets to ${format.toUpperCase()}`,
          {
            id: loadingId,
          }
        );
      } else {
        toast.error(`Failed to export wallets to ${format.toUpperCase()}`, {
          id: loadingId,
        });
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error(`Export failed: ${error.message}`, {
        id: loadingId,
      });
    }

    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl text-sm shadow-sm hover:from-indigo-700 hover:to-blue-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
      >
        <Download size={16} className="mr-2" strokeWidth={1.8} />
        Export
        <ChevronDown size={16} className="ml-2" strokeWidth={1.8} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-10 py-1 animate-fadeIn">
          <button
            onClick={() => handleExport("excel")}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 w-full text-left transition-colors"
          >
            <FileSpreadsheet size={16} className="mr-2" strokeWidth={1.8} />
            Export as Excel
          </button>
          <button
            onClick={() => handleExport("csv")}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 w-full text-left transition-colors"
          >
            <FileText size={16} className="mr-2" strokeWidth={1.8} />
            Export as CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
