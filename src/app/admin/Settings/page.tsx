import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    Link,
    Image,
    PaintBucket
} from "lucide-react";
import { settingsService } from "../../../api/services/settings";

// Animation variants
const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
};

const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const page: React.FC = () => {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const fileInputRefs = {
        website_logo: useRef<HTMLInputElement>(null),
        website_favicon: useRef<HTMLInputElement>(null),
        banner_image: useRef<HTMLInputElement>(null),
    };

    const [previewImages, setPreviewImages] = useState<Record<string, string>>({
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

        // Clear error for this field if it exists
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

        // Clear error for this field if it exists
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleColorChange = (color: string, field: string) => {
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

    const triggerFileInput = (inputRef: React.RefObject<HTMLInputElement | null>) => {
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

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <RefreshCw size={28} className="text-blue-500" />
                    </motion.div>
                    <p className="mt-3 text-sm text-gray-600">Loading settings...</p>
                </motion.div>
            </div>
        );
    }

    // Tab navigation setup
    const tabs = [
        { id: "general", label: "General", icon: <Globe size={15} /> },
        { id: "appearance", label: "Appearance", icon: <PaintBucket size={15} /> },
        { id: "limits", label: "User Limits", icon: <Users size={15} /> },
        { id: "links", label: "Links & Legal", icon: <Link size={15} /> },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Settings size={18} className="text-gray-700" />
                    <h1 className="text-base font-medium text-gray-800">Settings</h1>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-1.5 rounded-full bg-gray-100 text-gray-600"
                >
                    {mobileMenuOpen ? <X size={18} /> : <Sliders size={18} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed top-12 left-0 right-0 z-10 bg-white shadow-md lg:hidden"
                    >
                        <div className="p-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center space-x-2 px-3 py-2 my-0.5 rounded-lg text-left text-sm ${activeTab === tab.id
                                            ? "bg-blue-50 text-blue-600 font-medium"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4 pt-16 pb-6 lg:py-6 max-w-screen-xl">
                {/* Page title - Desktop only */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="hidden lg:block mb-6"
                >
                    <h1 className="text-xl font-medium text-gray-800">Settings</h1>
                    <p className="text-sm text-gray-500">Configure your website and application preferences</p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Desktop Sidebar */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={slideUp}
                        className="hidden lg:block w-56 flex-shrink-0"
                    >
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden backdrop-filter backdrop-blur-lg bg-opacity-90 border border-gray-100">
                            <div className="p-4">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center justify-between w-full px-3 py-2 my-0.5 rounded-lg text-sm transition-all duration-200 ${activeTab === tab.id
                                                ? "bg-blue-50 text-blue-600 font-medium"
                                                : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span className="flex items-center space-x-2">
                                            <span>{tab.icon}</span>
                                            <span>{tab.label}</span>
                                        </span>
                                        {activeTab === tab.id && <ChevronRight size={14} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={slideUp}
                        className="flex-1"
                    >
                        <div className="bg-white rounded-xl shadow-sm p-5 backdrop-filter backdrop-blur-lg bg-opacity-90 border border-gray-100">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Tab Content */}
                                <AnimatePresence mode="wait">
                                    {/* General Settings */}
                                    {activeTab === "general" && (
                                        <motion.div
                                            key="general"
                                            initial={{ opacity: 0, x: 5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -5 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-5"
                                        >
                                            <div className="pb-2 mb-2 border-b border-gray-100">
                                                <h2 className="text-base font-medium text-gray-800 flex items-center space-x-1.5">
                                                    <Globe size={16} className="text-gray-500" />
                                                    <span>General Settings</span>
                                                </h2>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Website Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="website_name"
                                                        value={settings?.website_name || ""}
                                                        onChange={handleChange}
                                                        className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.website_name ? "border-red-500" : "border-gray-200"
                                                            } focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                                                        placeholder="Enter website name"
                                                    />
                                                    {errors.website_name && (
                                                        <p className="mt-1 text-xs text-red-500">{errors.website_name}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Website Description
                                                    </label>
                                                    <textarea
                                                        name="website_description"
                                                        value={settings?.website_description || ""}
                                                        onChange={handleChange}
                                                        rows={3}
                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                                        placeholder="Enter website description"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Website Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="website_email"
                                                        value={settings?.website_email || ""}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                                        placeholder="Enter website email"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Appearance Settings */}
                                    {activeTab === "appearance" && (
                                        <motion.div
                                            key="appearance"
                                            initial={{ opacity: 0, x: 5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -5 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-5"
                                        >
                                            <div className="pb-2 mb-2 border-b border-gray-100">
                                                <h2 className="text-base font-medium text-gray-800 flex items-center space-x-1.5">
                                                    <PaintBucket size={16} className="text-gray-500" />
                                                    <span>Appearance Settings</span>
                                                </h2>
                                            </div>

                                            <div className="space-y-5">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Primary Color */}
                                                    <div className="relative">
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Primary Color
                                                        </label>
                                                        <div className="flex items-center">
                                                            <motion.div
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="w-8 h-8 rounded-lg shadow-sm mr-2 cursor-pointer"
                                                                style={{ backgroundColor: settings?.website_color_primary || "#3B82F6" }}
                                                                onClick={() => setShowColorPicker(showColorPicker === "primary" ? null : "primary")}
                                                            />
                                                            <input
                                                                type="text"
                                                                name="website_color_primary"
                                                                value={settings?.website_color_primary || ""}
                                                                onChange={handleChange}
                                                                className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                                                placeholder="#3B82F6"
                                                            />
                                                        </div>
                                                        {showColorPicker === "primary" && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="absolute z-10 mt-2"
                                                            >
                                                                <HexColorPicker
                                                                    color={settings?.website_color_primary || "#3B82F6"}
                                                                    onChange={(color) => handleColorChange(color, "website_color_primary")}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm"
                                                                    onClick={() => setShowColorPicker(null)}
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            </motion.div>
                                                        )}
                                                    </div>

                                                    {/* Secondary Color */}
                                                    <div className="relative">
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Secondary Color
                                                        </label>
                                                        <div className="flex items-center">
                                                            <motion.div
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="w-8 h-8 rounded-lg shadow-sm mr-2 cursor-pointer"
                                                                style={{ backgroundColor: settings?.website_color_secondary || "#10B981" }}
                                                                onClick={() => setShowColorPicker(showColorPicker === "secondary" ? null : "secondary")}
                                                            />
                                                            <input
                                                                type="text"
                                                                name="website_color_secondary"
                                                                value={settings?.website_color_secondary || ""}
                                                                onChange={handleChange}
                                                                className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                                                placeholder="#10B981"
                                                            />
                                                        </div>
                                                        {showColorPicker === "secondary" && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="absolute z-10 mt-2"
                                                            >
                                                                <HexColorPicker
                                                                    color={settings?.website_color_secondary || "#10B981"}
                                                                    onChange={(color) => handleColorChange(color, "website_color_secondary")}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm"
                                                                    onClick={() => setShowColorPicker(null)}
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Logo, Favicon, Banner Uploads */}
                                                <div className="space-y-5">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center space-x-1">
                                                            <Image size={14} className="text-gray-500" />
                                                            <span>Website Logo</span>
                                                        </label>
                                                        <motion.div
                                                            whileHover={{ borderColor: '#3B82F6' }}
                                                            className="border border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer"
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
                                                                    <img
                                                                        src={previewImages.website_logo}
                                                                        alt="Website Logo Preview"
                                                                        className="max-h-32 mb-2 rounded-md"
                                                                    />
                                                                    <p className="text-xs text-gray-500">Click to change</p>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col items-center">
                                                                    <Upload className="mb-1 text-gray-400" size={22} />
                                                                    <p className="text-xs text-gray-600">Click to upload logo</p>
                                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                                        PNG, JPG, SVG, WEBP up to 1MB
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                Website Favicon
                                                            </label>
                                                            <motion.div
                                                                whileHover={{ borderColor: '#3B82F6' }}
                                                                className="border border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer h-full"
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
                                                                        <img
                                                                            src={previewImages.website_favicon}
                                                                            alt="Favicon Preview"
                                                                            className="h-14 w-14 mb-2 rounded-md object-contain"
                                                                        />
                                                                        <p className="text-xs text-gray-500">Click to change</p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex flex-col items-center">
                                                                        <Upload className="mb-1 text-gray-400" size={18} />
                                                                        <p className="text-xs text-gray-600">Upload favicon</p>
                                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                                            ICO, PNG up to 500KB
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </motion.div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                Banner Image
                                                            </label>
                                                            <motion.div
                                                                whileHover={{ borderColor: '#3B82F6' }}
                                                                className="border border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer h-full"
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
                                                                        <img
                                                                            src={previewImages.banner_image}
                                                                            alt="Banner Preview"
                                                                            className="h-14 w-full mb-2 rounded-md object-cover"
                                                                        />
                                                                        <p className="text-xs text-gray-500">Click to change</p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex flex-col items-center">
                                                                        <Upload className="mb-1 text-gray-400" size={18} />
                                                                        <p className="text-xs text-gray-600">Upload banner</p>
                                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                                            1920×480px recommended
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* User Limits Settings */}
                                    {activeTab === "limits" && (
                                        <motion.div
                                            key="limits"
                                            initial={{ opacity: 0, x: 5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -5 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-5"
                                        >
                                            <div className="pb-2 mb-2 border-b border-gray-100">
                                                <h2 className="text-base font-medium text-gray-800 flex items-center space-x-1.5">
                                                    <Users size={16} className="text-gray-500" />
                                                    <span>User Limits</span>
                                                </h2>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Maximum Group Members <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="max_group_members"
                                                        value={settings?.max_group_members || ""}
                                                        onChange={handleNumberChange}
                                                        min="1"
                                                        className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.max_group_members ? "border-red-500" : "border-gray-200"
                                                            } focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                                                        placeholder="Enter maximum group members"
                                                    />
                                                    {errors.max_group_members && (
                                                        <p className="mt-1 text-xs text-red-500">{errors.max_group_members}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Maximum Group Name Length
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="max_group_name_length"
                                                        value={settings?.max_group_name_length || ""}
                                                        onChange={handleNumberChange}
                                                        min="1"
                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                                        placeholder="Enter maximum name length"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Links & Legal Settings */}
                                    {activeTab === "links" && (
                                        <motion.div
                                            key="links"
                                            initial={{ opacity: 0, x: 5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -5 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-5"
                                        >
                                            <div className="pb-2 mb-2 border-b border-gray-100">
                                                <h2 className="text-base font-medium text-gray-800 flex items-center space-x-1.5">
                                                    <Link size={16} className="text-gray-500" />
                                                    <span>Links & Legal</span>
                                                </h2>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Website Link
                                                    </label>
                                                    <input
                                                        type="url"
                                                        name="website_link"
                                                        value={settings?.website_link || ""}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                                        placeholder="https://example.com"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            iOS App Link
                                                        </label>
                                                        <input
                                                            type="url"
                                                            name="ios_link"
                                                            value={settings?.ios_link || ""}
                                                            onChange={handleChange}
                                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                                            placeholder="Apple App Store URL"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Android App Link
                                                        </label>
                                                        <input
                                                            type="url"
                                                            name="android_link"
                                                            value={settings?.android_link || ""}
                                                            onChange={handleChange}
                                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                                            placeholder="Google Play Store URL"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Tell a Friend Link
                                                    </label>
                                                    <input
                                                        type="url"
                                                        name="tell_a_friend_link"
                                                        value={settings?.tell_a_friend_link || ""}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                                        placeholder="https://example.com/refer"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Copyright Information
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="copy_right"
                                                        value={settings?.copy_right || ""}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                                        placeholder="© 2025 Your Company Name"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Save Button */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="pt-4 border-t border-gray-100 flex justify-end"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.02, backgroundColor: "#2563EB" }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={saving}
                                        type="submit"
                                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white ${saving ? "bg-gray-400" : "bg-blue-500"
                                            } shadow-sm transition-all duration-200`}
                                    >
                                        {saving ? (
                                            <>
                                                <RefreshCw className="animate-spin mr-1.5" size={14} />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-1.5" size={14} />
                                                <span>Save Settings</span>
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center text-sm"
                    >
                        <Check className="mr-1.5" size={16} />
                        Settings saved successfully
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default page;