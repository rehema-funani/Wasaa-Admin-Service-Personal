import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Image, Save, Check, AlertCircle, Monitor, Smartphone, Moon, Sun, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mediaService } from '../../../../api/services/media';

const AddWallpaper: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState('/api/placeholder/400/200');
  const [isValid, setIsValid] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const mockMessages = [
    { id: 1, sender: 'AI Assistant', content: 'Hello! How can I help you with your finances today?', time: '10:02 AM' },
    { id: 2, sender: 'User', content: 'I need to check my account balance', time: '10:03 AM' },
    { id: 3, sender: 'AI Assistant', content: 'Your current balance is $3,250.75. Would you like to see your recent transactions?', time: '10:03 AM' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    const updatedData = { ...formData, [name]: value };
    setIsValid(!!updatedData.name && !!updatedData.category && !!selectedFile);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadStatus('uploading');

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
        setUploadStatus('success');

        setIsValid(!!formData.name && !!formData.category && !!file);
      };

      reader.onerror = () => {
        setUploadStatus('error');
        setSelectedFile(null);
        setIsValid(false);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid || !selectedFile) return;

    try {
      setIsSubmitting(true);
      setApiError('');

      const apiFormData = new FormData();
      apiFormData.append('title', formData.name);
      apiFormData.append('media', selectedFile);
      apiFormData.append('type', 'wallpaper');
      apiFormData.append('category', formData.category);

      await mediaService.createMedia(apiFormData);

      navigate('/admin/Wallpaper/list-all-wallpaper', { state: { success: true, message: 'Wallpaper created successfully!' } });
    } catch (error) {
      console.error('Error creating wallpaper:', error);
      setApiError('Failed to create wallpaper. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const togglePreviewMode = () => {
    setPreviewMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const togglePreviewDevice = () => {
    setPreviewDevice(prevDevice => prevDevice === 'desktop' ? 'mobile' : 'desktop');
  };

  const categories = [
    'Gradient',
    'Dark',
    'Light',
    'Pattern',
    'Abstract',
    'Minimal',
    'Nature',
    'Urban'
  ];

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Gradient': 'bg-primary-50 text-primary-600',
      'Dark': 'bg-gray-900 text-white',
      'Light': 'bg-gray-50 text-gray-800',
      'Pattern': 'bg-emerald-50 text-emerald-600',
      'Abstract': 'bg-rose-50 text-rose-600',
      'Minimal': 'bg-amber-50 text-amber-600',
      'Nature': 'bg-green-50 text-green-600',
      'Urban': 'bg-purple-50 text-purple-600',
      'Unknown': 'bg-gray-100 text-gray-600'
    };

    return colors[category] || 'bg-primary-50 text-primary-600';
  };

  const getUploadStatusContent = () => {
    switch (uploadStatus) {
      case 'uploading':
        return (
          <div className="flex items-center text-primary-500">
            <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full mr-2"></div>
            <span>Uploading...</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center text-green-500">
            <Check size={16} className="mr-2" />
            <span>Upload complete</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center text-red-500">
            <AlertCircle size={16} className="mr-2" />
            <span>Upload failed</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center mb-12">
        <button
          onClick={handleBack}
          className="mr-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">New Wallpaper</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Create a custom background for your chat</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {apiError && (
          <div className="flex items-center p-4 text-red-800 bg-red-50 rounded-xl">
            <AlertCircle size={20} className="mr-2 flex-shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                <Upload size={20} className="mr-3 text-primary-500 dark:text-primary-400" />
                Upload Image
              </h2>

              <div className="relative">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="flex flex-col gap-4">
                  <label
                    htmlFor="imageUpload"
                    className={`group flex-grow flex flex-col items-center justify-center gap-3 py-8 px-6 rounded-2xl text-gray-700 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-700 border-dashed ${uploadStatus === 'uploading'
                        ? 'bg-primary-50 border-primary-200 dark:bg-primary-900 dark:border-primary-700'
                        : uploadStatus === 'success'
                          ? 'bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-700'
                          : uploadStatus === 'error'
                            ? 'bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-700'
                            : 'bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-100'
                      } transition-colors cursor-pointer`}
                  >
                    <div className={`p-4 rounded-full ${uploadStatus === 'uploading'
                        ? 'bg-primary-100 dark:bg-primary-900'
                        : uploadStatus === 'success'
                          ? 'bg-green-100 dark:bg-green-900'
                          : uploadStatus === 'error'
                            ? 'bg-red-100 dark:bg-red-900'
                            : 'bg-gray-100 dark:bg-gray-900 group-hover:bg-gray-200'
                      } transition-colors`}>
                      <Upload
                        size={24}
                        className={`${uploadStatus === 'uploading'
                            ? 'text-primary-500 animate-bounce'
                            : uploadStatus === 'success'
                              ? 'text-green-500'
                              : uploadStatus === 'error'
                                ? 'text-red-500'
                                : 'text-gray-500'
                          }`}
                      />
                    </div>
                    <span className="text-lg font-medium">{
                      uploadStatus === 'success'
                        ? 'Change Image'
                        : uploadStatus === 'uploading'
                          ? 'Uploading...'
                          : 'Upload Wallpaper Image'
                    }</span>
                    <span className="text-sm text-gray-500">
                      {uploadStatus === 'success'
                        ? 'Click to select a different image'
                        : 'JPG, PNG or GIF (Recommended: 1920×1080px)'}
                    </span>
                  </label>

                  <div className="h-6 px-2">
                    {getUploadStatusContent()}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                <Image size={20} className="mr-3 text-primary-500 dark:text-primary-400" />
                Wallpaper Details
              </h2>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-500  mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-white dark:bg-gray-800 rounded-xl text-gray-800 dark:text-gray-200 focus:outline-none border-2 border-gray-100 dark:border-gray-700 focus:border-primary-500 transition-all"
                    placeholder="Enter a descriptive name"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white dark:bg-gray-800 rounded-xl text-gray-800 dark:text-gray-200 focus:outline-none border-2 border-gray-100 dark:border-gray-700 focus:border-primary-500 transition-all appearance-none"
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {formData.category && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Category Preview
                    </label>
                    <span className={`inline-block px-4 py-1 rounded-full text-xs font-medium ${getCategoryColor(formData.category)}`}>
                      {formData.category}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <Image size={20} className="mr-3 text-primary-500 dark:text-primary-400" />
                Live Preview
              </h2>

              <div className="flex items-center space-x-3">
                {/* Device toggle */}
                <button
                  type="button"
                  onClick={togglePreviewDevice}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title={`Switch to ${previewDevice === 'desktop' ? 'mobile' : 'desktop'} view`}
                >
                  {previewDevice === 'desktop' ? <Smartphone size={20} /> : <Monitor size={20} />}
                </button>

                {/* Mode toggle */}
                <button
                  type="button"
                  onClick={togglePreviewMode}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                  title={`Switch to ${previewMode === 'light' ? 'dark' : 'light'} mode`}
                >
                  {previewMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
              </div>
            </div>

            <div className={`p-4 rounded-2xl ${previewMode === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
              {/* Preview content */}
              <div className="flex justify-center">
                {/* Desktop preview */}
                {previewDevice === 'desktop' ? (
                  <div className={`border ${previewMode === 'dark' ? 'border-gray-700' : 'border-gray-200'} rounded-2xl overflow-hidden shadow-lg w-full`}>
                    {/* Browser frame */}
                    <div className={`${previewMode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-2 flex items-center gap-2`}>
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className={`flex-1 mx-2 ${previewMode === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-md px-3 py-1 text-xs ${previewMode === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        app.yourfintech.com
                      </div>
                    </div>

                    {/* Chat interface */}
                    <div className="h-[400px] relative flex flex-col">
                      {/* Wallpaper as background */}
                      <div className="absolute inset-0">
                        <img
                          src={previewImage}
                          alt="Wallpaper preview"
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay for dark mode */}
                        {previewMode === 'dark' && (
                          <div className="absolute inset-0 bg-black/50"></div>
                        )}
                      </div>

                      {/* Header */}
                      <div className={`relative z-10 flex items-center justify-between p-4 ${previewMode === 'dark' ? 'bg-gray-900/70' : 'bg-white/70'} backdrop-blur-md border-b ${previewMode === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50'}`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center ${previewMode === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M9 9H9.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M15 9H15.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div>
                            <h3 className={`font-medium ${previewMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>FinChat Assistant</h3>
                            <div className={`text-xs ${previewMode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Online</div>
                          </div>
                        </div>
                        <div className={`flex items-center space-x-2 ${previewMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          <button className="p-1.5 rounded-full hover:bg-white/10">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.9 6 10 6.9 10 8V16C10 17.1 10.9 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" fill="currentColor" />
                            </svg>
                          </button>
                          <button className="p-1.5 rounded-full hover:bg-white/10">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="currentColor" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="relative z-10 flex-1 p-4 overflow-auto">
                        <div className="space-y-4">
                          {mockMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender === 'User' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] px-4 py-3 rounded-2xl ${message.sender === 'User'
                                    ? previewMode === 'dark'
                                      ? 'bg-primary-600 text-white'
                                      : 'bg-primary-500 text-white'
                                    : previewMode === 'dark'
                                      ? 'bg-gray-800 text-white'
                                      : 'bg-white text-gray-800'
                                  } shadow-sm`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className={`text-xs mt-1 ${message.sender === 'User' ? 'text-primary-100' : previewMode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {message.time}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Input area */}
                      <div className="relative z-10 p-4">
                        <div className={`flex items-center gap-2 p-2 rounded-full ${previewMode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                          <input
                            type="text"
                            placeholder="Type a message..."
                            disabled
                            className={`flex-1 bg-transparent border-0 focus:ring-0 outline-none ${previewMode === 'dark' ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'} px-3`}
                          />
                          <button className="p-2 rounded-full bg-primary-500 text-white">
                            <ArrowRight size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Mobile preview
                  <div className={`border-[12px] ${previewMode === 'dark' ? 'border-gray-800' : 'border-gray-200'} rounded-[40px] overflow-hidden shadow-xl w-[280px]`}>
                    {/* Notch */}
                    <div className={`relative ${previewMode === 'dark' ? 'bg-black' : 'bg-gray-100'} h-5 flex justify-center`}>
                      <div className="absolute top-0 w-32 h-5 bg-black rounded-b-xl"></div>
                    </div>

                    {/* Phone screen */}
                    <div className={`h-[500px] relative flex flex-col ${previewMode === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                      {/* Wallpaper as background */}
                      <div className="absolute inset-0">
                        <img
                          src={previewImage}
                          alt="Wallpaper preview"
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay for dark mode */}
                        {previewMode === 'dark' && (
                          <div className="absolute inset-0 bg-black/60"></div>
                        )}
                      </div>

                      {/* Status bar */}
                      <div className="relative z-10 flex justify-between items-center px-4 py-2">
                        <div className={`text-xs font-medium ${previewMode === 'dark' ? 'text-white' : 'text-black'}`}>12:30</div>
                        <div className="flex items-center gap-1">
                          <div className={`text-xs ${previewMode === 'dark' ? 'text-white' : 'text-black'}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12.5 2C9.85 2 7.45 3.4 6.07 5.61C6.02 5.69 5.99 5.79 6 5.89C6.01 6 6.05 6.09 6.11 6.17C6.17 6.25 6.26 6.31 6.35 6.33C6.44 6.36 6.54 6.34 6.62 6.29C7.85 5.46 9.33 5 10.85 5C14.99 5 18.35 8.36 18.35 12.5C18.35 14.02 17.89 15.5 17.06 16.73C17.01 16.81 16.99 16.91 17 17.01C17.01 17.11 17.05 17.2 17.12 17.27C17.19 17.34 17.27 17.38 17.37 17.39C17.46 17.4 17.56 17.37 17.64 17.31C19.64 15.91 21 13.36 21 10.5C21 5.78 17.22 2 12.5 2Z" fill="currentColor" />
                              <path d="M12.5 6C9.46 6 7 8.46 7 11.5C7 13.28 7.67 14.9 8.76 16.11C8.83 16.19 8.94 16.23 9.04 16.23C9.15 16.23 9.25 16.19 9.33 16.11C9.4 16.04 9.44 15.94 9.44 15.84C9.44 15.74 9.4 15.65 9.33 15.57C8.41 14.56 7.85 13.19 7.85 11.69C7.85 9.11 9.91 7.04 12.5 7.04C15.09 7.04 17.15 9.11 17.15 11.69C17.15 12.39 16.95 13.06 16.61 13.65C16.56 13.74 16.55 13.84 16.57 13.94C16.6 14.03 16.66 14.11 16.74 14.16C16.82 14.21 16.92 14.22 17.01 14.2C17.11 14.17 17.19 14.11 17.24 14.03C17.91 12.88 18.19 11.54 18.01 10.21C17.82 8.88 17.19 7.66 16.21 6.76C15.23 5.85 13.95 5.33 12.6 5.33C12.57 5.33 12.53 5.33 12.5 5.33V6Z" fill="currentColor" />
                            </svg>
                          </div>
                          <div className={`text-xs ${previewMode === 'dark' ? 'text-white' : 'text-black'}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6.67 4C6.67 2.9 7.57 2 8.67 2H15.33C16.43 2 17.33 2.9 17.33 4V20C17.33 21.1 16.43 22 15.33 22H8.67C7.57 22 6.67 21.1 6.67 20V4ZM8.67 4V16H15.33V4H8.67Z" fill="currentColor" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Header */}
                      <div className={`relative z-10 flex items-center justify-between p-4 ${previewMode === 'dark' ? 'bg-gray-900/70' : 'bg-white/70'} backdrop-blur-md`}>
                        <div className="flex items-center gap-2">
                          <ArrowLeft size={18} className={previewMode === 'dark' ? 'text-white' : 'text-gray-900'} />
                          <div className="flex items-center space-x-2">
                            <div className={`w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center ${previewMode === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 9H9.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M15 9H15.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                            <h3 className={`text-sm font-medium ${previewMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>FinChat</h3>
                          </div>
                        </div>
                        <button className={`p-1.5 rounded-full ${previewMode === 'dark' ? 'text-gray-300' : 'text-gray-600'} hover:bg-white/10`}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="currentColor" />
                          </svg>
                        </button>
                      </div>

                      {/* Messages */}
                      <div className="relative z-10 flex-1 p-4 overflow-auto">
                        <div className="space-y-4">
                          {mockMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender === 'User' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] px-4 py-3 rounded-2xl ${message.sender === 'User'
                                    ? previewMode === 'dark'
                                      ? 'bg-primary-600 text-white'
                                      : 'bg-primary-500 text-white'
                                    : previewMode === 'dark'
                                      ? 'bg-gray-800 text-white'
                                      : 'bg-white text-gray-800'
                                  } shadow-sm`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className={`text-xs mt-1 ${message.sender === 'User' ? 'text-primary-100' : previewMode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {message.time}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Input area */}
                      <div className="relative z-10 p-3">
                        <div className={`flex items-center gap-2 p-2 rounded-full ${previewMode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                          <input
                            type="text"
                            placeholder="Message"
                            disabled
                            className={`flex-1 text-sm bg-transparent border-0 focus:ring-0 outline-none ${previewMode === 'dark' ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'} px-3`}
                          />
                          <button className="p-1.5 rounded-full bg-primary-500 text-white">
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="relative z-10 flex justify-center py-2">
                        <div className={`w-24 h-1 rounded-full ${previewMode === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-sm text-center text-gray-500 flex items-center justify-center">
              <svg className="mr-1.5" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 17H13V11H11V17ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 9H13V7H11V9Z" fill="currentColor" />
              </svg>
              Toggle between device and theme modes to preview how your wallpaper will look
            </div>

          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`relative w-full py-5 rounded-2xl text-white dark:text-gray-200 font-medium text-lg transition-all shadow-sm ${isValid && !isSubmitting
              ? 'bg-primary-500 hover:bg-primary-600 hover:shadow dark:bg-primary-600 dark:hover:bg-primary-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
        >
          <span className="flex items-center justify-center">
            {isSubmitting ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white dark:border-gray-600 border-t-transparent rounded-full mr-2"></div>
                <span>Creating Wallpaper...</span>
              </>
            ) : (
              <>
                <Save size={20} className="mr-2" />
                <span>Save Wallpaper</span>
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
};

export default AddWallpaper;
