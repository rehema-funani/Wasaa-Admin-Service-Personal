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
                <div className="space-y-4 divide-y divide-gray-100