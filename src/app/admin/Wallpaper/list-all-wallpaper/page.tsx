import React, { useState } from 'react';
import { Search, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Wallpaper {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  createdAt: string;
}

const ListWallpaper: React.FC = () => {
  const navigate = useNavigate();

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([
    {
      id: '1',
      name: 'Gradient Blue',
      imageUrl: 'https://images.unsplash.com/photo-1668853853439-923e013afff1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JhZGllbnQlMjBibHVlfGVufDB8fDB8fHww',
      category: 'Gradient',
      createdAt: '2025-04-12'
    },
    {
      id: '2',
      name: 'Dark Mode',
      imageUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200',
      category: 'Dark',
      createdAt: '2025-04-15'
    },
    {
      id: '3',
      name: 'Light Minimalist',
      imageUrl: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=1200',
      category: 'Light',
      createdAt: '2025-04-18'
    },
    {
      id: '4',
      name: 'Geometric Pattern',
      imageUrl: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?q=80&w=1200',
      category: 'Pattern',
      createdAt: '2025-04-20'
    },
    {
      id: '5',
      name: 'Abstract Art',
      imageUrl: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=1200',
      category: 'Abstract',
      createdAt: '2025-04-25'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredWallpapers = wallpapers.filter(wallpaper =>
    wallpaper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wallpaper.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete wallpaper
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this wallpaper?")) {
      setWallpapers(wallpapers.filter(wallpaper => wallpaper.id !== id));
    }
  };

  // Navigate to add wallpaper page
  const navigateToAdd = () => {
    navigate('/add-wallpaper');
  };

  // Get category color
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Gradient': 'bg-blue-50 text-blue-600',
      'Dark': 'bg-gray-900 text-white',
      'Light': 'bg-gray-50 text-gray-800',
      'Pattern': 'bg-emerald-50 text-emerald-600',
      'Abstract': 'bg-rose-50 text-rose-600',
      'Minimal': 'bg-amber-50 text-amber-600',
      'Nature': 'bg-green-50 text-green-600',
      'Urban': 'bg-purple-50 text-purple-600'
    };

    return colors[category] || 'bg-blue-50 text-blue-600';
  };

  return (
    <div className="max-w-8xl mx-auto px-8 py-6">
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
          <p className="text-gray-400 mt-2 text-center mb-6">Try a different search term or add a new wallpaper</p>
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