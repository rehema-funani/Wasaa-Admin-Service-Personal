import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  AlertTriangle,
  CheckCircle,
  Settings,
  Clock,
  RefreshCw,
  Edit,
  Copy,
} from "lucide-react";
import supportService from "../../../api/services/support";
import CreateConfigForm from "../../../components/support/CreateConfigForm";

const SupportQueueConfigPage: React.FC = () => {
  const [configs, setConfigs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    assignmentMethod: "HYBRID",
    autoAssignmentEnabled: true,
    maxTicketsPerAgent: 10,
    lockTimeoutMinutes: 30,
    escalationThresholdHours: 24,
    skillMatchingRequired: true,
    priorityWeights: {
      LOW: 1,
      MEDIUM: 2,
      HIGH: 3,
      CRITICAL: 5,
    },
    businessHours: {
      start: "09:00",
      end: "17:00",
      timezone: "UTC",
    },
    isActive: true,
  });

  useEffect(() => {
    fetchQueueConfigs();
  }, []);

  const fetchQueueConfigs = async () => {
    try {
      setIsLoading(true);
      const res = await supportService.getQueueConfigs();
      setConfigs(res);
    } catch (error) {
      console.error("Error fetching queue configurations:", error);
      setConfigs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateConfig = async () => {
    try {
      await supportService.createQueueConfig(formData);
      fetchQueueConfigs();
      setShowCreateModal(false);
      setFormData({
        name: "",
        assignmentMethod: "HYBRID",
        autoAssignmentEnabled: true,
        maxTicketsPerAgent: 10,
        lockTimeoutMinutes: 30,
        escalationThresholdHours: 24,
        skillMatchingRequired: true,
        priorityWeights: {
          LOW: 1,
          MEDIUM: 2,
          HIGH: 3,
          CRITICAL: 5,
        },
        businessHours: {
          start: "09:00",
          end: "17:00",
          timezone: "UTC",
        },
        isActive: true,
      });
    } catch (error) {
      console.error("Error creating queue configuration:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checked });
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData],
          [child]: value,
        },
      });
    } else if (
      name === "maxTicketsPerAgent" ||
      name === "lockTimeoutMinutes" ||
      name === "escalationThresholdHours"
    ) {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePriorityChange = (priority: string, value: string) => {
    setFormData({
      ...formData,
      priorityWeights: {
        ...formData.priorityWeights,
        [priority]: parseInt(value),
      },
    });
  };

  const filteredConfigs =
    activeTab === "all" ? configs : configs.filter((config) => config.isActive);

  const getAssignmentMethodBadge = (method: string) => {
    const methodConfig = {
      MANUAL: {
        color:
          "bg-purple-100/80 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
        dot: "bg-purple-400 dark:bg-purple-600",
      },
      AUTOMATED: {
        color:
          "bg-blue-100/80 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
        dot: "bg-blue-400 dark:bg-blue-600",
      },
      HYBRID: {
        color:
          "bg-amber-100/80 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
        dot: "bg-amber-400 dark:bg-amber-600",
      },
    };

    const config =
      methodConfig[method as keyof typeof methodConfig] || methodConfig.HYBRID;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} backdrop-blur-sm`}
      >
        <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
        <span className="text-sm font-medium">{method}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50 dark:from-slate-900 dark:via-red-900/20 dark:to-orange-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 dark:border-red-800 dark:border-t-red-500 rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-orange-400 dark:border-r-orange-500 rounded-full animate-spin animation-delay-75" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50 dark:from-slate-900 dark:via-gray-900/20 dark:to-gray-950">
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-600 dark:from-primary-500 dark:to-primary-500 bg-clip-text text-transparent">
                  Support Queue Configurations
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage ticket assignment and queue behavior
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="p-2.5 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={fetchQueueConfigs}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
              <motion.button
                className="px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-600 dark:from-primary-500 dark:to-primary-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                onClick={() => setShowCreateModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-4 h-4 inline-block mr-2" />
                New Configuration
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {filteredConfigs.length === 0 && (
          <motion.div
            className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 rounded-2xl p-6 text-white relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  No Queue Configurations Found
                </h2>
                <p className="text-orange-100 mt-1">
                  Create your first queue configuration to start managing
                  support tickets efficiently.
                </p>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />
          </motion.div>
        )}

        <div className="flex gap-2 p-1 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/30 w-fit">
          <motion.button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "all"
                ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-700/50"
            }`}
            onClick={() => setActiveTab("all")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            All Configurations
          </motion.button>
          <motion.button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "active"
                ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-700/50"
            }`}
            onClick={() => setActiveTab("active")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Active Only
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConfigs.map((config, index) => (
            <motion.div
              key={config.id || index}
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/30 hover:shadow-lg transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      config.isActive
                        ? "bg-green-400 dark:bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {config.name}
                  </h3>
                </div>
                <div className="flex gap-1">
                  <motion.button
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </motion.button>
                  <motion.button
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Assignment Method
                  </span>
                  {getAssignmentMethodBadge(config.assignmentMethod)}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Auto Assignment
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      config.autoAssignmentEnabled
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {config.autoAssignmentEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Max Tickets/Agent
                  </span>
                  <span className="text-gray-900 dark:text-gray-200 font-medium">
                    {config.maxTicketsPerAgent}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Lock Timeout
                  </span>
                  <span className="text-gray-900 dark:text-gray-200 font-medium">
                    {config.lockTimeoutMinutes} mins
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Escalation Threshold
                  </span>
                  <span className="text-gray-900 dark:text-gray-200 font-medium">
                    {config.escalationThresholdHours} hrs
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Skill Matching
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      config.skillMatchingRequired
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {config.skillMatchingRequired ? "Required" : "Optional"}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-slate-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Business Hours
                  </span>
                  <span className="text-gray-900 dark:text-gray-200 font-medium">
                    {config.businessHours.start} - {config.businessHours.end} (
                    {config.businessHours.timezone})
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <motion.button
                  className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Details
                </motion.button>
                <motion.button
                  className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors text-sm ${
                    config.isActive
                      ? "bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400"
                      : "bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {config.isActive ? "Deactivate" : "Activate"}
                </motion.button>
              </div>
            </motion.div>
          ))}

          <motion.div
            className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-dashed border-gray-300 dark:border-slate-600 p-6 flex flex-col items-center justify-center cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: filteredConfigs.length * 0.05 }}
            onClick={() => setShowCreateModal(true)}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-red-500/20 to-orange-500/20 dark:from-red-500/10 dark:to-orange-500/10 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-orange-500 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Create New Configuration
            </h3>
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
              Define how tickets are assigned and processed
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {filteredConfigs.length}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Total Configurations
                </p>
              </div>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: "100%" }}
              />
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {configs.filter((config) => config.isActive).length}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Active Configurations
                </p>
              </div>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{
                  width: `${
                    configs.length
                      ? (configs.filter((config) => config.isActive).length /
                          configs.length) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {configs.reduce(
                    (avg, config) => avg + config.escalationThresholdHours,
                    0
                  ) / (configs.length || 1)}
                  h
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Avg. Escalation Time
                </p>
              </div>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: "70%" }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {showCreateModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl mt-20 rounded-2xl p-6 max-w-3xl w-full border border-white/20 dark:border-slate-700/30 max-h-[87vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CreateConfigForm
              formData={formData}
              handleInputChange={handleInputChange}
              handlePriorityChange={handlePriorityChange}
              handleCreateConfig={handleCreateConfig}
              setShowCreateModal={setShowCreateModal}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SupportQueueConfigPage;
