import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, X, Camera, Check } from 'lucide-react';
import { mediaService } from '../../../../api/services/media';

interface Avatar {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
}

const page: React.FC = () => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newAvatar, setNewAvatar] = useState({
    name: '',
    imageUrl: '/api/placeholder/100/100'
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchAvatars();
  }, []);

  const fetchAvatars = async () => {
    try {
      setIsLoading(true);
      const data = await mediaService.getAvatars();
      setAvatars(data);
    } catch (error) {
      console.error('Error fetching avatars:', error);
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredAvatars = avatars.filter(avatar =>
    avatar?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (confirm("Are you sure you want to delete this avatar?")) {
      try {
        await mediaService.deleteMedia(id);
        setAvatars(avatars.filter(avatar => avatar.id !== id));
      } catch (error) {
        console.error('Error deleting avatar:', error);
        alert('Failed to delete avatar. Please try again.');
      }
    }
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setNewAvatar({
      name: '',
      imageUrl: '/api/placeholder/100/100'
    });
    setSelectedFile(null);
    setUploadStatus('idle');

    document.body.style.overflow = 'hidden';
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleNewAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAvatar({
      ...newAvatar,
      [name]: value
    });
  };

  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadStatus('uploading');

      // Create a preview of the image
      const reader = new FileReader();
      reader.onload = () => {
        setNewAvatar({
          ...newAvatar,
          imageUrl: reader.result as string
        });
        setUploadStatus('success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAvatar = async () => {
    if (!newAvatar.name || !selectedFile) return;

    try {
      // Create form data to send the file and metadata
      const formData = new FormData();
      formData.append('title', newAvatar.name);
      formData.append('media', selectedFile);
      formData.append('type', 'avatar');

      // Send the request
      const response = await mediaService.createMedia(formData);

      // Add the new avatar to the list
      const newAvatarData: Avatar = {
        id: response.id,
        name: response.title,
        imageUrl: response.url,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setAvatars([...avatars, newAvatarData]);
      closeAddModal();
    } catch (error) {
      console.error('Error creating avatar:', error);
      alert('Failed to create avatar. Please try again.');
    }
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="max-w-8xl mx-auto px-8 py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Avatars</h1>
          <p className="text-gray-500 text-sm max-w-xl">Personalize user identities with custom profile images</p>
        </div>

        <div className="mt-6 md:mt-0">
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-6 py-2 text-[14px] bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors text-sm font-medium"
          >
            <Plus size={18} className="mr-2" />
            Add Avatar
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search avatars..."
          className="w-[350px] pl-14 pr-5 py-2 bg-transparent rounded-2xl text-gray-800 focus:outline-none focus:bg-white border-2 border-gray-100 focus:border-primary-500 transition-all duration-200"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {isLoading ? (
        <div className="bg-gray-50 rounded-3xl py-16 px-6 text-center">
          <div className="inline-flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-3 text-gray-500">Loading avatars...</p>
          </div>
        </div>
      ) : filteredAvatars.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredAvatars.map((avatar, index) => (
            <div
              key={avatar.id}
              className={`group bg-white border-2 border-gray-50 rounded-3xl p-6 transition-all hover:border-primary-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-20 h-20 overflow-hidden rounded-full bg-gray-50 border-4 border-white">
                    <img
                      src={avatar.imageUrl}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <button
                    onClick={(e) => handleDelete(avatar.id, e)}
                    className="absolute -top-1 -right-1 p-2 rounded-full bg-white text-gray-400 border-2 border-gray-50 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <h3 className="text-base font-medium text-gray-800 text-center mb-1">
                  {avatar.name}
                </h3>

                <p className="text-xs text-gray-400 text-center">
                  {avatar.createdAt}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-3xl py-16 px-6 text-center">
          <div className="inline-flex p-5 bg-white rounded-full mb-6">
            <Search size={24} className="text-gray-300" />
          </div>
          <p className="text-xl text-gray-500 font-medium">No avatars found</p>
          <p className="text-gray-400 mt-2 mb-6">Try a different search term or add a new avatar</p>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-primary-500 text-white rounded-full inline-flex items-center gap-2 hover:bg-primary-600 transition-colors"
          >
            <Plus size={18} />
            <span>Add Avatar</span>
          </button>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={closeAddModal}></div>

          <div
            className="relative bg-white rounded-3xl max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">New Avatar</h2>
              <button
                onClick={closeAddModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-8 flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-28 h-28 overflow-hidden rounded-full bg-gray-50">
                    <img
                      src={newAvatar.imageUrl}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="w-full">
                  <input
                    type="file"
                    id="avatarUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="avatarUpload"
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium ${uploadStatus === 'uploading'
                      ? 'bg-primary-50 text-primary-500 border-2 border-primary-100'
                      : uploadStatus === 'success'
                        ? 'bg-green-50 text-green-500 border-2 border-green-100'
                        : 'bg-gray-50 text-gray-700 border-2 border-gray-100 hover:bg-gray-100'
                      } transition-all cursor-pointer`}
                  >
                    {uploadStatus === 'uploading' ? (
                      <>
                        <div className="h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Uploading...</span>
                      </>
                    ) : uploadStatus === 'success' ? (
                      <>
                        <Check size={16} />
                        <span>Upload Complete</span>
                      </>
                    ) : (
                      <>
                        <Camera size={16} />
                        <span>Choose Image</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="mb-8">
                <label htmlFor="name" className="block text-sm font-medium text-gray-500 mb-2">
                  Avatar Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newAvatar.name}
                  onChange={handleNewAvatarChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 focus:outline-none border-2 border-transparent focus:border-primary-500 transition-all"
                  placeholder="Enter avatar name"
                  required
                />
              </div>

              <button
                onClick={handleAddAvatar}
                disabled={!newAvatar.name || !selectedFile}
                className={`w-full py-3 rounded-xl text-white font-medium transition-colors ${newAvatar.name && selectedFile
                  ? 'bg-primary-500 hover:bg-primary-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                Save Avatar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;