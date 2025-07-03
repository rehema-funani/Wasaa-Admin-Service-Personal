import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, X, Camera, Check, Edit, Moon, Sun, User, Eye } from 'lucide-react';
import { mediaService } from '../../../../api/services/media';
import moment from 'moment';

interface Avatar {
  id: string;
  name: string;
  url: string; // Changed from imageUrl to url for consistency with mediaService
  title?: string; // Optional title for display purposes
  imageUrl: string;
  createdAt: string;
}

const AvatarsPage: React.FC = () => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');

  const [newAvatar, setNewAvatar] = useState({
    name: '',
    imageUrl: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

  const mockUser = {
    name: "John Doe",
    status: "Online",
    balance: "$5,280.75",
    lastTransaction: "Coffee Shop • $4.50",
    lastActive: "2 min ago"
  };

  const mockMessages = [
    { id: 1, content: "Good morning! How can I help with your finances today?", time: "9:32 AM", isUser: false },
    { id: 2, content: "I'd like to check my current balance", time: "9:33 AM", isUser: true },
    { id: 3, content: "Your current balance is $5,280.75. Would you like to see your recent transactions?", time: "9:33 AM", isUser: false }
  ];

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
      imageUrl: ''
    });
    setSelectedFile(null);
    setUploadStatus('idle');

    document.body.style.overflow = 'hidden';
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const openPreviewModal = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
    setIsPreviewModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setSelectedAvatar(null);
    document.body.style.overflow = 'auto';
  };

  const togglePreviewMode = () => {
    setPreviewMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const handleNewAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAvatar({
      ...newAvatar,
      [name]: value
    });
  };

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
      const formData = new FormData();
      formData.append('title', newAvatar.name);
      formData.append('media', selectedFile);
      formData.append('type', 'avatar');

      // Send the request
      const response = await mediaService.createMedia(formData);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Avatars</h1>
          <p className="text-gray-500 max-w-xl">Personalize user identities with custom profile images</p>
        </div>

        <div className="mt-6 md:mt-0">
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-6 py-2.5 text-[14px] bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors text-sm font-medium shadow-sm hover:shadow"
          >
            <Plus size={18} className="mr-2" />
            Add Avatar
          </button>
        </div>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search avatars..."
          className="w-full md:w-[350px] pl-14 pr-5 py-3 bg-white rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-gray-100 shadow-sm transition-all duration-200"
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
      ) : avatars.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {avatars.map((avatar, index) => (
            <div
              key={avatar.id}
              className={`group bg-white border border-gray-100 rounded-3xl p-6 transition-all hover:border-primary-100 hover:shadow-lg ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: `${index * 50}ms` }}
              onClick={() => openPreviewModal(avatar)}
            >
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 overflow-hidden rounded-full bg-gray-50 border-4 border-white shadow-sm">
                    <img
                      src={avatar.url}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute -bottom-2 -right-2 flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openPreviewModal(avatar);
                      }}
                      className="p-2 rounded-full bg-white text-gray-400 border border-gray-100 shadow-sm opacity-0 group-hover:opacity-100 hover:text-primary-500 transition-all"
                      title="Preview avatar"
                    >
                      <Eye size={14} />
                    </button>

                    <button
                      onClick={(e) => handleDelete(avatar.id, e)}
                      className="p-2 rounded-full bg-white text-gray-400 border border-gray-100 shadow-sm opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                      title="Delete avatar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-medium text-gray-800 text-center mb-1 truncate max-w-full">
                  {avatar.title}
                </h3>

                <p className="text-xs text-gray-400 text-center">
                  {moment(avatar.createdAt).format('MMM D, YYYY')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-3xl py-16 px-6 text-center">
          <div className="inline-flex p-5 bg-white rounded-full mb-6 shadow-md">
            <Search size={24} className="text-gray-300" />
          </div>
          <p className="text-xl text-gray-500 font-medium">No avatars found</p>
          <p className="text-gray-400 mt-2 mb-6">Try a different search term or add a new avatar</p>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-primary-500 text-white rounded-full inline-flex items-center gap-2 hover:bg-primary-600 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Add Avatar</span>
          </button>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeAddModal}></div>

          <div
            className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <User size={20} className="mr-3 text-primary-500" />
                New Avatar
              </h2>
              <button
                onClick={closeAddModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left column: Avatar upload */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="w-36 h-36 overflow-hidden rounded-full bg-gray-50 border-4 border-white shadow-sm">
                      <img
                        src={newAvatar.url}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {uploadStatus === 'success' && (
                      <div className="absolute -right-2 -bottom-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
                        <Check size={16} />
                      </div>
                    )}
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
                          <Edit size={16} />
                          <span>Change Image</span>
                        </>
                      ) : (
                        <>
                          <Camera size={16} />
                          <span>Choose Image</span>
                        </>
                      )}
                    </label>

                    <div className="mt-2 text-xs text-center text-gray-500">
                      Recommended: Square image, at least 200×200px
                    </div>
                  </div>
                </div>

                {/* Right column: Avatar details */}
                <div>
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-500 mb-2">
                      Avatar Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newAvatar.name}
                      onChange={handleNewAvatarChange}
                      className="w-full px-4 py-3 bg-white rounded-xl text-gray-800 focus:outline-none border-2 border-gray-100 focus:border-primary-500 transition-all"
                      placeholder="Enter avatar name"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Preview
                    </label>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-50 border-2 border-white">
                          <img
                            src={newAvatar.url}
                            alt="Avatar preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {newAvatar.name || "Avatar Name"}
                          </p>
                          <p className="text-xs text-gray-500">Just now</p>
                        </div>
                      </div>
                      <div className="bg-primary-500 text-white px-4 py-3 rounded-2xl rounded-tl-none text-sm">
                        Hello! This is how your avatar will appear in chat.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddAvatar}
                disabled={!newAvatar.name || !selectedFile}
                className={`w-full py-3 rounded-xl text-white font-medium transition-colors ${newAvatar.name && selectedFile
                    ? 'bg-primary-500 hover:bg-primary-600 shadow-sm'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                Save Avatar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewModalOpen && selectedAvatar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closePreviewModal}></div>

          <div
            className={`relative ${previewMode === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-3xl max-w-4xl w-full shadow-2xl transition-colors duration-300`}
            onClick={e => e.stopPropagation()}
          >
            <div className={`flex justify-between items-center p-6 border-b ${previewMode === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
              <h2 className={`text-xl font-semibold ${previewMode === 'dark' ? 'text-white' : 'text-gray-800'} flex items-center`}>
                <User size={20} className="mr-3 text-primary-500" />
                {selectedAvatar.title}
              </h2>

              <div className="flex items-center space-x-3">
                {/* Theme toggle */}
                <button
                  onClick={togglePreviewMode}
                  className={`p-2 rounded-lg ${previewMode === 'dark' ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'} transition-colors`}
                  title={`Switch to ${previewMode === 'light' ? 'dark' : 'light'} mode`}
                >
                  {previewMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {/* Close button */}
                <button
                  onClick={closePreviewModal}
                  className={`p-2 rounded-lg ${previewMode === 'dark' ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'} transition-colors`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left column - Profile view */}
                <div className={`${previewMode === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl p-6 transition-colors duration-300`}>
                  <h3 className={`text-lg font-medium mb-6 ${previewMode === 'dark' ? 'text-white' : 'text-gray-800'}`}>Profile View</h3>

                  <div className={`${previewMode === 'dark' ? 'bg-gray-900/70' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        <div className="w-32 h-32 overflow-hidden rounded-full bg-gray-50 border-4 border-white shadow-sm">
                          <img
                            src={selectedAvatar.url}
                            alt={selectedAvatar.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 ${previewMode === 'dark' ? 'border-gray-900' : 'border-white'} bg-green-500`}></div>
                      </div>

                      <h4 className={`text-xl font-semibold mb-1 ${previewMode === 'dark' ? 'text-white' : 'text-gray-800'}`}>{mockUser.name}</h4>
                      <p className={`text-sm ${previewMode === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-4`}>{mockUser.status}</p>

                      <div className={`w-full p-4 rounded-lg ${previewMode === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} mb-4`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-sm ${previewMode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Balance</span>
                          <span className={`font-medium ${previewMode === 'dark' ? 'text-white' : 'text-gray-800'}`}>{mockUser.balance}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${previewMode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Last Transaction</span>
                          <span className={`text-sm ${previewMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{mockUser.lastTransaction}</span>
                        </div>
                      </div>

                      <button className="w-full py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
                        View Account
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right column - Chat view */}
                <div className={`${previewMode === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl p-6 transition-colors duration-300`}>
                  <h3 className={`text-lg font-medium mb-6 ${previewMode === 'dark' ? 'text-white' : 'text-gray-800'}`}>Chat View</h3>

                  <div className={`${previewMode === 'dark' ? 'bg-gray-900/70' : 'bg-white'} rounded-xl shadow-sm flex flex-col h-[400px]`}>
                    {/* Chat header */}
                    <div className={`flex items-center p-4 border-b ${previewMode === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
                      <div className="flex items-center flex-1">
                        <div className="relative mr-3">
                          <div className="w-10 h-10 overflow-hidden rounded-full">
                            <img
                              src={selectedAvatar.url}
                              alt={selectedAvatar.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border ${previewMode === 'dark' ? 'border-gray-900' : 'border-white'} bg-green-500`}></div>
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${previewMode === 'dark' ? 'text-white' : 'text-gray-800'}`}>{mockUser.name}</p>
                          <p className={`text-xs ${previewMode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{mockUser.lastActive}</p>
                        </div>
                      </div>
                      <button className={`p-2 rounded-full ${previewMode === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="currentColor" />
                        </svg>
                      </button>
                    </div>

                    {/* Chat messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                      {mockMessages.map(message => (
                        <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                          {!message.isUser && (
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 self-end">
                              <img
                                src="/api/placeholder/100/100"
                                alt="Assistant"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div className={`max-w-[240px] p-3 rounded-2xl ${message.isUser
                                ? `${previewMode === 'dark' ? 'bg-primary-600' : 'bg-primary-500'} text-white rounded-br-none`
                                : previewMode === 'dark'
                                  ? 'bg-gray-800 text-white rounded-bl-none'
                                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
                              }`}>
                              {message.content}
                            </div>
                            <div className={`text-xs mt-1 ${previewMode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                              {message.time}
                            </div>
                          </div>
                          {message.isUser && (
                            <div className="w-8 h-8 rounded-full overflow-hidden ml-2 flex-shrink-0 self-end">
                              <img
                                src={selectedAvatar.url}
                                alt={selectedAvatar.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Chat input */}
                    <div className="p-4 border-t ${previewMode === 'dark' ? 'border-gray-800' : 'border-gray-100'}">
                      <div className={`flex items-center rounded-full ${previewMode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} px-4 py-2`}>
                        <input
                          type="text"
                          placeholder="Type a message..."
                          disabled
                          className={`flex-1 bg-transparent border-0 focus:ring-0 ${previewMode === 'dark' ? 'text-white placeholder:text-gray-500' : 'text-gray-800 placeholder:text-gray-400'}`}
                        />
                        <button className="p-2 rounded-full bg-primary-500 text-white">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`flex items-center justify-between p-6 border-t ${previewMode === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
              <div className={`text-sm ${previewMode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className="flex items-center">
                  <svg className="mr-1.5" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 17H13V11H11V17ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 9H13V7H11V9Z" fill="currentColor" />
                  </svg>
                  Toggle between light and dark mode to preview appearance
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={closePreviewModal}
                  className={`px-6 py-2 rounded-xl ${previewMode === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
                >
                  Close
                </button>
                <button
                  className="px-6 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-sm"
                >
                  Use Avatar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarsPage;
