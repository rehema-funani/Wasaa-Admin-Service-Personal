import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    FileText,
    Check,
    X,
    Edit,
    Trash,
    AlertTriangle,
    FileUp,
    FileDown,
    RefreshCw,
    List,
    Grid,
    Filter
} from 'lucide-react';
import { languageService, translationService } from '../../../../api/services/language';
import { Language, Translation } from '../../../../types/language';
import TranslationItem from '../../../../components/translations/TranslationItem';
import TranslationForm from '../../../../components/translations/TranslationForm';
import { useParams } from 'react-router-dom';

const TranslationsPage: React.FC = () => {
    const [translations, setTranslations] = useState<Translation[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editTranslation, setEditTranslation] = useState<Translation | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
    const [importFile, setImportFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState<boolean>(false);
    const [importSuccess, setImportSuccess] = useState<boolean>(false);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [translationsData, languagesData] = await Promise.all([
                id ? translationService.getTranslations(id) : Promise.resolve([]),
                languageService.getLanguages()
            ]);
            setTranslations(translationsData);
            setLanguages(languagesData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddNew = () => {
        setEditTranslation(null);
        setShowForm(true);
        setFormError(null);
    };

    const handleEdit = (translation: Translation) => {
        setEditTranslation(translation);
        setShowForm(true);
        setFormError(null);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditTranslation(null);
        setFormError(null);
    };

    const handleSave = async (translation: Translation) => {
        try {
            setFormError(null);

            if (editTranslation) {
                await translationService.updateTranslation(editTranslation.id!, translation);
            } else {
                await translationService.createTranslation(translation);
            }

            fetchData();
            setShowForm(false);
            setEditTranslation(null);
        } catch (error: any) {
            console.error('Failed to save translation:', error);
            setFormError(error.response?.data?.message || 'Failed to save translation');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await translationService.deleteTranslation(id);
            fetchData();
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Failed to delete translation:', error);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchData();
            return;
        }

        try {
            setIsLoading(true);
            const data = await translationService.searchTranslations(searchQuery);
            setTranslations(data);
        } catch (error) {
            console.error('Failed to search translations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImportFile = async () => {
        if (!importFile) return;

        try {
            setIsImporting(true);
            await translationService.importTranslations(importFile);

            // Reset file input and refresh data
            setImportFile(null);
            fetchData();

            // Show success message
            setImportSuccess(true);
            setTimeout(() => setImportSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to import translations:', error);
        } finally {
            setIsImporting(false);
        }
    };

    const handleExport = async () => {
        try {
            const blob = await translationService.exportTranslations();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'translations-export.json';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Failed to export translations:', error);
        }
    };

    const filteredTranslations = translations
        .filter(translation => {
            // Filter by language if a specific language is selected
            if (selectedLanguage !== 'all') {
                return translation.translations.some(t => t.language_id === selectedLanguage);
            }
            return true;
        })
        .filter(translation => {
            // Further filter by search query if there is one
            return searchQuery.trim() === '' ||
                translation.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                translation.translations.some(t =>
                    t.translation.toLowerCase().includes(searchQuery.toLowerCase())
                );
        });

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
                        <FileText className="mr-2 text-blue-500" size={24} />
                        Translation Management
                    </span>
                </motion.h1>
                <motion.button
                    onClick={handleAddNew}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Plus size={18} className="mr-1" />
                    Add Translation
                </motion.button>
            </div>

            {/* Filters and Controls */}
            <motion.div
                className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="p-4 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search translations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                            />
                            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                        </div>

                        <div className="flex gap-2">
                            <div className="relative">
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    className="h-full px-4 py-2 border border-gray-200 rounded-xl appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all bg-white"
                                >
                                    <option value="all">All Languages</option>
                                    {languages.map(language => (
                                        <option key={language.id} value={language.id}>{language.name}</option>
                                    ))}
                                </select>
                                <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>

                            <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-2 ${viewMode === 'list'
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'bg-white text-gray-500 hover:bg-gray-50'} transition-colors`}
                                >
                                    <List size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-3 py-2 ${viewMode === 'grid'
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'bg-white text-gray-500 hover:bg-gray-50'} transition-colors`}
                                >
                                    <Grid size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Import/Export Tools */}
                <div className="px-4 py-3 bg-gray-50 flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-600 font-medium">Import/Export</label>
                        <div className="flex gap-2">
                            <label
                                className="relative cursor-pointer"
                            >
                                <input
                                    type="file"
                                    accept=".json"
                                    className="sr-only"
                                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                                />
                                <motion.div
                                    className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-blue-300 transition-colors"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <FileUp size={14} className="mr-1.5 text-gray-500" />
                                    Import
                                </motion.div>
                            </label>

                            <motion.button
                                type="button"
                                onClick={handleExport}
                                className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-blue-300 transition-colors"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <FileDown size={14} className="mr-1.5 text-gray-500" />
                                Export
                            </motion.button>
                        </div>
                    </div>

                    {importFile && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 truncate max-w-xs">
                                {importFile.name}
                            </span>
                            <motion.button
                                onClick={() => setImportFile(null)}
                                className="text-gray-500 hover:text-gray-700"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X size={14} />
                            </motion.button>
                            <motion.button
                                onClick={handleImportFile}
                                disabled={isImporting}
                                className={`flex items-center px-3 py-1.5 rounded-lg text-sm text-white ${isImporting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition-colors`}
                                whileHover={!isImporting ? { scale: 1.03 } : {}}
                                whileTap={!isImporting ? { scale: 0.97 } : {}}
                            >
                                {isImporting ? (
                                    <>
                                        <RefreshCw size={14} className="mr-1.5 animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    'Upload'
                                )}
                            </motion.button>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Import Success Message */}
            <AnimatePresence>
                {importSuccess && (
                    <motion.div
                        className="mb-4 p-3 bg-green-50 border border-green-100 rounded-xl flex items-center text-green-700"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <Check size={18} className="mr-2" />
                        Translations imported successfully!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Translations Content */}
            {isLoading ? (
                <div className="bg-white rounded-2xl shadow-md p-8 flex justify-center items-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                        <RefreshCw size={24} className="text-blue-500" />
                    </motion.div>
                    <span className="ml-2 text-gray-600">Loading translations...</span>
                </div>
            ) : filteredTranslations.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                    <FileText size={40} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-gray-500">No translations found. Add your first translation!</p>
                </div>
            ) : viewMode === 'list' ? (
                <motion.div
                    className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Translation Key
                                    </th>
                                    {languages.map(language => (
                                        <th key={language.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {language.name}
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTranslations.map((translation) => (
                                    <motion.tr
                                        key={translation.id}
                                        className="hover:bg-blue-50/30 transition-colors"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center">
                                                <div className="text-sm font-medium text-gray-800">{translation.key}</div>
                                            </div>
                                        </td>

                                        {languages.map(language => {
                                            const translationForLanguage = translation.translations.find(
                                                t => t.language_id === language.id
                                            );

                                            return (
                                                <td key={language.id} className="px-4 py-3 text-sm text-gray-700">
                                                    {translationForLanguage ? (
                                                        <div className="max-w-xs truncate">{translationForLanguage.translation}</div>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs italic">Not translated</span>
                                                    )}
                                                </td>
                                            );
                                        })}

                                        <td className="px-4 py-3 text-right text-sm font-medium space-x-2">
                                            <motion.button
                                                onClick={() => handleEdit(translation)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Edit size={16} />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => setDeleteConfirm(translation.id!)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Trash size={16} />
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    {filteredTranslations.map(translation => (
                        <TranslationItem
                            key={translation.id}
                            translation={translation}
                            languages={languages}
                            onEdit={() => handleEdit(translation)}
                            onDelete={() => setDeleteConfirm(translation.id!)}
                        />
                    ))}
                </motion.div>
            )}

            {/* Translation Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl shadow-xl max-w-4xl w-full"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25 }}
                        >
                            <div className="flex justify-between items-center p-5 border-b border-gray-100">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {editTranslation ? 'Edit Translation' : 'Add Translation'}
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
                                <TranslationForm
                                    initialData={editTranslation || undefined}
                                    languages={languages}
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
                                    Are you sure you want to delete this translation? This action cannot be undone.
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

export default TranslationsPage;