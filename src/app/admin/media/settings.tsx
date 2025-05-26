import React, { useState } from 'react';
import {
    Save, ShieldCheck,
    Languages, Video, Info, Check
} from 'lucide-react';

const ShortsSettings: React.FC = () => {
    const [maxDuration, setMaxDuration] = useState(60);
    const [minDuration, setMinDuration] = useState(15);
    const [maxFileSize, setMaxFileSize] = useState(100);
    const [autoModeration, setAutoModeration] = useState(true);
    const [moderationSLA, setModerationSLA] = useState(6);
    const [defaultLanguage, setDefaultLanguage] = useState('en');
    const [maxReportsToFlag, setMaxReportsToFlag] = useState(3);
    const [enableHashtags, setEnableHashtags] = useState(true);
    const [maxHashtags, setMaxHashtags] = useState(10);
    const [allowedFormats, setAllowedFormats] = useState(['mp4', 'mov', 'avi']);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleSaveSettings = () => {
        // In a real app, save to API
        console.log('Saving settings...');

        // Show success message
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    // Toggle allowed format
    const toggleFormat = (format: string) => {
        if (allowedFormats.includes(format)) {
            setAllowedFormats(allowedFormats.filter(f => f !== format));
        } else {
            setAllowedFormats([...allowedFormats, format]);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-medium">Shorts Settings</h1>
                    <p className="text-gray-500 text-sm mt-1">Configure system-wide settings for the Shorts module</p>
                </div>

                <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium flex items-center"
                >
                    <Save size={16} className="mr-2" />
                    Save Settings
                </button>
            </div>

            {saveSuccess && (
                <div className="mb-6 bg-green-50 border border-green-100 rounded-lg p-4 flex items-center">
                    <Check size={20} className="text-green-600 mr-2" />
                    <p className="text-green-700">Settings saved successfully.</p>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Video Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-200 flex items-center">
                        <Video size={20} className="text-primary-600 mr-2" />
                        <h2 className="text-lg font-medium">Video Settings</h2>
                    </div>

                    <div className="p-5 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Duration (seconds)
                            </label>
                            <input
                                type="number"
                                value={maxDuration}
                                onChange={(e) => setMaxDuration(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            />
                            <p className="mt-1 text-sm text-gray-500">Maximum allowed duration for short videos</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Min Duration (seconds)
                            </label>
                            <input
                                type="number"
                                value={minDuration}
                                onChange={(e) => setMinDuration(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            />
                            <p className="mt-1 text-sm text-gray-500">Minimum allowed duration for short videos</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max File Size (MB)
                            </label>
                            <input
                                type="number"
                                value={maxFileSize}
                                onChange={(e) => setMaxFileSize(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            />
                            <p className="mt-1 text-sm text-gray-500">Maximum allowed file size for uploads</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Allowed Formats
                            </label>

                            <div className="flex flex-wrap gap-2">
                                {['mp4', 'mov', 'avi', 'webm', 'mkv'].map(format => (
                                    <button
                                        key={format}
                                        onClick={() => toggleFormat(format)}
                                        className={`px-3 py-1 rounded-lg text-sm font-medium ${allowedFormats.includes(format)
                                            ? 'bg-primary-100 text-primary-700 border border-primary-200'
                                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                                            }`}
                                    >
                                        {format.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Moderation Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-200 flex items-center">
                        <ShieldCheck size={20} className="text-primary-600 mr-2" />
                        <h2 className="text-lg font-medium">Moderation Settings</h2>
                    </div>

                    <div className="p-5 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700">AI Auto-Moderation</h3>
                                <p className="mt-1 text-sm text-gray-500">Use AI to automatically flag potentially inappropriate content</p>
                            </div>

                            <div className="relative inline-block w-12 align-middle select-none">
                                <input
                                    type="checkbox"
                                    checked={autoModeration}
                                    onChange={() => setAutoModeration(!autoModeration)}
                                    className="sr-only toggle-checkbox"
                                    id="toggle-auto-mod"
                                />
                                <label
                                    htmlFor="toggle-auto-mod"
                                    className={`block h-6 rounded-full cursor-pointer transition-colors ${autoModeration ? 'bg-primary-600' : 'bg-gray-300'}`}
                                ></label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Moderation SLA (hours)
                            </label>
                            <input
                                type="number"
                                value={moderationSLA}
                                onChange={(e) => setModerationSLA(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            />
                            <p className="mt-1 text-sm text-gray-500">Target turnaround time for manual content review</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reports to Auto-Flag
                            </label>
                            <input
                                type="number"
                                value={maxReportsToFlag}
                                onChange={(e) => setMaxReportsToFlag(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            />
                            <p className="mt-1 text-sm text-gray-500">Number of user reports needed to auto-flag content</p>
                        </div>
                    </div>
                </div>

                {/* Hashtag Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-200 flex items-center">
                        <Info size={20} className="text-primary-600 mr-2" />
                        <h2 className="text-lg font-medium">Hashtag Settings</h2>
                    </div>

                    <div className="p-5 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700">Enable Hashtags</h3>
                                <p className="mt-1 text-sm text-gray-500">Allow users to add hashtags to videos</p>
                            </div>

                            <div className="relative inline-block w-12 align-middle select-none">
                                <input
                                    type="checkbox"
                                    checked={enableHashtags}
                                    onChange={() => setEnableHashtags(!enableHashtags)}
                                    className="sr-only toggle-checkbox"
                                    id="toggle-hashtags"
                                />
                                <label
                                    htmlFor="toggle-hashtags"
                                    className={`block h-6 rounded-full cursor-pointer transition-colors ${enableHashtags ? 'bg-primary-600' : 'bg-gray-300'}`}
                                ></label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Maximum Hashtags per Video
                            </label>
                            <input
                                type="number"
                                value={maxHashtags}
                                onChange={(e) => setMaxHashtags(parseInt(e.target.value))}
                                disabled={!enableHashtags}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                            />
                            <p className="mt-1 text-sm text-gray-500">Maximum number of hashtags allowed per video</p>
                        </div>
                    </div>
                </div>

                {/* Regional Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-200 flex items-center">
                        <Languages size={20} className="text-primary-600 mr-2" />
                        <h2 className="text-lg font-medium">Regional Settings</h2>
                    </div>

                    <div className="p-5 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Default Language
                            </label>
                            <select
                                value={defaultLanguage}
                                onChange={(e) => setDefaultLanguage(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="en">English</option>
                                <option value="sw">Swahili</option>
                                <option value="fr">French</option>
                                <option value="ar">Arabic</option>
                            </select>
                            <p className="mt-1 text-sm text-gray-500">Default language for content moderation</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-primary-50 border border-primary-100 rounded-lg p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <Info className="h-5 w-5 text-primary-400" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-primary-700">
                            Changes to these settings will affect all new uploads. Existing content will not be affected.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShortsSettings;