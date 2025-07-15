import * as XLSX from "xlsx";

/**
 * Formats wallet data for export
 * @param {Array} wallets - Array of wallet objects
 * @returns {Array} - Formatted data ready for export
 */
const formatWalletDataForExport = (wallets) => {
  return wallets.map((wallet) => ({
    "Wallet ID": wallet.id,
    "Owner ID": wallet.user_uuid || wallet.group_uuid || "",
    Type: wallet.type || "user",
    Status: wallet.status || "Active",
    "Available Balance": parseFloat(wallet.availableBalance || 0).toFixed(2),
    "Locked Balance": parseFloat(wallet.lockedBalance || 0).toFixed(2),
    "Total Debit": parseFloat(wallet.debit || 0).toFixed(2),
    "Total Credit": parseFloat(wallet.credit || 0).toFixed(2),
    Currency: wallet.currency?.symbol || "KES",
    "Created Date": new Date(wallet.createdAt).toLocaleString(),
    "Last Updated": new Date(wallet.updatedAt).toLocaleString(),
  }));
};

/**
 * Exports wallet data to CSV format
 * @param {Array} wallets - Array of wallet objects
 * @param {string} filename - Name of the file to download
 */
export const exportToCSV = (wallets, filename = "wallet-export") => {
  try {
    const formattedData = formatWalletDataForExport(wallets);

    // Get headers from the first object
    const headers = Object.keys(formattedData[0]);

    // Create CSV content
    let csvContent = headers.join(",") + "\n";

    // Add data rows
    formattedData.forEach((item) => {
      const row = headers
        .map((header) => {
          // Wrap values with commas in quotes
          const value = item[header]?.toString() || "";
          return value.includes(",") ? `"${value}"` : value;
        })
        .join(",");
      csvContent += row + "\n";
    });

    // Create a Blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().getTime()}.csv`);
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error exporting to CSV:", error);
    return false;
  }
};

/**
 * Exports wallet data to Excel format
 * @param {Array} wallets - Array of wallet objects
 * @param {string} filename - Name of the file to download
 */
export const exportToExcel = (wallets, filename = "wallet-export") => {
  try {
    const formattedData = formatWalletDataForExport(wallets);

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(formattedData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Wallets");

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Create Blob and download
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_${new Date().getTime()}.xlsx`;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    return false;
  }
};

/**
 * Export wallet data based on format
 * @param {Array} wallets - Array of wallet objects
 * @param {string} format - 'csv' or 'excel'
 * @param {string} filename - Name of the file to download
 */
export const exportWalletData = (
  wallets,
  format = "excel",
  filename = "wallet-export"
) => {
  // Ensure wallets is an array
  if (!Array.isArray(wallets) || wallets.length === 0) {
    console.error("No wallet data to export");
    return false;
  }

  // Add timestamp to filename
  const dateStr = new Date().toISOString().split("T")[0];
  const filenameWithDate = `${filename}_${dateStr}`;

  if (format === "csv") {
    return exportToCSV(wallets, filenameWithDate);
  } else {
    return exportToExcel(wallets, filenameWithDate);
  }
};
