import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Edit, Trash, ChevronDown, ChevronUp } from 'lucide-react';
import { Translation, Language } from '../../types/language';

interface TranslationItemProps {
    translation: Translation;
    languages: Language[];
    onEdit: () => void;
    onDelete: () => void;
}

const TranslationItem: React.FC<TranslationItemProps> = ({
    translation,
    languages,
    onEdit,
    onDelete
}) => {
    const [expanded, setExpanded] = useState(false);

    // Get available translations
    const availableTranslations = translation.translations.map(t => t.language_id);

    // Calculate completion percentage
    const completionPercentage = Math.floor(
        (availableTranslations.length / languages.length) * 100
    );

    // Group translations by language
    const translationsByLanguage = translation.translations.reduce((acc, t) => {
        acc[t.language_id] = t.translation;
        return acc;
    }, {} as Record<string, string>);

    // Get the default language translation
    const defaultLanguage = languages.find(lang => lang.is_default);
    const defaultTranslation = defaultLanguage && translationsByLanguage[defaultLanguage.id!];

    return (
        <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
            transition={{ duration: 0.2 }}
        >
            <div className="p-4 flex flex-col">
                {/* Header with key */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500 mr-2">
                            <FileText size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-800">{translation.key}</h3>
                            <div className="flex items-center mt-1">
                                <span
                                    className={`text-xs font-medium ${completionPercentage === 100
                                            ? 'text-green-600'
                                            : completionPercentage > 50
                                                ? 'text-yellow-600'
                                                : 'text-red-500'
                                        }`}
                                >
                                    {completionPercentage}% Complete
                                </span>
                                <span className="mx-2 text-gray-300">|</span>
                                <span className="text-xs text-gray-500">
                                    {availableTranslations.length} of {languages.length} languages
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-1">
                        <motion.button
                            onClick={onEdit}
                            className="p-1 text-blue-500 hover:bg-blue-50 rounded-md"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Edit size={15} />
                        </motion.button>
                        <motion.button
                            onClick={onDelete}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-md"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Trash size={15} />
                        </motion.button>
                    </div>
                </div>

                {/* Default translation preview */}
                <div className="px-3 py-2 bg-gray-50 rounded-lg mb-3">
                    <div className="text-xs text-gray-500 mb-1">
                        {defaultLanguage?.name || 'Default Language'}
                    </div>
                    <div className="text-sm text-gray-700 line-clamp-2">
                        {defaultTranslation ||
                            <span className="text-gray-400 italic">No default translation available</span>
                        }
                    </div>
                </div>

                {/* Language flags */}
                <div className="flex flex-wrap gap-1 mb-2">
                    {languages.map(language => {
                        const hasTranslation = !!translationsByLanguage[language.id!];

                        return (
                            <div
                                key={language.id}
                                className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center ${hasTranslation
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-500'
                                    }`}
                            >
                                {language.code.split('-')[0].toUpperCase()}
                            </div>
                        );
                    })}
                </div>

                {/* Expand/collapse button */}
                <motion.button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center justify-center w-full mt-1 py-1 text-xs text-gray-500 hover:bg-gray-50 rounded-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {expanded ? (
                        <>
                            <ChevronUp size={14} className="mr-1" />
                            Show Less
                        </>
                    ) : (
                        <>
                            <ChevronDown size={14} className="mr-1" />
                            Show All Translations
                        </>
                    )}
                </motion.button>
            </div>

            {/* Expanded view with all translations */}
            {expanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-100 divide-y divide-gray-100"
                >
                    {languages.map(language => {
                        const translationText = translationsByLanguage[language.id!];

                        return (
                            <div key={language.id} className="p-3">
                                <div className="flex items-center mb-1">
                                    <span className="text-xs font-medium text-gray-700 mr-2">
                                        {language.name}
                                    </span>
                                    {language.is_default && (
                                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                                            Default
                                        </span>
                                    )}
                                </div>
                                <div
                                    className={`text-sm ${translationText ? 'text-gray-700' : 'text-gray-400 italic'}`}
                                    dir={language.is_rtl ? 'rtl' : 'ltr'}
                                >
                                    {translationText || "Not translated"}
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            )}
        </motion.div>
    );
};

export default TranslationItem;