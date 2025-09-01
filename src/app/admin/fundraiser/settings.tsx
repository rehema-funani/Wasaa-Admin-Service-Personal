import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Save,
  Info,
  DollarSign,
  Clock,
  Percent,
  Settings,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  Check,
  Loader,
  BarChart2,
} from "lucide-react";
import { fundraiserService } from "../../../api/services/fundraiser";

const CampaignSettingsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [activeTab, setActiveTab] = useState("settings");

  const [settings, setSettings] = useState({
    platformFeePercentage: 5,
    minimumDonationAmount: 10,
    maximumDonationAmount: 100000,
    payoutProcessingTime: "3-5 business days",
  });

  const [originalSettings, setOriginalSettings] = useState({});

  const [stats, setStats] = useState({
    avgDonationAmount: 650,
    totalDonations: 0,
    donationBreakdown: [
      { range: "$10-$50", percentage: 35, color: "#bfdbfe" },
      { range: "$51-$100", percentage: 25, color: "#93c5fd" },
      { range: "$101-$500", percentage: 20, color: "#60a5fa" },
      { range: "$501-$1000", percentage: 15, color: "#3b82f6" },
      { range: "$1000+", percentage: 5, color: "#2563eb" },
    ],
    platformFeeRevenue: 0,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be an API call
        const response = await fundraiserService.getSystemSettings();

        // Simulating API response
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockResponse = {
          success: true,
          data: {
            platformFeePercentage: 5,
            minimumDonationAmount: 10,
            maximumDonationAmount: 100000,
            payoutProcessingTime: "3-5 business days",
          },
        };

        setSettings(mockResponse.data);
        setOriginalSettings(mockResponse.data);

        // Simulate fetching stats
        await fetchStats();
      } catch (error) {
        console.error("Error fetching campaign settings:", error);
        toast.error("Failed to load campaign settings");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        // Simulate API call for stats
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Calculate some sample stats based on current settings
        const totalDonations = Math.floor(Math.random() * 100000) + 50000;
        const platformFeeRevenue =
          (totalDonations *
            stats.avgDonationAmount *
            settings.platformFeePercentage) /
          100;

        setStats({
          ...stats,
          totalDonations,
          platformFeeRevenue,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    // Check if settings have changed from original values
    const checkForChanges = () => {
      for (const key in settings) {
        if (settings[key] !== originalSettings[key]) {
          setHasUnsavedChanges(true);
          return;
        }
      }
      setHasUnsavedChanges(false);
    };

    if (!isLoading) {
      checkForChanges();
    }
  }, [settings, originalSettings, isLoading]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fundraiserService.updateSystemSettings(settings);
      const totalDonations = stats.totalDonations;
      const platformFeeRevenue =
        (totalDonations *
          stats.avgDonationAmount *
          settings.platformFeePercentage) /
        100;

      setStats({
        ...stats,
        platformFeeRevenue,
      });

      setOriginalSettings(settings);
      setHasUnsavedChanges(false);
      toast.success("Campaign settings saved successfully");
    } catch (error) {
      console.error("Error saving campaign settings:", error);
      toast.error("Failed to save campaign settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
    setHasUnsavedChanges(false);
    toast.success("Changes discarded");
  };

  const handlePayoutTimeChange = (timeValue) => {
    setSettings({
      ...settings,
      payoutProcessingTime: timeValue,
    });
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={30} className="text-primary-500 animate-spin mr-3" />
        <span className="text-slate-500 dark:text-gray-400">
          Loading campaign settings...
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 w-full mx-auto max-w-[1200px]">
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-light text-slate-900 dark:text-gray-100">
            Campaign Settings
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">
            Configure global parameters for all fundraising campaigns
          </p>
        </div>

        <div className="flex gap-3">
          {hasUnsavedChanges && (
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
            >
              Discard Changes
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader size={16} className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-slate-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "settings"
                ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400"
                : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200"
            }`}
          >
            <Settings size={16} className="inline mr-2" />
            Settings
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "insights"
                ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400"
                : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200"
            }`}
          >
            <BarChart2 size={16} className="inline mr-2" />
            Insights
          </button>
        </div>
      </div>

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center">
                  <Settings className="text-primary-500 mr-2" size={18} />
                  <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                    Platform Settings
                  </h2>
                </div>
                <button
                  onClick={() => setShowTips(!showTips)}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {showTips ? "Hide tips" : "Show tips"}
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Platform Fee */}
                <div className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-1 flex items-center">
                        Platform Fee Percentage
                        <Info
                          size={14}
                          className="ml-1.5 text-slate-400 dark:text-gray-500 cursor-help"
                        //   title="Percentage fee collected from each donation"
                        />
                      </label>
                      <p className="text-xs text-slate-500 dark:text-gray-400">
                        Fee applied to all donations processed through the
                        platform
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {settings.platformFeePercentage}%
                      </span>
                      <p className="text-xs text-slate-500 dark:text-gray-400">
                        Current Fee
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <input
                      type="range"
                      name="platformFeePercentage"
                      min="0"
                      max="20"
                      step="0.5"
                      value={settings.platformFeePercentage}
                      onChange={handleChange}
                      className="w-full h-2 bg-slate-200 dark:bg-gray-600 rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-1 text-xs text-slate-500 dark:text-gray-400">
                      <span>0%</span>
                      <span>5%</span>
                      <span>10%</span>
                      <span>15%</span>
                      <span>20%</span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {showTips && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4 overflow-hidden"
                      >
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 rounded-lg p-3">
                          <div className="flex">
                            <Info
                              className="text-blue-500 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0"
                              size={16}
                            />
                            <div className="text-sm text-blue-800 dark:text-blue-300">
                              <p className="font-medium mb-1">
                                Platform Fee Tip
                              </p>
                              <p>
                                Most fundraising platforms charge between 2.5%
                                and 8%. Setting your fee too high may discourage
                                campaigns, while setting too low may not cover
                                operating costs.
                              </p>
                              <div className="mt-2 flex items-center">
                                <span className="text-xs font-medium">
                                  Industry average: 4-5%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Donation Amount Limits */}
                <div className="pt-4 border-t border-slate-100 dark:border-gray-700">
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-1 flex items-center">
                          Minimum Donation Amount
                          <Info
                            size={14}
                            className="ml-1.5 text-slate-400 dark:text-gray-500 cursor-help"
                            // title="Smallest donation amount allowed"
                          />
                        </label>
                        <p className="text-xs text-slate-500 dark:text-gray-400">
                          Smallest donation amount accepted on the platform
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign
                            size={16}
                            className="text-slate-400 dark:text-gray-500"
                          />
                        </div>
                        <input
                          type="number"
                          name="minimumDonationAmount"
                          value={settings.minimumDonationAmount}
                          onChange={handleChange}
                          min="1"
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex space-x-2">
                        {[5, 10, 20].map((amount) => (
                          <button
                            key={amount}
                            onClick={() =>
                              setSettings((prev) => ({
                                ...prev,
                                minimumDonationAmount: amount,
                              }))
                            }
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                              settings.minimumDonationAmount === amount
                                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium"
                                : "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600"
                            }`}
                          >
                            ${amount}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-1 flex items-center">
                          Maximum Donation Amount
                          <Info
                            size={14}
                            className="ml-1.5 text-slate-400 dark:text-gray-500 cursor-help"
                            // title="Largest single donation amount allowed"
                          />
                        </label>
                        <p className="text-xs text-slate-500 dark:text-gray-400">
                          Largest single donation amount accepted on the
                          platform
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign
                            size={16}
                            className="text-slate-400 dark:text-gray-500"
                          />
                        </div>
                        <input
                          type="number"
                          name="maximumDonationAmount"
                          value={settings.maximumDonationAmount}
                          onChange={handleChange}
                          min={settings.minimumDonationAmount}
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex space-x-2">
                        {[10000, 50000, 100000].map((amount) => (
                          <button
                            key={amount}
                            onClick={() =>
                              setSettings((prev) => ({
                                ...prev,
                                maximumDonationAmount: amount,
                              }))
                            }
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                              settings.maximumDonationAmount === amount
                                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium"
                                : "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600"
                            }`}
                          >
                            ${amount.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <AnimatePresence>
                      {showTips && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 overflow-hidden"
                        >
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 rounded-lg p-3">
                            <div className="flex">
                              <Info
                                className="text-blue-500 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0"
                                size={16}
                              />
                              <div className="text-sm text-blue-800 dark:text-blue-300">
                                <p className="font-medium mb-1">
                                  Donation Limits Tip
                                </p>
                                <p>
                                  Setting appropriate donation limits helps
                                  prevent fraud while accommodating your users.
                                  The minimum should cover transaction costs,
                                  while the maximum should balance fraud risk
                                  with allowing large donors to contribute.
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Payout Processing Time */}
                <div className="pt-4 border-t border-slate-100 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-1 flex items-center">
                        Payout Processing Time
                        <span title="How long it takes to process withdrawals">
                          <Info
                            size={14}
                            className="ml-1.5 text-slate-400 dark:text-gray-500 cursor-help"
                          />
                        </span>
                      </label>
                      <p className="text-xs text-slate-500 dark:text-gray-400">
                        Expected timeframe for processing withdrawal requests
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                    {[
                      "1-2 business days",
                      "3-5 business days",
                      "5-7 business days",
                    ].map((timeOption) => (
                      <div
                        key={timeOption}
                        onClick={() => handlePayoutTimeChange(timeOption)}
                        className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                          settings.payoutProcessingTime === timeOption
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-400"
                            : "border-slate-200 dark:border-gray-700 hover:border-slate-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <Clock
                            size={18}
                            className="text-slate-600 dark:text-gray-300"
                          />
                          {settings.payoutProcessingTime === timeOption && (
                            <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                              <Check size={12} className="text-white" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-medium text-slate-900 dark:text-white text-sm">
                          {timeOption}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                          {timeOption === "1-2 business days" &&
                            "Fastest option (premium)"}
                          {timeOption === "3-5 business days" &&
                            "Standard processing time"}
                          {timeOption === "5-7 business days" &&
                            "Most economical option"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Preview Panel */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden sticky top-6">
              <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex items-center">
                <TrendingUp className="text-primary-500 mr-2" size={18} />
                <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                  Settings Preview
                </h2>
              </div>

              <div className="p-4">
                <div className="mb-6">
                  <div className="px-4 py-3 bg-slate-50 dark:bg-gray-700/50 rounded-xl">
                    <p className="text-xs uppercase font-medium text-slate-500 dark:text-gray-400 mb-2">
                      Donation Amount Range
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-lg font-medium text-slate-900 dark:text-white">
                          ${settings.minimumDonationAmount}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-gray-400">
                          Minimum
                        </p>
                      </div>

                      <div className="flex-grow px-4">
                        <div className="h-0.5 bg-slate-200 dark:bg-gray-600 relative">
                          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between">
                            <ArrowRight
                              size={14}
                              className="text-slate-400 dark:text-gray-500"
                            />
                            <ArrowRight
                              size={14}
                              className="text-slate-400 dark:text-gray-500 transform rotate-180"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-lg font-medium text-slate-900 dark:text-white">
                          ${settings.maximumDonationAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-gray-400">
                          Maximum
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="px-4 py-3 bg-slate-50 dark:bg-gray-700/50 rounded-xl">
                    <p className="text-xs uppercase font-medium text-slate-500 dark:text-gray-400 mb-2">
                      Platform Fee
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-semibold text-primary-600 dark:text-primary-400">
                          {settings.platformFeePercentage}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-900 dark:text-white">
                          $
                          {(
                            (100 * settings.platformFeePercentage) /
                            100
                          ).toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-gray-400">
                          Fee on $100 donation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="px-4 py-3 bg-slate-50 dark:bg-gray-700/50 rounded-xl">
                    <p className="text-xs uppercase font-medium text-slate-500 dark:text-gray-400 mb-2">
                      Payout Timeline
                    </p>
                    <div className="relative py-2">
                      <div className="w-full h-1 bg-slate-200 dark:bg-gray-600 absolute top-1/2 -translate-y-1/2"></div>
                      <div className="relative z-10 flex justify-between">
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full bg-primary-500"></div>
                          <p className="text-xs text-slate-700 dark:text-gray-300 mt-1">
                            Request
                          </p>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-gray-600 flex items-center justify-center">
                            <RefreshCw
                              size={10}
                              className="text-slate-600 dark:text-gray-400"
                            />
                          </div>
                          <p className="text-xs text-slate-700 dark:text-gray-300 mt-1">
                            Processing
                          </p>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                          <p className="text-xs text-slate-700 dark:text-gray-300 mt-1">
                            Paid
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-sm font-medium text-slate-900 dark:text-white mt-4">
                      {settings.payoutProcessingTime}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/20 p-4">
                    <div className="flex">
                      <Info
                        size={18}
                        className="text-blue-500 dark:text-blue-400 mr-3 flex-shrink-0"
                      />
                      <div>
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                          Settings Impact
                        </h3>
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                          These settings directly affect user experience,
                          platform revenue, and campaign success rates. Review
                          carefully before saving changes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === "insights" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Insights */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
              <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart2 className="text-primary-500 mr-2" size={18} />
                  <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                    Platform Performance
                  </h2>
                </div>
                <div className="text-sm text-slate-500 dark:text-gray-400">
                  Last 30 days
                </div>
              </div>

              <div className="p-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-slate-500 dark:text-gray-400">
                        Platform Fee Revenue
                      </p>
                      <TrendingUp size={16} className="text-emerald-500" />
                    </div>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(stats.platformFeeRevenue)}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                      +4.2% from last month
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-slate-500 dark:text-gray-400">
                        Total Donations
                      </p>
                      <TrendingUp size={16} className="text-emerald-500" />
                    </div>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                      {stats.totalDonations.toLocaleString()}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                      +12.7% from last month
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-slate-500 dark:text-gray-400">
                        Average Donation
                      </p>
                      <TrendingUp size={16} className="text-emerald-500" />
                    </div>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                      ${stats.avgDonationAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                      +2.3% from last month
                    </p>
                  </div>
                </div>

                {/* Donation Breakdown */}
                <div className="mb-6">
                  <h3 className="text-base font-medium text-slate-800 dark:text-gray-200 mb-3">
                    Donation Amount Distribution
                  </h3>
                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="space-y-3">
                      {stats.donationBreakdown.map((item) => (
                        <div key={item.range}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-700 dark:text-gray-300">
                              {item.range}
                            </span>
                            <span className="font-medium text-slate-900 dark:text-white">
                              {item.percentage}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${item.percentage}%`,
                                backgroundColor: item.color,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-gray-600 text-center">
                      <p className="text-xs text-slate-500 dark:text-gray-400">
                        Current minimum: ${settings.minimumDonationAmount} •
                        Current maximum: $
                        {settings.maximumDonationAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fee Impact Simulation */}
                <div>
                  <h3 className="text-base font-medium text-slate-800 dark:text-gray-200 mb-3">
                    Platform Fee Impact Simulation
                  </h3>
                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <p className="text-sm text-slate-600 dark:text-gray-400 mb-4">
                      Based on your current donation volume, here's how changes
                      to the platform fee would affect revenue
                    </p>

                    <div className="space-y-3">
                      {[2.5, 5, 7.5, 10].map((fee) => (
                        <div
                          key={fee}
                          className={`p-3 border rounded-lg flex items-center justify-between ${
                            settings.platformFeePercentage === fee
                              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                              : "border-slate-200 dark:border-gray-600"
                          }`}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                settings.platformFeePercentage === fee
                                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                                  : "bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-gray-400"
                              }`}
                            >
                              <Percent size={14} />
                            </div>
                            <div>
                              <p
                                className={`text-sm font-medium ${
                                  settings.platformFeePercentage === fee
                                    ? "text-primary-700 dark:text-primary-300"
                                    : "text-slate-700 dark:text-gray-300"
                                }`}
                              >
                                {fee}% fee
                              </p>
                              <p className="text-xs text-slate-500 dark:text-gray-400">
                                $
                                {(
                                  (fee / 100) *
                                  stats.avgDonationAmount
                                ).toFixed(2)}{" "}
                                per avg donation
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p
                              className={`text-sm font-semibold ${
                                settings.platformFeePercentage === fee
                                  ? "text-primary-700 dark:text-primary-300"
                                  : "text-slate-900 dark:text-white"
                              }`}
                            >
                              {formatCurrency(
                                (stats.totalDonations *
                                  stats.avgDonationAmount *
                                  fee) /
                                  100
                              )}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-gray-400">
                              Est. monthly revenue
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden sticky top-6">
              <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex items-center">
                <Settings className="text-primary-500 mr-2" size={18} />
                <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                  Recommendations
                </h2>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  {/* Fee Recommendation */}
                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <Percent size={16} className="text-primary-500 mr-2" />
                      <h3 className="text-sm font-medium text-slate-800 dark:text-gray-200">
                        Platform Fee
                      </h3>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-gray-400 mb-3">
                      {settings.platformFeePercentage < 3
                        ? "Your current fee is below industry average and may not fully cover operational costs."
                        : settings.platformFeePercentage > 7
                        ? "Your current fee is above industry average and may discourage campaign creators."
                        : "Your current fee is within the industry average range."}
                    </p>

                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-600">
                      <p className="text-xs font-medium text-primary-700 dark:text-primary-300">
                        Recommendation
                      </p>
                      <p className="text-sm text-slate-700 dark:text-gray-300 mt-1">
                        {settings.platformFeePercentage < 3
                          ? "Consider increasing your fee to 4-5% to ensure sustainable operations."
                          : settings.platformFeePercentage > 7
                          ? "Consider reducing your fee to 4-5% to remain competitive."
                          : "Maintain your current fee structure as it balances revenue and competitiveness."}
                      </p>
                    </div>
                  </div>

                  {/* Min Donation Recommendation */}
                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <DollarSign size={16} className="text-primary-500 mr-2" />
                      <h3 className="text-sm font-medium text-slate-800 dark:text-gray-200">
                        Minimum Donation
                      </h3>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-gray-400 mb-3">
                      {settings.minimumDonationAmount < 5
                        ? "Your current minimum is very low and may not cover transaction costs."
                        : settings.minimumDonationAmount > 20
                        ? "Your current minimum is high and may exclude smaller donors."
                        : "Your current minimum is reasonable for most donors."}
                    </p>

                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-600">
                      <p className="text-xs font-medium text-primary-700 dark:text-primary-300">
                        Recommendation
                      </p>
                      <p className="text-sm text-slate-700 dark:text-gray-300 mt-1">
                        {settings.minimumDonationAmount < 5
                          ? "Consider setting minimum to $5-10 to ensure donation value exceeds processing costs."
                          : settings.minimumDonationAmount > 20
                          ? "Consider lowering your minimum to $10 to include more donors."
                          : "Your current minimum donation amount is in the optimal range."}
                      </p>
                    </div>
                  </div>

                  {/* Max Donation Recommendation */}
                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <DollarSign size={16} className="text-primary-500 mr-2" />
                      <h3 className="text-sm font-medium text-slate-800 dark:text-gray-200">
                        Maximum Donation
                      </h3>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-gray-400 mb-3">
                      {settings.maximumDonationAmount < 10000
                        ? "Your current maximum may limit large donors' contributions."
                        : settings.maximumDonationAmount > 250000
                        ? "Your current maximum is very high and may increase fraud risk."
                        : "Your current maximum allows for generous donations while maintaining reasonable risk."}
                    </p>

                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-600">
                      <p className="text-xs font-medium text-primary-700 dark:text-primary-300">
                        Recommendation
                      </p>
                      <p className="text-sm text-slate-700 dark:text-gray-300 mt-1">
                        {settings.maximumDonationAmount < 10000
                          ? "Consider increasing your maximum to $50,000-$100,000 to accommodate larger donors."
                          : settings.maximumDonationAmount > 250000
                          ? "Consider reducing your maximum to $100,000 to reduce fraud risk."
                          : "Your current maximum donation amount balances opportunity with risk."}
                      </p>
                    </div>
                  </div>

                  {/* Processing Time Recommendation */}
                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <Clock size={16} className="text-primary-500 mr-2" />
                      <h3 className="text-sm font-medium text-slate-800 dark:text-gray-200">
                        Payout Processing
                      </h3>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-gray-400 mb-3">
                      {settings.payoutProcessingTime === "1-2 business days"
                        ? "Your current processing time is faster than industry average."
                        : settings.payoutProcessingTime === "5-7 business days"
                        ? "Your current processing time is slower than industry average."
                        : "Your current processing time aligns with industry standards."}
                    </p>

                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-600">
                      <p className="text-xs font-medium text-primary-700 dark:text-primary-300">
                        Recommendation
                      </p>
                      <p className="text-sm text-slate-700 dark:text-gray-300 mt-1">
                        {settings.payoutProcessingTime === "1-2 business days"
                          ? "This timeline may require additional operational resources but provides excellent user experience."
                          : settings.payoutProcessingTime ===
                            "5-7 business days"
                          ? "Consider reducing to 3-5 business days to improve fundraiser satisfaction."
                          : "3-5 business days provides a good balance between operational efficiency and user satisfaction."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 border border-primary-100 dark:border-primary-900/40 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                  <div className="flex">
                    <Info
                      size={18}
                      className="text-primary-500 dark:text-primary-400 mr-3 flex-shrink-0"
                    />
                    <div>
                      <h3 className="text-sm font-medium text-primary-800 dark:text-primary-300 mb-1">
                        Overall Assessment
                      </h3>
                      <p className="text-xs text-primary-700 dark:text-primary-400">
                        Your current settings are{" "}
                        {settings.platformFeePercentage >= 3 &&
                        settings.platformFeePercentage <= 7 &&
                        settings.minimumDonationAmount >= 5 &&
                        settings.minimumDonationAmount <= 20 &&
                        settings.maximumDonationAmount >= 10000 &&
                        settings.maximumDonationAmount <= 250000 &&
                        settings.payoutProcessingTime === "3-5 business days"
                          ? "well optimized"
                          : "partially optimized"}{" "}
                        for balancing platform revenue, user experience, and
                        operational efficiency.
                      </p>
                      {!(
                        settings.platformFeePercentage >= 3 &&
                        settings.platformFeePercentage <= 7 &&
                        settings.minimumDonationAmount >= 5 &&
                        settings.minimumDonationAmount <= 20 &&
                        settings.maximumDonationAmount >= 10000 &&
                        settings.maximumDonationAmount <= 250000 &&
                        settings.payoutProcessingTime === "3-5 business days"
                      ) && (
                        <p className="text-xs text-primary-700 dark:text-primary-400 mt-2">
                          Consider implementing the recommendations above to
                          improve overall platform performance.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <style>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #10b981;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #10b981;
        }
        input[type="range"] {
          -webkit-appearance: none;
          height: 8px;
          border-radius: 4px;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
        }
        .dark input[type="range"]::-webkit-slider-thumb {
          background: #0d9488;
        }
        .dark input[type="range"]::-moz-range-thumb {
          background: #0d9488;
        }
      `}</style>
    </div>
  );
};

export default CampaignSettingsPage;