import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
    ChevronRight,
} from "lucide-react";
import SettingsForm from "./SettingsForm";
import { Settings, ThemeStyles } from "./page";

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08
        }
    }
};

interface SettingsTabsProps {
    theme: "light" | "dark";
    currentTheme: ThemeStyles;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    cardHover: Variants;
    slideUp: Variants;
    settings: Settings | null;
    setSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
    settingsService: any;
    setShowSuccess: (show: boolean) => void;
    tabs: Array<{ id: string; label: string; icon: JSX.Element }>;
    id?: string;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({
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
    id
}) => {
    return (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 relative z-10">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={slideUp}
                className="hidden lg:block w-72 flex-shrink-0"
            >
                <motion.div
                    className={`backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border ${currentTheme.cardBorder} bg-gradient-to-br ${currentTheme.cardBg}`}
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
                                className={`flex items-center justify-between w-full px-5 py-4 my-1.5 rounded-xl text-[13px] transition-all duration-200 ${activeTab === tab.id
                                    ? theme === "light"
                                        ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-lg"
                                        : "bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium shadow-lg"
                                    : theme === "light"
                                        ? "text-slate-700 hover:bg-slate-50/80"
                                        : "text-slate-300 hover:bg-slate-700/30"
                                    }`}
                            >
                                <span className="flex items-center space-x-3">
                                    <span className={activeTab === tab.id ? "text-white" : ""}>{tab.icon}</span>
                                    <span className="font-medium">{tab.label}</span>
                                </span>
                                {activeTab === tab.id && (
                                    <ChevronRight size={18} className="text-white" />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    className={`mt-6 backdrop-blur-xl rounded-2xl p-6 border ${currentTheme.cardBorder} bg-gradient-to-br ${theme === "light"
                        ? "from-purple-50/90 to-primary-50/80"
                        : "from-purple-900/30 to-primary-900/20"
                        }`}
                    initial="rest"
                    whileHover="hover"
                    variants={cardHover}
                >
                    <h3 className={`text-[13px] font-semibold ${theme === "light" ? "text-primary-700" : "text-primary-300"} mb-2`}>
                        Your Status
                    </h3>
                    <div className={`text-xs ${theme === "light" ? "text-slate-600" : "text-slate-300"} space-y-2`}>
                        <div className="flex justify-between items-center">
                            <span>Last updated</span>
                            <span className="font-medium">Today, 10:45 AM</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Storage used</span>
                            <span className="font-medium">128 MB</span>
                        </div>
                        <div className={`h-1.5 w-full mt-2 rounded-full overflow-hidden ${theme === "light" ? "bg-slate-200" : "bg-slate-700"}`}>
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
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
                    className={`backdrop-blur-xl rounded-2xl shadow-xl border ${currentTheme.cardBorder} bg-gradient-to-br ${currentTheme.cardBg} p-6 lg:p-8`}
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