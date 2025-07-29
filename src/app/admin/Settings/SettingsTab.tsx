import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import SettingsForm from "./SettingsForm";
import { Settings, ThemeStyles } from "./page";

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

interface SettingsTabsProps {
  theme: "light" | "dark";
  currentTheme: ThemeStyles;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cardHover: any;
  slideUp: any;
  settings: Settings | null;
  setSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
  settingsService: any;
  setShowSuccess: (show: boolean) => void;
  tabs: Array<{ id: string; label: string; icon: JSX.Element }>;
  id?: string;
}

const SettingsTabs = ({
  theme,
  currentTheme,
  activeTab,
  setActiveTab,
  cardHover,
  slideUp,
  settings,
  setSettings,
  settingsService,
  setShowSuccess,
  tabs,
  id,
}: SettingsTabsProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 relative z-10">
      {/* Sidebar Navigation */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={slideUp}
        className="hidden lg:block w-72 flex-shrink-0"
      >
        {/* Navigation Card */}
        <motion.div
          className={`backdrop-blur-xl rounded-2xl shadow-md overflow-hidden border ${currentTheme.cardBorder} dark:border-gray-700/40 bg-gradient-to-br ${currentTheme.cardBg} dark:from-gray-800/90 dark:to-gray-800/80`}
          initial="rest"
          whileHover="hover"
          variants={cardHover}
        >
          <div className="p-4">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-between w-full px-5 py-4 my-1.5 rounded-xl text-[13px] transition-all duration-200 ${
                  activeTab === tab.id
                    ? theme === "light"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md"
                      : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium shadow-md"
                    : theme === "light"
                    ? "text-gray-700 hover:bg-gray-50/80"
                    : "text-gray-300 hover:bg-gray-700/30"
                } dark:text-gray-300 dark:hover:bg-gray-700/30`}
              >
                <span className="flex items-center space-x-3">
                  <span
                    className={
                      activeTab === tab.id
                        ? "text-white"
                        : theme === "light"
                        ? "text-gray-500"
                        : "text-gray-400"
                    }
                  >
                    {tab.icon}
                  </span>
                  <span className="font-medium">{tab.label}</span>
                </span>
                {activeTab === tab.id && (
                  <ChevronRight size={18} className="text-white" />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Status Card */}
        <motion.div
          className={`mt-6 backdrop-blur-xl rounded-2xl p-6 border ${
            currentTheme.cardBorder
          } dark:border-gray-700/40 bg-gradient-to-br ${
            theme === "light"
              ? "from-blue-50/90 to-indigo-50/80"
              : "from-blue-900/30 to-indigo-900/20"
          } dark:from-blue-900/30 dark:to-indigo-900/20`}
          initial="rest"
          whileHover="hover"
          variants={cardHover}
        >
          <h3
            className={`text-[13px] font-semibold ${
              theme === "light" ? "text-blue-700" : "text-blue-300"
            } dark:text-blue-300 mb-2`}
          >
            System Status
          </h3>
          <div
            className={`text-xs ${
              theme === "light" ? "text-gray-600" : "text-gray-300"
            } dark:text-gray-300 space-y-2`}
          >
            <div className="flex justify-between items-center">
              <span>Last updated</span>
              <span className="font-medium">Today, 10:45 AM</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Storage used</span>
              <span className="font-medium">128 MB</span>
            </div>
            <div
              className={`h-1.5 w-full mt-2 rounded-full overflow-hidden ${
                theme === "light" ? "bg-gray-200" : "bg-gray-700"
              } dark:bg-gray-700`}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={slideUp}
        className="flex-1"
      >
        <motion.div
          className={`backdrop-blur-xl rounded-2xl shadow-md border ${currentTheme.cardBorder} dark:border-gray-700/40 bg-gradient-to-br ${currentTheme.cardBg} dark:from-gray-800/90 dark:to-gray-800/80 p-6 lg:p-8`}
          initial="rest"
          whileHover="hover"
          variants={cardHover}
        >
          <AnimatePresence mode="wait">
            <SettingsForm
              id={id || "default"}
              activeTab={activeTab}
              theme={theme}
              currentTheme={currentTheme}
              staggerChildren={staggerChildren}
              slideUp={slideUp}
              settings={settings}
              setSettings={setSettings}
              settingsService={settingsService}
              setShowSuccess={setShowSuccess}
            />
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SettingsTabs;
