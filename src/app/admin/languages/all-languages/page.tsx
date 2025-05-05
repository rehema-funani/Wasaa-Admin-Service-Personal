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
    RefreshCw
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

    // Navigate to language translations page
    const handleViewTranslations = (id: string) => {
        navigate(`/languages/${id}/translations`);
    };

    const filteredLanguages = languages.filter(language =>
        language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        language.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        language.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <motion.h1
                    className="text-2xl font-bold text-gray-800"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <span className="flex items-center">
                        <Globe className="mr-2 text-blue-500" size={24} />
                        Language Management
                    </span>
                </motion.h1>
                <motion.button
                    onClick={handleAddNew}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Plus size={18} className="mr-1" />
                    Add Language
                </motion.button>
            </div>

            <motion.div
                className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search languages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                        />
                        <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                            <RefreshCw size={24} className="text-blue-500" />
                        </motion.div>
                        <span className="ml-2 text-gray-600">Loading languages...</span>
                    </div>
                ) : filteredLanguages.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Globe size={40} className="mx-auto mb-2 text-gray-300" />
                        <p>No languages found. Add your first language!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Language
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Code
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Country
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        RTL
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Default
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredLanguages.map((language) => (
                                    <motion.tr
                                        key={language.id}
                                        className="hover:bg-blue-50/30 transition-colors"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                                                    {language.code.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-800">{language.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {language.code}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {language.country}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${language.is_rtl ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                                                {language.is_rtl ? '✓' : '✕'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {language.is_default ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Default
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleSetDefault(language.id!)}
                                                    className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                                >
                                                    Set Default
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <motion.button
                                                onClick={() => handleToggleStatus(language.id!, language.is_active)}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none ${language.is_active ? 'bg-blue-500' : 'bg-gray-300'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${language.is_active ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </motion.button>
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-medium space-x-2">
                                            <motion.button
                                                onClick={() => handleViewTranslations(language.id!)}
                                                className="text-indigo-600 hover:text-indigo-800 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                title="View Translations"
                                            >
                                                <Eye size={16} />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleEdit(language)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                title="Edit Language"
                                            >
                                                <Edit size={16} />
                                            </motion.button>
                                            {!language.is_default && (
                                                <motion.button
                                                    onClick={() => setDeleteConfirm(language.id!)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    title="Delete Language"
                                                >
                                                    <Trash size={16} />
                                                </motion.button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            {/* Language Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl shadow-xl max-w-lg w-full"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25 }}
                        >
                            <div className="flex justify-between items-center p-5 border-b border-gray-100">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {editLanguage ? 'Edit Language' : 'Add Language'}
                                </h2>
                                <motion.button
                                    onClick={handleCloseForm}
                                    className="text-gray-500 hover:text-gray-700"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X size={18} />
                                </motion.button>
                            </div>

                            {formError && (
                                <div className="px-5 py-2 bg-red-50 text-red-600 text-sm flex items-center">
                                    <AlertTriangle size={16} className="mr-2" />
                                    {formError}
                                </div>
                            )}

                            <div className="p-5">
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

            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25 }}
                        >
                            <div className="text-center mb-4">
                                <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                    <AlertTriangle size={24} className="text-red-500" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Delete</h3>
                                <p className="text-sm text-gray-500">
                                    Are you sure you want to delete this language? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex justify-center gap-3 mt-5">
                                <motion.button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-xl"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
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