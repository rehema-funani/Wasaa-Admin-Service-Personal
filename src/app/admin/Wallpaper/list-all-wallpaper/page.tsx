import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mediaService } from '../../../../api/services/media';

interface Wallpaper {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  createdAt: string;
}

interface LocationState {
  success?: boolean;
  message?: string;
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
        category: item.category || 'Unknown', // Default if category is not provided
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

  const navigateToAdd = () => {
    navigate('/admin/Wallpaper/add-a-new-wallpaper');
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Gradient': 'bg-blue-50 text-blue-600',
      'Dark': 'bg-gray-900 text-white',
      'Light': 'bg-gray-50 text-gray-800',
      'Pattern': 'bg-emerald-50 text-emerald-600',
      'Abstract': 'bg-rose-50 text-rose-600',
      'Minimal': 'bg-amber-50 text-amber-600',
      'Nature': 'bg-green-50 text-green-600',
      'Urban': 'bg-purple-50 text-purple-600',
      'Unknown': 'bg-gray-100 text-gray-600'
    };

    return colors[category] || 'bg-blue-50 text-blue-600';
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="max-w-8xl mx-auto px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Wallpapers</h1>
            <p className="text-gray-500 text-sm">Customizable backgrounds for your chat experience</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Loading wallpapers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto px-8 py-6">
      {successMessage && (
        <div className="mb-6 flex items-center p-4 bg-green-50 text-green-700 rounded-xl">
          <Check size={20} className="mr-2 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center p-4 bg-red-50 text-red-700 rounded-xl">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Wallpapers</h1>
          <p className="text-gray-500 text-sm">Customizable backgrounds for your chat experience</p>
        </div>

        <div className="flex items-center justify-end">
          <button
            onClick={navigateToAdd}
            className="group px-6 py-2 text-[14px] bg-blue-500 text-white rounded-full flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            <Plus size={18} className="transition-transform group-hover:rotate-90 duration-300" />
            <span>New Wallpaper</span>
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search wallpapers..."
            className="w-[350px] pl-14 pr-5 py-2 bg-transparent rounded-2xl text-gray-800 focus:outline-none focus:bg-white border-2 border-gray-100 focus:border-blue-500 transition-all duration-200"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {filteredWallpapers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredWallpapers.map(wallpaper => (
            <div
              key={wallpaper.id}
              className="group relative bg-white border-2 border-gray-50 rounded-3xl overflow-hidden transition-all hover:border-blue-100"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={wallpaper.imageUrl}
                  alt={wallpaper.name}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
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

              <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight size={20} className="text-blue-500" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-gray-50 rounded-3xl">
          <div className="bg-white p-6 rounded-full mb-6">
            <Search size={32} className="text-gray-300" />
          </div>
          <p className="text-xl text-gray-500 font-medium text-center">No wallpapers found</p>
          <p className="text-gray-400 mt-2 text-center mb-6">
            {searchQuery ? 'Try a different search term' : 'Add a new wallpaper to get started'}
          </p>
          <button
            onClick={navigateToAdd}
            className="px-6 py-3 bg-blue-500 text-white rounded-full flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            <Plus size={18} />
            <span>Add Wallpaper</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ListWallpaper;