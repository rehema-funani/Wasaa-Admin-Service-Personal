import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { HexColorPicker } from "react-colorful";
import {
    Check,
    X,
    Upload,
    Save,
    RefreshCw,
    ChevronRight,
    Settings,
    Sliders,
    Globe,
    Users,
    Link as LinkIcon,
    Image,
    PaintBucket,
    ChevronDown,
    Moon,
    Sun,
} from "lucide-react";
import { settingsService } from "../../../api/services/settings";

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

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08
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

interface Settings {
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
    [key: string]: any;
}

interface FileInputRef {
    current: HTMLInputElement | null;
}

interface ColorChangeHandler {
    (color: string, field: string): void;
}

const page: React.FC = () => {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showColorPicker, setShowColorPicker] = useState<"primary" | "secondary" | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const scrollY = useMotionValue(0);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const headerParallax = useTransform(scrollY, [0, 100], [0, -15]);

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

    const fileInputRefs = {
        website_logo: useRef<HTMLInputElement>(null),
        website_favicon: useRef<HTMLInputElement>(null),
        banner_image: useRef<HTMLInputElement>(null),
    };

    const [previewImages, setPreviewImages] = useState({
        website_logo: "",
        website_favicon: "",
        banner_image: "",
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await settingsService.getSettings();
                setSettings(data);
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (!settings) return;

        setSettings({
            ...settings,
            [name]: value,
        });

        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (!settings) return;

        setSettings({
            ...settings,
            [name]: value === "" ? "" : parseInt(value, 10),
        });

        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleColorChange: ColorChangeHandler = (color, field) => {
        if (!settings) return;

        setSettings({
            ...settings,
            [field]: color,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (!settings || !files || files.length === 0) return;

        const file = files[0];
        setSettings({
            ...settings,
            [name]: file,
        });

        // Create a preview URL
        const previewUrl = URL.createObjectURL(file);
        setPreviewImages({
            ...previewImages,
            [name]: previewUrl,
        });
    };

    const triggerFileInput = (inputRef: FileInputRef): void => {
        inputRef.current?.click();
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!settings?.website_name) {
            newErrors.website_name = "Website name is required";
        }

        if (!settings?.max_group_members) {
            newErrors.max_group_members = "Maximum group members is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!settings || !validateForm()) {
            return;
        }

        setSaving(true);

        try {
            // Convert the settings to FormData for file uploads
            const formData = new FormData();

            // Add all non-file fields
            Object.entries(settings).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    if (!(value instanceof File)) {
                        formData.append(key, String(value));
                    } else {
                        formData.append(key, value);
                    }
                }
            });

            await settingsService.updateSettings(formData);

            // Show success message
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to save settings:", error);
        } finally {
            setSaving(false);
        }
    };

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    // Tab navigation setup
    const tabs = [
        { id: "general", label: "General", icon: <Globe size={18} /> },
        { id: "appearance", label: "Appearance", icon: <PaintBucket size={18} /> },
        { id: "limits", label: "User Limits", icon: <Users size={18} /> },
        { id: "links", label: "Links & Legal", icon: <LinkIcon size={18} /> },
    ];

    // Theme styles
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

    const inputStyle = (hasError: boolean) =>
        `w-full px-4 py-3.5 text-[13px] rounded-xl border ${hasError
            ? "border-red-400"
            : theme === "light" ? "border-slate-200" : "border-slate-700"
        } ${theme === "light" ? "bg-white/80 text-slate-800" : "bg-slate-800/50 text-white"
        } focus:outline-none focus:ring-2 ${theme === "light" ? "focus:ring-indigo-400" : "focus:ring-indigo-600"
        } focus:border-transparent transition-all duration-200 backdrop-blur-sm`;

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
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${theme === "light" ? "bg-indigo-50" : "bg-indigo-900/50"
                            }`}
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
                        onClick={toggleTheme}
                        className={`p-2 rounded-full ${theme === "light"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-slate-800 text-slate-300"
                            }`}
                    >
                        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`p-2 rounded-full ${theme === "light"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-slate-800 text-slate-300"
                            }`}
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
                            : "bg-slate-900/90 border-b border-slate-700/30"
                            }`}
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
                            className={`flex items-center justify-center w-14 h-14 rounded-2xl ${theme === "light" ? "bg-indigo-50" : "bg-indigo-900/50"
                                } shadow-lg shadow-indigo-500/10`}
                        >
                            <Settings size={26} className={theme === "light" ? "text-indigo-600" : "text-indigo-300"} />
                        </motion.div>
                        <div>
                            <motion.h1
                                className={`text-3xl font-bold ${theme === "light"
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                                    : "bg-gradient-to-r from-indigo-400 to-purple-400"
                                    } bg-clip-text text-transparent`}
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
                                                ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium shadow-lg"
                                                : "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium shadow-lg"
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
                                ? "from-purple-50/90 to-indigo-50/80"
                                : "from-purple-900/30 to-indigo-900/20"
                                }`}
                            initial="rest"
                            whileHover="hover"
                            variants={cardHover}
                        >
                            <h3 className={`text-[13px] font-semibold ${theme === "light" ? "text-indigo-700" : "text-indigo-300"} mb-2`}>
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
                                <div className={`h-1.5 w-full mt-2 rounded-full overflow-hidden ${theme === "light" ? "bg-slate-200" : "bg-slate-700"
                                    }`}>
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: "65%" }}
                                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

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
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <AnimatePresence mode="wait">
                                    {activeTab === "general" && (
                                        <motion.div
                                            key="general"
                                            initial={{ opacity: 0, x: 5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -5 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-8"
                                        >
                                            <motion.div variants={staggerChildren} className="space-y-6">
                                                <motion.div
                                                    variants={slideUp}
                                                    className="flex items-center space-x-3 mb-2"
                                                >
                                                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${theme === "light" ? "bg-blue-50" : "bg-blue-900/30"
                                                        }`}>
                                                        <Globe size={20} className={theme === "light" ? "text-blue-600" : "text-blue-400"} />
                                                    </div>
                                                    <h2 className={`text-lg font-semibold ${theme === "light" ? "text-slate-800" : "text-white"}`}>
                                                        General Settings
                                                    </h2>
                                                </motion.div>

                                                <motion.div
                                                    variants={slideUp}
                                                    className={`p-6 rounded-2xl bg-gradient-to-br ${currentTheme.sectionBg} border ${currentTheme.sectionBorder} shadow-sm`}
                                                    whileHover={{ boxShadow: theme === "light" ? "0 10px 30px -10px rgba(0, 0, 0, 0.1)" : "0 10px 30px -10px rgba(0, 0, 0, 0.3)" }}
                                                >
                                                    <div className="space-y-6">
                                                        <div>
                                                            <label className={`block text-[13px] font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"} mb-2`}>
                                                                Website Name <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="website_name"
                                                                value={settings?.website_name || ""}
                                                                onChange={handleChange}
                                                                className={inputStyle(!!errors.website_name)}
                                                                placeholder="Enter website name"
                                                            />
                                                            {errors.website_name && (
                                                                <p className="mt-2 text-xs text-red-500">{errors.website_name}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className={`block text-[13px] font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"} mb-2`}>
                                                                Website Description
                                                            </label>
                                                            <textarea
                                                                name="website_description"
                                                                value={settings?.website_description || ""}
                                                                onChange={handleChange}
                                                                rows={3}
                                                                className={inputStyle(!!errors.website_description)}
                                                                placeholder="Enter website description"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className={`block text-[13px] font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"} mb-2`}>
                                                                Website Email
                                                            </label>
                                                            <input
                                                                type="email"
                                                                name="website_email"
                                                                value={settings?.website_email || ""}
                                                                onChange={handleChange}
                                                                className={inputStyle(!!errors.website_email)}
                                                                placeholder="Enter website email"
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        </motion.div>
                                    )}

                                    {/* Appearance Settings */}
                                    {activeTab === "appearance" && (
                                        <motion.div
                                            key="appearance"
                                            initial={{ opacity: 0, x: 5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -5 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-8"
                                        >
                                            <motion.div variants={staggerChildren} className="space-y-6">
                                                <motion.div
                                                    variants={slideUp}
                                                    className="flex items-center space-x-3 mb-2"
                                                >
                                                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${theme === "light" ? "bg-purple-50" : "bg-purple-900/30"
                                                        }`}>
                                                        <PaintBucket size={20} className={theme === "light" ? "text-purple-600" : "text-purple-400"} />
                                                    </div>
                                                    <h2 className={`text-lg font-semibold ${theme === "light" ? "text-slate-800" : "text-white"}`}>
                                                        Appearance Settings
                                                    </h2>
                                                </motion.div>

                                                {/* Colors Section */}
                                                <motion.div
                                                    variants={slideUp}
                                                    className={`p-6 rounded-2xl bg-gradient-to-br ${currentTheme.sectionBg} border ${currentTheme.sectionBorder} shadow-sm`}
                                                    whileHover={{ boxShadow: theme === "light" ? "0 10px 30px -10px rgba(0, 0, 0, 0.1)" : "0 10px 30px -10px rgba(0, 0, 0, 0.3)" }}
                                                >
                                                    <div
                                                        onClick={() => toggleSection("colors")}
                                                        className={`flex items-center justify-between cursor-pointer ${theme === "light" ? "hover:text-indigo-600" : "hover:text-indigo-400"
                                                            } transition-colors duration-200`}
                                                    >
                                                        <h3 className={`text-base font-medium ${theme === "light" ? "text-slate-800" : "text-white"}`}>
                                                            Brand Colors
                                                        </h3>
                                                        <motion.div
                                                            animate={{ rotate: expandedSection === "colors" ? 180 : 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className={theme === "light" ? "text-slate-500" : "text-slate-400"}
                                                        >
                                                            <ChevronDown size={18} />
                                                        </motion.div>
                                                    </div>

                                                    <AnimatePresence>
                                                        {(expandedSection === "colors" || expandedSection === null) && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="mt-5 space-y-6"
                                                            >
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                    {/* Primary Color */}
                                                                    <div className="relative">
                                                                        <label className={`block text-[13px] font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"} mb-2`}>
                                                                            Primary Color
                                                                        </label>
                                                                        <div className="flex items-center">
                                                                            <motion.div
                                                                                whileHover={{ scale: 1.1 }}
                                                                                whileTap={{ scale: 0.95 }}
                                                                                className="w-12 h-12 rounded-xl shadow-lg mr-4 cursor-pointer relative overflow-hidden"
                                                                                style={{ backgroundColor: settings?.website_color_primary || "#6366F1" }}
                                                                                onClick={() => setShowColorPicker(showColorPicker === "primary" ? null : "primary")}
                                                                            >
                                                                                {/* Reflection effect */}
                                                                                <div
                                                                                    className="absolute inset-0 opacity-30"
                                                                                    style={{
                                                                                        background: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.8) 40%, transparent 50%)",
                                                                                        top: "-100%",
                                                                                        left: "-100%",
                                                                                        width: "300%",
                                                                                        height: "300%",
                                                                                        animation: "colorShine 3s ease-in-out infinite"
                                                                                    }}
                                                                                />
                                                                            </motion.div>
                                                                            <input
                                                                                type="text"
                                                                                name="website_color_primary"
                                                                                value={settings?.website_color_primary || ""}
                                                                                onChange={handleChange}
                                                                                className={inputStyle(false)}
                                                                                placeholder="#6366F1"
                                                                            />
                                                                        </div>
                                                                        {showColorPicker === "primary" && (
                                                                            <motion.div
                                                                                initial={{ opacity: 0, y: 5 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                className="absolute z-10 mt-4"
                                                                            >
                                                                                <div className={`p-3 rounded-xl shadow-xl border ${theme === "light" ? "bg-white border-slate-200" : "bg-slate-800 border-slate-700"
                                                                                    }`}>
                                                                                    <HexColorPicker
                                                                                        color={settings?.website_color_primary || "#6366F1"}
                                                                                        onChange={(color) => handleColorChange(color, "website_color_primary")}
                                                                                    />
                                                                                    <motion.button
                                                                                        whileHover={{ scale: 1.1 }}
                                                                                        whileTap={{ scale: 0.9 }}
                                                                                        type="button"
                                                                                        className={`absolute -top-2 -right-2 ${theme === "light"
                                                                                            ? "bg-white rounded-full p-1 shadow-md border border-slate-200"
                                                                                            : "bg-slate-800 rounded-full p-1 shadow-md border border-slate-700"
                                                                                            }`}
                                                                                        onClick={() => setShowColorPicker(null)}
                                                                                    >
                                                                                        <X size={14} className={theme === "light" ? "text-slate-600" : "text-slate-300"} />
                                                                                    </motion.button>
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </div>

                                                                    {/* Secondary Color */}
                                                                    <div className="relative">
                                                                        <label className={`block text-[13px] font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"} mb-2`}>
                                                                            Secondary Color
                                                                        </label>
                                                                        <div className="flex items-center">
                                                                            <motion.div
                                                                                whileHover={{ scale: 1.1 }}
                                                                                whileTap={{ scale: 0.95 }}
                                                                                className="w-12 h-12 rounded-xl shadow-lg mr-4 cursor-pointer relative overflow-hidden"
                                                                                style={{ backgroundColor: settings?.website_color_secondary || "#10B981" }}
                                                                                onClick={() => setShowColorPicker(showColorPicker === "secondary" ? null : "secondary")}
                                                                            >
                                                                                {/* Reflection effect */}
                                                                                <div
                                                                                    className="absolute inset-0 opacity-30"
                                                                                    style={{
                                                                                        background: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.8) 40%, transparent 50%)",
                                                                                        top: "-100%",
                                                                                        left: "-100%",
                                                                                        width: "300%",
                                                                                        height: "300%",
                                                                                        animation: "colorShine 3s ease-in-out infinite"
                                                                                    }}
                                                                                />
                                                                            </motion.div>
                                                                            <input
                                                                                type="text"
                                                                                name="website_color_secondary"
                                                                                value={settings?.website_color_secondary || ""}
                                                                                onChange={handleChange}
                                                                                className={inputStyle(false)}
                                                                                placeholder="#10B981"
                                                                            />
                                                                        </div>
                                                                        {showColorPicker === "secondary" && (
                                                                            <motion.div
                                                                                initial={{ opacity: 0, y: 5 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                className="absolute z-10 mt-4"
                                                                            >
                                                                                <div className={`p-3 rounded-xl shadow-xl border ${theme === "light" ? "bg-white border-slate-200" : "bg-slate-800 border-slate-700"
                                                                                    }`}>
                                                                                    <HexColorPicker
                                                                                        color={settings?.website_color_secondary || "#10B981"}
                                                                                        onChange={(color) => handleColorChange(color, "website_color_secondary")}
                                                                                    />
                                                                                    <motion.button
                                                                                        whileHover={{ scale: 1.1 }}
                                                                                        whileTap={{ scale: 0.9 }}
                                                                                        type="button"
                                                                                        className={`absolute -top-2 -right-2 ${theme === "light"
                                                                                            ? "bg-white rounded-full p-1 shadow-md border border-slate-200"
                                                                                            : "bg-slate-800 rounded-full p-1 shadow-md border border-slate-700"
                                                                                            }`}
                                                                                        onClick={() => setShowColorPicker(null)}
                                                                                    >
                                                                                        <X size={14} className={theme === "light" ? "text-slate-600" : "text-slate-300"} />
                                                                                    </motion.button>
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Color preview panel */}
                                                                <div className={`mt-4 p-4 rounded-xl ${theme === "light" ? "bg-white/70" : "bg-slate-800/50"
                                                                    } border ${theme === "light" ? "border-slate-200" : "border-slate-700"
                                                                    }`}>
                                                                    <p className={`text-xs font-medium mb-3 ${theme === "light" ? "text-slate-600" : "text-slate-400"
                                                                        }`}>Preview:</p>
                                                                    <div className="flex space-x-3">
                                                                        <div
                                                                            className="flex-1 h-14 rounded-lg flex items-center justify-center shadow-md"
                                                                            style={{
                                                                                background: `linear-gradient(to right, ${settings?.website_color_primary || "#6366F1"}, ${settings?.website_color_primary || "#6366F1"}90)`,
                                                                            }}
                                                                        >
                                                                            <p className="text-white text-[13px] font-medium">Primary Button</p>
                                                                        </div>
                                                                        <div
                                                                            className="flex-1 h-14 rounded-lg flex items-center justify-center shadow-md"
                                                                            style={{
                                                                                background: `linear-gradient(to right, ${settings?.website_color_secondary || "#10B981"}, ${settings?.website_color_secondary || "#10B981"}90)`,
                                                                            }}
                                                                        >
                                                                            <p className="text-white text-[13px] font-medium">Secondary Button</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>

                                                {/* Branding Section */}
                                                <motion.div
                                                    variants={slideUp}
                                                    className={`p-6 rounded-2xl bg-gradient-to-br ${currentTheme.sectionBg} border ${currentTheme.sectionBorder} shadow-sm`}
                                                    whileHover={{ boxShadow: theme === "light" ? "0 10px 30px -10px rgba(0, 0, 0, 0.1)" : "0 10px 30px -10px rgba(0, 0, 0, 0.3)" }}
                                                >
                                                    <div
                                                        onClick={() => toggleSection("branding")}
                                                        className={`flex items-center justify-between cursor-pointer ${theme === "light" ? "hover:text-indigo-600" : "hover:text-indigo-400"
                                                            } transition-colors duration-200`}
                                                    >
                                                        <h3 className={`text-base font-medium ${theme === "light" ? "text-slate-800" : "text-white"}`}>
                                                            Visual Assets
                                                        </h3>
                                                        <motion.div
                                                            animate={{ rotate: expandedSection === "branding" ? 180 : 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className={theme === "light" ? "text-slate-500" : "text-slate-400"}
                                                        >
                                                            <ChevronDown size={18} />
                                                        </motion.div>
                                                    </div>

                                                    <AnimatePresence>
                                                        {(expandedSection === "branding" || expandedSection === null) && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="mt-5 space-y-6"
                                                            >
                                                                {/* Logo, Favicon, Banner Uploads */}
                                                                <div className="space-y-6">
                                                                    <div>
                                                                        <label className={`block text-[13px] font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"} mb-2 flex items-center space-x-2`}>
                                                                            <Image size={16} className={theme === "light" ? "text-slate-500" : "text-slate-400"} />
                                                                            <span>Website Logo</span>
                                                                        </label>
                                                                        <motion.div
                                                                            whileHover={{
                                                                                borderColor: theme === "light" ? '#6366F1' : '#818cf8',
                                                                                boxShadow: theme === "light"
                                                                                    ? '0 0 0 3px rgba(99, 102, 241, 0.1)'
                                                                                    : '0 0 0 3px rgba(129, 140, 248, 0.1)'
                                                                            }}
                                                                            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${theme === "light"
                                                                                ? "border-slate-200 bg-slate-50/50"
                                                                                : "border-slate-700 bg-slate-800/30"
                                                                                }`}
                                                                            onClick={() => triggerFileInput(fileInputRefs.website_logo)}
                                                                        >
                                                                            <input
                                                                                type="file"
                                                                                ref={fileInputRefs.website_logo}
                                                                                name="website_logo"
                                                                                accept="image/*"
                                                                                onChange={handleFileChange}
                                                                                className="hidden"
                                                                            />
                                                                            {previewImages.website_logo ? (
                                                                                <div className="flex flex-col items-center">
                                                                                    <motion.div
                                                                                        whileHover={{ scale: 1.03 }}
                                                                                        className="relative mb-3 rounded-lg shadow-lg overflow-hidden"
                                                                                    >
                                                                                        <img
                                                                                            src={previewImages.website_logo}
                                                                                            alt="Website Logo Preview"
                                                                                            className="max-h-36 z-10 relative"
                                                                                        />
                                                                                        <div
                                                                                            className="absolute -inset-1 opacity-30 rounded-lg z-0"
                                                                                            style={{
                                                                                                background: `linear-gradient(45deg, ${settings?.website_color_primary || "#6366F1"}, ${settings?.website_color_secondary || "#10B981"})`,
                                                                                                filter: "blur(8px)"
                                                                                            }}
                                                                                        />
                                                                                    </motion.div>
                                                                                    <p className={`text-xs font-medium ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
                                                                                        Click to change
                                                                                    </p>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="flex flex-col items-center">
                                                                                    <motion.div
                                                                                        whileHover={{ y: -5 }}
                                                                                        transition={{ type: "spring", stiffness: 300 }}
                                                                                        className={`w-16 h-16 rounded-full ${theme === "light" ? "bg-indigo-50" : "bg-indigo-900/30"
                                                                                            } flex items-center justify-center mb-3`}
                                                                                    >
                                                                                        <Upload className={theme === "light" ? "text-indigo-400" : "text-indigo-300"} size={24} />
                                                                                    </motion.div>
                                                                                    <p className={`text-[13px] font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"} mb-1`}>
                                                                                        Click to upload logo
                                                                                    </p>
                                                                                    <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-slate-500"}`}>
                                                                                        PNG, JPG, SVG, WEBP up to 1MB
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                        </motion.div>
                                                                    </div>

                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                        <div>
                                                                            <label className={`block text-[13px] font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"} mb-2`}>
                                                                                Website Favicon
                                                                            </label>
                                                                            <motion.div
                                                                                whileHover={{
                                                                                    borderColor: theme === "light" ? '#6366F1' : '#818cf8',
                                                                                    boxShadow: theme === "light"
                                                                                        ? '0 0 0 3px rgba(99, 102, 241, 0.1)'
                                                                                        : '0 0 0 3px rgba(129, 140, 248, 0.1)'
                                                                                }}
                                                                                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer h-full transition-all duration-200 ${theme === "light"
                                                                                    ? "border-slate-200 bg-slate-50/50"
                                                                                    : "border-slate-700 bg-slate-800/30"
                                                                                    }`}
                                                                                onClick={() => triggerFileInput(fileInputRefs.website_favicon)}
                                                                            >
                                                                                <input
                                                                                    type="file"
                                                                                    ref={fileInputRefs.website_favicon}
                                                                                    name="website_favicon"
                                                                                    accept="image/*"
                                                                                    onChange={handleFileChange}
                                                                                    className="hidden"
                                                                                />
                                                                                {previewImages.website_favicon ? (
                                                                                    <div className="flex flex-col items-center">
                                                                                        <motion.div
                                                                                            whileHover={{ scale: 1.05, rotate: 5 }}
                                                                                            className="relative mb-3 rounded-lg shadow-lg overflow-hidden"
                                                                                        >
                                                                                            <img
                                                                                                src={previewImages.website_favicon}
                                                                                                alt="Favicon Preview"
                                                                                                className="h-16 w-16 object-contain z-10 relative"
                                                                                            />
                                                                                            <div
                                                                                                className="absolute -inset-1 opacity-30 rounded-lg z-0"
                                                                                                style={{
                                                                                                    background: `linear-gradient(45deg, ${settings?.website_color_primary || "#6366F1"}, ${settings?.website_color_secondary || "#10B981"})`,
                                                                                                    filter: "blur(8px)"
                                                                                                }}
                                                                                            />
                                                                                        </motion.div>
                                                                                        <p className={`text-xs font-medium ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
                                                                                            Click to change
                                                                                        </p>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="flex flex-col items-center">
                                                                                        <motion.div
                                                                                            whileHover={{ rotate: 15 }}
                                                                                            transition={{ type: "spring", stiffness: 300 }}
                                                                                            className={`w-12 h-12 rounded-full ${theme === "light" ? "bg-indigo-50" : "bg-indigo-900/30"
                                                                                                } flex items-center justify-center mb-3`}
                                                                                        >
                                                                                            <Upload className={theme === "light" ? "text-indigo-400" : "text-indigo-300"} size={20} />
                                                                                        </motion.div>
                                                                                        <p className={`text-[13px] font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"} mb-1`}>
                                                                                            Upload favicon
                                                                                        </p>
                                                                                        <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-slate-500"}`}>
                                                                                            ICO, PNG up to 500KB
                                                                                        </p>
                                                                                    </div>
                                                                                )}
                                                                            </motion.div>
                                                                        </div>

                                                                        <div>
                                                                            <label className={`block text-[13px] font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"} mb-2`}>
                                                                                Banner Image
                                                                            </label>
                                                                            <motion.div
                                                                                whileHover={{
                                                                                    borderColor: theme === "light" ? '#6366F1' : '#818cf8',
                                                                                    boxShadow: theme === "light"
                                                                                        ? '0 0 0 3px rgba(99, 102, 241, 0.1)'
                                                                                        : '0 0 0 3px rgba(129, 140, 248, 0.1)'
                                                                                }}
                                                                                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer h-full transition-all duration-200 ${theme === "light"
                                                                                    ? "border-slate-200 bg-slate-50/50"
                                                                                    : "border-slate-700 bg-slate-800/30"
                                                                                    }`}
                                                                                onClick={() => triggerFileInput(fileInputRefs.banner_image)}
                                                                            >
                                                                                <input
                                                                                    type="file"
                                                                                    ref={fileInputRefs.banner_image}
                                                                                    name="banner_image"
                                                                                    accept="image/*"
                                                                                    onChange={handleFileChange}
                                                                                    className="hidden"
                                                                                />
                                                                                {previewImages.banner_image ? (
                                                                                    <div className="flex flex-col items-center">
                                                                                        <motion.div
                                                                                            whileHover={{ scale: 1.05 }}
                                                                                            className="relative mb-3 rounded-lg shadow-lg overflow-hidden w-full"
                                                                                        >
                                                                                            <img
                                                                                                src={previewImages.banner_image}
                                                                                                alt="Banner Preview"
                                                                                                className="h-16 w-full object-cover z-10 relative"
                                                                                            />
                                                                                            <div
                                                                                                className="absolute -inset-1 opacity-30 rounded-lg z-0"
                                                                                                style={{
                                                                                                    background: `linear-gradient(45deg, ${settings?.website_color_primary || "#6366F1"}, ${settings?.website_color_secondary || "#10B981"})`,
                                                                                                    filter: "blur(8px)"
                                                                                                }}
                                                                                            />
                                                                                        </motion.div>
                                                                                        <p className={`text-xs font-medium ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
                                                                                            Click to change
                                                                                        </p>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="flex flex-col items-center">
                                                                                        <motion.div
                                                                                            whileHover={{ y: -5 }}
                                                                                            transition={{ type: "spring", stiffness: 300 }}
                                                                                            className={`w-12 h-12 rounded-full ${theme === "light" ? "bg-indigo-50" : "bg-indigo-900/30"
                                                                                                } flex items-center justify-center mb-3`}
                                                                                        >
                                                                                            <Upload className={theme === "light" ? "text-indigo-400" : "text-indigo-300"} size={20} />
                                                                                        </motion.div>
                                                                                        <p className={`text-[13px] font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"} mb-1`}>
                                                                                            Upload banner
                                                                                        </p>
                                                                                        <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-slate-500"}`}>
                                                                                            1920×480px recommended
                                                                                        </p>
                                                                                    </div>
                                                                                )}
                                                                            </motion.div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            </motion.div>
                                        </motion.div>
                                    )}

                                    {/* User Limits Settings */}
                                    {activeTab === "limits" && (
                                        <motion.div
                                            key="limits"
                                            initial={{ opacity: 0, x: 5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -5 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-8"
                                        >
                                            <motion.div variants={staggerChildren} className="space-y-6">
                                                <motion.div
                                                    variants={slideUp}
                                                    className="flex items-center space-x-3 mb-2"
                                                >
                                                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${theme === "light" ? "bg-amber-50" : "bg-amber-900/30"
                                                        }`}>
                                                        <Users size={20} className={theme === "light" ? "text-amber-600" : "text-amber-400"} />
                                                    </div>
                                                    <h2 className={`text-lg font-semibold ${theme === "light" ? "text-slate-800" : "text-white"}`}>
                                                        User Limits
                                                    </h2>
                                                </motion.div>

                                                <motion.div
                                                    variants={slideUp}
                                                    className={`p-6 rounded-2xl bg-gradient-to-br ${currentTheme.sectionBg} border ${currentTheme.sectionBorder} shadow-sm`}
                                                    whileHover={{ boxShadow: theme === "light" ? "0 10px 30px -10px rgba(0, 0, 0, 0.1)" : "0 10px 30px -10px rgba(0, 0, 0, 0.3)" }}
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <label className={`block text-[13px] font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"} mb-2`}>
                                                                Maximum Group Members <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="max_group_members"
                                                                value={settings?.max_group_members || ""}
                                                                onChange={handleNumberChange}
                                                                min="1"
                                                                className={inputStyle(!!errors.max_group_members)}
                                                                placeholder="Enter maximum group members"
                                                            />
                                                            {errors.max_group_members && (
                                                                <p className="mt-2 text-xs text-red-500">{errors.max_group_members}</p>
                                                            )}

                                                            {/* Visual slider for user limits */}
                                                            <div className="mt-4">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
                                                                        Value: {settings?.max_group_members || 0}
                                                                    </p>
                                                                    <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
                                                                        Recommended: 50-200
                                                                    </p>
                                                                </div>
                                                                <div className={`h-1.5 w-full rounded-full overflow-hidden ${theme === "light" ? "bg-slate-200" : "bg-slate-700"
                                                                    }`}>
                                                                    <motion.div
                                                                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300"
                                                                        initial={{ width: 0 }}
                                                                        animate={{
                                                                            width: settings?.max_group_members
                                                                                ? `${Math.min(settings.max_group_members / 2, 100)}%`
                                                                                : '0%'
                                                                        }}
                                                                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className={`block text-[13px] font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"} mb-2`}>
                                                                Maximum Group Name Length
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="max_group_name_length"
                                                                value={settings?.max_group_name_length || ""}
                                                                onChange={handleNumberChange}
                                                                min="1"
                                                                className={inputStyle(false)}
                                                                placeholder="Enter maximum name length"
                                                            />

                                                            {/* Visual slider for name length */}
                                                            <div className="mt-4">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
                                                                        Value: {settings?.max_group_name_length || 0}
                                                                    </p>
                                                                    <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
                                                                        Recommended: 30-100
                                                                    </p>
                                                                </div>
                                                                <div className={`h-1.5 w-full rounded-full overflow-hidden ${theme === "light" ? "bg-slate-200" : "bg-slate-700"
                                                                    }`}>
                                                                    <motion.div
                                                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-400"
                                                                        initial={{ width: 0 }}
                                                                        animate={{
                                                                            width: settings?.max_group_name_length
                                                                                ? `${Math.min(settings.max_group_name_length, 100)}%`
                                                                                : '0%'
                                                                        }}
                                                                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        </motion.div>
                                    )}

                                    {/* Links & Legal Settings */}
                                    {activeTab === "links" && (
                                        <motion.div
                                            key="links"
                                            initial={{ opacity: 0, x: 5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -5 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-8"
                                        >
                                            <motion.div variants={staggerChildren} className="space-y-6">
                                                <motion.div
                                                    variants={slideUp}
                                                    className="flex items-center space-x-3 mb-2"
                                                >
                                                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${theme === "light" ? "bg-emerald-50" : "bg-emerald-900/30"
                                                        }`}>
                                                        <LinkIcon size={20} className={theme === "light" ? "text-emerald-600" : "text-emerald-400"} />
                                                    </div>
                                                    <h2 className={`text-lg font-semibold ${theme === "light" ? "text-slate-800" : "text-white"}`}>
                                                        Links & Legal
                                                    </h2>
                                                </motion.div>

                                                <motion.div
                                                    variants={slideUp}
                                                    className={`p-6 rounded-2xl bg-gradient-to-br ${currentTheme.sectionBg} border ${currentTheme.sectionBorder} shadow-sm`}
                                                    whileHover={{ boxShadow: theme === "light" ? "0 10px 30px -10px rgba(0, 0, 0, 0.1)" : "0 10px 30px -10px rgba(0, 0, 0, 0.3)" }}
                                                >
                                                    <div className="space-y-6">
                                                        <div>
                                                            <label className={`block text-[13px] font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"} mb-2`}>
                                                                Website Link
                                                            </label>
                                                            <input
                                                                type="url"
                                                                name="website_link"
                                                                value={settings?.website_link || ""}
                                                                onChange={handleChange}
                                                                className={inputStyle(false)}
                                                                placeholder="https://example.com"
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div>
                                                                <label className={`block text-[13px] font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"} mb-2`}>
                                                                    iOS App Link
                                                                </label>
                                                                <input
                                                                    type="url"
                                                                    name="ios_link"
                                                                    value={settings?.ios_link || ""}
                                                                    onChange={handleChange}
                                                                    className={inputStyle(false)}
                                                                    placeholder="Apple App Store URL"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className={`block text-[13px] font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"} mb-2`}>
                                                                    Android App Link
                                                                </label>
                                                                <input
                                                                    type="url"
                                                                    name="android_link"
                                                                    value={settings?.android_link || ""}
                                                                    onChange={handleChange}
                                                                    className={inputStyle(false)}
                                                                    placeholder="Google Play Store URL"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className={`block text-[13px] font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"} mb-2`}>
                                                                Tell a Friend Link
                                                            </label>
                                                            <input
                                                                type="url"
                                                                name="tell_a_friend_link"
                                                                value={settings?.tell_a_friend_link || ""}
                                                                onChange={handleChange}
                                                                className={inputStyle(false)}
                                                                placeholder="https://example.com/refer"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className={`block text-[13px] font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"} mb-2`}>
                                                                Copyright Information
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="copy_right"
                                                                value={settings?.copy_right || ""}
                                                                onChange={handleChange}
                                                                className={inputStyle(false)}
                                                                placeholder="© 2025 Your Company Name"
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Save Button */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className={`pt-6 border-t ${theme === "light" ? "border-slate-100" : "border-slate-700/50"} flex justify-end`}
                                >
                                    <motion.button
                                        whileHover={{
                                            scale: 1.03,
                                            boxShadow: theme === "light"
                                                ? "0 15px 30px -5px rgba(99, 102, 241, 0.5)"
                                                : "0 15px 30px -5px rgba(79, 70, 229, 0.4)"
                                        }}
                                        whileTap={{ scale: 0.97 }}
                                        disabled={saving}
                                        type="submit"
                                        className={`relative overflow-hidden flex items-center px-8 py-3.5 rounded-xl text-[13px] font-medium text-white ${saving
                                            ? theme === "light" ? "bg-slate-400" : "bg-slate-600"
                                            : "bg-gradient-to-r from-indigo-600 to-indigo-500"
                                            } shadow-xl transition-all duration-300`}
                                    >
                                        {/* Animated background effect for save button */}
                                        <div
                                            className="absolute inset-0 w-full h-full"
                                            style={{
                                                background: !saving
                                                    ? "linear-gradient(45deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 100%)"
                                                    : "none",
                                                backgroundSize: "200% 200%",
                                                animation: "moveGradient 3s ease infinite"
                                            }}
                                        />

                                        {saving ? (
                                            <>
                                                <RefreshCw className="animate-spin mr-2" size={18} />
                                                <span>Saving Changes...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2" size={18} />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            </form>
                        </motion.div>
                    </motion.div>
                </div>
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
                            : "bg-slate-800 border-green-900/30"
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${theme === "light" ? "bg-green-50" : "bg-green-900/30"
                            }`}>
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