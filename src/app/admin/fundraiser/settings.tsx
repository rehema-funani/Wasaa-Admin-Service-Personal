import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Save,
  Info,
  DollarSign,
  Percent,
  Shield,
  Loader,
  Settings,
  HelpCircle,
} from "lucide-react";
import { fundraiserService } from "../../../api/services/fundraiser";

const CampaignSettingsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    maxCampaignAmount: 0,
    minDonationAmount: 0,
    platformFeePercentage: 0,
    autoApprovalThreshold: 0,
    maxContributorsPerCampaign: 0,
    campaignDurationDays: 30,
    campaignFeaturedLimit: 5,
    verificationRequired: true,
    allowAnonymousDonations: true,
    requiresDonorAddress: false,
    allowsRecurringDonations: true,
    defaultCurrency: "KES",
  });

  const [originalSettings, setOriginalSettings] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be an API call
        const response = await fundraiserService.getSystemSettings();

        // Simulating API response
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockResponse = {
          settings: {
            maxCampaignAmount: 5000000,
            minDonationAmount: 100,
            platformFeePercentage: 2.5,
            autoApprovalThreshold: 10000,
            maxContributorsPerCampaign: 5000,
            campaignDurationDays: 30,
            campaignFeaturedLimit: 5,
            verificationRequired: true,
            allowAnonymousDonations: true,
            requiresDonorAddress: false,
            allowsRecurringDonations: true,
            defaultCurrency: "KES",
          },
        };

        setSettings(mockResponse.settings);
        setOriginalSettings(mockResponse.settings);
      } catch (error) {
        console.error("Error fetching campaign settings:", error);
        toast.error("Failed to load campaign settings");
      } finally {
        setIsLoading(false);
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
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real implementation, this would be an API call
      // await settingsService.updateCampaignSettings(settings);

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Settings */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex items-center">
              <DollarSign className="text-primary-500 mr-2" size={18} />
              <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                Financial Settings
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Maximum Campaign Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign
                      size={16}
                      className="text-slate-400 dark:text-gray-500"
                    />
                  </div>
                  <input
                    type="number"
                    name="maxCampaignAmount"
                    value={settings.maxCampaignAmount}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                  The maximum amount that can be raised in a single campaign (0
                  for unlimited)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Minimum Donation Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign
                      size={16}
                      className="text-slate-400 dark:text-gray-500"
                    />
                  </div>
                  <input
                    type="number"
                    name="minDonationAmount"
                    value={settings.minDonationAmount}
                    onChange={handleChange}
                    min="0"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                  The minimum amount that can be donated to any campaign
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Platform Fee Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="platformFeePercentage"
                    value={settings.platformFeePercentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full pl-4 pr-10 py-2 border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Percent
                      size={16}
                      className="text-slate-400 dark:text-gray-500"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                  The percentage fee applied to all donations (platform revenue)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Default Currency
                </label>
                <select
                  name="defaultCurrency"
                  value={settings.defaultCurrency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="KES">Kenyan Shilling (KES)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="TZS">Tanzanian Shilling (TZS)</option>
                  <option value="UGX">Ugandan Shilling (UGX)</option>
                </select>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                  The default currency for all campaigns and donations
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Campaign Limits */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex items-center">
              <Settings className="text-primary-500 mr-2" size={18} />
              <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                Campaign Limits
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Maximum Contributors Per Campaign
                </label>
                <input
                  type="number"
                  name="maxContributorsPerCampaign"
                  value={settings.maxContributorsPerCampaign}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                  Maximum number of unique donors per campaign (0 for unlimited)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Default Campaign Duration (Days)
                </label>
                <input
                  type="number"
                  name="campaignDurationDays"
                  value={settings.campaignDurationDays}
                  onChange={handleChange}
                  min="1"
                  max="365"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                  Default duration in days for new campaigns
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Featured Campaigns Limit
                </label>
                <input
                  type="number"
                  name="campaignFeaturedLimit"
                  value={settings.campaignFeaturedLimit}
                  onChange={handleChange}
                  min="0"
                  max="20"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                  Maximum number of campaigns that can be featured on the
                  homepage
                </p>
              </div>

              <div className="pt-2">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <div className="flex">
                    <HelpCircle
                      className="text-amber-500 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0"
                      size={16}
                    />
                    <div>
                      <p className="text-sm text-amber-800 dark:text-amber-300">
                        Setting limits too low may discourage fundraisers, while
                        setting them too high might increase risk.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Compliance & Security */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex items-center">
              <Shield className="text-primary-500 mr-2" size={18} />
              <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                Compliance & Security
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Auto-Approval Threshold
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign
                      size={16}
                      className="text-slate-400 dark:text-gray-500"
                    />
                  </div>
                  <input
                    type="number"
                    name="autoApprovalThreshold"
                    value={settings.autoApprovalThreshold}
                    onChange={handleChange}
                    min="0"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                  Withdrawals below this amount are automatically approved (0 to
                  disable)
                </p>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                    Require Verification
                  </label>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                    Require identity verification for campaign creators
                  </p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    name="verificationRequired"
                    id="verificationRequired"
                    checked={settings.verificationRequired}
                    onChange={handleChange}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white dark:bg-gray-300 border-4 border-slate-300 dark:border-gray-600 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="verificationRequired"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 dark:bg-gray-600 cursor-pointer"
                  ></label>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                    Allow Anonymous Donations
                  </label>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                    Let donors contribute without providing their name
                  </p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    name="allowAnonymousDonations"
                    id="allowAnonymousDonations"
                    checked={settings.allowAnonymousDonations}
                    onChange={handleChange}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white dark:bg-gray-300 border-4 border-slate-300 dark:border-gray-600 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="allowAnonymousDonations"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 dark:bg-gray-600 cursor-pointer"
                  ></label>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                    Require Donor Address
                  </label>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                    Collect donor address information during checkout
                  </p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    name="requiresDonorAddress"
                    id="requiresDonorAddress"
                    checked={settings.requiresDonorAddress}
                    onChange={handleChange}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white dark:bg-gray-300 border-4 border-slate-300 dark:border-gray-600 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="requiresDonorAddress"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 dark:bg-gray-600 cursor-pointer"
                  ></label>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                    Allow Recurring Donations
                  </label>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                    Enable monthly/recurring donation options
                  </p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    name="allowsRecurringDonations"
                    id="allowsRecurringDonations"
                    checked={settings.allowsRecurringDonations}
                    onChange={handleChange}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white dark:bg-gray-300 border-4 border-slate-300 dark:border-gray-600 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="allowsRecurringDonations"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 dark:bg-gray-600 cursor-pointer"
                  ></label>
                </div>
              </div>

              <div className="pt-2">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex">
                    <Info
                      className="text-blue-500 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0"
                      size={16}
                    />
                    <div>
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        These settings help ensure compliance with local
                        regulations and reduce fraud risk.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #10b981;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #10b981;
        }
      `}</style>
    </div>
  );
};

export default CampaignSettingsPage;
