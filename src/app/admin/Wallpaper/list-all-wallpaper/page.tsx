import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, ArrowRight, AlertCircle, Check, Moon, Sun, Monitor, Smartphone, X, ArrowLeft, ArrowRight as ArrowRightIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mediaService } from '../../../../api/services/media';

interface Wallpaper {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  createdAt: string;
}

const ListWallpaper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;

  // Wallpapers state
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Success message state from navigation
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');

  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [previewWallpaper, setPreviewWallpaper] = useState<Wallpaper | null>(null);
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  interface LocationState {
    success?: boolean;
    message?: string;
  }

  // Mock chat messages for the preview
  const mockMessages = [
    { id: 1, sender: 'AI Assistant', content: 'Hello! How can I help you with your finances today?', time: '10:02 AM' },
    { id: 2, sender: 'User', content: 'I need to check my account balance', time: '10:03 AM' },
    { id: 3, sender: 'AI Assistant', content: 'Your current balance is $3,250.75. Would you like to see your recent transactions?', time: '10:03 AM' },
  ];

  // Fetch wallpapers from API on component mount
  useEffect(() => {
    fetchWallpapers();

    // Check for success message in location state
    if (locationState?.success && locationState?.message) {
      setSuccessMessage(locationState.message);

      // Clear the location state
      window.history.replaceState({}, document.title);

      // Auto-hide success message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const fetchWallpapers = async () => {
    try {
      setIsLoading(true);
      setError('');

      const data = await mediaService.getWallpapers();

      // Transform API response to match our Wallpaper interface
      const formattedWallpapers: Wallpaper[] = data.map((item: any) => ({
        id: item.id,
        name: item.title,
        imageUrl: item.url,
        category: item.category || 'Unknown',
        createdAt: new Date(item.createdAt).toISOString().split('T')[0]
      }));

      setWallpapers(formattedWallpapers);
    } catch (err) {
      console.error('Error fetching wallpapers:', err);
      setError('Failed to load wallpapers. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredWallpapers = wallpapers.filter(wallpaper =>
    wallpaper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wallpaper.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this wallpaper?")) {
      try {
        await mediaService.deleteMedia(id);
        setWallpapers(wallpapers.filter(wallpaper => wallpaper.id !== id));
        setSuccessMessage('Wallpaper deleted successfully');

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } catch (err) {
        console.error('Error deleting wallpaper:', err);
        alert('Failed to delete wallpaper. Please try again.');
      }
    }
  };

  const openPreview = (wallpaper: Wallpaper) => {
    setPreviewWallpaper(wallpaper);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewWallpaper(null);
  };

  const togglePreviewMode = () => {
    setPreviewMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const togglePreviewDevice = () => {
    setPreviewDevice(prevDevice => prevDevice === 'desktop' ? 'mobile' : 'desktop');
  };

  const navigateToAdd = () => {
    navigate('/admin/Wallpaper/add-a-new-wallpaper');
  };

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

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Wallpapers</h1>
            <p className="text-gray-500 text-sm">Customizable backgrounds for your chat experience</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Loading wallpapers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Success message */}
      {successMessage && (
        <div className="mb-6 flex items-center p-4 bg-green-50 text-green-700 rounded-xl">
          <Check size={20} className="mr-2 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 flex items-center p-4 bg-red-50 text-red-700 rounded-xl">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Wallpapers</h1>
          <p className="text-gray-500">Customizable backgrounds for your chat experience</p>
        </div>

        <div className="flex items-center justify-end">
          <button
            onClick={navigateToAdd}
            className="group px-6 py-2.5 text-[14px] bg-primary-500 text-white rounded-full flex items-center gap-2 hover:bg-primary-600 transition-colors shadow-sm hover:shadow"
          >
            <Plus size={18} className="transition-transform group-hover:rotate-90 duration-300" />
            <span>New Wallpaper</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search wallpapers..."
            className="w-full md:w-[350px] pl-14 pr-5 py-3 bg-white rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-gray-100 shadow-sm transition-all duration-200"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Wallpaper Grid */}
      {filteredWallpapers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredWallpapers.map(wallpaper => (
            <div
              key={wallpaper.id}
              className="group relative bg-white border border-gray-100 rounded-3xl overflow-hidden transition-all hover:border-primary-100 hover:shadow-lg"
            >
              <div
                className="aspect-video overflow-hidden cursor-pointer"
                onClick={() => openPreview(wallpaper)}
              >
                <img
                  src={wallpaper.imageUrl}
                  alt={wallpaper.name}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6">
                <div className="flex justify-between mb-3">
                  <span className={`inline-block px-4 py-1 rounded-full text-xs font-medium ${getCategoryColor(wallpaper.category)}`}>
                    {wallpaper.category}
                  </span>

                  <button
                    onClick={() => handleDelete(wallpaper.id)}
                    className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">{wallpaper.name}</h3>

                <p className="text-xs text-gray-500">
                  Added {wallpaper.createdAt}
                </p>
              </div>

              <button
                onClick={() => openPreview(wallpaper)}
                className="absolute bottom-6 right-6 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full shadow-lg"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-gray-50 rounded-3xl">
          <div className="bg-white p-6 rounded-full mb-6 shadow-md">
            <Search size={32} className="text-gray-300" />
          </div>
          <p className="text-xl text-gray-500 font-medium text-center">No wallpapers found</p>
          <p className="text-gray-400 mt-2 text-center mb-6">
            {searchQuery ? 'Try a different search term' : 'Add a new wallpaper to get started'}
          </p>
          <button
            onClick={navigateToAdd}
            className="px-6 py-3 bg-primary-500 text-white rounded-full flex items-center gap-2 hover:bg-primary-600 transition-colors shadow-md"
          >
            <Plus size={18} />
            <span>Add Wallpaper</span>
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewWallpaper && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className={`${previewMode === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col transition-colors duration-300 shadow-2xl`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-6 border-b ${previewMode === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
              <div className="flex items-center space-x-4">
                <h3 className={`text-xl font-semibold ${previewMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {previewWallpaper.name}
                </h3>
                <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(previewWallpaper.category)}`}>
                  {previewWallpaper.category}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className={`text-sm ${previewMode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Preview
                </span>

                <button
                  onClick={togglePreviewDevice}
                  className={`p-2 rounded-lg ${previewMode === 'dark' ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'} transition-colors`}
                  title={`Switch to ${previewDevice === 'desktop' ? 'mobile' : 'desktop'} view`}
                >
                  {previewDevice === 'desktop' ? <Smartphone size={20} /> : <Monitor size={20} />}
                </button>

                <button
                  onClick={togglePreviewMode}
                  className={`p-2 rounded-lg ${previewMode === 'dark' ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'} transition-colors`}
                  title={`Switch to ${previewMode === 'light' ? 'dark' : 'light'} mode`}
                >
                  {previewMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <button
                  onClick={closePreview}
                  className={`p-2 rounded-lg ${previewMode === 'dark' ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'} transition-colors`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className={`p-6 flex-1 overflow-auto ${previewMode === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
              <div className="flex justify-center">
                {previewDevice === 'desktop' ? (
                  <div className={`border ${previewMode === 'dark' ? 'border-gray-700' : 'border-gray-200'} rounded-2xl overflow-hidden shadow-xl max-w-[1000px] w-full`}>
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

                    <div className="h-[500px] relative flex flex-col">
                      <div className="absolute inset-0">
                        <img
                          src={previewWallpaper.imageUrl}
                          alt={previewWallpaper.name}
                          className="w-full h-full object-cover"
                        />
                        {previewMode === 'dark' && (
                          <div className="absolute inset-0 bg-black/50"></div>
                        )}
                      </div>

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
                            <ArrowRightIcon size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Mobile preview
                  <div className={`border-[14px] ${previewMode === 'dark' ? 'border-gray-800' : 'border-gray-200'} rounded-[60px] overflow-hidden shadow-xl w-[320px]`}>
                    {/* Notch */}
                    <div className={`relative ${previewMode === 'dark' ? 'bg-black' : 'bg-gray-100'} h-6 flex justify-center`}>
                      <div className="absolute top-0 w-40 h-6 bg-black rounded-b-xl"></div>
                    </div>

                    {/* Phone screen */}
                    <div className={`h-[600px] relative flex flex-col ${previewMode === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                      {/* Wallpaper as background */}
                      <div className="absolute inset-0">
                        <img
                          src={previewWallpaper.imageUrl}
                          alt={previewWallpaper.name}
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
                            <ArrowRightIcon size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Home indicator */}
                      <div className="relative z-10 flex justify-center py-2">
                        <div className={`w-32 h-1 rounded-full ${previewMode === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListWallpaper;
