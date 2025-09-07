import React, { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

const EscrowSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
      // Show success message
    }, 2000);
  };

  const resetToDefaults = () => {
    // Reset all settings to default values
    setHasChanges(true);
  };

  const toggleSetting = (section: string, key: string) => {
    switch (section) {
      case "general":
        setGeneralSettings((prev) => ({
          ...prev,
          [key]: !prev[key as keyof typeof prev],
        }));
        break;
      case "risk":
        setRiskSettings((prev) => ({
          ...prev,
          [key]: !prev[key as keyof typeof prev],
        }));
        break;
      case "notifications":
        setNotificationSettings((prev) => ({
          ...prev,
          [key]: !prev[key as keyof typeof prev],
        }));
        break;
      case "api":
        setApiSettings((prev) => ({
          ...prev,
          [key]: !prev[key as keyof typeof prev],
        }));
        break;
    }
    setHasChanges(true);
  };

  const updateNumericSetting = (
    section: string,
    key: string,
    value: number
  ) => {
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

  const ToggleSwitch = ({
    enabled,
    onToggle,
    disabled = false,
  }: {
    enabled: boolean;
    onToggle: () => void;
    disabled?: boolean;
  }) => (
    <motion.button
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={disabled ? undefined : onToggle}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
        initial={false}
        animate={{ x: enabled ? 24 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );

  const SettingCard = ({
    title,
    description,
    children,
    icon: Icon,
    warning = false,
  }: {
    title: string;
    description: string;
    children: React.ReactNode;
    icon?: any;
    warning?: boolean;
  }) => (
    <motion.div
      className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${
        warning
          ? "border-orange-200 dark:border-orange-800"
          : "border-gray-100 dark:border-gray-700"
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {Icon && (
            <div
              className={`p-2 rounded-lg ${
                warning
                  ? "bg-orange-100 dark:bg-orange-900/20"
                  : "bg-blue-100 dark:bg-blue-900/20"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  warning
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {title}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {description}
            </p>
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Escrow Configuration
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            Configure escrow system settings, rules, and operational parameters
          </p>
          <div className="flex items-center space-x-4 mt-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Status: Online</span>
            </div>
            {hasChanges && (
              <div className="flex items-center space-x-2 text-sm text-orange-600 dark:text-orange-400">
                <AlertCircle className="w-4 h-4" />
                <span>Unsaved changes</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <motion.button
            className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600"
            onClick={resetToDefaults}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <RefreshCw size={16} className="mr-2" strokeWidth={2} />
            Reset to Defaults
          </motion.button>
          <motion.button
            className={`flex items-center px-6 py-2 rounded-lg text-sm shadow-lg font-medium ${
              hasChanges
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
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

      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search settings..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Default Expiry (hours)
                    </label>
                    <input
                      type="number"
                      value={generalSettings.defaultExpiry}
                      onChange={(e) =>
                        updateNumericSetting(
                          "general",
                          "defaultExpiry",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Auto-Release
                    </label>
                    <ToggleSwitch
                      enabled={generalSettings.autoRelease}
                      onToggle={() => toggleSetting("general", "autoRelease")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Require Buyer Confirmation
                    </label>
                    <ToggleSwitch
                      enabled={generalSettings.requireBuyerConfirmation}
                      onToggle={() =>
                        toggleSetting("general", "requireBuyerConfirmation")
                      }
                    />
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="Dispute Management"
                description="Configure dispute handling and escalation settings"
                icon={Gavel}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Disputes
                    </label>
                    <ToggleSwitch
                      enabled={generalSettings.enableDisputes}
                      onToggle={() =>
                        toggleSetting("general", "enableDisputes")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Max Dispute Duration (days)
                    </label>
                    <input
                      type="number"
                      value={generalSettings.maxDisputeDuration}
                      onChange={(e) =>
                        updateNumericSetting(
                          "general",
                          "maxDisputeDuration",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!generalSettings.enableDisputes}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Auto-Escalation Threshold (hours)
                    </label>
                    <input
                      type="number"
                      value={generalSettings.escalationThreshold}
                      onChange={(e) =>
                        updateNumericSetting(
                          "general",
                          "escalationThreshold",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="Currency & Multi-Currency"
                description="Configure supported currencies and conversion settings"
                icon={DollarSign}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Default Currency
                    </label>
                    <select
                      value={generalSettings.defaultCurrency}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          defaultCurrency: e.target.value,
                        }))
                      }
                      className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="KES">KES - Kenyan Shilling</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Multi-Currency
                    </label>
                    <ToggleSwitch
                      enabled={generalSettings.multiCurrencyEnabled}
                      onToggle={() =>
                        toggleSetting("general", "multiCurrencyEnabled")
                      }
                    />
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="Advanced Features"
                description="Enable advanced escrow features like partial releases and milestones"
                icon={Target}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Partial Release
                    </label>
                    <ToggleSwitch
                      enabled={generalSettings.enablePartialRelease}
                      onToggle={() =>
                        toggleSetting("general", "enablePartialRelease")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Milestones
                    </label>
                    <ToggleSwitch
                      enabled={generalSettings.enableMilestones}
                      onToggle={() =>
                        toggleSetting("general", "enableMilestones")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Max Milestones per Escrow
                    </label>
                    <input
                      type="number"
                      value={generalSettings.maxMilestones}
                      onChange={(e) =>
                        updateNumericSetting(
                          "general",
                          "maxMilestones",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!generalSettings.enableMilestones}
                    />
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Standard Fee (%)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        step="0.1"
                        value={feeSettings.standardFee}
                        onChange={(e) =>
                          updateNumericSetting(
                            "fees",
                            "standardFee",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Express Fee Surcharge (%)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        step="0.1"
                        value={feeSettings.expressFeeSurcharge}
                        onChange={(e) =>
                          updateNumericSetting(
                            "fees",
                            "expressFeeSurcharge",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      High-Value Discount (%)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        step="0.1"
                        value={feeSettings.highValueDiscount}
                        onChange={(e) =>
                          updateNumericSetting(
                            "fees",
                            "highValueDiscount",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="Fee Limits & Thresholds"
                description="Set minimum and maximum fee amounts and volume thresholds"
                icon={Scale}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Minimum Fee (KES)
                    </label>
                    <input
                      type="number"
                      value={feeSettings.minimumFee}
                      onChange={(e) =>
                        updateNumericSetting(
                          "fees",
                          "minimumFee",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-32 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Maximum Fee (KES)
                    </label>
                    <input
                      type="number"
                      value={feeSettings.maximumFee}
                      onChange={(e) =>
                        updateNumericSetting(
                          "fees",
                          "maximumFee",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-32 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Volume Discount Threshold (KES)
                    </label>
                    <input
                      type="number"
                      value={feeSettings.volumeDiscountThreshold}
                      onChange={(e) =>
                        updateNumericSetting(
                          "fees",
                          "volumeDiscountThreshold",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-40 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="Processing Fees"
                description="Configure fees for special processing services"
                icon={CreditCard}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Refund Processing Fee (KES)
                    </label>
                    <input
                      type="number"
                      value={feeSettings.refundProcessingFee}
                      onChange={(e) =>
                        updateNumericSetting(
                          "fees",
                          "refundProcessingFee",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-32 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Dispute Processing Fee (KES)
                    </label>
                    <input
                      type="number"
                      value={feeSettings.disputeProcessingFee}
                      onChange={(e) =>
                        updateNumericSetting(
                          "fees",
                          "disputeProcessingFee",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-32 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Expedited Processing Fee (KES)
                    </label>
                    <input
                      type="number"
                      value={feeSettings.expeditedProcessingFee}
                      onChange={(e) =>
                        updateNumericSetting(
                          "fees",
                          "expeditedProcessingFee",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-32 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="Currency Conversion"
                description="Configure currency conversion spreads and fees"
                icon={Globe}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Currency Conversion Spread (%)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        step="0.1"
                        value={feeSettings.currencyConversionSpread}
                        onChange={(e) =>
                          updateNumericSetting(
                            "fees",
                            "currencyConversionSpread",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start space-x-2">
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        <p className="font-medium">Currency Conversion</p>
                        <p>
                          Applied when users transact in different currencies.
                          This spread is added to the market rate.
                        </p>
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable KYC Checks
                    </label>
                    <ToggleSwitch
                      enabled={riskSettings.enableKYCCheck}
                      onToggle={() => toggleSetting("risk", "enableKYCCheck")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Strict KYC Mode
                    </label>
                    <ToggleSwitch
                      enabled={riskSettings.strictKYCMode}
                      onToggle={() => toggleSetting("risk", "strictKYCMode")}
                      disabled={!riskSettings.enableKYCCheck}
                    />
                  </div>
                  {!riskSettings.enableKYCCheck && (
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        <span className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                          KYC verification is disabled. This may increase
                          compliance risk.
                        </span>
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable AML Screening
                    </label>
                    <ToggleSwitch
                      enabled={riskSettings.enableAMLScreening}
                      onToggle={() =>
                        toggleSetting("risk", "enableAMLScreening")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      AML Threshold (KES)
                    </label>
                    <input
                      type="number"
                      value={riskSettings.amlThreshold}
                      onChange={(e) =>
                        updateNumericSetting(
                          "risk",
                          "amlThreshold",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-40 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!riskSettings.enableAMLScreening}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Sanctions Check
                    </label>
                    <ToggleSwitch
                      enabled={riskSettings.enableSanctionsCheck}
                      onToggle={() =>
                        toggleSetting("risk", "enableSanctionsCheck")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable PEP Screening
                    </label>
                    <ToggleSwitch
                      enabled={riskSettings.enablePEPCheck}
                      onToggle={() => toggleSetting("risk", "enablePEPCheck")}
                    />
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="Transaction Limits"
                description="Set maximum transaction amounts and daily limits"
                icon={Target}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Max Transaction Amount (KES)
                    </label>
                    <input
                      type="number"
                      value={riskSettings.maxTransactionAmount}
                      onChange={(e) =>
                        updateNumericSetting(
                          "risk",
                          "maxTransactionAmount",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-40 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Daily Transaction Limit (KES)
                    </label>
                    <input
                      type="number"
                      value={riskSettings.dailyTransactionLimit}
                      onChange={(e) =>
                        updateNumericSetting(
                          "risk",
                          "dailyTransactionLimit",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-40 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Velocity Checks
                    </label>
                    <ToggleSwitch
                      enabled={riskSettings.enableVelocityChecks}
                      onToggle={() =>
                        toggleSetting("risk", "enableVelocityChecks")
                      }
                    />
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="Fraud Detection"
                description="Configure fraud detection and prevention mechanisms"
                icon={Scan}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Fraud Detection
                    </label>
                    <ToggleSwitch
                      enabled={riskSettings.enableFraudDetection}
                      onToggle={() =>
                        toggleSetting("risk", "enableFraudDetection")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Fraud Score Threshold
                    </label>
                    <input
                      type="number"
                      value={riskSettings.fraudScoreThreshold}
                      onChange={(e) =>
                        updateNumericSetting(
                          "risk",
                          "fraudScoreThreshold",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!riskSettings.enableFraudDetection}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Device Fingerprinting
                    </label>
                    <ToggleSwitch
                      enabled={riskSettings.enableDeviceFingerprinting}
                      onToggle={() =>
                        toggleSetting("risk", "enableDeviceFingerprinting")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Geo-blocking
                    </label>
                    <ToggleSwitch
                      enabled={riskSettings.enableGeoBlocking}
                      onToggle={() =>
                        toggleSetting("risk", "enableGeoBlocking")
                      }
                    />
                  </div>
                </div>
              </SettingCard>
            </div>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SettingCard
                title="Notification Channels"
                description="Configure available notification delivery methods"
                icon={Bell}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Notifications
                      </label>
                    </div>
                    <ToggleSwitch
                      enabled={notificationSettings.emailNotifications}
                      onToggle={() =>
                        toggleSetting("notifications", "emailNotifications")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        SMS Notifications
                      </label>
                    </div>
                    <ToggleSwitch
                      enabled={notificationSettings.smsNotifications}
                      onToggle={() =>
                        toggleSetting("notifications", "smsNotifications")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Webhook Notifications
                      </label>
                    </div>
                    <ToggleSwitch
                      enabled={notificationSettings.webhookNotifications}
                      onToggle={() =>
                        toggleSetting("notifications", "webhookNotifications")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Push Notifications
                      </label>
                    </div>
                    <ToggleSwitch
                      enabled={notificationSettings.pushNotifications}
                      onToggle={() =>
                        toggleSetting("notifications", "pushNotifications")
                      }
                    />
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="Transaction Events"
                description="Configure notifications for specific transaction events"
                icon={Activity}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notify on Escrow Creation
                    </label>
                    <ToggleSwitch
                      enabled={notificationSettings.notifyOnCreation}
                      onToggle={() =>
                        toggleSetting("notifications", "notifyOnCreation")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notify on Funding
                    </label>
                    <ToggleSwitch
                      enabled={notificationSettings.notifyOnFunding}
                      onToggle={() =>
                        toggleSetting("notifications", "notifyOnFunding")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notify on Release
                    </label>
                    <ToggleSwitch
                      enabled={notificationSettings.notifyOnRelease}
                      onToggle={() =>
                        toggleSetting("notifications", "notifyOnRelease")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notify on Dispute
                    </label>
                    <ToggleSwitch
                      enabled={notificationSettings.notifyOnDispute}
                      onToggle={() =>
                        toggleSetting("notifications", "notifyOnDispute")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notify on Expiry
                    </label>
                    <ToggleSwitch
                      enabled={notificationSettings.notifyOnExpiry}
                      onToggle={() =>
                        toggleSetting("notifications", "notifyOnExpiry")
                      }
                    />
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="Timing & Reminders"
                description="Configure notification timing and reminder settings"
                icon={Clock}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Reminder Before Expiry (hours)
                    </label>
                    <input
                      type="number"
                      value={notificationSettings.reminderBefore}
                      onChange={(e) =>
                        updateNumericSetting(
                          "notifications",
                          "reminderBefore",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Escalation Notifications
                    </label>
                    <ToggleSwitch
                      enabled={notificationSettings.escalationNotifications}
                      onToggle={() =>
                        toggleSetting(
                          "notifications",
                          "escalationNotifications"
                        )
                      }
                    />
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="System & Security Alerts"
                description="Configure system-wide and security-related notifications"
                icon={ShieldCheck}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Admin Alerts
                    </label>
                    <ToggleSwitch
                      enabled={notificationSettings.adminAlerts}
                      onToggle={() =>
                        toggleSetting("notifications", "adminAlerts")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      System Maintenance Alerts
                    </label>
                    <ToggleSwitch
                      enabled={notificationSettings.systemMaintenanceAlerts}
                      onToggle={() =>
                        toggleSetting(
                          "notifications",
                          "systemMaintenanceAlerts"
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Security Alerts
                    </label>
                    <ToggleSwitch
                      enabled={notificationSettings.securityAlerts}
                      onToggle={() =>
                        toggleSetting("notifications", "securityAlerts")
                      }
                    />
                  </div>
                </div>
              </SettingCard>
            </div>
          </motion.div>
        )}

        {/* Automation Rules Tab */}
        {activeTab === "automation" && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Automation Rules
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Configure automated actions based on transaction conditions
                </p>
              </div>
              <motion.button
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm shadow-sm hover:bg-blue-700"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Plus size={16} className="mr-2" />
                Add Rule
              </motion.button>
            </div>

            <div className="space-y-4">
              {automationRules.map((rule, index) => (
                <motion.div
                  key={rule.id}
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div
                          className={`p-2 rounded-lg ${
                            rule.enabled
                              ? "bg-green-100 dark:bg-green-900/20"
                              : "bg-gray-100 dark:bg-gray-700"
                          }`}
                        >
                          <Brain
                            className={`w-4 h-4 ${
                              rule.enabled
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-400"
                            }`}
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {rule.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Priority: {rule.priority} • Delay: {rule.delay}h
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Condition
                          </label>
                          <code className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-200">
                            {rule.condition}
                          </code>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Action
                            </label>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {rule.action.replace("_", " ")}
                            </span>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Status
                            </label>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                rule.enabled
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                              }`}
                            >
                              {rule.enabled ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <ToggleSwitch
                        enabled={rule.enabled}
                        onToggle={() => {
                          const updatedRules = automationRules.map((r) =>
                            r.id === rule.id ? { ...r, enabled: !r.enabled } : r
                          );
                          setAutomationRules(updatedRules);
                          setHasChanges(true);
                        }}
                      />
                      <motion.button
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Edit Rule"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete Rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* API & Integration Tab */}
        {activeTab === "api" && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SettingCard
                title="API Access Control"
                description="Configure API access and authentication settings"
                icon={Key}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable API Access
                    </label>
                    <ToggleSwitch
                      enabled={apiSettings.enableAPIAccess}
                      onToggle={() => toggleSetting("api", "enableAPIAccess")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Rate Limit (requests/minute)
                    </label>
                    <input
                      type="number"
                      value={apiSettings.rateLimitPerMinute}
                      onChange={(e) =>
                        updateNumericSetting(
                          "api",
                          "rateLimitPerMinute",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-32 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!apiSettings.enableAPIAccess}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Require API Authentication
                    </label>
                    <ToggleSwitch
                      enabled={apiSettings.requireAPIAuthentication}
                      onToggle={() =>
                        toggleSetting("api", "requireAPIAuthentication")
                      }
                      disabled={!apiSettings.enableAPIAccess}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable OAuth
                    </label>
                    <ToggleSwitch
                      enabled={apiSettings.enableOAuth}
                      onToggle={() => toggleSetting("api", "enableOAuth")}
                      disabled={!apiSettings.enableAPIAccess}
                    />
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="Webhook Configuration"
                description="Configure webhook delivery and retry settings"
                icon={Wifi}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Webhooks
                    </label>
                    <ToggleSwitch
                      enabled={apiSettings.enableWebhooks}
                      onToggle={() => toggleSetting("api", "enableWebhooks")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Retry Attempts
                    </label>
                    <input
                      type="number"
                      value={apiSettings.webhookRetryAttempts}
                      onChange={(e) =>
                        updateNumericSetting(
                          "api",
                          "webhookRetryAttempts",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!apiSettings.enableWebhooks}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Timeout (seconds)
                    </label>
                    <input
                      type="number"
                      value={apiSettings.webhookTimeout}
                      onChange={(e) =>
                        updateNumericSetting(
                          "api",
                          "webhookTimeout",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!apiSettings.enableWebhooks}
                    />
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="SDK & Development Tools"
                description="Configure SDK access and development features"
                icon={Database}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable SDK
                    </label>
                    <ToggleSwitch
                      enabled={apiSettings.enableSDK}
                      onToggle={() => toggleSetting("api", "enableSDK")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      API Versioning
                    </label>
                    <ToggleSwitch
                      enabled={apiSettings.apiVersioning}
                      onToggle={() => toggleSetting("api", "apiVersioning")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable GraphQL
                    </label>
                    <ToggleSwitch
                      enabled={apiSettings.enableGraphQL}
                      onToggle={() => toggleSetting("api", "enableGraphQL")}
                    />
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="Bulk Operations"
                description="Configure bulk processing and batch operations"
                icon={Layers}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Bulk Operations
                    </label>
                    <ToggleSwitch
                      enabled={apiSettings.enableBulkOperations}
                      onToggle={() =>
                        toggleSetting("api", "enableBulkOperations")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Max Bulk Size
                    </label>
                    <input
                      type="number"
                      value={apiSettings.maxBulkSize}
                      onChange={(e) =>
                        updateNumericSetting(
                          "api",
                          "maxBulkSize",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!apiSettings.enableBulkOperations}
                    />
                  </div>
                </div>
              </SettingCard>
            </div>

            {/* Allowed Origins */}
            <SettingCard
              title="CORS & Allowed Origins"
              description="Configure Cross-Origin Resource Sharing and allowed domains"
              icon={Globe}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Allowed Origins
                  </label>
                  <div className="space-y-2">
                    {apiSettings.allowedOrigins.map((origin, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={origin}
                          onChange={(e) => {
                            const newOrigins = [...apiSettings.allowedOrigins];
                            newOrigins[index] = e.target.value;
                            setApiSettings((prev) => ({
                              ...prev,
                              allowedOrigins: newOrigins,
                            }));
                            setHasChanges(true);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://example.com"
                        />
                        <motion.button
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            const newOrigins =
                              apiSettings.allowedOrigins.filter(
                                (_, i) => i !== index
                              );
                            setApiSettings((prev) => ({
                              ...prev,
                              allowedOrigins: newOrigins,
                            }));
                            setHasChanges(true);
                          }}
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                      </div>
                    ))}
                    <motion.button
                      className="flex items-center px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setApiSettings((prev) => ({
                          ...prev,
                          allowedOrigins: [...prev.allowedOrigins, ""],
                        }));
                        setHasChanges(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Origin
                    </motion.button>
                  </div>
                </div>
              </div>
            </SettingCard>
          </motion.div>
        )}
      </div>

      {/* Configuration Summary */}
      {hasChanges && (
        <motion.div
          className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md"
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Unsaved Changes
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                You have unsaved configuration changes. Save them to apply the
                new settings.
              </p>
              <div className="flex space-x-2">
                <motion.button
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                  onClick={saveSettings}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <RefreshCw size={14} className="mr-2 animate-spin" />
                  ) : (
                    <Save size={14} className="mr-2" />
                  )}
                  Save
                </motion.button>
                <motion.button
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                  onClick={() => setHasChanges(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Discard
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EscrowSettingsPage;