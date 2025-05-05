import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
    Check,
    X,
    RefreshCw,
    Settings,
    Sliders,
    Globe,
    Users,
    Link as LinkIcon,
    PaintBucket,
    ChevronRight,
} from "lucide-react";
import { settingsService } from "../../../api/services/settings";
import SettingsTabs from "./SettingsTab";

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const slideUp = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1.0]
        }
    }
};

const cardHover = {
    rest: {
        scale: 1,
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" }
    },
    hover: {
        scale: 1.01,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
        y: -5,
        transition: { duration: 0.3, ease: "easeOut" }
    }
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
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<string>("general");
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [id, setId] = useState<string>("");

    const scrollY = useMotionValue(0);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const headerParallax = useTransform(scrollY, [0, 100], [0, -15]);

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

    const handleMouseMove = (e: React.MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    };

    const themeStyles = {
        light: {
            bg: "from-slate-50 via-slate-50 to-indigo-50",
            cardBg: "from-white/80 to-white/70",
            cardBorder: "border-white/60",
            text: "text-slate-800",
            sectionBg: "from-slate-50 to-white",
            sectionBorder: "border-slate-100"
        },
        dark: {
            bg: "from-slate-900 via-slate-900 to-indigo-950",
            cardBg: "from-slate-800/70 to-slate-800/60",
            cardBorder: "border-slate-700/40",
            text: "text-slate-100",
            sectionBg: "from-slate-800/80 to-slate-800/60",
            sectionBorder: "border-slate-700/60"
        }
    };

    const currentTheme = themeStyles[theme];

    const tabs = [
        { id: "general", label: "General", icon: <Globe size={18} /> },
        { id: "appearance", label: "Appearance", icon: <PaintBucket size={18} /> },
        { id: "limits", label: "User Limits", icon: <Users size={18} /> },
        { id: "links", label: "Links & Legal", icon: <LinkIcon size={18} /> },
    ];

    if (loading) {
        return (
            <div className={`flex h-screen items-center justify-center bg-gradient-to-br ${currentTheme.bg}`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                >
                    <div className="relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: "conic-gradient(from 0deg, rgba(99, 102, 241, 0), rgba(99, 102, 241, 1))",
                                filter: "blur(10px)"
                            }}
                        />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
                        >
                            <RefreshCw size={36} className="text-white relative z-10" />
                        </motion.div>
                    </div>
                    <p className="mt-6 text-base font-medium text-white">Loading settings...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} transition-colors duration-300`}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className={`lg:hidden fixed top-0 left-0 right-0 z-20 backdrop-blur-xl shadow-sm px-5 py-4 flex items-center justify-between 
                ${theme === "light" ? "bg-white/80 shadow-sm" : "bg-slate-900/80 shadow-slate-800/20"}`}
                style={{ y: headerParallax }}
            >
                <div className="flex items-center space-x-3">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${theme === "light" ? "bg-indigo-50" : "bg-indigo-900/50"}`}
                    >
                        <Settings size={20} className={theme === "light" ? "text-indigo-600" : "text-indigo-300"} />
                    </motion.div>
                    <h1 className={`text-base font-semibold ${theme === "light" ? "text-slate-800" : "text-white"}`}>
                        Settings
                    </h1>
                </div>
                <div className="flex items-center space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`p-2 rounded-full ${theme === "light"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-slate-800 text-slate-300"}`}
                    >
                        {mobileMenuOpen ? <X size={18} /> : <Sliders size={18} />}
                    </motion.button>
                </div>
            </motion.div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`fixed top-16 left-0 right-0 z-10 backdrop-blur-xl lg:hidden rounded-b-2xl ${theme === "light"
                            ? "bg-white/90 border-b border-slate-200"
                            : "bg-slate-900/90 border-b border-slate-700/30"}`}
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
                                    className={`w-full flex items-center space-x-3 px-4 py-3.5 my-1 rounded-xl text-left text-[13px] ${activeTab === tab.id
                                        ? theme === "light"
                                            ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium shadow-md"
                                            : "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium shadow-md"
                                        : theme === "light"
                                            ? "text-slate-700 hover:bg-slate-50"
                                            : "text-slate-300 hover:bg-slate-800/50"
                                        } transition-all duration-200`}
                                >
                                    <span className={activeTab === tab.id ? "text-white" : theme === "light" ? "text-slate-500" : "text-slate-400"}>
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
                    variants={fadeIn}
                    className="hidden lg:block mb-10 px-2"
                    style={{ y: headerParallax }}
                >
                    <div className="flex items-center space-x-4 mb-2">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 15 }}
                            whileTap={{ scale: 0.95, rotate: -15 }}
                            className={`flex items-center justify-center w-14 h-14 rounded-2xl ${theme === "light" ? "bg-indigo-50" : "bg-indigo-900/50"} shadow-lg shadow-indigo-500/10`}
                        >
                            <Settings size={26} className={theme === "light" ? "text-indigo-600" : "text-indigo-300"} />
                        </motion.div>
                        <div>
                            <motion.h1
                                className={`text-3xl font-bold ${theme === "light"
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                                    : "bg-gradient-to-r from-indigo-400 to-purple-400"} bg-clip-text text-transparent`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                Settings Dashboard
                            </motion.h1>
                            <p className={`text-[13px] mt-1 ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
                                Configure your platform preferences and appearance
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content */}
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

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`fixed bottom-6 right-6 p-4 rounded-xl flex items-center text-[13px] shadow-2xl border ${theme === "light"
                            ? "bg-white border-green-200"
                            : "bg-slate-800 border-green-900/30"}`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${theme === "light" ? "bg-green-50" : "bg-green-900/30"}`}>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
                            >
                                <Check className={theme === "light" ? "text-green-500" : "text-green-400"} size={20} />
                            </motion.div>
                        </div>
                        <div>
                            <p className={`font-semibold ${theme === "light" ? "text-slate-800" : "text-white"}`}>
                                Settings Saved Successfully
                            </p>
                            <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
                                Your changes have been applied to your platform
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes moveGradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                @keyframes colorShine {
                    0% { transform: rotate(0deg); }
                    25% { transform: rotate(90deg); }
                    50% { transform: rotate(180deg); }
                    75% { transform: rotate(270deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default page;