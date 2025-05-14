import React, { useState } from 'react';
import { Save, Percent, DollarSign, Info, Check, PlusCircle, Edit, Trash2, ChevronDown, ChevronRight, Search, SlidersHorizontal, Plus, X } from 'lucide-react';
import { Modal } from '../../../../components/common/Modal';

type TariffType = 'flat' | 'percentage';

interface TariffRange {
    id: string;
    min: number;
    max: number | null;
    fee: number;
}

interface Tariff {
    id: string;
    name: string;
    description: string;
    type: TariffType;
    value: number;
    ranges: TariffRange[];
    status: 'active' | 'inactive';
    lastUpdated: string;
}

type ModalType = 'add' | 'edit' | 'delete' | 'addRange' | 'editRange' | 'deleteRange' | null;

const TariffsManagement = () => {
    const [tariffs, setTariffs] = useState<Tariff[]>([
        {
            id: '1',
            name: 'Send Money',
            description: 'Fee charged when sending money to another user',
            type: 'flat',
            value: 0,
            ranges: [
                { id: '1-1', min: 0, max: 300, fee: 0 },
                { id: '1-2', min: 301, max: 1000, fee: 5 },
                { id: '1-3', min: 1001, max: 5000, fee: 15 },
                { id: '1-4', min: 5001, max: 10000, fee: 25 },
                { id: '1-5', min: 10001, max: null, fee: 45 }
            ],
            status: 'active',
            lastUpdated: '2025-05-10'
        },
        {
            id: '2',
            name: 'Withdraw to Bank',
            description: 'Fee charged when withdrawing to a bank account',
            type: 'flat',
            value: 0,
            ranges: [
                { id: '2-1', min: 0, max: 1000, fee: 30 },
                { id: '2-2', min: 1001, max: 5000, fee: 50 },
                { id: '2-3', min: 5001, max: null, fee: 100 }
            ],
            status: 'active',
            lastUpdated: '2025-05-08'
        },
        {
            id: '3',
            name: 'Withdraw to M-Pesa',
            description: 'Fee charged when withdrawing to M-Pesa',
            type: 'flat',
            value: 0,
            ranges: [
                { id: '3-1', min: 0, max: 1000, fee: 25 },
                { id: '3-2', min: 1001, max: 3000, fee: 35 },
                { id: '3-3', min: 3001, max: null, fee: 50 }
            ],
            status: 'active',
            lastUpdated: '2025-05-07'
        },
        {
            id: '4',
            name: 'Transfer Between Accounts',
            description: 'Fee charged when transferring between account balances',
            type: 'percentage',
            value: 0.5,
            ranges: [],
            status: 'active',
            lastUpdated: '2025-05-05'
        },
        {
            id: '5',
            name: 'Gift to User',
            description: 'Fee charged when gifting to another user',
            type: 'percentage',
            value: 1,
            ranges: [],
            status: 'inactive',
            lastUpdated: '2025-04-30'
        }
    ]);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [currentTariff, setCurrentTariff] = useState<Tariff | null>(null);
    const [currentRange, setCurrentRange] = useState<TariffRange | null>(null);
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
    const [formData, setFormData] = useState<Omit<Tariff, 'id' | 'lastUpdated' | 'ranges'> & { ranges: TariffRange[] }>({
        name: '',
        description: '',
        type: 'flat',
        value: 0,
        ranges: [],
        status: 'active'
    });

    const [rangeFormData, setRangeFormData] = useState<Omit<TariffRange, 'id'>>({
        min: 0,
        max: null,
        fee: 0
    });

    const filteredTariffs = tariffs.filter(tariff => {
        const matchesSearch = tariff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tariff.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || tariff.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const toggleRowExpansion = (id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Handler for changing tariff type (flat/percentage)
    const handleTypeChange = (id: string, type: TariffType) => {
        setTariffs(tariffs.map(tariff =>
            tariff.id === id ? {
                ...tariff,
                type,
                // Reset ranges if switching to percentage
                ranges: type === 'percentage' ? [] : tariff.ranges.length ? tariff.ranges : [{ id: `${id}-1`, min: 0, max: null, fee: 0 }]
            } : tariff
        ));
    };

    // Handler for changing tariff value (for percentage type)
    const handleValueChange = (id: string, value: string) => {
        const numValue = parseFloat(value) || 0;
        setTariffs(tariffs.map(tariff =>
            tariff.id === id ? { ...tariff, value: numValue } : tariff
        ));
    };

    // Handler for saving changes
    const handleSave = () => {
        // Here you would typically save to an API
        console.log('Saving tariffs:', tariffs);

        // Show success message
        setSuccessMessage('Tariffs updated successfully');

        // Hide message after 3 seconds
        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
    };

    // Open modal for adding new tariff
    const openAddModal = () => {
        setFormData({
            name: '',
            description: '',
            type: 'flat',
            value: 0,
            ranges: [{ id: `new-1`, min: 0, max: null, fee: 0 }],
            status: 'active'
        });
        setModalType('add');
        setIsModalOpen(true);
    };

    // Open modal for editing tariff
    const openEditModal = (tariff: Tariff) => {
        setCurrentTariff(tariff);
        setFormData({
            name: tariff.name,
            description: tariff.description,
            type: tariff.type,
            value: tariff.value,
            ranges: [...tariff.ranges],
            status: tariff.status
        });
        setModalType('edit');
        setIsModalOpen(true);
    };

    // Open modal for deleting tariff
    const openDeleteModal = (tariff: Tariff) => {
        setCurrentTariff(tariff);
        setModalType('delete');
        setIsModalOpen(true);
    };

    // Open modal for adding range to a tariff
    const openAddRangeModal = (tariff: Tariff) => {
        setCurrentTariff(tariff);

        // Find highest range to suggest a new min value
        const highestRange = [...tariff.ranges].sort((a, b) => (b.max || Infinity) - (a.max || Infinity))[0];
        const suggestedMin = highestRange && highestRange.max !== null ? highestRange.max + 1 : 0;

        setRangeFormData({
            min: suggestedMin,
            max: null,
            fee: 0
        });

        setModalType('addRange');
        setIsModalOpen(true);
    };

    const openEditRangeModal = (tariff: Tariff, range: TariffRange) => {
        setCurrentTariff(tariff);
        setCurrentRange(range);
        setRangeFormData({
            min: range.min,
            max: range.max,
            fee: range.fee
        });
        setModalType('editRange');
        setIsModalOpen(true);
    };

    const openDeleteRangeModal = (tariff: Tariff, range: TariffRange) => {
        setCurrentTariff(tariff);
        setCurrentRange(range);
        setModalType('deleteRange');
        setIsModalOpen(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRangeFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Handle null for max value
        if (name === 'max' && (value === '' || value.toLowerCase() === 'null')) {
            setRangeFormData(prev => ({
                ...prev,
                max: null
            }));
            return;
        }

        setRangeFormData(prev => ({
            ...prev,
            [name]: name === 'fee' || name === 'min' || name === 'max' ? parseFloat(value) || 0 : value
        }));
    };

    // Handle form type change
    const handleFormTypeChange = (type: TariffType) => {
        setFormData(prev => ({
            ...prev,
            type,
            // Reset ranges if switching to percentage
            ranges: type === 'percentage' ? [] : prev.ranges.length ? prev.ranges : [{ id: 'new-1', min: 0, max: null, fee: 0 }]
        }));
    };

    // Handle form status change
    const handleFormStatusChange = (status: 'active' | 'inactive') => {
        setFormData(prev => ({
            ...prev,
            status
        }));
    };

    // Helper function to create a new range ID
    const createNewRangeId = (tariffId: string) => {
        const existingRanges = tariffs.find(t => t.id === tariffId)?.ranges || [];
        const maxId = existingRanges.reduce((max, range) => {
            const idNum = parseInt(range.id.split('-')[1]);
            return idNum > max ? idNum : max;
        }, 0);
        return `${tariffId}-${maxId + 1}`;
    };

    // Handle adding a range
    const handleAddRange = () => {
        if (!currentTariff) return;

        // Validate range
        if (rangeFormData.min < 0) {
            setSuccessMessage('Minimum value cannot be negative');
            return;
        }

        if (rangeFormData.max !== null && rangeFormData.max <= rangeFormData.min) {
            setSuccessMessage('Maximum value must be greater than minimum value');
            return;
        }

        // Check for overlapping ranges
        const overlapping = currentTariff.ranges.some(range => {
            const rangeMin = range.min;
            const rangeMax = range.max === null ? Infinity : range.max;
            const newMin = rangeFormData.min;
            const newMax = rangeFormData.max === null ? Infinity : rangeFormData.max;

            // Check for overlap
            return (newMin <= rangeMax && newMax >= rangeMin);
        });

        if (overlapping) {
            setSuccessMessage('This range overlaps with an existing range');
            setTimeout(() => setSuccessMessage(null), 3000);
            return;
        }

        // Create new range
        const newRange: TariffRange = {
            id: createNewRangeId(currentTariff.id),
            ...rangeFormData
        };

        // Add range to tariff
        setTariffs(tariffs.map(tariff =>
            tariff.id === currentTariff.id
                ? {
                    ...tariff,
                    ranges: [...tariff.ranges, newRange].sort((a, b) => a.min - b.min),
                    lastUpdated: new Date().toISOString().split('T')[0]
                }
                : tariff
        ));

        // Close modal and show success message
        setIsModalOpen(false);
        setModalType(null);
        setCurrentTariff(null);
        setCurrentRange(null);
        setSuccessMessage('Range added successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    // Handle editing a range
    const handleEditRange = () => {
        if (!currentTariff || !currentRange) return;

        // Validate range
        if (rangeFormData.min < 0) {
            setSuccessMessage('Minimum value cannot be negative');
            return;
        }

        if (rangeFormData.max !== null && rangeFormData.max <= rangeFormData.min) {
            setSuccessMessage('Maximum value must be greater than minimum value');
            return;
        }

        // Check for overlapping ranges (excluding the current range)
        const overlapping = currentTariff.ranges.some(range => {
            if (range.id === currentRange.id) return false;

            const rangeMin = range.min;
            const rangeMax = range.max === null ? Infinity : range.max;
            const newMin = rangeFormData.min;
            const newMax = rangeFormData.max === null ? Infinity : rangeFormData.max;

            // Check for overlap
            return (newMin <= rangeMax && newMax >= rangeMin);
        });

        if (overlapping) {
            setSuccessMessage('This range overlaps with an existing range');
            setTimeout(() => setSuccessMessage(null), 3000);
            return;
        }

        // Update range
        setTariffs(tariffs.map(tariff =>
            tariff.id === currentTariff.id
                ? {
                    ...tariff,
                    ranges: tariff.ranges.map(range =>
                        range.id === currentRange.id
                            ? { ...range, ...rangeFormData }
                            : range
                    ).sort((a, b) => a.min - b.min),
                    lastUpdated: new Date().toISOString().split('T')[0]
                }
                : tariff
        ));

        // Close modal and show success message
        setIsModalOpen(false);
        setModalType(null);
        setCurrentTariff(null);
        setCurrentRange(null);
        setSuccessMessage('Range updated successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    // Handle deleting a range
    const handleDeleteRange = () => {
        if (!currentTariff || !currentRange) return;

        // Check if this is the last range
        if (currentTariff.ranges.length === 1) {
            setSuccessMessage('Cannot delete the last range. A flat rate tariff must have at least one range.');
            setTimeout(() => setSuccessMessage(null), 3000);
            return;
        }

        // Delete range
        setTariffs(tariffs.map(tariff =>
            tariff.id === currentTariff.id
                ? {
                    ...tariff,
                    ranges: tariff.ranges.filter(range => range.id !== currentRange.id),
                    lastUpdated: new Date().toISOString().split('T')[0]
                }
                : tariff
        ));

        setIsModalOpen(false);
        setModalType(null);
        setCurrentTariff(null);
        setCurrentRange(null);
        setSuccessMessage('Range deleted successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const handleAddFormRange = () => {
        const tempId = `new-${formData.ranges.length + 1}`;

        const highestRange = [...formData.ranges].sort((a, b) => (b.max || Infinity) - (a.max || Infinity))[0];
        const suggestedMin = highestRange && highestRange.max !== null ? highestRange.max + 1 : 0;

        setFormData(prev => ({
            ...prev,
            ranges: [...prev.ranges, { id: tempId, min: suggestedMin, max: null, fee: 0 }].sort((a, b) => a.min - b.min)
        }));
    };

    const handleRemoveFormRange = (id: string) => {
        if (formData.type === 'flat' && formData.ranges.length === 1) {
            setSuccessMessage('Cannot delete the last range. A flat rate tariff must have at least one range.');
            setTimeout(() => setSuccessMessage(null), 3000);
            return;
        }

        setFormData(prev => ({
            ...prev,
            ranges: prev.ranges.filter(range => range.id !== id)
        }));
    };

    // Handle updating a range in the form data
    const handleUpdateFormRange = (id: string, field: keyof TariffRange, value: any) => {
        // Handle null for max value
        if (field === 'max' && (value === '' || value === 'null')) {
            setFormData(prev => ({
                ...prev,
                ranges: prev.ranges.map(range =>
                    range.id === id
                        ? { ...range, max: null }
                        : range
                )
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            ranges: prev.ranges.map(range =>
                range.id === id
                    ? { ...range, [field]: field === 'min' || field === 'max' || field === 'fee' ? parseFloat(value) || 0 : value }
                    : range
            ).sort((a, b) => a.min - b.min)
        }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.type === 'flat') {
            const rangeMap = new Map<number, TariffRange>();
            let hasOverlap = false;

            for (const range of formData.ranges) {
                const min = range.min;
                const max = range.max === null ? Infinity : range.max;

                if (min < 0) {
                    setSuccessMessage('Minimum value cannot be negative');
                    setTimeout(() => setSuccessMessage(null), 3000);
                    return;
                }

                if (max !== Infinity && max <= min) {
                    setSuccessMessage('Maximum value must be greater than minimum value');
                    setTimeout(() => setSuccessMessage(null), 3000);
                    return;
                }

                for (let i = min; i <= (max === Infinity ? min + 1 : max); i++) {
                    if (rangeMap.has(i)) {
                        hasOverlap = true;
                        break;
                    }
                    rangeMap.set(i, range);
                }

                if (hasOverlap) break;
            }

            if (hasOverlap) {
                setSuccessMessage('There are overlapping ranges. Please fix them before saving.');
                setTimeout(() => setSuccessMessage(null), 3000);
                return;
            }
        }

        if (modalType === 'add') {
            const newTariff: Tariff = {
                id: Date.now().toString(),
                ...formData,
                ranges: formData.type === 'flat'
                    ? formData.ranges.map((range, index) => ({ ...range, id: `new-${index + 1}` }))
                    : [],
                lastUpdated: new Date().toISOString().split('T')[0]
            };

            setTariffs([...tariffs, newTariff]);
            setSuccessMessage('Tariff added successfully');
        } else if (modalType === 'edit' && currentTariff) {
            setTariffs(tariffs.map(tariff =>
                tariff.id === currentTariff.id
                    ? {
                        ...tariff,
                        ...formData,
                        ranges: formData.type === 'flat'
                            ? formData.ranges.map(range => {
                                const existingRange = tariff.ranges.find(r => r.id === range.id);
                                return existingRange
                                    ? { ...range }
                                    : { ...range, id: createNewRangeId(tariff.id) };
                            })
                            : [],
                        lastUpdated: new Date().toISOString().split('T')[0]
                    }
                    : tariff
            ));
            setSuccessMessage('Tariff updated successfully');
        }

        setIsModalOpen(false);
        setModalType(null);
        setCurrentTariff(null);

        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
    };

    const handleDeleteTariff = () => {
        if (currentTariff) {
            setTariffs(tariffs.filter(tariff => tariff.id !== currentTariff.id));
            setSuccessMessage('Tariff deleted successfully');

            setIsModalOpen(false);
            setModalType(null);
            setCurrentTariff(null);

            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        }
    };

    const getModalTitle = () => {
        switch (modalType) {
            case 'add':
                return 'Add New Tariff';
            case 'edit':
                return 'Edit Tariff';
            case 'delete':
                return 'Delete Tariff';
            case 'addRange':
                return 'Add New Range';
            case 'editRange':
                return 'Edit Range';
            case 'deleteRange':
                return 'Delete Range';
            default:
                return '';
        }
    };

    const formatRange = (range: TariffRange) => {
        if (range.max === null) {
            return `KES ${range.min.toLocaleString()} and above`;
        }
        return `KES ${range.min.toLocaleString()} - ${range.max.toLocaleString()}`;
    };

    return (
        <div className="min-h-screen bg-[#FCFCFD] p-4 md:p-6 font-['Inter',sans-serif]">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                        <div>
                            <h1 className="text-2xl font-medium text-gray-800 tracking-tight">Tariffs Management</h1>
                            <p className="text-gray-500 text-sm mt-1">Configure transaction fees for different operations</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-500 text-white rounded-xl  hover:bg-blue-600 transition-all text-sm"
                            >
                                <Save size={16} />
                                <span>Save Changes</span>
                            </button>

                            <button
                                onClick={openAddModal}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl  hover:bg-gray-50 transition-all text-sm"
                            >
                                <PlusCircle size={16} />
                                <span>New Tariff</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center mb-5">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search tariffs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-3 py-2 w-full bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-2">
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

                {successMessage && (
                    <div className="mb-5 flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100 text-green-700">
                        <Check size={16} className="flex-shrink-0" />
                        <span className="text-sm">{successMessage}</span>
                    </div>
                )}

                <div className="bg-white rounded-2xl  overflow-hidden border border-gray-100 backdrop-blur-sm bg-white/90">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/80">
                                    <th className="w-10 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTariffs.length > 0 ? (
                                    filteredTariffs.map((tariff) => (
                                        <React.Fragment key={tariff.id}>
                                            <tr className={`${expandedRows[tariff.id] ? 'bg-blue-50/50' : 'hover:bg-gray-50/50'} transition-colors`}>
                                                <td className="px-3 py-3 text-center">
                                                    <button
                                                        onClick={() => toggleRowExpansion(tariff.id)}
                                                        className={`p-1 rounded-md hover:bg-gray-100 transition-colors ${tariff.type === 'flat' ? 'text-gray-500' : 'text-gray-300 cursor-not-allowed'}`}
                                                        disabled={tariff.type !== 'flat'}
                                                        title={tariff.type === 'flat' ? "Show fee ranges" : "Percentage tariffs don't have ranges"}
                                                    >
                                                        {expandedRows[tariff.id] ?
                                                            <ChevronDown size={16} /> :
                                                            <ChevronRight size={16} />
                                                        }
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-gray-800 text-sm font-medium">
                                                    {tariff.name}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 text-xs max-w-xs">
                                                    {tariff.description}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-lg w-fit">
                                                        <button
                                                            onClick={() => handleTypeChange(tariff.id, 'flat')}
                                                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${tariff.type === 'flat'
                                                                ? 'bg-blue-100 text-gray-800 font-medium'
                                                                : 'text-gray-500'
                                                                }`}
                                                        >
                                                            <DollarSign size={12} />
                                                            <span>Flat</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleTypeChange(tariff.id, 'percentage')}
                                                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${tariff.type === 'percentage'
                                                                ? 'bg-blue-100 text-gray-800 font-medium'
                                                                : 'text-gray-500'
                                                                }`}
                                                        >
                                                            <Percent size={12} />
                                                            <span>Percentage</span>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {tariff.type === 'percentage' ? (
                                                        <div className="flex items-center">
                                                            <div className="relative">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.1"
                                                                    value={tariff.value}
                                                                    onChange={(e) => handleValueChange(tariff.id, e.target.value)}
                                                                    className="py-1.5 px-2 pr-7 bg-gray-50 border border-gray-100 rounded-lg text-gray-800 focus:ring-1 focus:ring-blue-400 w-20 text-sm"
                                                                />
                                                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                                    <Percent size={12} className="text-gray-400" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-600 text-xs font-medium">Tiered Pricing</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${tariff.status === 'active'
                                                        ? 'bg-green-50 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {tariff.status === 'active' ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                                                    {tariff.lastUpdated}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            onClick={() => openEditModal(tariff)}
                                                            className="p-1 text-gray-400 hover:text-blue-500 rounded-md hover:bg-blue-50"
                                                            title="Edit"
                                                        >
                                                            <Edit size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteModal(tariff)}
                                                            className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {tariff.type === 'flat' && expandedRows[tariff.id] && (
                                                <tr className="bg-blue-50/30">
                                                    <td colSpan={8} className="px-6 py-2 border-t border-blue-100">
                                                        <div className="py-2">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <h4 className="text-sm font-medium text-gray-700">Fee Ranges</h4>
                                                                <button
                                                                    onClick={() => openAddRangeModal(tariff)}
                                                                    className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all text-xs"
                                                                >
                                                                    <Plus size={14} />
                                                                    <span>Add Range</span>
                                                                </button>
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                {tariff.ranges.map((range) => (
                                                                    <div
                                                                        key={range.id}
                                                                        className="p-3 bg-white rounded-xl border border-gray-100 "
                                                                    >
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <div className="text-sm font-medium text-gray-700">{formatRange(range)}</div>
                                                                            <div className="flex gap-0.5">
                                                                                <button
                                                                                    onClick={() => openEditRangeModal(tariff, range)}
                                                                                    className="p-1 text-gray-400 hover:text-blue-500 rounded-md hover:bg-blue-50"
                                                                                    title="Edit Range"
                                                                                >
                                                                                    <Edit size={14} />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => openDeleteRangeModal(tariff, range)}
                                                                                    className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50"
                                                                                    title="Delete Range"
                                                                                    disabled={tariff.ranges.length === 1}
                                                                                >
                                                                                    <Trash2 size={14} />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center">
                                                                            <span className="text-gray-500 text-xs mr-2">Fee:</span>
                                                                            <span className="text-gray-800 font-medium text-sm">KES {range.fee.toLocaleString()}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-5 text-center text-gray-500 text-sm">
                                            No tariffs found matching your criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Info Card */}
                <div className="mt-6 bg-blue-50/70 rounded-xl p-3 border border-blue-100 backdrop-blur-sm">
                    <div className="flex items-start gap-2">
                        <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-blue-700">About Tariffs</h3>
                            <p className="text-blue-600 text-xs mt-0.5 leading-relaxed">
                                Tariffs can be configured as either a flat rate (with transaction amount ranges) or a percentage of the transaction value.
                                For flat rate tariffs, you can define different fees for different transaction amount ranges. For percentage tariffs, a single percentage is applied to all transactions.
                                Changes will take effect immediately after saving and will apply to all new transactions.
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
                    setCurrentTariff(null);
                    setCurrentRange(null);
                }}
                title={getModalTitle()}
                size={['delete', 'deleteRange'].includes(modalType || '') ? 'sm' : ['addRange', 'editRange'].includes(modalType || '') ? 'md' : 'lg'}
            >
                {modalType === 'delete' ? (
                    <div className="space-y-3">
                        <p className="text-gray-700 text-sm">
                            Are you sure you want to delete the tariff <span className="font-semibold">{currentTariff?.name}</span>?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2 mt-5">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setModalType(null);
                                    setCurrentTariff(null);
                                }}
                                className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteTariff}
                                className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ) : modalType === 'deleteRange' ? (
                    <div className="space-y-3">
                        <p className="text-gray-700 text-sm">
                            Are you sure you want to delete the range <span className="font-semibold">{currentRange && formatRange(currentRange)}</span>?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2 mt-5">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setModalType(null);
                                    setCurrentTariff(null);
                                    setCurrentRange(null);
                                }}
                                className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteRange}
                                className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ) : modalType === 'addRange' || modalType === 'editRange' ? (
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <div>
                                <label htmlFor="min" className="block text-xs font-medium text-gray-700 mb-1">
                                    Minimum Amount (KES)
                                </label>
                                <input
                                    type="number"
                                    id="min"
                                    name="min"
                                    value={rangeFormData.min}
                                    onChange={handleRangeFormChange}
                                    min="0"
                                    required
                                    className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                    placeholder="e.g., 0"
                                />
                                <p className="text-xs text-gray-500 mt-1">The minimum transaction amount for this range (inclusive)</p>
                            </div>

                            <div>
                                <label htmlFor="max" className="block text-xs font-medium text-gray-700 mb-1">
                                    Maximum Amount (KES)
                                </label>
                                <input
                                    type="text" // Using text to allow "null" value
                                    id="max"
                                    name="max"
                                    value={rangeFormData.max === null ? '' : rangeFormData.max}
                                    onChange={handleRangeFormChange}
                                    min="0"
                                    className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                    placeholder="Leave empty for 'and above'"
                                />
                                <p className="text-xs text-gray-500 mt-1">The maximum transaction amount for this range (inclusive). Leave empty for "and above".</p>
                            </div>

                            <div>
                                <label htmlFor="fee" className="block text-xs font-medium text-gray-700 mb-1">
                                    Fee (KES)
                                </label>
                                <input
                                    type="number"
                                    id="fee"
                                    name="fee"
                                    value={rangeFormData.fee}
                                    onChange={handleRangeFormChange}
                                    min="0"
                                    step="0.1"
                                    required
                                    className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                    placeholder="e.g., 50"
                                />
                                <p className="text-xs text-gray-500 mt-1">The fee to charge for transactions in this range</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setModalType(null);
                                    setCurrentTariff(null);
                                    setCurrentRange(null);
                                }}
                                className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={modalType === 'addRange' ? handleAddRange : handleEditRange}
                                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                            >
                                {modalType === 'addRange' ? 'Add Range' : 'Update Range'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-3">
                            <div>
                                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                                    Tariff Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                    placeholder="e.g., Send Money"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    rows={2}
                                    className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                    placeholder="Describe the purpose of this tariff"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Fee Type
                                </label>
                                <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-lg w-fit">
                                    <button
                                        type="button"
                                        onClick={() => handleFormTypeChange('flat')}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${formData.type === 'flat'
                                            ? 'bg-white  text-gray-800 font-medium'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        <DollarSign size={12} />
                                        <span>Flat Rate</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleFormTypeChange('percentage')}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${formData.type === 'percentage'
                                            ? 'bg-white  text-gray-800 font-medium'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        <Percent size={12} />
                                        <span>Percentage</span>
                                    </button>
                                </div>
                            </div>

                            {formData.type === 'percentage' ? (
                                <div>
                                    <label htmlFor="value" className="block text-xs font-medium text-gray-700 mb-1">
                                        Percentage Value (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            id="value"
                                            name="value"
                                            value={formData.value}
                                            onChange={handleFormChange}
                                            min="0"
                                            step="0.1"
                                            required
                                            className="w-full py-2 px-3 pr-8 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <Percent size={14} className="text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-xs font-medium text-gray-700">
                                            Fee Ranges
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleAddFormRange}
                                            className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-xs"
                                        >
                                            <Plus size={14} />
                                            <span>Add Range</span>
                                        </button>
                                    </div>

                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                        {formData.ranges.map((range, index) => (
                                            <div
                                                key={range.id}
                                                className="p-3 bg-gray-50 rounded-xl border border-gray-200"
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-medium text-gray-700">Range {index + 1}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFormRange(range.id)}
                                                        className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50"
                                                        disabled={formData.ranges.length === 1}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">
                                                            Min (KES)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={range.min}
                                                            onChange={(e) => handleUpdateFormRange(range.id, 'min', e.target.value)}
                                                            min="0"
                                                            required
                                                            className="w-full py-1.5 px-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-xs"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">
                                                            Max (KES)
                                                        </label>
                                                        <input
                                                            type="text" // Using text to allow "null" value
                                                            value={range.max === null ? '' : range.max}
                                                            onChange={(e) => handleUpdateFormRange(range.id, 'max', e.target.value)}
                                                            placeholder="Leave empty for 'and above'"
                                                            className="w-full py-1.5 px-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-xs"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">
                                                            Fee (KES)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={range.fee}
                                                            onChange={(e) => handleUpdateFormRange(range.id, 'fee', e.target.value)}
                                                            min="0"
                                                            step="0.1"
                                                            required
                                                            className="w-full py-1.5 px-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-xs"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-lg w-fit">
                                    <button
                                        type="button"
                                        onClick={() => handleFormStatusChange('active')}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${formData.status === 'active'
                                            ? 'bg-white  text-gray-800 font-medium'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        <span>Active</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleFormStatusChange('inactive')}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${formData.status === 'inactive'
                                            ? 'bg-white  text-gray-800 font-medium'
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
                                    setCurrentTariff(null);
                                }}
                                className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                            >
                                {modalType === 'add' ? 'Add Tariff' : 'Update Tariff'}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default TariffsManagement;