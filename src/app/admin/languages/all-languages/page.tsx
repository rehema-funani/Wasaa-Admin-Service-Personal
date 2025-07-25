import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Globe,
    Eye,
    X,
    Edit,
    Trash,
    AlertTriangle,
    RefreshCw,
    Settings,
    Command,
    CheckCircle,
    XCircle,
    Filter,
    ArrowUpDown
} from 'lucide-react';
import { Language } from '../../../../types/language';
import { languageService } from '../../../../api/services/language';
import LanguageForm from '../../../../components/languages/LanguageForm';

const page: React.FC = () => {
    const navigate = useNavigate();
    const [languages, setLanguages] = useState<Language[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editLanguage, setEditLanguage] = useState<Language | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [sortColumn, setSortColumn] = useState<string>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');

    useEffect(() => {
        fetchLanguages();
    }, []);

    const fetchLanguages = async () => {
        try {
            setIsLoading(true);
            const data = await languageService.getLanguages();
            setLanguages(data);
        } catch (error) {
            console.error('Failed to fetch languages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddNew = () => {
        setEditLanguage(null);
        setShowForm(true);
        setFormError(null);
    };

    const handleEdit = (language: Language) => {
        setEditLanguage(language);
        setShowForm(true);
        setFormError(null);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditLanguage(null);
        setFormError(null);
    };

    const handleSave = async (language: Language) => {
        try {
            setFormError(null);

            if (editLanguage) {
                await languageService.updateLanguage(editLanguage.id!, language);
            } else {
                await languageService.createLanguage(language);
            }

            fetchLanguages();
            setShowForm(false);
            setEditLanguage(null);
        } catch (error: any) {
            console.error('Failed to save language:', error);
            setFormError(error.response?.data?.message || 'Failed to save language');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await languageService.deleteLanguage(id);
            fetchLanguages();
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Failed to delete language:', error);
        }
    };

    const handleToggleStatus = async (id: string, isActive: boolean) => {
        try {
            await languageService.toggleLanguageStatus(id, !isActive);
            fetchLanguages();
        } catch (error) {
            console.error('Failed to toggle language status:', error);
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await languageService.setDefaultLanguage(id);
            fetchLanguages();
        } catch (error) {
            console.error('Failed to set default language:', error);
        }
    };

    const handleViewTranslations = (id: string) => {
        navigate(`/admin/languages/${id}/translations`);
    };

    // Sorting logic
    const handleSort = (column: string) => {
        if (sortColumn === column) {
            // Toggle direction if clicking the same column
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new column and default to ascending
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    // Apply filtering
    let filteredLanguages = languages.filter(language =>
        (searchQuery === '' ||
            language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            language.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            language.country.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (activeFilter === 'all' ||
            (activeFilter === 'active' && language.is_active) ||
            (activeFilter === 'inactive' && !language.is_active))
    );

    // Apply sorting
    filteredLanguages = [...filteredLanguages].sort((a, b) => {
        let valueA, valueB;

        switch (sortColumn) {
            case 'name':
                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();
                break;
            case 'code':
                valueA = a.code.toLowerCase();
                valueB = b.code.toLowerCase();
                break;
            case 'country':
                valueA = a.country.toLowerCase();
                valueB = b.country.toLowerCase();
                break;
            case 'rtl':
                valueA = a.is_rtl ? 1 : 0;
                valueB = b.is_rtl ? 1 : 0;
                break;
            case 'default':
                valueA = a.is_default ? 1 : 0;
                valueB = b.is_default ? 1 : 0;
                break;
            case 'status':
                valueA = a.is_active ? 1 : 0;
                valueB = b.is_active ? 1 : 0;
                break;
            default:
                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();
        }

        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="py-4 px-4 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <motion.h1
                    className="text-lg font-medium bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Globe className="mr-2 text-primary-500" size={20} />
                    Language Management
                </motion.h1>
                <div className="flex items-center space-x-2">
                    <motion.button
                        onClick={() => fetchLanguages()}
                        className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full bg-white hover:bg-gray-50 border border-gray-100 shadow-sm"
                        whileHover={{ scale: 1.05, rotate: 180 }}
                        whileTap={{ scale: 0.95 }}
                        title="Refresh"
                    >
                        <RefreshCw size={16} />
                    </motion.button>
                    <motion.button
                        title="Settings"
                        className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full bg-white hover:bg-gray-50 border border-gray-100 shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Settings size={16} />
                    </motion.button>
                    <motion.button
                        onClick={handleAddNew}
                        className="flex items-center px-3 py-1.5 bg-primary-600 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full text-xs font-medium shadow-sm"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Plus size={14} className="mr-1" />
                        Add Language
                    </motion.button>
                </div>
            </div>

            <motion.div
                className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="p-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="relative flex-grow max-w-md">
                        <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search languages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
                        />
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                        <span className="text-gray-500 flex items-center">
                            <Filter size={12} className="mr-1" />
                            Filter:
                        </span>
                        <motion.button
                            whileHover={{ y: -1 }}
                            whileTap={{ y: 1 }}
                            onClick={() => setActiveFilter('all')}
                            className={`px-2.5 py-1 rounded-full flex items-center ${activeFilter === 'all'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </motion.button>
                        <motion.button
                            whileHover={{ y: -1 }}
                            whileTap={{ y: 1 }}
                            onClick={() => setActiveFilter('active')}
                            className={`px-2.5 py-1 rounded-full flex items-center ${activeFilter === 'active'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
                            Active
                        </motion.button>
                        <motion.button
                            whileHover={{ y: -1 }}
                            whileTap={{ y: 1 }}
                            onClick={() => setActiveFilter('inactive')}
                            className={`px-2.5 py-1 rounded-full flex items-center ${activeFilter === 'inactive'
                                ? 'bg-gray-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5"></span>
                            Inactive
                        </motion.button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center p-6">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="text-primary-500"
                        >
                            <RefreshCw size={20} />
                        </motion.div>
                        <span className="ml-2 text-sm text-gray-600">Loading languages...</span>
                    </div>
                ) : filteredLanguages.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100 }}
                            className="mb-3"
                        >
                            <Globe size={32} className="mx-auto text-gray-300" />
                        </motion.div>
                        <p className="text-sm">No languages found.</p>
                        <motion.button
                            onClick={handleAddNew}
                            className="mt-3 inline-flex items-center px-3 py-1.5 bg-primary-100 text-primary-600 rounded-full text-xs font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Plus size={14} className="mr-1" />
                            Add your first language
                        </motion.button>
                    </div>
                ) : (
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/80 text-left">
                                    <th
                                        className="px-3 py-2 text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center">
                                            Language
                                            {sortColumn === 'name' && (
                                                <ArrowUpDown size={12} className={`ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-3 py-2 text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                        onClick={() => handleSort('code')}
                                    >
                                        <div className="flex items-center">
                                            Code
                                            {sortColumn === 'code' && (
                                                <ArrowUpDown size={12} className={`ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-3 py-2 text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                        onClick={() => handleSort('country')}
                                    >
                                        <div className="flex items-center">
                                            Country
                                            {sortColumn === 'country' && (
                                                <ArrowUpDown size={12} className={`ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                        onClick={() => handleSort('rtl')}
                                    >
                                        <div className="flex items-center justify-center">
                                            RTL
                                            {sortColumn === 'rtl' && (
                                                <ArrowUpDown size={12} className={`ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                        onClick={() => handleSort('default')}
                                    >
                                        <div className="flex items-center justify-center">
                                            Default
                                            {sortColumn === 'default' && (
                                                <ArrowUpDown size={12} className={`ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                        onClick={() => handleSort('status')}
                                    >
                                        <div className="flex items-center justify-center">
                                            Status
                                            {sortColumn === 'status' && (
                                                <ArrowUpDown size={12} className={`ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredLanguages.map((language, index) => (
                                        <motion.tr
                                            key={language.id}
                                            className="border-t border-gray-100 hover:bg-primary-50/30"
                                            initial="hidden"
                                            animate="visible"
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ delay: index * 0.03 }}
                                        >
                                            <td className="px-3 py-2">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-6 w-6 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-sm">
                                                        {language.code.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="ml-2">
                                                        <div className="text-xs font-medium text-gray-800">{language.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-xs text-gray-600">
                                                <span className="px-2 py-0.5 bg-gray-100 rounded-md">
                                                    {language.code}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 text-xs text-gray-600">
                                                {language.country}
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                {language.is_rtl ? (
                                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 text-purple-600">
                                                        <CheckCircle size={12} />
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-400">
                                                        <XCircle size={12} />
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                {language.is_default ? (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700">
                                                        Default
                                                    </span>
                                                ) : (
                                                    <motion.button
                                                        onClick={() => handleSetDefault(language.id!)}
                                                        className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        Set
                                                    </motion.button>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                <motion.button
                                                    onClick={() => handleToggleStatus(language.id!, language.is_active)}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${language.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                                >
                                                    <span
                                                        className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform ${language.is_active ? 'translate-x-4' : 'translate-x-1'}`}
                                                    />
                                                </motion.button>
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                                <div className="flex items-center justify-end space-x-1">
                                                    <motion.button
                                                        onClick={() => handleViewTranslations(language.id!)}
                                                        className="p-1 rounded-md text-primary-500 hover:text-primary-600 hover:bg-primary-50"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        title="View Translations"
                                                    >
                                                        <Eye size={14} />
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => handleEdit(language)}
                                                        className="p-1 rounded-md text-primary-500 hover:text-primary-600 hover:bg-primary-50"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        title="Edit Language"
                                                    >
                                                        <Edit size={14} />
                                                    </motion.button>
                                                    {!language.is_default && (
                                                        <motion.button
                                                            onClick={() => setDeleteConfirm(language.id!)}
                                                            className="p-1 rounded-md text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            title="Delete Language"
                                                        >
                                                            <Trash size={14} />
                                                        </motion.button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            <motion.div
                className="text-xs text-gray-500 flex items-center justify-between p-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="flex items-center">
                    <Command size={12} className="text-primary-500 mr-1" />
                    <span>Total: {filteredLanguages.length} languages</span>
                </div>
                <div className="flex items-center">
                    <span className="text-gray-400">Updated just now</span>
                </div>
            </motion.div>

            {/* Language Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-xl shadow-lg border border-gray-100 max-w-lg w-full overflow-hidden"
                            initial={{ scale: 0.9, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            <div className="flex justify-between items-center p-4 border-b border-gray-100">
                                <h2 className="text-sm font-medium bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                                    {editLanguage ? 'Edit Language' : 'Add Language'}
                                </h2>
                                <motion.button
                                    onClick={handleCloseForm}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X size={16} />
                                </motion.button>
                            </div>

                            {formError && (
                                <div className="px-4 py-2 bg-rose-50 text-rose-600 text-xs flex items-center">
                                    <AlertTriangle size={14} className="mr-1.5" />
                                    {formError}
                                </div>
                            )}

                            <div className="p-4">
                                <LanguageForm
                                    initialData={editLanguage || undefined}
                                    onSubmit={handleSave}
                                    onCancel={handleCloseForm}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-xl shadow-lg border border-gray-100 max-w-md w-full p-4"
                            initial={{ scale: 0.9, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            <div className="text-center mb-3">
                                <motion.div
                                    className="mx-auto w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mb-3"
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                >
                                    <AlertTriangle size={20} className="text-rose-500" />
                                </motion.div>
                                <h3 className="text-sm font-medium text-gray-800 mb-1.5">Delete Language</h3>
                                <p className="text-xs text-gray-500">
                                    Are you sure you want to delete this language? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex justify-center gap-2 mt-4">
                                <motion.button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-xs"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default page;