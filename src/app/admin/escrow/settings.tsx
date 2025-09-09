import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Save,
  RefreshCw,
  Settings,
  Shield,
  Clock,
  AlertTriangle,
  Globe,
  CreditCard,
  DollarSign,
  Target,
  Activity,
  Layers,
  Scale,
  Percent,
  Smartphone,
  Bell,
  Brain,
  Scan,
  Key,
  Database,
  Wifi,
  ShieldCheck,
  UserCheck,
  Mail,
  Phone,
  Gavel,
  AlertCircle,
  Info,
  Plus,
  Minus,
  Edit,
  Trash2,
  X,
  ChevronRight,
  Check,
  ArrowRight,
  Eye,
  EyeOff,
  Sliders
} from "lucide-react";

const EscrowSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSettingsSummary, setShowSettingsSummary] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    defaultExpiry: 72,
    autoRelease: true,
    requireBuyerConfirmation: true,
    requireSellerConfirmation: false,
    enableDisputes: true,
    maxDisputeDuration: 14,
    defaultCurrency: "KES",
    multiCurrencyEnabled: true,
    enablePartialRelease: true,
    enableMilestones: true,
    maxMilestones: 10,
    enableAutoEscalation: true,
    escalationThreshold: 48,
  });

  // Fee Structure State
  const [feeSettings, setFeeSettings] = useState({
    standardFee: 2.5,
    expressFeeSurcharge: 1.0,
    highValueDiscount: 0.5,
    volumeDiscountThreshold: 1000000,
    minimumFee: 100,
    maximumFee: 50000,
    refundProcessingFee: 50,
    disputeProcessingFee: 200,
    expeditedProcessingFee: 500,
    currencyConversionSpread: 0.5,
  });

  // Risk & Compliance State
  const [riskSettings, setRiskSettings] = useState({
    enableKYCCheck: true,
    strictKYCMode: false,
    enableAMLScreening: true,
    amlThreshold: 100000,
    enableSanctionsCheck: true,
    enablePEPCheck: true,
    maxTransactionAmount: 10000000,
    dailyTransactionLimit: 50000000,
    enableVelocityChecks: true,
    enableDeviceFingerprinting: true,
    enableGeoBlocking: false,
    restrictedCountries: ["US", "IR", "KP"],
    enableFraudDetection: true,
    fraudScoreThreshold: 75,
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    webhookNotifications: true,
    pushNotifications: false,
    notifyOnCreation: true,
    notifyOnFunding: true,
    notifyOnRelease: true,
    notifyOnDispute: true,
    notifyOnExpiry: true,
    reminderBefore: 24,
    escalationNotifications: true,
    adminAlerts: true,
    systemMaintenanceAlerts: true,
    securityAlerts: true,
  });

  // Automation Rules State
  const [automationRules, setAutomationRules] = useState([
    {
      id: 1,
      name: "Auto-release for verified users",
      condition:
        "buyer_kyc_verified AND seller_kyc_verified AND amount < 500000",
      action: "auto_release",
      delay: 72,
      enabled: true,
      priority: 1,
    },
    {
      id: 2,
      name: "Express processing for premium users",
      condition: "user_tier = 'premium' OR user_tier = 'enterprise'",
      action: "expedite_processing",
      delay: 2,
      enabled: true,
      priority: 2,
    },
    {
      id: 3,
      name: "Enhanced review for high-value transactions",
      condition: "amount >= 2000000",
      action: "manual_review",
      delay: 0,
      enabled: true,
      priority: 3,
    },
  ]);

  // API & Integration Settings State
  const [apiSettings, setApiSettings] = useState({
    enableAPIAccess: true,
    rateLimitPerMinute: 1000,
    enableWebhooks: true,
    webhookRetryAttempts: 3,
    webhookTimeout: 30,
    enableSDK: true,
    allowedOrigins: [
      "https://app.example.com",
      "https://dashboard.example.com",
    ],
    requireAPIAuthentication: true,
    enableOAuth: true,
    apiVersioning: true,
    enableGraphQL: false,
    enableBulkOperations: true,
    maxBulkSize: 100,
  });

  const tabs = [
    { id: "general", name: "General Settings", icon: Settings },
    { id: "fees", name: "Fee Structure", icon: DollarSign },
    { id: "risk", name: "Risk & Compliance", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "automation", name: "Automation Rules", icon: Brain },
    { id: "api", name: "API & Integration", icon: Database },
  ];

  const saveSettings = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setHasChanges(false);
      // Show success notification
      showToast("Settings saved successfully", "success");
    }, 2000);
  };

  const resetToDefaults = () => {
    // Reset all settings to default values
    setHasChanges(true);
    showToast("Settings reset to defaults", "warning");
  };

  const showToast = (message, type = "info") => {
    // This would be implemented with a toast library like react-hot-toast
    console.log(`Toast: ${type} - ${message}`);
  };

  const toggleSetting = (section, key) => {
    switch (section) {
      case "general":
        setGeneralSettings((prev) => ({
          ...prev,
          [key]: !prev[key],
        }));
        break;
      case "risk":
        setRiskSettings((prev) => ({
          ...prev,
          [key]: !prev[key],
        }));
        break;
      case "notifications":
        setNotificationSettings((prev) => ({
          ...prev,
          [key]: !prev[key],
        }));
        break;
      case "api":
        setApiSettings((prev) => ({
          ...prev,
          [key]: !prev[key],
        }));
        break;
    }
    setHasChanges(true);
  };

  const updateNumericSetting = (section, key, value) => {
    switch (section) {
      case "general":
        setGeneralSettings((prev) => ({ ...prev, [key]: value }));
        break;
      case "fees":
        setFeeSettings((prev) => ({ ...prev, [key]: value }));
        break;
      case "risk":
        setRiskSettings((prev) => ({ ...prev, [key]: value }));
        break;
      case "notifications":
        setNotificationSettings((prev) => ({ ...prev, [key]: value }));
        break;
      case "api":
        setApiSettings((prev) => ({ ...prev, [key]: value }));
        break;
    }
    setHasChanges(true);
  };

  const ToggleSwitch = ({ enabled, onToggle, disabled = false, size = "default" }) => {
    const sizeClasses = size === "small" 
      ? "h-5 w-9" 
      : size === "large" 
        ? "h-7 w-14" 
        : "h-6 w-11";
    
    const thumbSizeClasses = size === "small" 
      ? "h-3.5 w-3.5" 
      : size === "large" 
        ? "h-5 w-5" 
        : "h-4 w-4";

    return (
      <motion.button
        className={`relative inline-flex items-center rounded-full transition-colors ${sizeClasses} ${
          enabled 
            ? "bg-gradient-to-r from-blue-500 to-purple-500" 
            : "bg-gray-200 dark:bg-gray-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={disabled ? undefined : onToggle}
        whileTap={disabled ? {} : { scale: 0.95 }}
      >
        <motion.span
          className={`inline-block transform rounded-full bg-white shadow-md ${thumbSizeClasses}`}
          initial={false}
          animate={{ 
            x: enabled 
              ? size === "small" 
                ? 20 
                : size === "large" 
                  ? 32 
                  : 24 
              : size === "small" 
                ? 2 
                : size === "large" 
                  ? 4 
                  : 3 
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.button>
    );
  };

  const SettingCard = ({
    title,
    description,
    children,
    icon: Icon,
    warning = false,
    className = "",
  }) => (
    <motion.div
      className={`p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border ${
        warning
          ? "border-orange-200 dark:border-orange-800/50"
          : "border-gray-100 dark:border-gray-700/50"
      } backdrop-blur-sm bg-opacity-90 dark:bg-opacity-80 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {Icon && (
            <div
              className={`p-3 rounded-xl ${
                warning
                  ? "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                  : "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400"
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {title}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              {description}
            </p>
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
  
  const NumberInput = ({ 
    value, 
    onChange, 
    min, 
    max, 
    step = 1, 
    prefix, 
    suffix, 
    disabled = false,
    className = "w-24",
    placeholder = ""
  }) => (
    <div className="relative flex items-center">
      {prefix && (
        <div className="absolute left-3 text-gray-400">
          {prefix}
        </div>
      )}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.valueAsNumber || 0)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        placeholder={placeholder}
        className={`${className} px-3 ${prefix ? 'pl-8' : 'pl-3'} ${suffix ? 'pr-10' : 'pr-3'} py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-shadow duration-200`}
      />
      {suffix && (
        <div className="absolute right-3 text-gray-500 dark:text-gray-400 pointer-events-none">
          {suffix}
        </div>
      )}
    </div>
  );

  const SettingRow = ({ 
    label, 
    tooltip, 
    children, 
    disabled = false,
    warning = false
  }) => (
    <div className={`flex items-center justify-between py-3 ${disabled ? 'opacity-60' : ''}`}>
      <div className="flex items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {tooltip && (
          <div className="group relative ml-2">
            <Info className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 w-60 p-2 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
              {tooltip}
            </div>
          </div>
        )}
        {warning && (
          <div className="ml-2">
            <AlertTriangle className="w-4 h-4 text-orange-500 dark:text-orange-400" />
          </div>
        )}
      </div>
      {children}
    </div>
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/30">
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Escrow Configuration
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
            Configure escrow system settings, rules, and operational parameters
          </p>
          <div className="flex items-center space-x-4 mt-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200/50 dark:border-gray-700/50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Status: Online</span>
            </div>
            {hasChanges && (
              <div className="flex items-center space-x-2 text-sm text-orange-600 dark:text-orange-400 bg-orange-50/80 dark:bg-orange-900/20 backdrop-blur-sm px-3 py-1 rounded-full border border-orange-200/50 dark:border-orange-800/50">
                <AlertCircle className="w-4 h-4" />
                <span>Unsaved changes</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <motion.button
            className="flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl text-sm shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700"
            onClick={resetToDefaults}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <RefreshCw size={16} className="mr-2" strokeWidth={2} />
            Reset to Defaults
          </motion.button>
          
          <motion.button
            className="flex items-center px-4 py-2.5 rounded-xl text-sm shadow-md font-medium border border-transparent"
            onClick={() => setShowSettingsSummary(!showSettingsSummary)}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            style={{
              background: "linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(124, 58, 237, 0.1))",
              color: "rgb(59, 130, 246)",
              border: "1px solid rgba(59, 130, 246, 0.2)"
            }}
          >
            {showSettingsSummary ? <EyeOff size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
            {showSettingsSummary ? "Hide Overview" : "View Overview"}
          </motion.button>
          
          <motion.button
            className={`flex items-center px-6 py-2.5 rounded-xl text-sm shadow-lg font-medium ${
              hasChanges
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
            onClick={saveSettings}
            disabled={!hasChanges || isLoading}
            whileHover={
              hasChanges
                ? { y: -2, boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)" }
                : {}
            }
            whileTap={hasChanges ? { y: 0 } : {}}
          >
            {isLoading ? (
              <RefreshCw
                size={16}
                className="mr-2 animate-spin"
                strokeWidth={2}
              />
            ) : (
              <Save size={16} className="mr-2" strokeWidth={2} />
            )}
            {isLoading ? "Saving..." : "Save Configuration"}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSettingsSummary && (
          <motion.div
            className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Sliders className="w-5 h-5 mr-2 text-blue-500" />
              Configuration Overview
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-500" />
                  General Settings
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Default Expiry:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{generalSettings.defaultExpiry} hours</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Auto-Release:</span>
                    <span className={`font-medium ${generalSettings.autoRelease ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {generalSettings.autoRelease ? 'Enabled' : 'Disabled'}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Default Currency:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{generalSettings.defaultCurrency}</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  Risk & Compliance
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">KYC Verification:</span>
                    <span className={`font-medium ${riskSettings.enableKYCCheck ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {riskSettings.enableKYCCheck ? 'Enabled' : 'Disabled'}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Max Transaction:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(riskSettings.maxTransactionAmount)}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Fraud Detection:</span>
                    <span className={`font-medium ${riskSettings.enableFraudDetection ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {riskSettings.enableFraudDetection ? 'Enabled' : 'Disabled'}
                    </span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                  Fee Structure
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Standard Fee:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{feeSettings.standardFee}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Minimum Fee:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(feeSettings.minimumFee)}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Maximum Fee:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(feeSettings.maximumFee)}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search settings..."
            className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab, index) => {
              const IconComponent = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  className={`whitespace-nowrap py-4 px-4 font-medium text-sm flex items-center space-x-2 rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-white/40 dark:bg-gray-800/40"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/30"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.name}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* General Settings Tab */}
        {activeTab === "general" && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SettingCard
                title="Default Escrow Duration"
                description="Set the default timeframe for escrow transactions before auto-expiry"
                icon={Clock}
              >
                <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-700">
                  <SettingRow 
                    label="Default Expiry (hours)" 
                    tooltip="The time period after which an escrow will automatically expire if not funded"
                  >
                    <NumberInput
                      value={generalSettings.defaultExpiry}
                      onChange={(value) => updateNumericSetting("general", "defaultExpiry", value)}
                      min={1}
                      max={720}
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Enable Auto-Release" 
                    tooltip="Automatically release funds to the seller after the escrow period ends without disputes"
                  >
                    <ToggleSwitch
                      enabled={generalSettings.autoRelease}
                      onToggle={() => toggleSetting("general", "autoRelease")}
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Require Buyer Confirmation" 
                    tooltip="Require explicit confirmation from the buyer before releasing funds"
                  >
                    <ToggleSwitch
                      enabled={generalSettings.requireBuyerConfirmation}
                      onToggle={() => toggleSetting("general", "requireBuyerConfirmation")}
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Require Seller Confirmation" 
                    tooltip="Require explicit confirmation from the seller before releasing funds"
                  >
                    <ToggleSwitch
                      enabled={generalSettings.requireSellerConfirmation}
                      onToggle={() => toggleSetting("general", "requireSellerConfirmation")}
                    />
                  </SettingRow>
                </div>
              </SettingCard>

              <SettingCard
                title="Dispute Management"
                description="Configure dispute handling and escalation settings"
                icon={Gavel}
              >
                <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-700">
                  <SettingRow 
                    label="Enable Disputes" 
                    tooltip="Allow users to initiate dispute resolution for escrow transactions"
                  >
                    <ToggleSwitch
                      enabled={generalSettings.enableDisputes}
                      onToggle={() => toggleSetting("general", "enableDisputes")}
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Max Dispute Duration (days)" 
                    tooltip="Maximum time allowed for resolving a dispute before system intervention"
                    disabled={!generalSettings.enableDisputes}
                  >
                    <NumberInput
                      value={generalSettings.maxDisputeDuration}
                      onChange={(value) => updateNumericSetting("general", "maxDisputeDuration", value)}
                      min={1}
                      max={60}
                      disabled={!generalSettings.enableDisputes}
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Enable Auto-Escalation" 
                    tooltip="Automatically escalate unresolved disputes to an administrator"
                    disabled={!generalSettings.enableDisputes}
                  >
                    <ToggleSwitch
                      enabled={generalSettings.enableAutoEscalation}
                      onToggle={() => toggleSetting("general", "enableAutoEscalation")}
                      disabled={!generalSettings.enableDisputes}
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Escalation Threshold (hours)" 
                    tooltip="Time after which a dispute is automatically escalated"
                    disabled={!generalSettings.enableDisputes || !generalSettings.enableAutoEscalation}
                  >
                    <NumberInput
                      value={generalSettings.escalationThreshold}
                      onChange={(value) => updateNumericSetting("general", "escalationThreshold", value)}
                      min={1}
                      max={168}
                      disabled={!generalSettings.enableDisputes || !generalSettings.enableAutoEscalation}
                    />
                  </SettingRow>
                </div>
              </SettingCard>

              <SettingCard
                title="Currency & Multi-Currency"
                description="Configure supported currencies and conversion settings"
                icon={DollarSign}
              >
                <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-700">
                  <SettingRow 
                    label="Default Currency" 
                    tooltip="The primary currency for escrow transactions"
                  >
                    <select
                      value={generalSettings.defaultCurrency}
                      onChange={(e) => {
                        setGeneralSettings((prev) => ({
                          ...prev,
                          defaultCurrency: e.target.value,
                        }));
                        setHasChanges(true);
                      }}
                      className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-shadow"
                    >
                      <option value="KES">KES - Kenyan Shilling</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </SettingRow>
                  
                  <SettingRow 
                    label="Enable Multi-Currency" 
                    tooltip="Allow escrow transactions in multiple currencies"
                  >
                    <ToggleSwitch
                      enabled={generalSettings.multiCurrencyEnabled}
                      onToggle={() => toggleSetting("general", "multiCurrencyEnabled")}
                    />
                  </SettingRow>
                  
                  <div className="pt-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                      <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                          <p className="font-medium mb-1">Currency Settings</p>
                          <p>
                            Currency settings affect all financial transactions. Changes may require updates to payment providers and financial reports.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="Advanced Features"
                description="Enable advanced escrow features like partial releases and milestones"
                icon={Target}
              >
                <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-700">
                  <SettingRow 
                    label="Enable Partial Release" 
                    tooltip="Allow releasing funds in portions rather than all at once"
                  >
                    <ToggleSwitch
                      enabled={generalSettings.enablePartialRelease}
                      onToggle={() => toggleSetting("general", "enablePartialRelease")}
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Enable Milestones" 
                    tooltip="Allow breaking escrow agreements into sequential deliverable milestones"
                  >
                    <ToggleSwitch
                      enabled={generalSettings.enableMilestones}
                      onToggle={() => toggleSetting("general", "enableMilestones")}
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Max Milestones per Escrow" 
                    tooltip="Maximum number of milestones allowed per escrow agreement"
                    disabled={!generalSettings.enableMilestones}
                  >
                    <NumberInput
                      value={generalSettings.maxMilestones}
                      onChange={(value) => updateNumericSetting("general", "maxMilestones", value)}
                      min={1}
                      max={50}
                      disabled={!generalSettings.enableMilestones}
                    />
                  </SettingRow>
                  
                  <div className="pt-4">
                    <motion.div 
                      className={`p-4 rounded-xl border ${
                        generalSettings.enableMilestones 
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30' 
                          : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                      }`}
                      animate={{
                        backgroundColor: generalSettings.enableMilestones 
                          ? 'rgba(240, 253, 244, 0.8)' 
                          : 'rgba(249, 250, 251, 0.8)'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start">
                        <Check className={`w-5 h-5 ${
                          generalSettings.enableMilestones 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-gray-400 dark:text-gray-500'
                        } mt-0.5 mr-3 flex-shrink-0`} />
                        <div className="text-sm">
                          <p className={`font-medium ${
                            generalSettings.enableMilestones 
                              ? 'text-green-800 dark:text-green-300' 
                              : 'text-gray-600 dark:text-gray-300'
                          }`}>
                            {generalSettings.enableMilestones 
                              ? "Milestones Enabled" 
                              : "Milestones Disabled"}
                          </p>
                          <p className={`mt-1 ${
                            generalSettings.enableMilestones 
                              ? 'text-green-700/80 dark:text-green-400/80' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {generalSettings.enableMilestones 
                              ? "Users can create escrows with structured milestones for better project management." 
                              : "Enable milestones to allow users to structure payments according to project deliverables."}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </SettingCard>
            </div>
          </motion.div>
        )}

        {/* Fee Structure Tab */}
        {activeTab === "fees" && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SettingCard
                title="Standard Fee Structure"
                description="Configure base fees for escrow transactions"
                icon={Percent}
              >
                <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-700">
                  <SettingRow 
                    label="Standard Fee (%)" 
                    tooltip="Base percentage fee applied to all escrow transactions"
                  >
                    <NumberInput
                      value={feeSettings.standardFee}
                      onChange={(value) => updateNumericSetting("fees", "standardFee", value)}
                      min={0}
                      max={20}
                      step={0.1}
                      suffix="%"
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Express Fee Surcharge (%)" 
                    tooltip="Additional fee for expedited processing"
                  >
                    <NumberInput
                      value={feeSettings.expressFeeSurcharge}
                      onChange={(value) => updateNumericSetting("fees", "expressFeeSurcharge", value)}
                      min={0}
                      max={10}
                      step={0.1}
                      suffix="%"
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="High-Value Discount (%)" 
                    tooltip="Fee discount for transactions above the volume threshold"
                  >
                    <NumberInput
                      value={feeSettings.highValueDiscount}
                      onChange={(value) => updateNumericSetting("fees", "highValueDiscount", value)}
                      min={0}
                      max={5}
                      step={0.1}
                      suffix="%"
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Volume Discount Threshold" 
                    tooltip="Transaction amount required to qualify for the high-value discount"
                  >
                    <NumberInput
                      value={feeSettings.volumeDiscountThreshold}
                      onChange={(value) => updateNumericSetting("fees", "volumeDiscountThreshold", value)}
                      min={0}
                      className="w-40"
                      prefix="KES"
                    />
                  </SettingRow>
                </div>
              </SettingCard>

              <SettingCard
                title="Fee Limits & Thresholds"
                description="Set minimum and maximum fee amounts and volume thresholds"
                icon={Scale}
              >
                <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-700">
                  <SettingRow 
                    label="Minimum Fee (KES)" 
                    tooltip="Lowest possible fee for any transaction"
                  >
                    <NumberInput
                      value={feeSettings.minimumFee}
                      onChange={(value) => updateNumericSetting("fees", "minimumFee", value)}
                      min={0}
                      className="w-32"
                      prefix="KES"
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Maximum Fee (KES)" 
                    tooltip="Highest possible fee for any transaction"
                  >
                    <NumberInput
                      value={feeSettings.maximumFee}
                      onChange={(value) => updateNumericSetting("fees", "maximumFee", value)}
                      min={0}
                      className="w-32"
                      prefix="KES"
                    />
                  </SettingRow>
                  
                  <div className="pt-4">
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium text-purple-800 dark:text-purple-300">Fee Calculation Preview</h5>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-purple-600 dark:text-purple-400">KES 10,000 transaction:</span>
                          <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                            {new Intl.NumberFormat('en-KE', { 
                              style: 'currency', 
                              currency: 'KES' 
                            }).format(Math.max(Math.min(10000 * (feeSettings.standardFee / 100), feeSettings.maximumFee), feeSettings.minimumFee))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-purple-600 dark:text-purple-400">KES 100,000 transaction:</span>
                          <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                            {new Intl.NumberFormat('en-KE', { 
                              style: 'currency', 
                              currency: 'KES' 
                            }).format(Math.max(Math.min(100000 * (feeSettings.standardFee / 100), feeSettings.maximumFee), feeSettings.minimumFee))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-purple-600 dark:text-purple-400">KES 1,000,000 transaction:</span>
                          <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                            {new Intl.NumberFormat('en-KE', { 
                              style: 'currency', 
                              currency: 'KES' 
                            }).format(Math.max(Math.min(1000000 * (feeSettings.standardFee / 100) * (1 - (feeSettings.highValueDiscount / 100)), feeSettings.maximumFee), feeSettings.minimumFee))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="Processing Fees"
                description="Configure fees for special processing services"
                icon={CreditCard}
              >
                <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-700">
                  <SettingRow 
                    label="Refund Processing Fee (KES)" 
                    tooltip="Fee charged for processing refunds"
                  >
                    <NumberInput
                      value={feeSettings.refundProcessingFee}
                      onChange={(value) => updateNumericSetting("fees", "refundProcessingFee", value)}
                      min={0}
                      className="w-32"
                      prefix="KES"
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Dispute Processing Fee (KES)" 
                    tooltip="Fee charged for processing dispute claims"
                  >
                    <NumberInput
                      value={feeSettings.disputeProcessingFee}
                      onChange={(value) => updateNumericSetting("fees", "disputeProcessingFee", value)}
                      min={0}
                      className="w-32"
                      prefix="KES"
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Expedited Processing Fee (KES)" 
                    tooltip="Fee charged for expedited transaction processing"
                  >
                    <NumberInput
                      value={feeSettings.expeditedProcessingFee}
                      onChange={(value) => updateNumericSetting("fees", "expeditedProcessingFee", value)}
                      min={0}
                      className="w-32"
                      prefix="KES"
                    />
                  </SettingRow>
                </div>
              </SettingCard>

              <SettingCard
                title="Currency Conversion"
                description="Configure currency conversion spreads and fees"
                icon={Globe}
              >
                <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-700">
                  <SettingRow 
                    label="Currency Conversion Spread (%)" 
                    tooltip="Percentage added to the market exchange rate when converting currencies"
                  >
                    <NumberInput
                      value={feeSettings.currencyConversionSpread}
                      onChange={(value) => updateNumericSetting("fees", "currencyConversionSpread", value)}
                      min={0}
                      max={10}
                      step={0.1}
                      suffix="%"
                    />
                  </SettingRow>
                  
                  <div className="pt-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/30">
                      <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                          <p className="font-medium mb-1">Currency Conversion</p>
                          <p>
                            Applied when users transact in different currencies.
                            This spread is added to the market rate to account for volatility and risk.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SettingCard>
            </div>
          </motion.div>
        )}

        {/* Risk & Compliance Tab */}
        {activeTab === "risk" && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SettingCard
                title="KYC & Identity Verification"
                description="Configure know-your-customer verification requirements"
                icon={UserCheck}
                warning={!riskSettings.enableKYCCheck}
              >
                <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-700">
                  <SettingRow 
                    label="Enable KYC Checks" 
                    tooltip="Require identity verification for users"
                    warning={!riskSettings.enableKYCCheck}
                  >
                    <ToggleSwitch
                      enabled={riskSettings.enableKYCCheck}
                      onToggle={() => toggleSetting("risk", "enableKYCCheck")}
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Strict KYC Mode" 
                    tooltip="Require enhanced verification for all transactions"
                    disabled={!riskSettings.enableKYCCheck}
                  >
                    <ToggleSwitch
                      enabled={riskSettings.strictKYCMode}
                      onToggle={() => toggleSetting("risk", "strictKYCMode")}
                      disabled={!riskSettings.enableKYCCheck}
                    />
                  </SettingRow>
                  
                  {!riskSettings.enableKYCCheck && (
                    <div className="pt-4">
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800/30">
                        <div className="flex items-center space-x-2 mb-1">
                          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                            Security Warning
                          </span>
                        </div>
                        <p className="text-sm text-orange-600 dark:text-orange-400 ml-7">
                          KYC verification is disabled. This significantly increases compliance risk and may violate regulatory requirements in certain jurisdictions.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </SettingCard>

              <SettingCard
                title="AML & Sanctions Screening"
                description="Configure anti-money laundering and sanctions checking"
                icon={Shield}
              >
                <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-700">
                  <SettingRow 
                    label="Enable AML Screening" 
                    tooltip="Screen transactions for potential money laundering patterns"
                  >
                    <ToggleSwitch
                      enabled={riskSettings.enableAMLScreening}
                      onToggle={() => toggleSetting("risk", "enableAMLScreening")}
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="AML Threshold (KES)" 
                    tooltip="Transaction amount that triggers AML screening"
                    disabled={!riskSettings.enableAMLScreening}
                  >
                    <NumberInput
                      value={riskSettings.amlThreshold}
                      onChange={(value) => updateNumericSetting("risk", "amlThreshold", value)}
                      min={0}
                      className="w-40"
                      prefix="KES"
                      disabled={!riskSettings.enableAMLScreening}
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Enable Sanctions Check" 
                    tooltip="Screen users against international sanctions lists"
                  >
                    <ToggleSwitch
                      enabled={riskSettings.enableSanctionsCheck}
                      onToggle={() => toggleSetting("risk", "enableSanctionsCheck")}
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Enable PEP Screening" 
                    tooltip="Screen for politically exposed persons"
                  >
                    <ToggleSwitch
                      enabled={riskSettings.enablePEPCheck}
                      onToggle={() => toggleSetting("risk", "enablePEPCheck")}
                    />
                  </SettingRow>
                </div>
              </SettingCard>

              <SettingCard
                title="Transaction Limits"
                description="Set maximum transaction amounts and daily limits"
                icon={Target}
              >
                <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-700">
                  <SettingRow 
                    label="Max Transaction Amount (KES)" 
                    tooltip="Maximum amount allowed for a single transaction"
                  >
                    <NumberInput
                      value={riskSettings.maxTransactionAmount}
                      onChange={(value) => updateNumericSetting("risk", "maxTransactionAmount", value)}
                      min={0}
                      className="w-40"
                      prefix="KES"
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Daily Transaction Limit (KES)" 
                    tooltip="Maximum total amount allowed per user per day"
                  >
                    <NumberInput
                      value={riskSettings.dailyTransactionLimit}
                      onChange={(value) => updateNumericSetting("risk", "dailyTransactionLimit", value)}
                      min={0}
                      className="w-40"
                      prefix="KES"
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Enable Velocity Checks" 
                    tooltip="Detect and flag unusual transaction patterns"
                  >
                    <ToggleSwitch
                      enabled={riskSettings.enableVelocityChecks}
                      onToggle={() => toggleSetting("risk", "enableVelocityChecks")}
                    />
                  </SettingRow>
                </div>
              </SettingCard>

              <SettingCard
                title="Fraud Detection"
                description="Configure fraud detection and prevention mechanisms"
                icon={Scan}
              >
                <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-700">
                  <SettingRow 
                    label="Enable Fraud Detection" 
                    tooltip="Activate fraud detection and prevention systems"
                  >
                    <ToggleSwitch
                      enabled={riskSettings.enableFraudDetection}
                      onToggle={() => toggleSetting("risk", "enableFraudDetection")}
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Fraud Score Threshold" 
                    tooltip="Score above which transactions are flagged for review (0-100)"
                    disabled={!riskSettings.enableFraudDetection}
                  >
                    <div className="flex items-center gap-3">
                      <NumberInput
                        value={riskSettings.fraudScoreThreshold}
                        onChange={(value) => updateNumericSetting("risk", "fraudScoreThreshold", value)}
                        min={0}
                        max={100}
                        disabled={!riskSettings.enableFraudDetection}
                        className="w-20"
                      />
                      <div className="w-32 h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full">
                        <div className="w-2 h-5 bg-white dark:bg-gray-200 rounded-full border border-gray-300 shadow-md relative -mt-1.5" style={{ marginLeft: `${riskSettings.fraudScoreThreshold}%` }}></div>
                      </div>
                    </div>
                  </SettingRow>
                  
                  <SettingRow 
                    label="Enable Device Fingerprinting" 
                    tooltip="Track unique device characteristics to prevent fraud"
                  >
                    <ToggleSwitch
                      enabled={riskSettings.enableDeviceFingerprinting}
                      onToggle={() => toggleSetting("risk", "enableDeviceFingerprinting")}
                    />
                  </SettingRow>
                  
                  <SettingRow 
                    label="Enable Geo-blocking" 
                    tooltip="Block transactions from restricted countries"
                  >
                    <ToggleSwitch
                      enabled={riskSettings.enableGeoBlocking}
                      onToggle={() => toggleSetting("risk", "enableGeoBlocking")}
                    />
                  </SettingRow>
                </div>
              </SettingCard>
            </div>
          </motion.div>
        )}

        {/* More tabs implementation... */}
      </div>

      {/* Fixed notification for unsaved changes */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md backdrop-blur-sm bg-opacity-90 dark:bg-opacity-80">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Unsaved Changes
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    You have unsaved configuration changes. Save them to apply the
                    new settings.
                  </p>
                  <div className="flex space-x-3">
                    <motion.button
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium"
                      onClick={saveSettings}
                      disabled={isLoading}
                      whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? (
                        <RefreshCw size={14} className="mr-2 animate-spin" />
                      ) : (
                        <Save size={14} className="mr-2" />
                      )}
                      {isLoading ? "Saving..." : "Save Changes"}
                    </motion.button>
                    <motion.button
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white/80 dark:bg-gray-800/80"
                      onClick={() => setHasChanges(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    ></motion.button>