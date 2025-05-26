import React, { useState } from 'react';
import { ArrowLeft, Upload, Image, Save, Check, AlertCircle } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto px-8 py-16">
      <div className="flex items-center mb-16">
        <button
          onClick={handleBack}
          className="mr-6 p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">New Wallpaper</h1>
          <p className="mt-1 text-gray-500">Create a custom background for your chat</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-14">
        {/* API Error message */}
        {apiError && (
          <div className="flex items-center p-4 text-red-800 bg-red-50 rounded-xl">
            <AlertCircle size={20} className="mr-2 flex-shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Unique two-column layout for desktop - Fintech inspired */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column - Image preview */}
          <div className="order-2 lg:order-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Image size={22} className="mr-3 text-primary-500" />
              Preview
            </h2>

            <div className="relative rounded-3xl overflow-hidden bg-gray-50 border-2 border-gray-100 aspect-video">
              <img
                src={previewImage}
                alt="Wallpaper preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right column - Upload control */}
          <div className="order-1 lg:order-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Image Upload</h2>

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
                  className={`flex-grow flex items-center justify-center gap-3 py-5 px-6 rounded-2xl text-gray-700 border-2 ${uploadStatus === 'uploading'
                    ? 'bg-primary-50 border-primary-100'
                    : uploadStatus === 'success'
                      ? 'bg-green-50 border-green-100'
                      : uploadStatus === 'error'
                        ? 'bg-red-50 border-red-100'
                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                    } transition-colors cursor-pointer`}
                >
                  <Upload size={24} className={uploadStatus === 'uploading' ? 'text-primary-500 animate-bounce' : ''} />
                  <span className="text-lg">{uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Image'}</span>
                </label>

                <div className="h-6 px-2">
                  {getUploadStatusContent()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wallpaper Details - Minimal design */}
        <div className="bg-gray-50 p-8 rounded-3xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-8">Wallpaper Details</h2>

          <div className="space-y-8">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-500 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-white rounded-xl text-gray-800 focus:outline-none border-2 border-transparent focus:border-primary-500 transition-all"
                placeholder="Enter a descriptive name"
                required
              />
            </div>

            {/* Category - iOS 18 inspired select */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-500 mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-white rounded-xl text-gray-800 focus:outline-none border-2 border-transparent focus:border-primary-500 transition-all appearance-none"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button - Fintech inspired minimalist */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`relative w-full py-5 rounded-2xl text-white font-medium text-lg transition-all ${isValid && !isSubmitting
            ? 'bg-primary-500 hover:bg-primary-600'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          <span className="flex items-center justify-center">
            {isSubmitting ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
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