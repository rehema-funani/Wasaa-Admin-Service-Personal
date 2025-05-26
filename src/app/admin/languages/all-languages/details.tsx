import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe, BarChart2, X, Maximize2, PieChart,
    Search, ArrowUpDown, Layers, ArrowRight,
    RefreshCcw, Laptop, Settings
} from 'lucide-react';
import { translationService } from '../../../../api/services/language';
import { useParams } from 'react-router-dom';

type TranslationItem = {
    key: string;
    translation: string;
};

const details: React.FC = () => {
    const [translations, setTranslations] = useState<TranslationItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<TranslationItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('all');

    const [stats, setStats] = useState({
        totalItems: 0,
        unchangedCount: 0,
        unchangedPercentage: 0,
        averageKeyLength: 0,
        averageTranslationLength: 0,
        lengthDifference: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const languageId = id ?? '';
                const data = await translationService.getTranslations(languageId);

                const transformedData = data.map(item => ({
                    key: item.key,
                    translation: item.translation || ''
                }));

                const totalItems = transformedData.length;
                const unchangedCount = transformedData.filter(item => item.key === item.translation).length;
                const unchangedPercentage = totalItems > 0 ? (unchangedCount / totalItems) * 100 : 0;

                const averageKeyLength = totalItems > 0
                    ? transformedData.reduce((sum, item) => sum + item.key.length, 0) / totalItems
                    : 0;
                const averageTranslationLength = totalItems > 0
                    ? transformedData.reduce((sum, item) => sum + item.translation.length, 0) / totalItems
                    : 0;
                const lengthDifference = averageTranslationLength - averageKeyLength;

                setStats({
                    totalItems,
                    unchangedCount,
                    unchangedPercentage,
                    averageKeyLength,
                    averageTranslationLength,
                    lengthDifference
                });

                setTranslations(transformedData);
            } catch (error) {
                console.error("Error fetching translations:", error);
                setError("Failed to load translations. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const filteredTranslations = translations.filter(item => {
        // Filter based on search query
        const matchesSearch = item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.translation.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter based on active tab
        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'unchanged') return matchesSearch && (item.key === item.translation);
        if (activeTab === 'translated') return matchesSearch && (item.key !== item.translation);

        return matchesSearch;
    });

    const getStatus = (item: TranslationItem) => {
        if (item.key === item.translation) {
            return { color: 'bg-amber-400', text: 'Unchanged' };
        }
        return { color: 'bg-emerald-400', text: 'Translated' };
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 overflow-hidden">
            {/* Top Navbar */}
            <header className="bg-white border-b border-gray-100 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <motion.div
                            whileHover={{ rotate: 20, scale: 1.1 }}
                            className="text-primary-500"
                        >
                            <Globe size={20} className="text-primary-600" />
                        </motion.div>
                        <h1 className="text-base font-medium bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">Translation Dashboard</h1>
                    </div>

                    <div className="flex items-center space-x-2">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full bg-gray-50 hover:bg-gray-100"
                        >
                            <Settings size={16} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1.5 bg-primary-600 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full text-xs font-medium flex items-center space-x-1 shadow-sm"
                        >
                            <Layers size={14} />
                            <span>Export</span>
                        </motion.button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar with Stats */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="w-56 bg-white border-r border-gray-100 py-3 flex flex-col"
                >
                    <div className="px-3 mb-4">
                        <h2 className="text-xs font-medium uppercase text-gray-500 mb-3 tracking-wide flex items-center">
                            <BarChart2 size={14} className="mr-1.5 text-primary-500" />
                            Dashboard
                        </h2>

                        <div className="space-y-3">
                            <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-2.5 rounded-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-primary-200 opacity-20 -mr-6 -mt-6"></div>
                                <p className="text-xs text-gray-500 mb-1">Total Entries</p>
                                <div className="flex items-end justify-between">
                                    <p className="text-lg font-semibold text-primary-700">{stats.totalItems}</p>
                                    <motion.div
                                        animate={{
                                            rotate: [0, 0, 180, 180, 0],
                                            scale: [1, 1.1, 1.1, 1, 1]
                                        }}
                                        transition={{
                                            duration: 2,
                                            ease: "easeInOut",
                                            repeat: Infinity,
                                            repeatDelay: 10
                                        }}
                                        className="text-primary-400"
                                    >
                                        <RefreshCcw size={14} />
                                    </motion.div>
                                </div>
                            </div>

                            <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-500">Unchanged</p>
                                    <span className="text-xs font-medium px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                                        {stats.unchangedPercentage.toFixed(0)}%
                                    </span>
                                </div>
                                <p className="text-sm font-medium mt-1">{stats.unchangedCount} entries</p>
                                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stats.unchangedPercentage}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full bg-amber-400 rounded-full"
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm">
                                <p className="text-xs text-gray-500 mb-1.5">Average Length</p>

                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-gray-400 mr-1.5"></span>
                                        <span className="text-xs">Original</span>
                                    </div>
                                    <span className="text-xs font-medium">{stats.averageKeyLength.toFixed(1)}</span>
                                </div>

                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-primary-400 mr-1.5"></span>
                                        <span className="text-xs">Translated</span>
                                    </div>
                                    <span className="text-xs font-medium">{stats.averageTranslationLength.toFixed(1)}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-gray-200 mr-1.5"></span>
                                        <span className="text-xs">Difference</span>
                                    </div>
                                    <span className={`text-xs font-medium ${stats.lengthDifference > 0 ? 'text-emerald-600' : stats.lengthDifference < 0 ? 'text-rose-600' : 'text-gray-600'}`}>
                                        {stats.lengthDifference > 0 ? '+' : ''}{stats.lengthDifference.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto px-3">
                        <div className="flex items-center p-2.5 bg-primary-50 rounded-lg">
                            <PieChart size={14} className="text-primary-500 mr-1.5" />
                            <div className="text-xs">
                                <span className="font-medium text-primary-600">{(stats.totalItems - stats.unchangedCount)}</span>
                                <span className="text-gray-500"> of </span>
                                <span className="font-medium">{stats.totalItems}</span>
                                <span className="text-gray-500"> translated</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center text-xs text-gray-500">
                                <Laptop size={14} className="mr-1" />
                                <span>{id ? id.slice(0, 8) : 'Default'}</span>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-xs text-primary-600 px-2 py-1 rounded-md flex items-center hover:bg-primary-50"
                            >
                                details
                                <ArrowRight size={12} className="ml-1" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Search and Filter Bar */}
                    <div className="p-3 border-b border-gray-100 bg-white">
                        <div className="relative mb-2">
                            <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search translations..."
                                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex space-x-2 text-xs">
                            <motion.button
                                whileHover={{ y: -1 }}
                                whileTap={{ y: 1 }}
                                onClick={() => setActiveTab('all')}
                                className={`px-3 py-1 rounded-full flex items-center ${activeTab === 'all'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                All
                            </motion.button>
                            <motion.button
                                whileHover={{ y: -1 }}
                                whileTap={{ y: 1 }}
                                onClick={() => setActiveTab('unchanged')}
                                className={`px-3 py-1 rounded-full flex items-center ${activeTab === 'unchanged'
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5"></span>
                                Unchanged
                            </motion.button>
                            <motion.button
                                whileHover={{ y: -1 }}
                                whileTap={{ y: 1 }}
                                onClick={() => setActiveTab('translated')}
                                className={`px-3 py-1 rounded-full flex items-center ${activeTab === 'translated'
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
                                Translated
                            </motion.button>
                        </div>
                    </div>

                    {/* Translations List */}
                    <div className="flex-1 overflow-y-auto p-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2 px-2">
                            <div className="flex items-center">
                                <ArrowUpDown size={12} className="mr-1" />
                                <span>Original Text</span>
                            </div>
                            <div>Translation</div>
                            <div>Status</div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex justify-center items-center h-64"
                            >
                                <div className="text-rose-500 text-sm flex items-center">
                                    <X size={14} className="mr-1" />
                                    {error}
                                </div>
                            </motion.div>
                        )}

                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col justify-center items-center h-64 space-y-2"
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.5,
                                            ease: "linear"
                                        }}
                                        className="text-primary-500"
                                    >
                                        <RefreshCcw size={20} />
                                    </motion.div>
                                    <div className="text-gray-400 text-sm">Loading translations...</div>
                                </motion.div>
                            ) : filteredTranslations.length === 0 ? (
                                <motion.div
                                    key="no-results"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex justify-center items-center h-64"
                                >
                                    <div className="text-gray-400 text-sm">No translations found</div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="results"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="space-y-1.5"
                                >
                                    {filteredTranslations.map((item, index) => {
                                        const status = getStatus(item);
                                        return (
                                            <motion.div
                                                key={index}
                                                variants={itemVariants}
                                                onClick={() => setSelectedItem(item)}
                                                className="bg-white rounded-lg p-2 border border-gray-100 hover:border-primary-200 hover:shadow-sm cursor-pointer transition-all duration-200"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="w-5/12 truncate text-sm">{item.key}</div>
                                                    <div className="w-5/12 truncate text-xs text-gray-600">{item.translation}</div>
                                                    <div className="flex items-center">
                                                        <span className={`w-2 h-2 rounded-full ${status.color} mr-1.5`}></span>
                                                        <span className="text-xs text-gray-500">{status.text}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Selected Item Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-white rounded-xl w-full max-w-md p-4 shadow-lg border border-gray-100"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-medium bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">Translation details</h3>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setSelectedItem(null)}
                                    className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={16} />
                                </motion.button>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Original</p>
                                    <div className="p-2 bg-gray-50 rounded-lg text-sm">{selectedItem.key}</div>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Translation</p>
                                    <div className="p-2 bg-gray-50 rounded-lg text-sm">{selectedItem.translation}</div>
                                </div>

                                <div className="flex space-x-3 bg-gray-50 rounded-lg p-2">
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">Original Length</p>
                                        <p className="text-sm font-medium">{selectedItem.key.length} chars</p>
                                    </div>
                                    <div className="border-r border-gray-200"></div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">Translation Length</p>
                                        <p className="text-sm font-medium">{selectedItem.translation.length} chars</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Status</p>
                                    {selectedItem.key === selectedItem.translation ? (
                                        <div className="flex items-center bg-amber-50 text-amber-800 p-1.5 px-2 rounded-lg text-xs">
                                            <span className="w-2 h-2 rounded-full bg-amber-400 mr-1.5"></span>
                                            <span>Unchanged • Keys and translations match</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center bg-emerald-50 text-emerald-800 p-1.5 px-2 rounded-lg text-xs">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5"></span>
                                            <span>Translated • Keys and translations differ</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-700"
                                    onClick={() => setSelectedItem(null)}
                                >
                                    Close
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="px-3 py-1.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-xs flex items-center"
                                >
                                    <Maximize2 size={14} className="mr-1" />
                                    Edit
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default details;