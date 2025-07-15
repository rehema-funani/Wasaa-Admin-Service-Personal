
interface Transaction {
  id: string;
  user_uuid: string;
  amount: string;
  description: string;
  source: string | null;
  type: string;
  debit: string;
  credit: string;
  status: string;
  counterpartyId: string | null;
  reference: string;
  createdAt: string;
  wallet: Wallet;
  walletId?: string;
  walletName?: string;
  timestamp?: string;
}

interface Wallet {
  id: string;
  user_uuid: string;
  group_uuid: string | null;
  type: string;
  status: string;
  availableBalance: string;
  lockedBalance: string;
  debit: string;
  credit: string;
  currencyId: string;
  createdAt: string;
  updatedAt: string;
}

const formatDateTime = (dateString: string): { date: string; time: string } => {
  try {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  } catch (error) {
    return { date: "Invalid", time: "--" };
  }
};

const getTransactionType = (transaction: Transaction): string => {
  if (!transaction.type) return "Other";

  switch (transaction.type.toUpperCase()) {
    case "TOPUP":
      return "Deposit";
    case "WITHDRAW":
      return "Withdrawal";
    case "TRANSFER":
      return "Transfer";
    default:
      return transaction.type;
  }
};

const getTransactionAmount = (transaction: Transaction): number => {
  return parseFloat(transaction.amount?.toString() || "0") || 0;
};

const formatCurrency = (amount: number) => {
  const million = 1_000_000;
  const billion = 1_000_000_000;
  const trillion = 1_000_000_000_000;

  if (Math.abs(amount) >= trillion) {
    const formatted = (amount / trillion).toFixed(2);
    const trimmed = formatted.replace(/\.00$/, "");
    return `KES ${trimmed} trillion`;
  } else if (Math.abs(amount) >= billion) {
    const formatted = (amount / billion).toFixed(2);
    const trimmed = formatted.replace(/\.00$/, "");
    return `KES ${trimmed} billion`;
  } else if (Math.abs(amount) >= million) {
    const formatted = (amount / million).toFixed(2);
    const trimmed = formatted.replace(/\.00$/, "");
    return `KES ${trimmed} million`;
  }

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatReference = (reference: string): string => {
  if (!reference) return "N/A";

  if (reference.startsWith("CREDIT-") || reference.startsWith("DEBIT-")) {
    return reference.split("-")[1];
  }

  return reference;
};

const getWalletBalance = (wallet: Wallet): string => {
  if (!wallet) return "0.00";

  const availableBalance = wallet.availableBalance;
  if (availableBalance === "NaN") {
    const credit = parseFloat(wallet.credit || "0");
    const debit = parseFloat(wallet.debit || "0");

    if (isNaN(debit)) {
      return credit.toFixed(2);
    }

    return (credit - debit).toFixed(2);
  }

  return parseFloat(availableBalance).toFixed(2);
};

const calculateTotals = (data: Transaction[]) => {
  let totalDeposits = 0;
  let totalWithdrawals = 0;
  let totalTransfers = 0;
  let totalAmount = 0;

  data.forEach((transaction) => {
    const amount = getTransactionAmount(transaction);
    totalAmount += amount;

    const type = getTransactionType(transaction);
    if (type === "Deposit") {
      totalDeposits += amount;
    } else if (type === "Withdrawal") {
      totalWithdrawals += amount;
    } else if (type === "Transfer") {
      totalTransfers += amount;
    }
  });

  return {
    totalAmount,
    totalDeposits,
    totalWithdrawals,
    totalTransfers,
    count: data.length,
  };
};

export const exportSecureReport = async (
  data: Transaction[],
  passcode: string
): Promise<void> => {
  try {
    // Calculate transaction totals for summary
    const totals = calculateTotals(data);

    // Generate the transaction table HTML
    const tableHtml = generateTransactionTable(data);

    const encryptContent = (content: string, key: string) => {
      let result = "";
      for (let i = 0; i < content.length; i++) {
        result += String.fromCharCode(
          content.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      // Use encodeURIComponent before btoa to handle Unicode characters
      return btoa(encodeURIComponent(result));
    };

    const encryptedContent = encryptContent(tableHtml, passcode);

    // Get date for report ID
    const now = new Date();
    const reportId = `TX-${now.getFullYear()}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(
      Math.random() * 10000
    )
      .toString()
      .padStart(4, "0")}`;

    // Create HTML with password protection
    const passwordProtectedHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Financial Report</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      /* Core palette */
      --blue-50: #EFF6FF;
      --blue-100: #DBEAFE;
      --blue-200: #BFDBFE;
      --blue-500: #3B82F6;
      --blue-600: #2563EB;
      --blue-700: #1D4ED8;
      
      /* Success/error colors */
      --green-50: #ECFDF5;
      --green-500: #10B981;
      --green-600: #059669;
      
      --amber-50: #FFFBEB;
      --amber-500: #F59E0B;
      
      --red-50: #FEF2F2;
      --red-500: #EF4444;
      
      /* Neutral tones */
      --gray-50: #F9FAFB;
      --gray-100: #F3F4F6;
      --gray-200: #E5E7EB;
      --gray-300: #D1D5DB;
      --gray-400: #9CA3AF;
      --gray-500: #6B7280;
      --gray-600: #4B5563;
      --gray-700: #374151;
      --gray-800: #1F2937;
      --gray-900: #111827;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      font-size: 14px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: var(--gray-700);
      background-color: white;
      line-height: 1.4;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px;
    }
    
    /* Modern login screen */
    .login-view {
      position: fixed;
      inset: 0;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }
    
    .login-container {
      width: 90%;
      max-width: 400px;
      background: white;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
    }
    
    .login-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }
    
    .login-logo svg {
      width: 40px;
      height: 40px;
      color: var(--blue-600);
    }
    
    .login-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--gray-900);
      margin-bottom: 8px;
      text-align: center;
    }
    
    .login-subtitle {
      font-size: 14px;
      color: var(--gray-500);
      margin-bottom: 32px;
      text-align: center;
    }
    
    .security-notice {
      background: var(--blue-50);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 24px;
      display: flex;
      gap: 12px;
    }
    
    .security-notice svg {
      flex-shrink: 0;
      color: var(--blue-600);
      margin-top: 2px;
    }
    
    .security-notice-content h4 {
      font-size: 14px;
      font-weight: 600;
      color: var(--gray-900);
      margin-bottom: 8px;
    }
    
    .security-notice-content p {
      font-size: 13px;
      color: var(--gray-600);
      margin-bottom: 4px;
    }
    
    .input-label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: var(--gray-700);
      margin-bottom: 6px;
    }
    
    .input-field {
      width: 100%;
      padding: 10px 14px;
      font-size: 14px;
      border: 1px solid var(--gray-300);
      border-radius: 8px;
      margin-bottom: 16px;
      font-family: 'Inter', sans-serif;
      transition: all 0.15s ease;
    }
    
    .input-field:focus {
      outline: none;
      border-color: var(--blue-500);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    }
    
    .error-message {
      display: none;
      background: var(--red-50);
      color: var(--red-500);
      font-size: 13px;
      padding: 10px 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      align-items: center;
    }
    
    .error-message svg {
      margin-right: 8px;
      flex-shrink: 0;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 500;
      padding: 10px 18px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: 'Inter', sans-serif;
    }
    
    .btn-primary {
      background: var(--blue-600);
      color: white;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      width: 100%;
    }
    
    .btn-primary:hover {
      background: var(--blue-700);
    }
    
    /* Report styles */
    .report-container {
      display: none;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      margin-bottom: 24px;
      overflow: hidden;
    }
    
    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid var(--gray-100);
    }
    
    .report-company {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .company-logo svg {
      width: 32px;
      height: 32px;
      color: var(--blue-600);
    }
    
    .company-info h2 {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 2px;
    }
    
    .company-info p {
      font-size: 13px;
      color: var(--gray-500);
      margin: 0;
    }
    
    .report-meta {
      text-align: right;
    }
    
    .report-meta h3 {
      font-size: 15px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 4px;
    }
    
    .report-meta p {
      font-size: 13px;
      color: var(--gray-500);
      margin: 0 0 2px;
    }
    
    .report-id {
      font-family: 'JetBrains Mono', monospace;
      color: var(--blue-600);
      font-size: 12px;
      font-weight: 500;
    }
    
    .report-body {
      padding: 24px;
      position: relative;
    }
    
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 80px;
      font-weight: 700;
      opacity: 0.02;
      color: var(--gray-900);
      white-space: nowrap;
      pointer-events: none;
      user-select: none;
    }
    
    .section-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--gray-900);
      margin-bottom: 16px;
      position: relative;
    }
    
    /* Summary cards */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    
    .summary-card {
      background: var(--gray-50);
      border-radius: 12px;
      padding: 16px;
      border: 1px solid var(--gray-100);
    }
    
    .summary-card h4 {
      font-size: 13px;
      font-weight: 500;
      color: var(--gray-500);
      margin-bottom: 6px;
    }
    
    .summary-value {
      font-size: 17px;
      font-weight: 500;
      color: var(--gray-900);
    }
    
    .transaction-table-container {
      overflow-x: auto;
      border-radius: 12px;
      border: 1px solid var(--gray-100);
    }
    
    /* Table styling handled in table generation function */
    
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid var(--gray-100);
      color: var(--gray-500);
      font-size: 12px;
      text-align: center;
    }
    
    .footer p {
      margin-bottom: 4px;
    }
    
    .report-actions {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    
    .btn-secondary {
      background: var(--gray-100);
      color: var(--gray-700);
    }
    
    .btn-secondary:hover {
      background: var(--gray-200);
    }
    
    @media print {
      body {
        background: white;
      }
      .container {
        max-width: 100%;
        padding: 0;
      }
      .login-view {
        display: none !important;
      }
      .report-container {
        display: block !important;
        box-shadow: none;
        border-radius: 0;
      }
      .report-actions {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Login Screen -->
    <div id="loginView" class="login-view">
      <div class="login-container">
        <div class="login-logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        
        <h1 class="login-title">Secure Financial Report</h1>
        <p class="login-subtitle">Enter passcode to access transaction data</p>
        
        <div class="security-notice">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <div class="security-notice-content">
            <h4>Password Protected Report</h4>
            <p>This report contains sensitive financial information encrypted with your passcode.</p>
            <p>Generated: ${new Date().toLocaleString()}</p>
          </div>
        </div>
        
        <div id="passwordForm">
          <label for="passcodeInput" class="input-label">Passcode</label>
          <input type="password" id="passcodeInput" class="input-field" placeholder="Enter your passcode" autocomplete="off">
          
          <div class="error-message" id="errorMessage">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
              <path d="M12 9v4"></path><path d="M12 17h.01"></path>
            </svg>
            Incorrect passcode. Please try again.
          </div>
          
          <button onclick="attemptUnlock()" class="btn btn-primary">
            Unlock Report
          </button>
        </div>
      </div>
    </div>
    
    <!-- Report Container -->
    <div id="reportContainer" class="report-container">
      <div class="report-header">
        <div class="report-company">
          <div class="company-logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div class="company-info">
            <h2>Wasaachat ltd</h2>
            <p>Senteu Plaza, Lenana rd Junction</p>
          </div>
        </div>
        <div class="report-meta">
          <h3>Transaction Report</h3>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <p>Records: ${totals.count}</p>
          <p class="report-id">${reportId}</p>
        </div>
      </div>
      
      <div class="report-body">
        <div class="watermark">CONFIDENTIAL</div>
        
        <h2 class="section-title">Financial Summary</h2>
        <div class="summary-grid">
          <div class="summary-card">
            <h4>Total Transactions</h4>
            <div class="summary-value">${totals.count}</div>
          </div>
          <div class="summary-card">
            <h4>Total Deposits</h4>
            <div class="summary-value" style="color: var(--green-500);">${formatCurrency(
              totals.totalDeposits
            )}</div>
          </div>
          <div class="summary-card">
            <h4>Total Withdrawals</h4>
            <div class="summary-value" style="color: var(--red-500);">${formatCurrency(
              totals.totalWithdrawals
            )}</div>
          </div>
          <div class="summary-card">
            <h4>Net Amount</h4>
            <div class="summary-value">${formatCurrency(
              totals.totalAmount
            )}</div>
          </div>
        </div>
        
        <h2 class="section-title">Transaction Details</h2>
        <div class="transaction-table-container" id="transactionTableContainer"></div>
        
        <div class="footer">
          <p>This report is confidential and contains sensitive financial information.</p>
          <p>© ${new Date().getFullYear()} Wasaachat Ltd. All rights reserved.</p>
        </div>
        
        <div class="report-actions">
          <button onclick="logout()" class="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Lock Report
          </button>
          <button onclick="printPDF()" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect width="12" height="8" x="6" y="14"></rect>
            </svg>
            Save as PDF
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <script>
    // The encrypted content
    const encryptedData = "${encryptedContent}";
    const correctPasscode = "${passcode}";
    
    function decryptContent(content, key) {
      try {
        // First decode from Base64, then decode the URL encoding
        const decoded = decodeURIComponent(atob(content));
        let result = '';
        for (let i = 0; i < decoded.length; i++) {
          result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
      } catch (e) {
        console.error('Decryption failed:', e);
        return '';
      }
    }
    
    function attemptUnlock() {
      const passcodeInput = document.getElementById('passcodeInput').value;
      const errorMessage = document.getElementById('errorMessage');
      const loginView = document.getElementById('loginView');
      const reportContainer = document.getElementById('reportContainer');
      
      if (passcodeInput === correctPasscode) {
        // Correct passcode - decrypt and show content
        const decryptedContent = decryptContent(encryptedData, correctPasscode);
        document.getElementById('transactionTableContainer').innerHTML = decryptedContent;
        
        // Show the report view
        loginView.style.display = 'none';
        reportContainer.style.display = 'block';
      } else {
        // Wrong passcode
        errorMessage.style.display = 'flex';
        
        // Shake the input field for feedback
        const input = document.getElementById('passcodeInput');
        input.style.animation = 'none';
        setTimeout(() => {
          input.style.animation = 'shake 0.5s';
        }, 10);
      }
    }
    
    function printPDF() {
      // Add print instructions
      const printInstructions = document.createElement('div');
      printInstructions.innerHTML = \`
        <div style="position:fixed; top:0; left:0; right:0; background-color:var(--blue-50); padding:12px; text-align:center; z-index:9999; border-bottom:1px solid var(--blue-100); box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <h2 style="margin:0; color:var(--gray-900); font-size: 14px; font-weight: 600;">Save as PDF</h2>
          <p style="margin:6px 0 0; color: var(--gray-600); font-size: 12px;">In the printer dialog, select "Save as PDF" or "Microsoft Print to PDF" as your printer.</p>
        </div>
      \`;
      document.body.appendChild(printInstructions);
      
      // Print the document
      window.print();
      
      // Remove instructions after printing
      setTimeout(() => {
        document.body.removeChild(printInstructions);
      }, 100);
    }
    
    function logout() {
      const loginView = document.getElementById('loginView');
      const reportContainer = document.getElementById('reportContainer');
      
      // Hide report view, show login
      loginView.style.display = 'flex';
      reportContainer.style.display = 'none';
      
      // Clear passcode input
      document.getElementById('passcodeInput').value = '';
      document.getElementById('errorMessage').style.display = 'none';
    }
    
    // Allow Enter key to submit
    document.getElementById('passcodeInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        attemptUnlock();
      }
    });
    
    // Add shake animation for incorrect passcode
    const style = document.createElement('style');
    style.textContent = \`
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
      }
    \`;
    document.head.appendChild(style);
  </script>
</body>
</html>
    `;

    const blob = new Blob([passwordProtectedHTML], {
      type: "text/html",
    });

    if ((window.navigator as any).msSaveOrOpenBlob) {
      (window.navigator as any).msSaveOrOpenBlob(
        blob,
        `secure_transactions_report_${new Date().getTime()}.html`
      );
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `secure_transactions_report_${new Date().getTime()}.html`;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    }
  } catch (error) {
    console.error("Error exporting secure report:", error);
    throw new Error("Failed to export secure report. Please try again.");
  }
};

const generateTransactionTable = (data: Transaction[]) => {
  let tableHtml = "";

  tableHtml +=
    "<table style=\"width:100%; border-collapse:collapse; font-family: 'Inter', sans-serif; font-size: 13px;\">";
  tableHtml +=
    '<thead><tr style="background-color:#F9FAFB; border-bottom: 1px solid #E5E7EB;">';

  const headers = [
    "Type",
    "Amount",
    "Date",
    "Time",
    "Status",
    "Reference",
    "Description",
    "Wallet Balance",
  ];

  headers.forEach((header) => {
    tableHtml += `<th style="padding:10px 12px; text-align:left; font-size:11px; font-weight:500; color:#6B7280; text-transform:uppercase; letter-spacing:0.05em;">${header}</th>`;
  });

  tableHtml += "</tr></thead><tbody>";

  data.forEach((transaction, index) => {
    const { date, time } = formatDateTime(transaction.createdAt);
    const isEven = index % 2 === 0;
    const type = getTransactionType(transaction);

    let amountColor = "#6B7280";
    if (type === "Deposit") {
      amountColor = "#10B981";
    } else if (type === "Withdrawal") {
      amountColor = "#EF4444";
    }

    let statusBg = "#F3F4F6"; 
    let statusColor = "#6B7280"; 
    let statusText = transaction.status;

    if (transaction.status?.toUpperCase() === "COMPLETED") {
      statusBg = "#ECFDF5";
      statusColor = "#059669";
      statusText = "Completed";
    } else if (transaction.status?.toUpperCase() === "PENDING") {
      statusBg = "#FFFBEB";
      statusColor = "#D97706";
      statusText = "Pending";
    } else if (transaction.status?.toUpperCase() === "FAILED") {
      statusBg = "#FEF2F2";
      statusColor = "#DC2626";
      statusText = "Failed";
    }

    tableHtml += `<tr style="background-color:${
      isEven ? "white" : "#F9FAFB"
    }; border-bottom: 1px solid #E5E7EB;">`;

    let typeIcon = "●";
    if (type === "Deposit") {
      typeIcon = "↓";
    } else if (type === "Withdrawal") {
      typeIcon = "↑";
    } else if (type === "Transfer") {
      typeIcon = "⇄";
    }

    tableHtml += `<td style="padding:12px; font-size:13px; color:#374151;">
      <div style="display:flex; align-items:center;">
        <span style="display:inline-flex; width:16px; height:16px; border-radius:50%; background-color:${amountColor}; color:white; text-align:center; align-items:center; justify-content:center; line-height:1; margin-right:8px; font-size:10px;">${typeIcon}</span>
        ${type}
      </div>
    </td>`;

    const amount = getTransactionAmount(transaction);
    const prefix = type === "Withdrawal" ? "-" : type === "Deposit" ? "+" : "";
    tableHtml += `<td style="padding:12px; font-size:13px; font-weight:500; color:${amountColor}; text-align:right;">${prefix}${formatCurrency(
      amount
    )}</td>`;

    tableHtml += `<td style="padding:12px; font-size:13px; color:#374151;">${date}</td>`;

    tableHtml += `<td style="padding:12px; font-size:13px; color:#6B7280;">${time}</td>`;

    tableHtml += `<td style="padding:12px;">
      <span style="display:inline-block; padding:3px 8px; border-radius:9999px; background-color:${statusBg}; color:${statusColor}; font-size:11px; font-weight:500;">${statusText}</span>
    </td>`;

    tableHtml += `<td style="padding:12px; font-size:13px; color:#6B7280; font-family:'JetBrains Mono', monospace; letter-spacing:-0.02em;">${formatReference(
      transaction.reference
    )}</td>`;

    // Description
    tableHtml += `<td style="padding:12px; font-size:13px; color:#374151;">${
      transaction.description || "—"
    }</td>`;

    // Wallet Balance
    tableHtml += `<td style="padding:12px; font-size:13px; font-weight:500; color:#374151; text-align:right;">${formatCurrency(
      parseFloat(getWalletBalance(transaction.wallet))
    )}</td>`;

    tableHtml += "</tr>";
  });

  tableHtml += "</tbody></table>";
  return tableHtml;
};
