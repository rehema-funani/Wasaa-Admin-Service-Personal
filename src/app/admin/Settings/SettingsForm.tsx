import React, { useState, useRef } from "react";
import { motion, Variants } from "framer-motion";
import { HexColorPicker } from "react-colorful";
import {
    X,
    Upload,
    Save,
    RefreshCw,
    Globe,
    Users,
    Link as LinkIcon,
    Image,
    PaintBucket,
    ChevronDown,
} from "lucide-react";
import { Settings, FileInputRef, ColorChangeHandler, ThemeStyles } from "./page";

interface SettingsFormProps {
    id: string;
    activeTab: string;
    theme: "light" | "dark";
    currentTheme: ThemeStyles;
    staggerChildren: Variants;
    slideUp: Variants;
    settings: Settings | null;
    setSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
    settingsService: any;
    setShowSuccess: (show: boolean) => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({
    id,
    activeTab,
    theme,
    currentTheme,
    staggerChildren,
    slideUp,
    settings,
    setSettings,
    settingsService,
    setShowSuccess
}) => {
    const [saving, setSaving] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showColorPicker, setShowColorPicker] = useState<"primary" | "secondary" | null>(null);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

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
            const updatedSettings = { ...settings };

            if (updatedSettings.website_social_links && typeof updatedSettings.website_social_links !== 'object') {
                updatedSettings.website_social_links = {};
            } else if (!updatedSettings.website_social_links) {
                updatedSettings.website_social_links = {};
            }

            const formData = new FormData();

            Object.entries(updatedSettings).forEach(([key, value]) => {
                if (key === 'id' || key === 'website_phone' || key === 'website_address' || key === 'website_about' || key === 'createdAt' || key === 'updatedAt') return;

                if (value !== null && value !== undefined) {
                    if (!(value instanceof File)) {
                        if (typeof value === 'object' && !(value instanceof File)) {
                            formData.append(key, JSON.stringify(value));
                        } else {
                            formData.append(key, String(value));
                        }
                    } else {
                        formData.append(key, value);
                    }
                }
            });

            await settingsService.updateSettings(formData, id);

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

    const inputStyle = (hasError: boolean) =>
        `w-full px-4 py-3.5 text-[13px] rounded-xl border ${hasError
            ? "border-red-400"
            : theme === "light" ? "border-slate-200" : "border-slate-700"
        } ${theme === "light" ? "bg-white/80 text-slate-800" : "bg-slate-800/50 text-white"
        } focus:outline-none focus:ring-2 ${theme === "light" ? "focus:ring-indigo-400" : "focus:ring-indigo-600"
        } focus:border-transparent transition-all duration-200 backdrop-blur-sm`;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
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
                            <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${theme === "light" ? "bg-blue-50" : "bg-blue-900/30"}`}>
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

            {/* Appearance Settings Tab */}
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
                            <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${theme === "light" ? "bg-purple-50" : "bg-purple-900/30"}`}>
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
                                className={`flex items-center justify-between cursor-pointer ${theme === "light" ? "hover:text-indigo-600" : "hover:text-indigo-400"} transition-colors duration-200`}
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
                                                    <div className={`p-3 rounded-xl shadow-xl border ${theme === "light" ? "bg-white border-slate-200" : "bg-slate-800 border-slate-700"}`}>
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
                                                                : "bg-slate-800 rounded-full p-1 shadow-md border border-slate-700"}`}
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
                                                    <div className={`p-3 rounded-xl shadow-xl border ${theme === "light" ? "bg-white border-slate-200" : "bg-slate-800 border-slate-700"}`}>
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
                                                                : "bg-slate-800 rounded-full p-1 shadow-md border border-slate-700"}`}
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
                                    <div className={`mt-4 p-4 rounded-xl ${theme === "light" ? "bg-white/70" : "bg-slate-800/50"} border ${theme === "light" ? "border-slate-200" : "border-slate-700"}`}>
                                        <p className={`text-xs font-medium mb-3 ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>Preview:</p>
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
                        </motion.div>

                        {/* Branding Section */}
                        <motion.div
                            variants={slideUp}
                            className={`p-6 rounded-2xl bg-gradient-to-br ${currentTheme.sectionBg} border ${currentTheme.sectionBorder} shadow-sm`}
                            whileHover={{ boxShadow: theme === "light" ? "0 10px 30px -10px rgba(0, 0, 0, 0.1)" : "0 10px 30px -10px rgba(0, 0, 0, 0.3)" }}
                        >
                            <div
                                onClick={() => toggleSection("branding")}
                                className={`flex items-center justify-between cursor-pointer ${theme === "light" ? "hover:text-indigo-600" : "hover:text-indigo-400"} transition-colors duration-200`}
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
                                                    : "border-slate-700 bg-slate-800/30"}`}
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
                                                            className={`w-16 h-16 rounded-full ${theme === "light" ? "bg-indigo-50" : "bg-indigo-900/30"} flex items-center justify-center mb-3`}
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

                                        {/* We'd include the favicon and banner upload fields here */}
                                        {/* Simplified for brevity */}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}

            {/* User Limits Settings Tab */}
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
                            <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${theme === "light" ? "bg-amber-50" : "bg-amber-900/30"}`}>
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
                                        <div className={`h-1.5 w-full rounded-full overflow-hidden ${theme === "light" ? "bg-slate-200" : "bg-slate-700"}`}>
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

                                {/* Group name length input field would go here */}
                                {/* Simplified for brevity */}
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}

            {/* Links & Legal Settings Tab */}
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
                            <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${theme === "light" ? "bg-emerald-50" : "bg-emerald-900/30"}`}>
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

                                {/* Additional fields for iOS link, Android link, etc. would go here */}
                                {/* Simplified for brevity */}
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}

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
                        : "bg-gradient-to-r from-indigo-600 to-indigo-500"} shadow-xl transition-all duration-300`}
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
    );
};

export default SettingsForm;