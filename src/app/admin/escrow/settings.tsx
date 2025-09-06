import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Calendar,
  ArrowUpDown,
  Eye,
  Save,
  RefreshCw,
  Settings,
  Shield,
  Lock,
  Clock,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
  CreditCard,
  DollarSign,
  Target,
  Activity,
  Layers,
  ArrowRight,
  MoreVertical,
  Maximize2,
  CalendarDays,
  Scale,
  MessageSquare,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Timer,
  Award,
  Building,
  Wallet,
  Smartphone,
  Banknote,
  Bell,
  Brain,
  Scan,
  Fingerprint,
  Key,
  Database,
  Server,
  Wifi,
  ShieldCheck,
  UserCheck,
  Mail,
  Phone,
  Gavel,
  AlertCircle,
  Info,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Plus,
  Minus,
  Edit,
  Trash2,
  Copy,
  Upload
} from "lucide-react";

const EscrowSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // General Settings State
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
    escalationThreshold: 48
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
    currencyConversionSpread: 0.5
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
    fraudScoreThreshold: 75
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
    securityAlerts: true
  });

  // Automation Rules State
  const [automationRules, setAutomationRules] = useState([
    {
      id: 1,
      name: "Auto-release for verified users",
      condition: "buyer_kyc_verified AND seller_kyc_verified AND amount < 500000",
      action: "auto_release",
      delay: 72,
      enabled: true,
      priority: 1
    },
    {
      id: 2,
      name: "Express processing for premium users",
      condition: "user_tier = 'premium' OR user_tier = 'enterprise'",
      action: "expedite_processing",
      delay: 2,
      enabled: true,
      priority: 2
    },
    {
      id: 3,
      name: "Enhanced review for high-value transactions",
      condition: "amount >= 2000000",
      action: "manual_review",
      delay: 0,
      enabled: true,
      priority: 3
    }
  ]);

  // API & Integration Settings State
  const [apiSettings, setApiSettings] = useState({
    enableAPIAccess: true,
    rateLimitPerMinute: 1000,
    enableWebhooks: true,
    webhookRetryAttempts: 3,
    webhookTimeout: 30,
    enableSDK: true,
    allowedOrigins: ["https://app.example.com", "https://dashboard.example.com"],
    requireAPIAuthentication: true,
    enableOAuth: true,
    apiVersioning: true,
    enableGraphQL: false,
    enableBulkOperations: true,
    maxBulkSize: 100
  });

  const tabs = [
    { id: "general", name: "General Settings", icon: Settings },
    { id: "fees", name: "Fee Structure", icon: DollarSign },
    { id: "risk", name: "Risk & Compliance", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "automation", name: "Automation Rules", icon: Brain },
    { id: "api", name: "API & Integration", icon: Database }
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
      case 'general':
        setGeneralSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
        break;
      case 'risk':
        setRiskSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
        break;
      case 'notifications':
        setNotificationSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
        break;
      case 'api':
        setApiSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
        break;
    }
    setHasChanges(true);
  };

  const updateNumericSetting = (section: string, key: string, value: number) => {
    switch (section) {
      case 'general':
        setGeneralSettings(prev => ({ ...prev, [key]: value }));
        break;
      case 'fees':
        setFeeSettings(prev => ({ ...prev, [key]: value }));
        break;
      case 'risk':
        setRiskSettings(prev => ({ ...prev, [key]: value }));
        break;
      case 'notifications':
        setNotificationSettings(prev => ({ ...prev, [key]: value }));
        break;
      case 'api':
        setApiSettings(prev => ({ ...prev, [key]: value }));
        break;
    }
    setHasChanges(true);
  };

  const ToggleSwitch = ({ enabled, onToggle, disabled = false }: { 
    enabled: boolean; 
    onToggle: () => void; 
    disabled?: boolean; 
  }) => (
    <motion.button
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={disabled ? undefined : onToggle}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
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
    warning = false 
  }: { 
    title: string; 
    description: string; 
    children: React.ReactNode; 
    icon?: any; 
    warning?: boolean; 
  }) => (
    <motion.div
      className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${
        warning ? 'border-orange-200 dark:border-orange-800' : 'border-gray-100 dark:border-gray-700'
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {Icon && (
            <div className={`p-2 rounded-lg ${
              warning ? 'bg-orange-100 dark:bg-orange-900/20' : 'bg-blue-100 dark:bg-blue-900/20'
            }`}>
              <Icon className={`w-5 h-5 ${
                warning ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'
              }`} />
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
      {/* Header */}
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
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            onClick={saveSettings}
            disabled={!hasChanges || isLoading}
            whileHover={hasChanges ? { y: -2, boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)" } : {}}
            whileTap={hasChanges ? { y: 0 } : {}}
          >
            {isLoading ? (
              <RefreshCw size={16} className="mr-2 animate-spin" strokeWidth={2} />
            ) : (
              <Save size={16} className="mr-2" strokeWidth={2} />
            )}
            {isLoading ? 'Saving...' : 'Save Configuration'}
          </motion.button>
        </div>
      </motion.div>

      {/* Search Bar */}
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

      {/* Navigation Tabs */}
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
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
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

      {/* Tab Content */}
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Default Expiry (hours)
                    </label>
                    <input
                      type="number"
                      value={generalSettings.defaultExpiry}
                      onChange={(e) => updateNumericSetting('general', 'defaultExpiry', parseInt(e.target.value))}
                      className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Auto-Release
                    </label>
                    <ToggleSwitch
                      enabled={generalSettings.autoRelease}
                      onToggle={() => toggleSetting('general', 'autoRelease')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Require Buyer Confirmation
                    </label>
                    <ToggleSwitch
                      enabled={generalSettings.requireBuyerConfirmation}
                      onToggle={() => toggleSetting('general', 'requireBuyerConfirmation')}
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
                      onToggle={() => toggleSetting('general', 'enableDisputes')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Max Dispute Duration (days)
                    </label>
                    <input
                      type="number"
                      value={generalSettings.maxDisputeDuration}
                      onChange={(e) => updateNumericSetting('general', 'maxDisputeDuration', parseInt(e.target.value))}
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
                      onChange={(e) => updateNumericSetting('general', 'escalationThreshold', parseInt(e.target.value))}
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
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, defaultCurrency: e.target.value }))}
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
                      onToggle={() => toggleSetting('general', 'multiCurrencyEnabled')}
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
                      onToggle={() => toggleSetting('general', 'enablePartialRelease')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Milestones
                    </label>
                    <ToggleSwitch
                      enabled={generalSettings.enableMilestones}
                      onToggle={() => toggleSetting('general', 'enableMilestones')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Max Milestones per Escrow
                    </label>
                    <input
                      type="number"
                      value={generalSettings.maxMilestones}
                      onChange={(e) => updateNumericSetting('general', 'maxMilestones', parseInt(e.target.value))}
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
                        onChange={(e) => updateNumericSetting('fees', 'standardFee', parseFloat(e.target.value))}
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
                        onChange={(e) => updateNumericSetting('fees', 'expressFeeSurcharge', parseFloat(e.target.value))}
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
                        onChange={(e) => updateNumericSetting('fees', 'highValueDiscount', parseFloat(e.target.value))}
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
                      onChange={(e) => updateNumericSetting('fees', 'minimumFee', parseInt(e.target.value))}
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
                      onChange={(e) => updateNumericSetting('fees', 'maximumFee', parseInt(e.target.value))}
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
                      onChange={(e) => updateNumericSetting('fees', 'volumeDiscountThreshold', parseInt(e.target.value))}
                      className="