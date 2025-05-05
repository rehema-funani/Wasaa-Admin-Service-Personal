import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Search,
    Edit,
    X,
    Check,
    AlertTriangle,
    RefreshCw,
    FileText,
    Download
} from 'lucide-react';
import { Language, Translation } from '../../../../types/language';
import { languageService, translationService } from '../../../../api/services/language';

const details: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [language, setLanguage] = useState<Language | null>(null);
    const [translations, setTranslations] = useState<Translation[]>([]);
    const [allTranslations, setAllTranslations] = useState<Translation[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [editingTranslation, setEditingTranslation] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [saveLoading, setSaveLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<{
        showMissing: boolean;
        showExisting: boolean;
    }>({
        showMissing: true,
        showExisting: true
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                setError(null);

                // Fetch language details
                const languageData = await languageService.getLanguage(id);
                setLanguage(languageData);

                // Fetch all translations
                const translationsData = await translationService.getTranslations(id);
                setAllTranslations(translationsData);

                // Process translations for this language
                processTranslations(translationsData, id);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setError('Failed to load language data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Process translations to show translations for this language
    const processTranslations = (allTranslations: Translation[], languageId: string) => {
        const processedTranslations = allTranslations.map(translation => {
            const hasTranslation = translation.translations.some(t =>
                t.language_id === languageId && t.translation.trim() !== ''
            );

            return {
                ...translation,
                hasTranslation,
                currentTranslation: translation.translations.find(t => t.language_id === languageId)?.translation || ''
            };
        });

        setTranslations(processedTranslations);
    };

    // Filter translations based on search query and filters
    const filteredTranslations = translations
        .filter(translation => {
            // Apply missing/existing filters
            if (filters.showMissing && !filters.showExisting) {
                return !translation.translations.some(t => t.language_id === id && t.translation.trim() !== '');
            }
            if (!filters.showMissing && filters.showExisting) {
                return translation.hasTranslation;
            }
            if (!filters.showMissing && !filters.showExisting) {
                return false;
            }

            return true;
        })
        .filter(translation => {
            // Apply search filter
            if (!searchQuery.trim()) return true;

            const query = searchQuery.toLowerCase();
            return (
                translation.key.toLowerCase().includes(query) ||
                (translation.currentTranslation ?? '').toLowerCase().includes(query)
            );
        });

    // Start editing a translation
    const handleEdit = (translationKey: string, currentValue: string) => {
        setEditingTranslation(translationKey);
        setEditValue(currentValue);
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingTranslation(null);
        setEditValue('');
    };

    // Save edited translation
    const handleSaveTranslation = async (translationId: string) => {
        if (!id || !translationId) return;

        try {
            setSaveLoading(translationId);

            // Find the translation in the all translations array
            const translation = allTranslations.find(t => t.id === translationId);
            if (!translation) return;

            // Create a deep copy to work with
            const updatedTranslation = {
                ...translation,
                translations: [...translation.translations]
            };

            // Check if there's already a translation for this language
            const langTranslationIndex = updatedTranslation.translations.findIndex(
                t => t.language_id === id
            );

            if (langTranslationIndex >= 0) {
                // Update existing translation
                updatedTranslation.translations[langTranslationIndex].translation = editValue;
            } else {
                // Add new translation for this language
                updatedTranslation.translations.push({
                    language_id: id,
                    translation: editValue
                });
            }

            // Save the updated translation
            await translationService.updateTranslation(translationId, updatedTranslation);

            // Update local state
            const updatedAllTranslations = allTranslations.map(t =>
                t.id === translationId ? updatedTranslation : t
            );
            setAllTranslations(updatedAllTranslations);

            // Update processed translations
            processTranslations(updatedAllTranslations, id);

            // Reset editing state
            setEditingTranslation(null);
            setEditValue('');
        } catch (error) {
            console.error('Failed to save translation:', error);
            setError('Failed to save translation. Please try again.');
        } finally {
            setSaveLoading(null);
        }
    };

    // Export translations for this language
    const handleExportLanguageTranslations = async () => {
        if (!id || !language) return;

        try {
            // Create a JSON object with all translations for this language
            const exportData = filteredTranslations.reduce((acc, translation) => {
                acc[translation.key] = translation.currentTranslation || '';
                return acc;
            }, {} as Record<string, string>);

            // Convert to blob and download
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${language.code}-translations.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Failed to export translations:', error);
            setError('Failed to export translations. Please try again.');
        }
    };

    // Calculate stats
    const translationStats = {
        total: translations.length,
        translated: translations.filter(t => t.hasTranslation).length,
        missing: translations.filter(t => !t.hasTranslation).length
    };

    const completionPercentage = Math.floor(
        (translationStats.translated / Math.max(translationStats.total, 1)) * 100
    );

    if (isLoading) {
        return (
            <div className="p-8 flex justify-center items-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                    <RefreshCw size={24} className="text-blue-500" />
                </motion.div>
                <span className="ml-2 text-gray-600">Loading language details...</span>
            </div>
        );
    }

    if (!language) {
        return (
            <div className="p-8 flex flex-col items-center justify-center text-center">
                <AlertTriangle size={40} className="text-amber-500 mb-4" />
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Language Not Found</h2>
                <p className="text-gray-600 mb-6">The language you're looking for doesn't exist or has been removed.</p>
                <button
                    onClick={() => navigate('/languages')}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl shadow-sm hover:bg-blue-600 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Languages
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header with language info */}
            <div className="mb-6">
                <div className="flex items-center mb-3">
                    <button
                        onClick={() => navigate('/languages')}
                        className="mr-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeft size={18} className="text-gray-700" />
                    </button>

                    <motion.h1
                        className="text-2xl font-bold text-gray-800 flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-3">
                            {language.code.slice(0, 2).toUpperCase()}
                        </div>
                        <span>{language.name} Translations</span>
                        {language.is_default && (
                            <span className="ml-3 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                Default Language
                            </span>
                        )}
                        {language.is_rtl && (
                            <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                                RTL
                            </span>
                        )}
                    </motion.h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {/* Stats Cards */}
                    <motion.div
                        className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
                        whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                    >
                        <div className="text-sm text-gray-500 mb-1">Total Translations</div>
                        <div className="text-2xl font-semibold text-gray-800">{translationStats.total}</div>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
                        whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                    >
                        <div className="text-sm text-gray-500 mb-1">Translated</div>
                        <div className="text-2xl font-semibold text-green-600">{translationStats.translated}</div>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
                        whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                    >
                        <div className="text-sm text-gray-500 mb-1">Missing</div>
                        <div className="text-2xl font-semibold text-red-500">{translationStats.missing}</div>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
                        whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                    >
                        <div className="text-sm text-gray-500 mb-1">Completion</div>
                        <div className="flex items-end">
                            <div className="text-2xl font-semibold text-blue-600">
                                {completionPercentage}%
                            </div>
                            <div className="ml-2 w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-1">
                                <div
                                    className="h-2.5 rounded-full bg-blue-600"
                                    style={{ width: `${completionPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Search and Filters */}
            <motion.div
                className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder={`Search ${language.name} translations...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                            />
                            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="inline-flex items-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={filters.showMissing}
                                        onChange={() => setFilters({ ...filters, showMissing: !filters.showMissing })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                    <span className="ml-2 text-sm font-medium text-gray-700">Show Missing</span>
                                </label>
                            </div>

                            <div className="inline-flex items-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={filters.showExisting}
                                        onChange={() => setFilters({ ...filters, showExisting: !filters.showExisting })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                    <span className="ml-2 text-sm font-medium text-gray-700">Show Translated</span>
                                </label>
                            </div>

                            <motion.button
                                onClick={handleExportLanguageTranslations}
                                className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <Download size={16} className="mr-1" />
                                Export {language.code.toUpperCase()}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Show error if any */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 flex items-center">
                    <AlertTriangle size={18} className="mr-2" />
                    {error}
                </div>
            )}

            {/* Translations List */}
            {filteredTranslations.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                    <FileText size={40} className="mx-auto mb-2 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-800 mb-1">No translations found</h3>
                    <p className="text-gray-500 mb-4">
                        {searchQuery ?
                            `No translations matching "${searchQuery}"` :
                            filters.showMissing && !filters.showExisting ?
                                'No missing translations! Everything is translated.' :
                                !filters.showMissing && filters.showExisting ?
                                    'No existing translations yet.' :
                                    'Try changing your filters.'}
                    </p>
                </div>
            ) : (
                <motion.div
                    className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-72">
                                    Translation Key
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {language.name} Translation
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
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
                                    whileHover={{ scale: 1.005 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <td className="px-4 py-4">
                                        <div className="flex items-center">
                                            <div className="text-sm font-medium text-gray-800">
                                                {translation.key}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4">
                                        {editingTranslation === translation.id ? (
                                            <div>
                                                <textarea
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                                                    rows={2}
                                                    dir={language.is_rtl ? 'rtl' : 'ltr'}
                                                    placeholder={`Enter ${language.name} translation...`}
                                                />
                                                <div className="flex justify-end mt-2 space-x-2">
                                                    <motion.button
                                                        onClick={handleCancelEdit}
                                                        className="flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <X size={12} className="mr-1" />
                                                        Cancel
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => handleSaveTranslation(translation.id!)}
                                                        disabled={saveLoading === translation.id}
                                                        className={`flex items-center px-2 py-1 text-xs rounded-lg ${saveLoading === translation.id
                                                                ? 'bg-gray-300 text-gray-700'
                                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                                            } transition-colors`}
                                                        whileHover={saveLoading !== translation.id ? { scale: 1.05 } : {}}
                                                        whileTap={saveLoading !== translation.id ? { scale: 0.95 } : {}}
                                                    >
                                                        {saveLoading === translation.id ? (
                                                            <RefreshCw size={12} className="mr-1 animate-spin" />
                                                        ) : (
                                                            <Check size={12} className="mr-1" />
                                                        )}
                                                        Save
                                                    </motion.button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className={`text-sm ${!translation.hasTranslation ? 'text-gray-400 italic' : 'text-gray-700'}`}
                                                dir={language.is_rtl ? 'rtl' : 'ltr'}
                                            >
                                                {translation.currentTranslation || "Not translated"}
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-4 py-4 text-center">
                                        {translation.hasTranslation ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <Check size={12} className="mr-1" />
                                                Translated
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                <AlertTriangle size={12} className="mr-1" />
                                                Missing
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-4 py-4 text-right">
                                        {editingTranslation === translation.id ? (
                                            <div className="opacity-50">
                                                <Edit size={16} className="inline text-gray-400" />
                                            </div>
                                        ) : (
                                            <motion.button
                                                onClick={() => handleEdit(translation.id ?? '', translation.currentTranslation ?? '')}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Edit size={16} />
                                            </motion.button>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            )}
        </div>
    );
};

export default details;