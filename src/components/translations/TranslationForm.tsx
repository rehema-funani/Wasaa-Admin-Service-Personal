import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash, HelpCircle } from 'lucide-react';
import { Translation, TranslationFormData, Language } from '../../types/language';

interface TranslationFormProps {
    initialData?: Translation;
    languages: Language[];
    onSubmit: (translation: TranslationFormData) => void;
    onCancel: () => void;
}

const TranslationForm: React.FC<TranslationFormProps> = ({
    initialData,
    languages,
    onSubmit,
    onCancel
}) => {
    const [formData, setFormData] = useState<TranslationFormData>({
        key: '',
        translations: []
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showHelper, setShowHelper] = useState<boolean>(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                key: initialData.key,
                translations: [...initialData.translations]
            });
        } else {
            // Initialize with empty translations for each language
            const defaultTranslations = languages.map(language => ({
                language_id: language.id || '',
                translation: ''
            }));

            setFormData({
                key: '',
                translations: defaultTranslations
            });
        }
    }, [initialData, languages]);

    const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setFormData({
            ...formData,
            key: value
        });

        if (errors.key) {
            setErrors({
                ...errors,
                key: ''
            });
        }
    };

    const handleTranslationChange = (languageId: string, value: string) => {
        setFormData({
            ...formData,
            translations: formData.translations.map(t =>
                t.language_id === languageId
                    ? { ...t, translation: value }
                    : t
            )
        });

        // Clear error for this language if exists
        if (errors[`translation_${languageId}`]) {
            setErrors({
                ...errors,
                [`translation_${languageId}`]: ''
            });
        }
    };

    const addTranslation = (languageId: string) => {
        // Check if a translation for this language already exists
        const existingIndex = formData.translations.findIndex(
            t => t.language_id === languageId
        );

        if (existingIndex === -1) {
            setFormData({
                ...formData,
                translations: [
                    ...formData.translations,
                    { language_id: languageId, translation: '' }
                ]
            });
        }
    };

    const removeTranslation = (languageId: string) => {
        setFormData({
            ...formData,
            translations: formData.translations.filter(
                t => t.language_id !== languageId
            )
        });
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.key.trim()) {
            newErrors.key = 'Translation key is required';
        }

        // At least one translation is required
        if (formData.translations.length === 0) {
            newErrors.translations = 'At least one translation is required';
        }

        // Validate each translation
        formData.translations.forEach(t => {
            if (!t.translation.trim()) {
                newErrors[`translation_${t.language_id}`] = 'Translation text is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    // Get available languages (languages without translations)
    const availableLanguages = languages.filter(language =>
        !formData.translations.some(t => t.language_id === language.id)
    );

    // Helper text for translation keys
    const keyHelperText = (
        <div className="p-3 text-sm bg-primary-50 rounded-xl border border-primary-100 mb-4">
            <p className="font-medium text-primary-700 mb-1">Translation Key Guidelines:</p>
            <ul className="list-disc list-inside text-primary-600 space-y-1">
                <li>Use descriptive names that represent the content</li>
                <li>Use dot notation for hierarchy (e.g., <code className="bg-primary-100 px-1 rounded">app.header.title</code>)</li>
                <li>Avoid spaces, use underscores or camelCase</li>
                <li>Keep keys consistent across your application</li>
            </ul>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Translation Key
                    </label>
                    <motion.button
                        type="button"
                        className="text-primary-500 hover:text-primary-700"
                        onClick={() => setShowHelper(!showHelper)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <HelpCircle size={16} />
                    </motion.button>
                </div>

                {showHelper && keyHelperText}

                <input
                    type="text"
                    value={formData.key}
                    onChange={handleKeyChange}
                    className={`w-full px-3 py-2 rounded-xl border ${errors.key ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        } focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-colors`}
                    placeholder="e.g., app.common.save"
                />
                {errors.key && (
                    <p className="mt-1 text-xs text-red-500">{errors.key}</p>
                )}
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Translations</h3>

                    {availableLanguages.length > 0 && (
                        <div className="relative group">
                            <motion.button
                                type="button"
                                className="flex items-center px-2 py-1 text-xs bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Plus size={14} className="mr-1" />
                                Add Language
                            </motion.button>

                            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 hidden group-hover:block">
                                {availableLanguages.map(language => (
                                    <button
                                        key={language.id}
                                        type="button"
                                        onClick={() => addTranslation(language.id!)}
                                        className="flex items-center w-full px-3 py-2 text-left text-sm hover:bg-primary-50 transition-colors"
                                    >
                                        <span className="w-6 h-6 inline-flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mr-2 text-xs font-medium">
                                            {language.code.slice(0, 2).toUpperCase()}
                                        </span>
                                        <span className="text-gray-700">{language.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {errors.translations && (
                    <p className="mt-1 text-xs text-red-500 mb-2">{errors.translations}</p>
                )}

                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                    {languages.map(language => {
                        const translationItem = formData.translations.find(
                            t => t.language_id === language.id
                        );

                        if (!translationItem) return null;

                        return (
                            <div key={language.id} className="border border-gray-200 rounded-xl p-3 bg-white">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center">
                                        <span className="w-6 h-6 inline-flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mr-2 text-xs font-medium">
                                            {language.code.slice(0, 2).toUpperCase()}
                                        </span>
                                        <span className="text-sm font-medium text-gray-700">{language.name}</span>
                                        {language.is_default && (
                                            <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                                                Default
                                            </span>
                                        )}
                                        {language.is_rtl && (
                                            <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                                                RTL
                                            </span>
                                        )}
                                    </div>

                                    {!language.is_default && (
                                        <motion.button
                                            type="button"
                                            onClick={() => removeTranslation(language.id!)}
                                            className="text-red-500 hover:text-red-700"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Trash size={14} />
                                        </motion.button>
                                    )}
                                </div>

                                <div>
                                    <textarea
                                        value={translationItem.translation}
                                        onChange={(e) => handleTranslationChange(language.id!, e.target.value)}
                                        rows={2}
                                        dir={language.is_rtl ? 'rtl' : 'ltr'}
                                        className={`w-full px-3 py-2 rounded-lg border ${errors[`translation_${language.id}`]
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-200'
                                            } focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-colors`}
                                        placeholder={`Enter ${language.name} translation...`}
                                    />
                                    {errors[`translation_${language.id}`] && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors[`translation_${language.id}`]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <motion.button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Cancel
                </motion.button>
                <motion.button
                    type="submit"
                    className="flex items-center px-5 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Save size={16} className="mr-1" />
                    Save Translation
                </motion.button>
            </div>
        </form>
    );
};

export default TranslationForm;