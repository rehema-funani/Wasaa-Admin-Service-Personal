import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Settings,
  Shield,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  X,
  HelpCircle,
  CreditCard,
  Clock,
  Users,
  Briefcase,
  Percent,
  DollarSign,
  Eye,
  EyeOff,
  Tag,
  Upload,
  RefreshCw,
  UploadCloud,
  Info,
  BarChart2,
  FileText,
  MessageSquare,
  Lock,
  Hexagon,
  Globe,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from "lucide-react";
import businessService from "../../../api/services/businessService";
import { toast } from "react-hot-toast";

const BusinessSettingsPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    registration: true,
    verification: true,
    financial: true,
    limits: true,
    display: true,
    verification: false,
    financial: false,
    limits: false,
    display: false,
    integration: false,
    security: false,
  });

  // Settings form state
  const [settings, setSettings] = useState({
    // Registration settings
    registrationEnabled: true,
    requireVerificationBeforeOperating: true,
    allowPublicRegistration: true,
    registrationEnabled: false,
    requireVerificationBeforeOperating: false,
    allowPublicRegistration: false,
    adminApprovalRequired: false,
    requiredDocuments: [
      "businessRegistration",
      "taxCertificate",
      "ownerIdentification",
    ],
    requiredDocuments: [],
    registrationFee: 0,

    // Verification settings
    autoVerifyEmails: true,
    kycLevel: "standard", // basic, standard, advanced
    documentVerificationTimeout: 48, // hours
    autoVerifyEmails: false,
    kycLevel: "",
    documentVerificationTimeout: 0,
    allowOperationPendingVerification: false,

    // Financial settings
    transactionFeePercent: 2.5,
    minimumTransactionFee: 10,
    maxTransactionFeeAmount: 1000,
    walletEnabled: true,
    maxWalletBalance: 1000000,
    allowExternalPayments: true,
    payoutSchedule: "weekly", // daily, weekly, monthly, manual
    minimumPayoutAmount: 1000,
    transactionFeePercent: 0,
    minimumTransactionFee: 0,
    maxTransactionFeeAmount: 0,
    walletEnabled: false,
    maxWalletBalance: 0,
    allowExternalPayments: false,
    payoutSchedule: "",
    minimumPayoutAmount: 0,

    // Limits and restrictions
    maxProductsPerBusiness: 100,
    maxCategoriesPerBusiness: 5,
    maxMediaPerProduct: 10,
    maxStorefrontBanners: 5,
    maxProductsPerBusiness: 0,
    maxCategoriesPerBusiness: 0,
    maxMediaPerProduct: 0,
    maxStorefrontBanners: 0,
    productApprovalRequired: false,
    restrictedProductCategories: ["alcohol", "tobacco", "pharmaceuticals"],
    restrictedProductCategories: [],

    // Display settings
    defaultBusinessSortOrder: "newest", // newest, highestRated, mostPopular
    businessListingPageSize: 24,
    showBusinessRatings: true,
    showVerificationBadges: true,
    showBusinessContacts: true,
    allowBusinessCustomization: true,
    defaultBusinessSortOrder: "",
    businessListingPageSize: 0,
    showBusinessRatings: false,
    showVerificationBadges: false,
    showBusinessContacts: false,
    allowBusinessCustomization: false,

    // Integration settings
    enableApiAccess: true,
    allowSocialLogin: true,
    allowExternalLinks: true,
    allowEmbeddedContent: false,
    trackingCookiesEnabled: true,

    // Security settings
    twoFactorAuthRequired: false,
    passwordPolicyStrength: "medium", // low, medium, high
    sessionTimeout: 60, // minutes
    loginThrottling: true,
    maxLoginAttempts: 5,
    securityAuditFrequency: "monthly", // weekly, monthly, quarterly
    passwordPolicyStrength: "",
    sessionTimeout: 0,
    loginThrottling: false,
    maxLoginAttempts: 0,
    securityAuditFrequency: "",
  });

  // Lists for dropdowns and options
  const kycLevelOptions = [
    { value: "basic", label: "Basic" },
    { value: "standard", label: "Standard" },
    { value: "advanced", label: "Advanced" },
  ];

  const payoutScheduleOptions = [
    { value: "", label: "Select Schedule" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "manual", label: "Manual" },
  ];

  const sortOrderOptions = [
    { value: "newest", label: "Newest First" },
    { value: "highestRated", label: "Highest Rated" },
    { value: "mostPopular", label: "Most Popular" },
    { value: "alphabetical", label: "Alphabetical" },
  ];

  const passwordStrengthOptions = [
    { value: "low", label: "Low (minimum 6 characters)" },
    { value: "medium", label: "Medium (8+ chars, requires numbers)" },
    { value: "high", label: "High (8+ chars, numbers, symbols, mixed case)" },
    { value: "", label: "Select Strength" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const securityAuditOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
  ];

  const documentOptions = [
    {
      value: "businessRegistration",
      label: "Business Registration Certificate",
    },
    { value: "taxCertificate", label: "Tax Certificate" },
    { value: "ownerIdentification", label: "Owner ID Document" },
    { value: "utilityBill", label: "Utility Bill" },
    { value: "bankStatement", label: "Bank Statement" },
    { value: "businessPermit", label: "Business Permit" },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);

    try {
      // Simulate API call with timeout
      setTimeout(() => {
        // In a real app, you would fetch settings from API
        // const response = await businessService.getBusinessSettings();
        // setSettings(response);
        setIsLoading(false);
      }, 1000);
      const response = await businessService.getBusinessSettings();
      setSettings(response);
    } catch (error) {
      console.error("Error fetching business settings:", error);
      toast.error("Failed to load business settings.");
      // Initialize with empty arrays to prevent crashes on render
      setSettings(prev => ({ ...prev, requiredDocuments: [], restrictedProductCategories: [] }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  const handleToggleChange = (field) => {
    setSettings({
      ...settings,
      [field]: !settings[field],
    });
  };

  const handleDocumentChange = (document) => {
    let updatedDocuments = [...settings.requiredDocuments];

    if (updatedDocuments.includes(document)) {
      updatedDocuments = updatedDocuments.filter((doc) => doc !== document);
    } else {
      updatedDocuments.push(document);
    }

    setSettings({
      ...settings,
      requiredDocuments: updatedDocuments,
    });
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);

    try {
      // Simulate API call with timeout
      setTimeout(() => {
        // In a real app, you would save settings via API
        // await businessService.updateBusinessSettings(settings);
        setIsSaving(false);
        setShowSuccessMessage(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      }, 1500);
      await businessService.updateBusinessSettings(settings);
      toast.success("Settings saved successfully!");
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Error saving business settings:", error);
      toast.error((error as Error).message || "Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // Function to render a toggle switch setting
  const renderToggleSetting = (field, label, description) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
      <div>
        <p className="font-medium text-gray-700 dark:text-gray-300">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <div className="relative inline-block w-12 align-middle select-none">
        <input
          type="checkbox"
          id={field}
          className="hidden"
          checked={settings[field]}
          onChange={() => handleToggleChange(field)}
        />
        <label
          htmlFor={field}
          className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
            settings[field]
              ? "bg-blue-600 dark:bg-blue-500"
              : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <span
            className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
              settings[field] ? "translate-x-6" : "translate-x-0"
            }`}
          ></span>
        </label>
      </div>
    </div>
  );

  // Function to render a number input setting
  const renderNumberSetting = (
    field,
    label,
    description,
    min = 0,
    max = null,
    unit = null
  ) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
      <div>
        <p className="font-medium text-gray-700 dark:text-gray-300">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <div className="flex items-center">
        <input
          type="number"
          min={min}
          max={max}
          className="w-24 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
          value={settings[field]}
          onChange={(e) => handleInputChange("", field, Number(e.target.value))}
        />
        {unit && (
          <span className="ml-2 text-gray-500 dark:text-gray-400">{unit}</span>
        )}
      </div>
    </div>
  );

  // Function to render a dropdown select setting
  const renderSelectSetting = (field, label, description, options) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
      <div>
        <p className="font-medium text-gray-700 dark:text-gray-300">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <select
        className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
        value={settings[field]}
        onChange={(e) => handleInputChange("", field, e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-white/20 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 hover:bg-white/50 dark:hover:bg-gray-800 rounded-xl transition-colors"
                onClick={() => navigate("/admin/business/dashboard")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-400 bg-clip-text text-transparent">
                  Business Settings
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Configure platform-wide business settings and policies
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="p-2.5 hover:bg-white/50 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-600 dark:text-gray-400"
                onClick={fetchSettings}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                title="Refresh Settings"
              >
                <RefreshCw size={18} />
              </motion.button>
              <motion.button
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                onClick={handleSaveSettings}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Settings
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-20 right-6 bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <CheckCircle size={18} />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">
              Loading settings...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Registration Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-white/20 dark:border-gray-700 shadow-sm">
              <button
                className="w-full flex items-center justify-between mb-4"
                onClick={() => toggleSection("registration")}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Business Registration
                  </h2>
                </div>
                {expandedSections.registration ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>

              {expandedSections.registration && (
                <div className="mt-4 space-y-1">
                  {renderToggleSetting(
                    "registrationEnabled",
                    "Enable Business Registration",
                    "Allow new businesses to register on the platform"
                  )}

                  {renderToggleSetting(
                    "requireVerificationBeforeOperating",
                    "Require Verification Before Operating",
                    "Businesses must be verified before they can sell products"
                  )}

                  {renderToggleSetting(
                    "allowPublicRegistration",
                    "Allow Public Registration",
                    "Allow anyone to register a business without invitation"
                  )}

                  {renderToggleSetting(
                    "adminApprovalRequired",
                    "Admin Approval Required",
                    "New business registrations require admin approval"
                  )}

                  {renderNumberSetting(
                    "registrationFee",
                    "Registration Fee",
                    "One-time fee for registering a business",
                    0,
                    null,
                    "KES"
                  )}

                  <div className="py-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="mb-2">
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Required Documents
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Documents required for business registration
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {documentOptions.map((doc) => (
                        <label key={doc.value} className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-blue-600 dark:text-blue-500 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-600"
                            checked={settings.requiredDocuments.includes(
                              doc.value
                            )}
                            onChange={() => handleDocumentChange(doc.value)}
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {doc.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Verification Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-white/20 dark:border-gray-700 shadow-sm">
              <button
                className="w-full flex items-center justify-between mb-4"
                onClick={() => toggleSection("verification")}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Verification & KYC
                  </h2>
                </div>
                {expandedSections.verification ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>

              {expandedSections.verification && (
                <div className="mt-4 space-y-1">
                  {renderToggleSetting(
                    "autoVerifyEmails",
                    "Auto-Verify Email Addresses",
                    "Automatically verify email addresses on registration"
                  )}

                  {renderSelectSetting(
                    "kycLevel",
                    "KYC Verification Level",
                    "Level of KYC verification required for businesses",
                    kycLevelOptions
                  )}

                  {renderNumberSetting(
                    "documentVerificationTimeout",
                    "Document Verification Timeout",
                    "Time allowed for document verification",
                    1,
                    168,
                    "hours"
                  )}

                  {renderToggleSetting(
                    "allowOperationPendingVerification",
                    "Allow Limited Operation During Verification",
                    "Businesses can operate with limitations while verification is pending"
                  )}
                </div>
              )}
            </div>

            {/* Financial Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-white/20 dark:border-gray-700 shadow-sm">
              <button
                className="w-full flex items-center justify-between mb-4"
                onClick={() => toggleSection("financial")}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Financial Settings
                  </h2>
                </div>
                {expandedSections.financial ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>

              {expandedSections.financial && (
                <div className="mt-4 space-y-1">
                  {renderNumberSetting(
                    "transactionFeePercent",
                    "Transaction Fee Percentage",
                    "Percentage fee charged on each transaction",
                    0,
                    100,
                    "%"
                  )}

                  {renderNumberSetting(
                    "minimumTransactionFee",
                    "Minimum Transaction Fee",
                    "Minimum fee charged per transaction",
                    0,
                    null,
                    "KES"
                  )}

                  {renderNumberSetting(
                    "maxTransactionFeeAmount",
                    "Maximum Transaction Fee",
                    "Maximum fee charged per transaction",
                    0,
                    null,
                    "KES"
                  )}

                  {renderToggleSetting(
                    "walletEnabled",
                    "Enable Business Wallets",
                    "Allow businesses to have platform wallets"
                  )}

                  {renderNumberSetting(
                    "maxWalletBalance",
                    "Maximum Wallet Balance",
                    "Maximum amount a business can hold in their wallet",
                    0,
                    null,
                    "KES"
                  )}

                  {renderToggleSetting(
                    "allowExternalPayments",
                    "Allow External Payment Methods",
                    "Businesses can accept payments from external sources"
                  )}

                  {renderSelectSetting(
                    "payoutSchedule",
                    "Payout Schedule",
                    "How often businesses receive their funds",
                    payoutScheduleOptions
                  )}

                  {renderNumberSetting(
                    "minimumPayoutAmount",
                    "Minimum Payout Amount",
                    "Minimum amount for a payout to be processed",
                    0,
                    null,
                    "KES"
                  )}
                </div>
              )}
            </div>

            {/* Limits and Restrictions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-white/20 dark:border-gray-700 shadow-sm">
              <button
                className="w-full flex items-center justify-between mb-4"
                onClick={() => toggleSection("limits")}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Limits & Restrictions
                  </h2>
                </div>
                {expandedSections.limits ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>

              {expandedSections.limits && (
                <div className="mt-4 space-y-1">
                  {renderNumberSetting(
                    "maxProductsPerBusiness",
                    "Maximum Products Per Business",
                    "Maximum number of products a business can list",
                    1,
                    null
                  )}

                  {renderNumberSetting(
                    "maxCategoriesPerBusiness",
                    "Maximum Categories Per Business",
                    "Maximum number of categories a business can be listed in",
                    1,
                    null
                  )}

                  {renderNumberSetting(
                    "maxMediaPerProduct",
                    "Maximum Media Per Product",
                    "Maximum number of images/videos per product",
                    1,
                    null
                  )}

                  {renderNumberSetting(
                    "maxStorefrontBanners",
                    "Maximum Storefront Banners",
                    "Maximum number of banner images in a business storefront",
                    1,
                    null
                  )}

                  {renderToggleSetting(
                    "productApprovalRequired",
                    "Product Approval Required",
                    "New products require admin approval before being listed"
                  )}

                  <div className="py-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="mb-2">
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Restricted Product Categories
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Product categories that require special approval
                      </p>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {settings.restrictedProductCategories.map((category) => (
                        <div
                          key={category}
                          className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-full text-sm flex items-center gap-1"
                        >
                          <span>{category}</span>
                          <button
                            className="text-amber-700 dark:text-amber-500 hover:text-amber-900 dark:hover:text-amber-300"
                            onClick={() => {
                              setSettings({
                                ...settings,
                                restrictedProductCategories:
                                  settings.restrictedProductCategories.filter(
                                    (c) => c !== category
                                  ),
                              });
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Add category..."
                          className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                          onKeyDown={(e) => {
                            const input = e.target as HTMLInputElement;
                            if (e.key === "Enter" && input.value.trim()) {
                              setSettings({
                                ...settings,
                                restrictedProductCategories: [
                                  ...settings.restrictedProductCategories,
                                  input.value.trim(),
                                ],
                              });
                              input.value = "";
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Display Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-white/20 dark:border-gray-700 shadow-sm">
              <button
                className="w-full flex items-center justify-between mb-4"
                onClick={() => toggleSection("display")}
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Display Settings
                  </h2>
                </div>
                {expandedSections.display ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>

              {expandedSections.display && (
                <div className="mt-4 space-y-1">
                  {renderSelectSetting(
                    "defaultBusinessSortOrder",
                    "Default Business Sort Order",
                    "Default sorting for business listings",
                    sortOrderOptions
                  )}

                  {renderNumberSetting(
                    "businessListingPageSize",
                    "Business Listing Page Size",
                    "Number of businesses shown per page",
                    6,
                    100
                  )}

                  {renderToggleSetting(
                    "showBusinessRatings",
                    "Show Business Ratings",
                    "Display star ratings for businesses"
                  )}

                  {renderToggleSetting(
                    "showVerificationBadges",
                    "Show Verification Badges",
                    "Display verification badges on business profiles"
                  )}

                  {renderToggleSetting(
                    "showBusinessContacts",
                    "Show Business Contact Information",
                    "Display business contact information publicly"
                  )}

                  {renderToggleSetting(
                    "allowBusinessCustomization",
                    "Allow Business Customization",
                    "Businesses can customize their storefront appearance"
                  )}
                </div>
              )}
            </div>

            {/* Integration Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-white/20 dark:border-gray-700 shadow-sm">
              <button
                className="w-full flex items-center justify-between mb-4"
                onClick={() => toggleSection("integration")}
              >
                <div className="flex items-center gap-2">
                  <Hexagon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Integration Settings
                  </h2>
                </div>
                {expandedSections.integration ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>

              {expandedSections.integration && (
                <div className="mt-4 space-y-1">
                  {renderToggleSetting(
                    "enableApiAccess",
                    "Enable API Access",
                    "Allow businesses to access the platform API"
                  )}

                  {renderToggleSetting(
                    "allowSocialLogin",
                    "Allow Social Login",
                    "Enable login via social media accounts"
                  )}

                  {renderToggleSetting(
                    "allowExternalLinks",
                    "Allow External Links",
                    "Businesses can add links to external websites"
                  )}

                  {renderToggleSetting(
                    "allowEmbeddedContent",
                    "Allow Embedded Content",
                    "Businesses can embed external content in their profiles"
                  )}

                  {renderToggleSetting(
                    "trackingCookiesEnabled",
                    "Enable Tracking Cookies",
                    "Allow analytics and tracking cookies on business pages"
                  )}

                  <div className="py-4 mt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          API Documentation
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Business API documentation and developer resources
                        </p>
                      </div>
                      <a
                        href="#"
                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={14} />
                        <span>View Documentation</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Security Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-white/20 dark:border-gray-700 shadow-sm">
              <button
                className="w-full flex items-center justify-between mb-4"
                onClick={() => toggleSection("security")}
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Security Settings
                  </h2>
                </div>
                {expandedSections.security ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>

              {expandedSections.security && (
                <div className="mt-4 space-y-1">
                  {renderToggleSetting(
                    "twoFactorAuthRequired",
                    "Require Two-Factor Authentication",
                    "Business accounts must use 2FA for security"
                  )}

                  {renderSelectSetting(
                    "passwordPolicyStrength",
                    "Password Policy Strength",
                    "Required strength for business account passwords",
                    passwordStrengthOptions
                  )}

                  {renderNumberSetting(
                    "sessionTimeout",
                    "Session Timeout",
                    "Business account session timeout period",
                    5,
                    1440,
                    "minutes"
                  )}

                  {renderToggleSetting(
                    "loginThrottling",
                    "Enable Login Throttling",
                    "Restrict repeated login attempts"
                  )}

                  {renderNumberSetting(
                    "maxLoginAttempts",
                    "Maximum Login Attempts",
                    "Number of failed attempts before temporary lockout",
                    1,
                    20
                  )}

                  {renderSelectSetting(
                    "securityAuditFrequency",
                    "Security Audit Frequency",
                    "How often to audit business account security",
                    securityAuditOptions
                  )}

                  <div className="py-4 mt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                      <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">
                          Security Best Practices
                        </p>
                        <p>
                          Regularly audit business accounts and review
                          suspicious activities. Security settings affect all
                          businesses on the platform.
                        </p>
                        <a
                          href="#"
                          className="text-blue-700 dark:text-blue-400 hover:underline mt-2 inline-block"
                        >
                          View Security Dashboard
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8">
              <motion.button
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors flex items-center gap-2"
                onClick={fetchSettings}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw size={16} />
                Reset Changes
              </motion.button>

              <motion.button
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                onClick={handleSaveSettings}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save All Settings
                  </>
                )}
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessSettingsPage;