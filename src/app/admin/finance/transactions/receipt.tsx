import { useState, useEffect } from "react";
import {
  ArrowDownToLine,
  Copy,
  Download,
  Share,
  Printer,
  Shield,
  Clock,
  Calendar,
  CheckCircle,
  CircleDollarSign,
  Tag,
  Info,
  Wallet,
  ArrowLeft,
  AlertCircle,
  Loader,
} from "lucide-react";
import financeService from "../../../../api/services/finance";
import { useParams } from "react-router-dom";

export default function TransactionReceipt() {
  const [copied, setCopied] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const { id } = useParams();

  const getTransactionData = async () => {
    if (!id) {
      setError("Transaction ID is missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await financeService.getTransaction(id);
      console.log("Transaction Data:", res);

      const data = res.transaction;

      if (!data || Object.keys(data).length === 0) {
        throw new Error("No transaction data found");
      }

      setTransactionData(data);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
      setError(
        error.message || "Failed to fetch transaction data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactionData();
  }, [id]);

  const copyToClipboard = (text: string) => {
    if (!text) return;

    navigator.clipboard.writeText(text.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showNotification("Copied to clipboard");
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  const shareTransaction = async () => {
    if (!transactionData) return;

    const shareData = {
      title: `Transaction Receipt: ${transactionData.reference || "N/A"}`,
      text: `Transaction of ${formatCurrency(
        transactionData.amount || 0
      )} on ${formatDate(
        transactionData.createdAt || transactionData.created_at
      )}`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        showNotification("Transaction shared successfully");
      } else {
        copyToClipboard(window.location.href);
        showNotification("Transaction URL copied to clipboard");
      }
    } catch (error) {
      copyToClipboard(window.location.href);
      showNotification("Transaction URL copied to clipboard");
    }
  };

  const printReceipt = () => {
    window.print();
    showNotification("Printing receipt...");
  };

  const downloadReceipt = () => {
    showNotification("Receipt downloaded successfully");
  };

  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "--:--";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "--:--";

      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "--:--";
    }
  };

  const getTransactionType = () => {
    if (!transactionData) return "Transaction";

    // Determine transaction type based on available data
    if (transactionData.type) return transactionData.type;
    if (transactionData.transaction_type)
      return transactionData.transaction_type;
    if (parseFloat(transactionData.credit || 0) > 0) return "Money Received";
    if (parseFloat(transactionData.debit || 0) > 0) return "Money Sent";
    return "Transaction";
  };

  const getTransactionStatus = () => {
    if (!transactionData) return "pending";
    return (
      transactionData.status ||
      transactionData.transaction_status ||
      "completed"
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center">
        <div className="text-center">
          <Loader
            size={48}
            className="text-blue-500 dark:text-blue-400 animate-spin mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-slate-700 dark:text-gray-300 mb-2">
            Loading Transaction
          </h2>
          <p className="text-slate-500 dark:text-gray-400">
            Please wait while we fetch your transaction details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle
            size={48}
            className="text-red-500 dark:text-red-400 mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-slate-700 dark:text-gray-300 mb-2">
            Unable to Load Transaction
          </h2>
          <p className="text-slate-500 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center px-4 py-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 border border-slate-300 dark:border-gray-600 rounded-lg transition"
            >
              <ArrowLeft size={16} className="mr-2" />
              Go Back
            </button>
            <button
              onClick={getTransactionData}
              className="flex items-center justify-center px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!transactionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Info
            size={48}
            className="text-slate-400 dark:text-gray-500 mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-slate-700 dark:text-gray-300 mb-2">
            No Transaction Data
          </h2>
          <p className="text-slate-500 dark:text-gray-400 mb-6">
            We couldn't find any transaction data to display.
          </p>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center px-4 py-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 border border-slate-300 dark:border-gray-600 rounded-lg transition mx-auto"
          >
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const transactionDate = formatDate(
    transactionData.createdAt || transactionData.created_at
  );
  const transactionTime = formatTime(
    transactionData.createdAt || transactionData.created_at
  );
  const transactionType = getTransactionType();
  const transactionStatus = getTransactionStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Fixed top navigation bar */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-slate-100 dark:border-gray-700 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 transition"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={shareTransaction}
                className="flex items-center px-4 py-2 text-sm text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-full transition"
              >
                <Share size={16} className="mr-2" />
                Share
              </button>
              <button
                onClick={printReceipt}
                className="flex items-center px-4 py-2 text-sm text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-full transition"
              >
                <Printer size={16} className="mr-2" />
                Print
              </button>
              <button
                onClick={downloadReceipt}
                className="flex items-center px-5 py-2 text-sm bg-blue-500 dark:bg-blue-600 text-white rounded-full hover:bg-blue-600 dark:hover:bg-blue-700 transition shadow-md shadow-blue-100 dark:shadow-blue-900/20"
              >
                <Download size={16} className="mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-blue-500 dark:text-blue-400 text-2xl md:text-3xl font-medium mb-2">
            Transaction Receipt
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-gray-100 mb-2">
            {transactionType}
          </h2>
          <div
            className={`inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-full ${
              transactionStatus?.toLowerCase() === "completed" ||
              transactionStatus?.toLowerCase() === "success"
                ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                : transactionStatus?.toLowerCase() === "pending"
                ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                : "bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300"
            }`}
          >
            {transactionStatus}
          </div>
        </div>

        {/* Main Receipt Card */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 p-10 text-white relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>
              <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-white/5 rounded-full"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 space-y-6 md:space-y-0">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <ArrowDownToLine size={32} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm font-medium uppercase tracking-wider">
                        Transaction Type
                      </p>
                      <h3 className="text-white text-2xl font-bold">
                        {transactionType}
                      </h3>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center space-x-3 text-white/80 text-sm mb-2">
                      <Calendar size={16} />
                      <span>{transactionDate}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-white/80 text-sm">
                      <Clock size={16} />
                      <span>{transactionTime}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-white/80 text-lg mb-2">Amount</p>
                  <div className="text-6xl md:text-7xl font-bold mb-3">
                    {formatCurrency(transactionData.amount || 0)}
                  </div>
                  <div className="inline-flex items-center px-4 py-1.5 bg-white/10 rounded-full">
                    <CircleDollarSign size={16} className="mr-2" />
                    <span className="text-white/90">
                      Transaction {transactionStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details Content */}
            <div className="p-8 md:p-10">
              {/* Reference Number with Copy */}
              {(transactionData.reference ||
                transactionData.transaction_reference) && (
                <div className="mb-10">
                  <div
                    className="flex items-center justify-between p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/40 group cursor-pointer transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    onClick={() =>
                      copyToClipboard(
                        transactionData.reference ||
                          transactionData.transaction_reference
                      )
                    }
                  >
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-blue-500/10 dark:bg-blue-400/10 rounded-full flex items-center justify-center mr-4">
                        <Tag
                          size={24}
                          className="text-blue-500 dark:text-blue-400"
                        />
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-gray-400 text-sm mb-1">
                          Reference Number
                        </p>
                        <p className="text-slate-800 dark:text-gray-200 text-xl font-medium">
                          {transactionData.reference ||
                            transactionData.transaction_reference}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Copy size={20} className="mr-2" />
                      <span className="text-sm font-medium">Copy</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Two Column Layout for Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Transaction Details */}
                <div className="bg-slate-50 dark:bg-gray-700/50 rounded-3xl p-8 border border-gray-100 dark:border-gray-600 h-full">
                  <h3 className="text-slate-700 dark:text-gray-300 text-xl font-semibold mb-6 flex items-center">
                    <Info
                      size={20}
                      className="text-blue-500 dark:text-blue-400 mr-2"
                    />
                    Transaction Details
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <p className="text-slate-500 dark:text-gray-400 text-sm mb-1">
                        Transaction Type
                      </p>
                      <p className="text-slate-800 dark:text-gray-200 text-lg font-medium">
                        {transactionType}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500 dark:text-gray-400 text-sm mb-1">
                        Date & Time
                      </p>
                      <p className="text-slate-800 dark:text-gray-200 text-lg">
                        {transactionDate}, {transactionTime}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-gray-600">
                      <div>
                        <p className="text-slate-500 dark:text-gray-400 text-sm mb-1">
                          Debit
                        </p>
                        <p className="text-slate-800 dark:text-gray-200 font-mono text-lg">
                          {formatCurrency(transactionData.debit || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-gray-400 text-sm mb-1">
                          Credit
                        </p>
                        <p className="text-slate-800 dark:text-gray-200 font-mono text-lg">
                          {formatCurrency(transactionData.credit || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wallet Information */}
                <div className="bg-slate-50 dark:bg-gray-700/50 rounded-3xl p-8 border border-gray-100 dark:border-gray-600 h-full">
                  <h3 className="text-slate-700 dark:text-gray-300 text-xl font-semibold mb-6 flex items-center">
                    <Wallet
                      size={20}
                      className="text-blue-500 dark:text-blue-400 mr-2"
                    />
                    Wallet Information
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <p className="text-slate-500 dark:text-gray-400 text-sm mb-1">
                        Available Balance
                      </p>
                      <div className="flex items-center">
                        <p className="text-emerald-500 dark:text-emerald-400 text-4xl font-bold">
                          {formatCurrency(
                            transactionData.wallet?.availableBalance ||
                              transactionData.available_balance ||
                              transactionData.balance ||
                              0
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-gray-600">
                      <div>
                        <p className="text-slate-500 dark:text-gray-400 text-sm mb-1">
                          Wallet Type
                        </p>
                        <p className="text-slate-800 dark:text-gray-200 text-lg capitalize">
                          {transactionData.wallet?.type ||
                            transactionData.wallet_type ||
                            "Standard"}
                        </p>
                      </div>
                      <div className="px-4 py-2 rounded-full text-sm font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                        {transactionData.wallet?.status ||
                          transactionData.wallet_status ||
                          "Active"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              {(transactionData.description ||
                transactionData.transaction_description) && (
                <div className="bg-slate-50 dark:bg-gray-700/50 rounded-3xl p-8 border border-gray-100 dark:border-gray-600">
                  <div className="flex items-start">
                    <div className="w-14 h-14 bg-blue-500/10 dark:bg-blue-400/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <Info
                        size={24}
                        className="text-blue-500 dark:text-blue-400"
                      />
                    </div>
                    <div>
                      <p className="text-slate-700 dark:text-gray-300 text-xl font-semibold mb-2">
                        Description
                      </p>
                      <p className="text-slate-600 dark:text-gray-400 text-lg">
                        {transactionData.description ||
                          transactionData.transaction_description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with verification */}
            <div className="px-10 py-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
              <div className="flex items-center text-sm text-slate-500 dark:text-gray-400">
                <Shield
                  size={18}
                  className="mr-2 text-blue-500 dark:text-blue-400"
                />
                <span>This is an official verified transaction receipt</span>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={shareTransaction}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Share size={18} />
                </button>
                <button
                  onClick={printReceipt}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Printer size={18} />
                </button>
                <button
                  onClick={downloadReceipt}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors shadow-md shadow-blue-100 dark:shadow-blue-900/20"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Text */}
        <p className="mt-10 text-sm text-slate-500 dark:text-gray-400 text-center max-w-2xl">
          This is a secure digital receipt. All sensitive identifiers have been
          removed for your security. This receipt serves as official proof of
          transaction.
        </p>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className="fixed bottom-6 right-6 bg-slate-800 dark:bg-gray-700 text-white px-5 py-3 rounded-xl shadow-xl flex items-center print:hidden border border-gray-600 z-50 animate-fadeIn">
          <CheckCircle size={18} className="mr-2 text-emerald-400" />
          <span className="text-base">{notification.message}</span>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-content,
          .receipt-content * {
            visibility: visible;
          }
          .receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
