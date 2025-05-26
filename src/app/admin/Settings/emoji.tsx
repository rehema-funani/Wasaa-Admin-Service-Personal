import React, { useState } from 'react';
import { Search, PlusCircle, Trash2, Edit, Save, Check, SlidersHorizontal, Info, X, Upload, ChevronDown, ChevronRight, Star, Clock, Smile, Heart, Flag, Palette } from 'lucide-react';
import { Modal } from '../../../components/common/Modal';

type EmojiCategory = 'standard' | 'custom' | 'animated' | 'stickers';

interface Emoji {
    id: string;
    name: string;
    value: string;
    category: EmojiCategory;
    type: 'unicode' | 'image' | 'animated';
    tags: string[];
    isFeatured: boolean;
    status: 'active' | 'inactive';
    usageCount: number;
    lastUpdated: string;
}

interface CategoryData {
    id: string;
    type: EmojiCategory;
    name: string;
    description: string;
    icon: React.ReactNode;
    emojis: Emoji[];
    status: 'active' | 'inactive';
}

// Define modal types
type ModalType = 'add' | 'edit' | 'delete' | 'addCategory' | 'editCategory' | 'deleteCategory' | null;

const page = () => {
    // Initial emoji categories data
    const [categories, setCategories] = useState<CategoryData[]>([
        {
            id: '1',
            type: 'standard',
            name: 'Smileys & Emotions',
            description: 'Standard emoji faces and emotions',
            icon: <Smile size={16} />,
            emojis: [
                {
                    id: '1-1',
                    name: 'Smiling Face',
                    value: '😊',
                    category: 'standard',
                    type: 'unicode',
                    tags: ['smile', 'happy', 'friendly'],
                    isFeatured: true,
                    status: 'active',
                    usageCount: 1893,
                    lastUpdated: '2025-05-01'
                },
                {
                    id: '1-2',
                    name: 'Grinning Face',
                    value: '😀',
                    category: 'standard',
                    type: 'unicode',
                    tags: ['grin', 'happy', 'smile'],
                    isFeatured: true,
                    status: 'active',
                    usageCount: 1342,
                    lastUpdated: '2025-05-01'
                },
                {
                    id: '1-3',
                    name: 'Face with Tears of Joy',
                    value: '😂',
                    category: 'standard',
                    type: 'unicode',
                    tags: ['laugh', 'joy', 'crying'],
                    isFeatured: true,
                    status: 'active',
                    usageCount: 2541,
                    lastUpdated: '2025-05-01'
                },
                {
                    id: '1-4',
                    name: 'Heart Eyes',
                    value: '😍',
                    category: 'standard',
                    type: 'unicode',
                    tags: ['love', 'heart', 'eyes'],
                    isFeatured: false,
                    status: 'active',
                    usageCount: 1245,
                    lastUpdated: '2025-05-01'
                },
                {
                    id: '1-5',
                    name: 'Thinking Face',
                    value: '🤔',
                    category: 'standard',
                    type: 'unicode',
                    tags: ['thinking', 'thoughtful', 'consider'],
                    isFeatured: false,
                    status: 'active',
                    usageCount: 980,
                    lastUpdated: '2025-05-01'
                }
            ],
            status: 'active'
        },
        {
            id: '2',
            type: 'standard',
            name: 'Hearts & Love',
            description: 'Hearts and love-related emojis',
            icon: <Heart size={16} />,
            emojis: [
                {
                    id: '2-1',
                    name: 'Red Heart',
                    value: '❤️',
                    category: 'standard',
                    type: 'unicode',
                    tags: ['love', 'heart', 'red'],
                    isFeatured: true,
                    status: 'active',
                    usageCount: 2341,
                    lastUpdated: '2025-05-01'
                },
                {
                    id: '2-2',
                    name: 'primary Heart',
                    value: '💙',
                    category: 'standard',
                    type: 'unicode',
                    tags: ['heart', 'primary', 'love'],
                    isFeatured: false,
                    status: 'active',
                    usageCount: 789,
                    lastUpdated: '2025-05-01'
                },
                {
                    id: '2-3',
                    name: 'Purple Heart',
                    value: '💜',
                    category: 'standard',
                    type: 'unicode',
                    tags: ['heart', 'purple', 'love'],
                    isFeatured: false,
                    status: 'active',
                    usageCount: 654,
                    lastUpdated: '2025-05-01'
                }
            ],
            status: 'active'
        },
        {
            id: '3',
            type: 'custom',
            name: 'Company Emojis',
            description: 'Custom branded emojis for our platform',
            icon: <Flag size={16} />,
            emojis: [
                {
                    id: '3-1',
                    name: 'Company Logo',
                    value: '/images/emojis/company-logo.png',
                    category: 'custom',
                    type: 'image',
                    tags: ['logo', 'brand', 'company'],
                    isFeatured: true,
                    status: 'active',
                    usageCount: 421,
                    lastUpdated: '2025-05-05'
                },
                {
                    id: '3-2',
                    name: 'Money Transfer',
                    value: '/images/emojis/money-transfer.png',
                    category: 'custom',
                    type: 'image',
                    tags: ['money', 'transfer', 'payment'],
                    isFeatured: true,
                    status: 'active',
                    usageCount: 356,
                    lastUpdated: '2025-05-05'
                }
            ],
            status: 'active'
        },
        {
            id: '4',
            type: 'animated',
            name: 'Animated Emojis',
            description: 'Animated emoji reactions',
            icon: <Clock size={16} />,
            emojis: [
                {
                    id: '4-1',
                    name: 'Party Popper',
                    value: '/images/emojis/animated/party-popper.gif',
                    category: 'animated',
                    type: 'animated',
                    tags: ['party', 'celebration', 'congrats'],
                    isFeatured: true,
                    status: 'active',
                    usageCount: 678,
                    lastUpdated: '2025-05-02'
                },
                {
                    id: '4-2',
                    name: 'Clapping Hands',
                    value: '/images/emojis/animated/clapping.gif',
                    category: 'animated',
                    type: 'animated',
                    tags: ['clap', 'applause', 'congrats'],
                    isFeatured: false,
                    status: 'active',
                    usageCount: 542,
                    lastUpdated: '2025-05-02'
                }
            ],
            status: 'active'
        },
        {
            id: '5',
            type: 'stickers',
            name: 'Stickers',
            description: 'Larger sticker packs',
            icon: <Palette size={16} />,
            emojis: [
                {
                    id: '5-1',
                    name: 'Thank You',
                    value: '/images/emojis/stickers/thank-you.png',
                    category: 'stickers',
                    type: 'image',
                    tags: ['thanks', 'gratitude', 'appreciation'],
                    isFeatured: true,
                    status: 'active',
                    usageCount: 321,
                    lastUpdated: '2025-05-03'
                },
                {
                    id: '5-2',
                    name: 'Congratulations',
                    value: '/images/emojis/stickers/congrats.png',
                    category: 'stickers',
                    type: 'image',
                    tags: ['congrats', 'celebration', 'achievement'],
                    isFeatured: false,
                    status: 'active',
                    usageCount: 289,
                    lastUpdated: '2025-05-03'
                }
            ],
            status: 'active'
        }
    ]);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [categoryFilter, setCategoryFilter] = useState<'all' | EmojiCategory>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [currentCategory, setCurrentCategory] = useState<CategoryData | null>(null);
    const [currentEmoji, setCurrentEmoji] = useState<Emoji | null>(null);

    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const [emojiFormData, setEmojiFormData] = useState<Omit<Emoji, 'id' | 'lastUpdated' | 'usageCount'> & { tags: string }>({
        name: '',
        value: '',
        category: 'standard',
        type: 'unicode',
        tags: '',
        isFeatured: false,
        status: 'active'
    });

    const [categoryFormData, setcategoryFormData] = useState<Omit<CategoryData, 'id' | 'emojis' | 'icon'>>({
        type: 'standard',
        name: '',
        description: '',
        status: 'active'
    });

    // Get all emojis across all categories
    const getAllEmojis = () => {
        return categories.flatMap(category => category.emojis);
    };

    // Filter emojis based on search query, category and status
    const filterEmojis = (emojis: Emoji[]) => {
        return emojis.filter(emoji => {
            const matchesSearch = emoji.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emoji.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = categoryFilter === 'all' || emoji.category === categoryFilter;
            const matchesStatus = statusFilter === 'all' || emoji.status === statusFilter;
            return matchesSearch && matchesCategory && matchesStatus;
        });
    };

    // Filtered categories (only showing categories that have matching emojis)
    const filteredCategories = categories
        .map(category => ({
            ...category,
            emojis: filterEmojis(category.emojis)
        }))
        .filter(category => category.emojis.length > 0 || searchQuery === '');

    // Toggle row expansion
    const toggleRowExpansion = (id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Handler for saving changes
    const handleSave = () => {
        // Here you would typically save to an API
        console.log('Saving emoji categories:', categories);

        // Show success message
        setSuccessMessage('Emoji configurations updated successfully');

        // Hide message after 3 seconds
        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
    };

    // Open modal for adding new emoji
    const openAddEmojiModal = (category: CategoryData) => {
        setCurrentCategory(category);
        setEmojiFormData({
            name: '',
            value: '',
            category: category.type,
            type: category.type === 'animated' ? 'animated' : (category.type === 'standard' ? 'unicode' : 'image'),
            tags: '',
            isFeatured: false,
            status: 'active'
        });
        setModalType('add');
        setIsModalOpen(true);
    };

    // Open modal for editing emoji
    const openEditEmojiModal = (category: CategoryData, emoji: Emoji) => {
        setCurrentCategory(category);
        setCurrentEmoji(emoji);
        setEmojiFormData({
            name: emoji.name,
            value: emoji.value,
            category: emoji.category,
            type: emoji.type,
            tags: emoji.tags.join(', '),
            isFeatured: emoji.isFeatured,
            status: emoji.status
        });
        setModalType('edit');
        setIsModalOpen(true);
    };

    // Open modal for deleting emoji
    const openDeleteEmojiModal = (category: CategoryData, emoji: Emoji) => {
        setCurrentCategory(category);
        setCurrentEmoji(emoji);
        setModalType('delete');
        setIsModalOpen(true);
    };

    // Open modal for adding new category
    const openAddCategoryModal = () => {
        setcategoryFormData({
            type: 'standard',
            name: '',
            description: '',
            status: 'active'
        });
        setModalType('addCategory');
        setIsModalOpen(true);
    };

    // Open modal for editing category
    const openEditCategoryModal = (category: CategoryData) => {
        setCurrentCategory(category);
        setcategoryFormData({
            type: category.type,
            name: category.name,
            description: category.description,
            status: category.status
        });
        setModalType('editCategory');
        setIsModalOpen(true);
    };

    // Open modal for deleting category
    const openDeleteCategoryModal = (category: CategoryData) => {
        setCurrentCategory(category);
        setModalType('deleteCategory');
        setIsModalOpen(true);
    };

    // Handle emoji form changes
    const handleEmojiFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
        setEmojiFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle category form changes
    const handleCategoryFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setcategoryFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle category type change
    const handleCategoryTypeChange = (type: EmojiCategory) => {
        setcategoryFormData(prev => ({
            ...prev,
            type
        }));
    };

    // Handle status change
    const handleStatusChange = (status: 'active' | 'inactive') => {
        setcategoryFormData(prev => ({
            ...prev,
            status
        }));
    };

    // Handle emoji status change
    const handleEmojiStatusChange = (status: 'active' | 'inactive') => {
        setEmojiFormData(prev => ({
            ...prev,
            status
        }));
    };

    // Handle emoji featured status change
    const handleEmojiFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmojiFormData(prev => ({
            ...prev,
            isFeatured: e.target.checked
        }));
    };

    // Handle emoji form submission
    const handleEmojiFormSubmit = (e: React.MouseEvent) => {
        e.preventDefault();

        // Parse tags from string to array
        const tagsArray = emojiFormData.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        if (modalType === 'add' && currentCategory) {
            // Add new emoji
            const newEmoji: Emoji = {
                id: `${currentCategory.id}-${currentCategory.emojis.length + 1}`,
                name: emojiFormData.name,
                value: emojiFormData.value,
                category: emojiFormData.category,
                type: emojiFormData.type,
                tags: tagsArray,
                isFeatured: emojiFormData.isFeatured,
                status: emojiFormData.status,
                usageCount: 0,
                lastUpdated: new Date().toISOString().split('T')[0]
            };

            // Update categories
            setCategories(categories.map(category =>
                category.id === currentCategory.id
                    ? { ...category, emojis: [...category.emojis, newEmoji] }
                    : category
            ));

            setSuccessMessage('Emoji added successfully');
        } else if (modalType === 'edit' && currentCategory && currentEmoji) {
            // Update existing emoji
            setCategories(categories.map(category =>
                category.id === currentCategory.id
                    ? {
                        ...category,
                        emojis: category.emojis.map(emoji =>
                            emoji.id === currentEmoji.id
                                ? {
                                    ...emoji,
                                    name: emojiFormData.name,
                                    value: emojiFormData.value,
                                    category: emojiFormData.category,
                                    type: emojiFormData.type,
                                    tags: tagsArray,
                                    isFeatured: emojiFormData.isFeatured,
                                    status: emojiFormData.status,
                                    lastUpdated: new Date().toISOString().split('T')[0]
                                }
                                : emoji
                        )
                    }
                    : category
            ));

            setSuccessMessage('Emoji updated successfully');
        }

        // Close modal and reset state
        setIsModalOpen(false);
        setModalType(null);
        setCurrentCategory(null);
        setCurrentEmoji(null);

        // Hide message after 3 seconds
        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
    };

    // Handle category form submission
    const handleCategoryFormSubmit = (e: React.MouseEvent) => {
        e.preventDefault();

        if (modalType === 'addCategory') {
            // Add new category
            const newCategory: CategoryData = {
                id: `${categories.length + 1}`,
                type: categoryFormData.type,
                name: categoryFormData.name,
                description: categoryFormData.description,
                icon: getCategoryIcon(categoryFormData.type),
                emojis: [],
                status: categoryFormData.status
            };

            setCategories([...categories, newCategory]);
            setSuccessMessage('Category added successfully');
        } else if (modalType === 'editCategory' && currentCategory) {
            // Update existing category
            setCategories(categories.map(category =>
                category.id === currentCategory.id
                    ? {
                        ...category,
                        type: categoryFormData.type,
                        name: categoryFormData.name,
                        description: categoryFormData.description,
                        icon: getCategoryIcon(categoryFormData.type),
                        status: categoryFormData.status
                    }
                    : category
            ));

            setSuccessMessage('Category updated successfully');
        }

        // Close modal and reset state
        setIsModalOpen(false);
        setModalType(null);
        setCurrentCategory(null);

        // Hide message after 3 seconds
        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
    };

    // Handle emoji deletion
    const handleDeleteEmoji = () => {
        if (currentCategory && currentEmoji) {
            // Remove emoji from category
            setCategories(categories.map(category =>
                category.id === currentCategory.id
                    ? {
                        ...category,
                        emojis: category.emojis.filter(emoji => emoji.id !== currentEmoji.id)
                    }
                    : category
            ));

            setSuccessMessage('Emoji deleted successfully');

            // Close modal and reset state
            setIsModalOpen(false);
            setModalType(null);
            setCurrentCategory(null);
            setCurrentEmoji(null);

            // Hide message after 3 seconds
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        }
    };

    // Handle category deletion
    const handleDeleteCategory = () => {
        if (currentCategory) {
            // Remove category
            setCategories(categories.filter(category => category.id !== currentCategory.id));

            setSuccessMessage('Category deleted successfully');

            // Close modal and reset state
            setIsModalOpen(false);
            setModalType(null);
            setCurrentCategory(null);

            // Hide message after 3 seconds
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        }
    };

    // Get icon for category type
    const getCategoryIcon = (type: EmojiCategory) => {
        switch (type) {
            case 'standard':
                return <Smile size={16} />;
            case 'custom':
                return <Flag size={16} />;
            case 'animated':
                return <Clock size={16} />;
            case 'stickers':
                return <Palette size={16} />;
            default:
                return <Smile size={16} />;
        }
    };

    // Generate modal title based on modalType
    const getModalTitle = () => {
        switch (modalType) {
            case 'add':
                return `Add New Emoji to ${currentCategory?.name}`;
            case 'edit':
                return `Edit Emoji: ${currentEmoji?.name}`;
            case 'delete':
                return 'Delete Emoji';
            case 'addCategory':
                return 'Add New Category';
            case 'editCategory':
                return `Edit Category: ${currentCategory?.name}`;
            case 'deleteCategory':
                return 'Delete Category';
            default:
                return '';
        }
    };

    // Render emoji based on type
    const renderEmoji = (emoji: Emoji) => {
        switch (emoji.type) {
            case 'unicode':
                return (
                    <div className="text-2xl w-8 h-8 flex items-center justify-center">
                        {emoji.value}
                    </div>
                );
            case 'image':
                return (
                    <div className="w-8 h-8 flex items-center justify-center">
                        <img src={emoji.value} alt={emoji.name} className="max-w-full max-h-full" />
                    </div>
                );
            case 'animated':
                return (
                    <div className="w-8 h-8 flex items-center justify-center">
                        <img src={emoji.value} alt={emoji.name} className="max-w-full max-h-full" />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#FCFCFD] p-4 md:p-6 font-['Inter',sans-serif]">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                        <div>
                            <h1 className="text-2xl font-medium text-gray-800 tracking-tight">Emoji Management</h1>
                            <p className="text-gray-500 text-sm mt-1">Configure and organize emojis for your chat platform</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-500 text-white rounded-xl shadow-sm hover:bg-primary-600 transition-all text-sm"
                            >
                                <Save size={16} />
                                <span>Save Changes</span>
                            </button>

                            <button
                                onClick={openAddCategoryModal}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm hover:bg-gray-50 transition-all text-sm"
                            >
                                <PlusCircle size={16} />
                                <span>New Category</span>
                            </button>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center mb-5">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search emojis by name or tag..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-3 py-2 w-full bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-0.5">
                                <button
                                    onClick={() => setCategoryFilter('all')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${categoryFilter === 'all' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setCategoryFilter('standard')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${categoryFilter === 'standard' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    Standard
                                </button>
                                <button
                                    onClick={() => setCategoryFilter('custom')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${categoryFilter === 'custom' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    Custom
                                </button>
                                <button
                                    onClick={() => setCategoryFilter('animated')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${categoryFilter === 'animated' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    Animated
                                </button>
                            </div>

                            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-0.5">
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${statusFilter === 'all' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setStatusFilter('active')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${statusFilter === 'active' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setStatusFilter('inactive')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${statusFilter === 'inactive' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    Inactive
                                </button>
                            </div>

                            <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
                                <SlidersHorizontal size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-5 flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100 text-green-700">
                        <Check size={16} className="flex-shrink-0" />
                        <span className="text-sm">{successMessage}</span>
                    </div>
                )}

                {/* Emoji Categories */}
                <div className="space-y-6">
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map(category => (
                            <div key={category.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 backdrop-blur-sm bg-white/90">
                                <div
                                    className={`px-6 py-4 flex items-center justify-between cursor-pointer ${expandedRows[category.id] ? 'bg-gray-50/80 border-b border-gray-100' : ''
                                        }`}
                                    onClick={() => toggleRowExpansion(category.id)}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-lg ${category.type === 'standard' ? 'bg-primary-50 text-primary-500' :
                                            category.type === 'custom' ? 'bg-purple-50 text-purple-500' :
                                                category.type === 'animated' ? 'bg-green-50 text-green-500' :
                                                    'bg-amber-50 text-amber-500'
                                            }`}>
                                            {category.icon}
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-800">{category.name}</h3>
                                            <p className="text-xs text-gray-500">{category.description}</p>
                                        </div>

                                        <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                            {category.emojis.length} emojis
                                        </span>

                                        {category.status === 'inactive' && (
                                            <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                                Inactive
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openAddEmojiModal(category);
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-primary-500 rounded-lg hover:bg-primary-50"
                                            title="Add Emoji"
                                        >
                                            <PlusCircle size={16} />
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openEditCategoryModal(category);
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-primary-500 rounded-lg hover:bg-primary-50"
                                            title="Edit Category"
                                        >
                                            <Edit size={16} />
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openDeleteCategoryModal(category);
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                                            title="Delete Category"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        {expandedRows[category.id] ? (
                                            <ChevronDown size={16} className="text-gray-400 ml-1" />
                                        ) : (
                                            <ChevronRight size={16} className="text-gray-400 ml-1" />
                                        )}
                                    </div>
                                </div>

                                {expandedRows[category.id] && (
                                    <div className="px-6 py-4">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                            {category.emojis.map(emoji => (
                                                <div
                                                    key={emoji.id}
                                                    className={`p-3 bg-gray-50 rounded-xl border border-gray-100 transition-all hover:shadow-sm ${emoji.status === 'inactive' ? 'opacity-60' : ''
                                                        }`}
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <div className="mb-2 relative">
                                                            {renderEmoji(emoji)}

                                                            {emoji.isFeatured && (
                                                                <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full w-3 h-3 border border-white">
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="text-center">
                                                            <p className="text-xs font-medium text-gray-700 truncate max-w-full">
                                                                {emoji.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                {emoji.usageCount.toLocaleString()} uses
                                                            </p>
                                                        </div>

                                                        <div className="mt-2 pt-2 border-t border-gray-200 w-full flex justify-center gap-1">
                                                            <button
                                                                onClick={() => openEditEmojiModal(category, emoji)}
                                                                className="p-1 text-gray-400 hover:text-primary-500 rounded-md hover:bg-primary-50"
                                                                title="Edit"
                                                            >
                                                                <Edit size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => openDeleteEmojiModal(category, emoji)}
                                                                className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <div
                                                className="p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-100/50 transition-all"
                                                onClick={() => openAddEmojiModal(category)}
                                            >
                                                <div className="flex flex-col items-center text-gray-400">
                                                    <PlusCircle size={20} className="mb-1" />
                                                    <span className="text-xs">Add Emoji</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                            <p className="text-gray-500">No emojis found matching your criteria.</p>
                        </div>
                    )}
                </div>

                {/* Info Card */}
                <div className="mt-6 bg-primary-50/70 rounded-xl p-3 border border-primary-100 backdrop-blur-sm">
                    <div className="flex items-start gap-2">
                        <Info size={16} className="text-primary-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-primary-700">About Emoji Management</h3>
                            <p className="text-primary-600 text-xs mt-0.5 leading-relaxed">
                                Manage emoji categories and individual emojis for your chat platform. You can add standard unicode emojis, custom image-based emojis, and animated emojis.
                                Featured emojis (marked with an orange dot) will appear in the quick-selection menu for users.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalType(null);
                    setCurrentCategory(null);
                    setCurrentEmoji(null);
                }}
                title={getModalTitle()}
                size={['delete', 'deleteCategory'].includes(modalType || '') ? 'sm' : 'md'}
            >
                {modalType === 'delete' ? (
                    <div className="space-y-3">
                        <p className="text-gray-700 text-sm">
                            Are you sure you want to delete the emoji <span className="font-semibold">{currentEmoji?.name}</span>?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2 mt-5">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setModalType(null);
                                    setCurrentCategory(null);
                                    setCurrentEmoji(null);
                                }}
                                className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteEmoji}
                                className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ) : modalType === 'deleteCategory' ? (
                    <div className="space-y-3">
                        <p className="text-gray-700 text-sm">
                            Are you sure you want to delete the category <span className="font-semibold">{currentCategory?.name}</span>?
                            This will also delete all emojis in this category. This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2 mt-5">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setModalType(null);
                                    setCurrentCategory(null);
                                }}
                                className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteCategory}
                                className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ) : modalType === 'addCategory' || modalType === 'editCategory' ? (
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Category Type
                                </label>
                                <div className="flex flex-wrap items-center gap-1 bg-gray-50 p-0.5 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => handleCategoryTypeChange('standard')}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${categoryFormData.type === 'standard'
                                            ? 'bg-white shadow-sm text-gray-800 font-medium'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        <Smile size={12} />
                                        <span>Standard</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleCategoryTypeChange('custom')}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${categoryFormData.type === 'custom'
                                            ? 'bg-white shadow-sm text-gray-800 font-medium'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        <Flag size={12} />
                                        <span>Custom</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleCategoryTypeChange('animated')}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${categoryFormData.type === 'animated'
                                            ? 'bg-white shadow-sm text-gray-800 font-medium'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        <Clock size={12} />
                                        <span>Animated</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleCategoryTypeChange('stickers')}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${categoryFormData.type === 'stickers'
                                            ? 'bg-white shadow-sm text-gray-800 font-medium'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        <Palette size={12} />
                                        <span>Stickers</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={categoryFormData.name}
                                    onChange={handleCategoryFormChange}
                                    required
                                    className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-400 text-gray-800 text-sm"
                                    placeholder="e.g., Smileys & Emotions"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={categoryFormData.description}
                                    onChange={handleCategoryFormChange}
                                    rows={2}
                                    className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-400 text-gray-800 text-sm"
                                    placeholder="Describe the category..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-lg w-fit">
                                    <button
                                        type="button"
                                        onClick={() => handleStatusChange('active')}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${categoryFormData.status === 'active'
                                            ? 'bg-white shadow-sm text-gray-800 font-medium'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        <span>Active</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleStatusChange('inactive')}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${categoryFormData.status === 'inactive'
                                            ? 'bg-white shadow-sm text-gray-800 font-medium'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        <span>Inactive</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setModalType(null);
                                    setCurrentCategory(null);
                                }}
                                className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleCategoryFormSubmit}
                                className="px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm"
                            >
                                {modalType === 'addCategory' ? 'Add Category' : 'Update Category'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <div>
                                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                                    Emoji Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={emojiFormData.name}
                                    onChange={handleEmojiFormChange}
                                    required
                                    className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-400 text-gray-800 text-sm"
                                    placeholder="e.g., Smiling Face"
                                />
                            </div>

                            <div>
                                <label htmlFor="value" className="block text-xs font-medium text-gray-700 mb-1">
                                    {emojiFormData.type === 'unicode' ? 'Unicode Value' : 'Image URL'}
                                </label>
                                <input
                                    type="text"
                                    id="value"
                                    name="value"
                                    value={emojiFormData.value}
                                    onChange={handleEmojiFormChange}
                                    required
                                    className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-400 text-gray-800 text-sm"
                                    placeholder={emojiFormData.type === 'unicode' ? 'e.g., 😊 or U+1F60A' : 'e.g., /images/emojis/smile.png'}
                                />
                                {emojiFormData.type !== 'unicode' && (
                                    <div className="flex items-center gap-1 mt-2">
                                        <button
                                            type="button"
                                            className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-xs flex items-center gap-1"
                                        >
                                            <Upload size={14} />
                                            <span>Upload Image</span>
                                        </button>
                                        <p className="text-xs text-gray-500">
                                            Recommended size: 64px × 64px
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="tags" className="block text-xs font-medium text-gray-700 mb-1">
                                    Tags (comma separated)
                                </label>
                                <input
                                    type="text"
                                    id="tags"
                                    name="tags"
                                    value={emojiFormData.tags}
                                    onChange={handleEmojiFormChange}
                                    className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-400 text-gray-800 text-sm"
                                    placeholder="e.g., smile, happy, friendly"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={emojiFormData.isFeatured}
                                        onChange={handleEmojiFeaturedChange}
                                        className="rounded text-primary-500 focus:ring-primary-500 h-4 w-4"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Feature in quick selection</span>
                                </label>

                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500">Status:</span>
                                    <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-lg">
                                        <button
                                            type="button"
                                            onClick={() => handleEmojiStatusChange('active')}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${emojiFormData.status === 'active'
                                                ? 'bg-white shadow-sm text-gray-800 font-medium'
                                                : 'text-gray-500'
                                                }`}
                                        >
                                            <span>Active</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleEmojiStatusChange('inactive')}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${emojiFormData.status === 'inactive'
                                                ? 'bg-white shadow-sm text-gray-800 font-medium'
                                                : 'text-gray-500'
                                                }`}
                                        >
                                            <span>Inactive</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setModalType(null);
                                    setCurrentCategory(null);
                                    setCurrentEmoji(null);
                                }}
                                className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleEmojiFormSubmit}
                                className="px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm"
                            >
                                {modalType === 'add' ? 'Add Emoji' : 'Update Emoji'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default page;