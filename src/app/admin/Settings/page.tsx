import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Bell,
  Check,
  ChevronRight,
  Globe,
  Link as LinkIcon,
  PaintBucket,
  Settings,
  Shield,
  Sliders,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import SettingsTabs from "./SettingsTab";
import { settingsService } from "../../../api/services/settings";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const slideUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

const cardHover = {
  rest: {
    scale: 1,
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  hover: {
    scale: 1.01,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
    y: -3,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export interface Settings {
  website_name?: string;
  website_description?: string;
  website_email?: string;
  max_group_members?: number;
  max_group_name_length?: number;
  website_color_primary?: string;
  website_color_secondary?: string;
  website_link?: string;
  ios_link?: string;
  android_link?: string;
  tell_a_friend_link?: string;
  copy_right?: string;
  website_social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    [key: string]: string | undefined;
  };
  [key: string]: any;
}

export interface FileInputRef {
  current: HTMLInputElement | null;
}

export interface ColorChangeHandler {
  (color: string, field: string): void;
}

export interface ThemeStyles {
  bg: string;
  cardBg: string;
  cardBorder: string;
  text: string;
  sectionBg: string;
  sectionBorder: string;
}

const page: React.FC = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [showSuccess, setShowSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [id, setId] = useState("");

  const scrollY = useMotionValue(0);
  const headerParallax = useTransform(scrollY, [0, 100], [0, -12]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
        setId(data?.id);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.set(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const themeStyles = {
    light: {
      bg: "from-gray-50 via-gray-50 to-blue-50/30",
      cardBg: "from-white/95 to-white/90",
      cardBorder: "border-gray-100",
      text: "text-gray-800",
      sectionBg: "from-white to-gray-50/80",
      sectionBorder: "border-gray-100",
    },
    dark: {
      bg: "from-gray-900 via-gray-900 to-blue-950/30",
      cardBg: "from-gray-800/90 to-gray-800/80",
      cardBorder: "border-gray-700/40",
      text: "text-gray-100",
      sectionBg: "from-gray-800/90 to-gray-800/70",
      sectionBorder: "border-gray-700/60",
    },
  };

  const currentTheme = themeStyles[theme];

  const tabs = [
    { id: "general", label: "General", icon: <Globe size={18} /> },
    { id: "appearance", label: "Appearance", icon: <PaintBucket size={18} /> },
    { id: "limits", label: "User Limits", icon: <Users size={18} /> },
    { id: "links", label: "Links & Legal", icon: <LinkIcon size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
  ];

  if (loading) {
    return (
      <div
        className={`flex h-screen items-center justify-center bg-gradient-to-br ${currentTheme.bg} dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/30`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="relative flex items-center justify-center w-20 h-20">
            <motion.div
              className="absolute inset-0 rounded-full opacity-30"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(59, 130, 246, 0), rgba(59, 130, 246, 1))",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <div className="bg-white dark:bg-gray-800 rounded-full p-4 relative z-10 shadow-lg">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Settings
                  size={32}
                  className="text-blue-500 dark:text-blue-400"
                />
              </motion.div>
            </div>
          </div>
          <p className="mt-6 text-base font-medium text-blue-600 dark:text-blue-400">
            Loading settings...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/30 transition-colors duration-300 pb-20`}
    >
      <motion.div
        className={`lg:hidden fixed top-0 left-0 right-0 z-20 backdrop-blur-xl shadow-sm px-5 py-4 flex items-center justify-between
        ${
          theme === "light"
            ? "bg-white/90 shadow-sm"
            : "bg-gray-900/90 shadow-gray-800/20"
        } dark:bg-gray-900/90 dark:shadow-gray-800/20`}
        style={{ y: headerParallax }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              theme === "light" ? "bg-blue-50" : "bg-blue-900/50"
            } dark:bg-blue-900/50`}
          >
            <Settings
              size={20}
              className={theme === "light" ? "text-blue-600" : "text-blue-300"}
            />
          </motion.div>
          <h1
            className={`text-base font-semibold ${
              theme === "light" ? "text-gray-800" : "text-white"
            } dark:text-white`}
          >
            Settings
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-full ${
              theme === "light"
                ? "bg-gray-100 text-gray-600"
                : "bg-gray-800 text-gray-300"
            } dark:bg-gray-800 dark:text-gray-300`}
          >
            {mobileMenuOpen ? <X size={18} /> : <Sliders size={18} />}
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-16 left-0 right-0 z-10 backdrop-blur-xl lg:hidden rounded-b-2xl ${
              theme === "light"
                ? "bg-white/95 border-b border-gray-200"
                : "bg-gray-900/95 border-b border-gray-700/30"
            } dark:bg-gray-900/95 dark:border-b dark:border-gray-700/30`}
          >
            <div className="p-3">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.01, x: 3 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3.5 my-1 rounded-xl text-left text-[13px] ${
                    activeTab === tab.id
                      ? theme === "light"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md"
                        : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium shadow-md"
                      : theme === "light"
                      ? "text-gray-700 hover:bg-gray-50"
                      : "text-gray-300 hover:bg-gray-800/50"
                  } dark:text-gray-300 dark:hover:bg-gray-800/50 transition-all duration-200`}
                >
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
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <ChevronRight size={16} className="ml-auto text-white" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 pt-20 pb-8 lg:py-10 max-w-screen-xl relative z-1">
        <motion.div
          initial="hidden"
          animate="visible"
          className="hidden lg:block mb-10 px-2"
          style={{ y: headerParallax }}
        >
          <div className="flex items-center space-x-4 mb-2">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95, rotate: -15 }}
              className={`flex items-center justify-center w-14 h-14 rounded-2xl ${
                theme === "light" ? "bg-blue-50" : "bg-blue-900/50"
              } dark:bg-blue-900/50 shadow-lg shadow-blue-500/10`}
            >
              <Settings
                size={26}
                className={
                  theme === "light" ? "text-blue-600" : "text-blue-300"
                }
              />
            </motion.div>
            <div>
              <motion.h1
                className={`text-3xl font-bold ${
                  theme === "light"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                    : "bg-gradient-to-r from-blue-400 to-indigo-400"
                } bg-clip-text text-transparent`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Settings Dashboard
              </motion.h1>
              <p
                className={`text-[14px] mt-1 ${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                } dark:text-gray-400`}
              >
                Configure your platform preferences and appearance
              </p>
            </div>
          </div>
        </motion.div>

        <SettingsTabs
          id={id}
          theme={theme}
          currentTheme={currentTheme}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cardHover={cardHover}
          slideUp={slideUp}
          settings={settings}
          setSettings={setSettings}
          settingsService={settingsService}
          setShowSuccess={setShowSuccess}
          tabs={tabs}
        />
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`fixed bottom-6 right-6 p-4 rounded-xl flex items-center text-[13px] shadow-xl ${
              theme === "light"
                ? "bg-white border border-green-100"
                : "bg-gray-800 border border-green-900/30"
            } dark:bg-gray-800 dark:border-green-900/30`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                theme === "light" ? "bg-green-50" : "bg-green-900/30"
              } dark:bg-green-900/30`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
              >
                <Check
                  className={
                    theme === "light" ? "text-green-500" : "text-green-400"
                  }
                  size={20}
                />
              </motion.div>
            </div>
            <div>
              <p
                className={`font-semibold ${
                  theme === "light" ? "text-gray-800" : "text-white"
                } dark:text-white`}
              >
                Settings Saved Successfully
              </p>
              <p
                className={`text-xs ${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                } dark:text-gray-400`}
              >
                Your changes have been applied to your platform
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default page;
