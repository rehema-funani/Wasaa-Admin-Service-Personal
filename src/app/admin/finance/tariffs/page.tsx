import React, { useState } from 'react';
import { Save, Percent, DollarSign, Info, Check, PlusCircle, Edit, Trash2, ArrowUpDown, ChevronDown, Search, SlidersHorizontal, Menu, Filter } from 'lucide-react';
import { Modal } from '../../../../components/common/Modal';

type TariffType = 'flat' | 'percentage';

interface Tariff {
    id: string;
    name: string;
    description: string;
    type: TariffType;
    value: number;
    status: 'active' | 'inactive';
    lastUpdated: string;
}

type ModalType = 'add' | 'edit' | 'delete' | null;

const TariffsManagement = () => {
    const [tariffs, setTariffs] = useState<Tariff[]>([
        {
            id: '1',
            name: 'Send Money',
            description: 'Fee charged when sending money to another user',
            type: 'percentage',
            value: 1.5,
            status: 'active',
            lastUpdated: '2025-05-10'
        },
        {
            id: '2',
            name: 'Withdraw to Bank',
            description: 'Fee charged when withdrawing to a bank account',
            type: 'flat',
            value: 30,
            status: 'active',
            lastUpdated: '2025-05-08'
        },
        {
            id: '3',
            name: 'Withdraw to M-Pesa',
            description: 'Fee charged when withdrawing to M-Pesa',
            type: 'flat',
            value: 25,
            status: 'active',
            lastUpdated: '2025-05-07'
        },
        {
            id: '4',
            name: 'Transfer Between Accounts',
            description: 'Fee charged when transferring between account balances',
            type: 'percentage',
            value: 0.5,
            status: 'active',
            lastUpdated: '2025-05-05'
        },
        {
            id: '5',
            name: 'Gift to User',
            description: 'Fee charged when gifting to another user',
            type: 'percentage',
            value: 1,
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
    const [formData, setFormData] = useState<Omit<Tariff, 'id' | 'lastUpdated'>>({
        name: '',
        description: '',
        type: 'flat',
        value: 0,
        status: 'active'
    });

    const filteredTariffs = tariffs.filter(tariff => {
        const matchesSearch = tariff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tariff.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || tariff.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleTypeChange = (id: string, type: TariffType) => {
        setTariffs(tariffs.map(tariff =>
            tariff.id === id ? { ...tariff, type } : tariff
        ));
    };

    const handleValueChange = (id: string, value: string) => {
        const numValue = parseFloat(value) || 0;
        setTariffs(tariffs.map(tariff =>
            tariff.id === id ? { ...tariff, value: numValue } : tariff
        ));
    };

    const handleSave = () => {
        console.log('Saving tariffs:', tariffs);

        setSuccessMessage('Tariffs updated successfully');

        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
    };

    const openAddModal = () => {
        setFormData({
            name: '',
            description: '',
            type: 'flat',
            value: 0,
            status: 'active'
        });
        setModalType('add');
        setIsModalOpen(true);
    };

    const openEditModal = (tariff: Tariff) => {
        setCurrentTariff(tariff);
        setFormData({
            name: tariff.name,
            description: tariff.description,
            type: tariff.type,
            value: tariff.value,
            status: tariff.status
        });
        setModalType('edit');
        setIsModalOpen(true);
    };

    const openDeleteModal = (tariff: Tariff) => {
        setCurrentTariff(tariff);
        setModalType('delete');
        setIsModalOpen(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFormTypeChange = (type: TariffType) => {
        setFormData(prev => ({
            ...prev,
            type
        }));
    };

    const handleFormStatusChange = (status: 'active' | 'inactive') => {
        setFormData(prev => ({
            ...prev,
            status
        }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (modalType === 'add') {
            const newTariff: Tariff = {
                id: Date.now().toString(),
                ...formData,
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
            default:
                return '';
        }
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
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-500 text-white rounded-xl shadow-sm hover:bg-blue-600 transition-all text-sm"
                            >
                                <Save size={16} />
                                <span>Save Changes</span>
                            </button>

                            <button
                                onClick={openAddModal}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm hover:bg-gray-50 transition-all text-sm"
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

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 backdrop-blur-sm bg-white/90">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/80">
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
                                        <tr key={tariff.id} className="hover:bg-gray-50/50 transition-colors">
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
                                                                ? 'bg-white shadow-sm text-gray-800 font-medium'
                                                                : 'text-gray-500'
                                                            }`}
                                                    >
                                                        <DollarSign size={12} />
                                                        <span>Flat</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleTypeChange(tariff.id, 'percentage')}
                                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${tariff.type === 'percentage'
                                                                ? 'bg-white shadow-sm text-gray-800 font-medium'
                                                                : 'text-gray-500'
                                                            }`}
                                                    >
                                                        <Percent size={12} />
                                                        <span>Percentage</span>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center">
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step={tariff.type === 'percentage' ? '0.1' : '1'}
                                                            value={tariff.value}
                                                            onChange={(e) => handleValueChange(tariff.id, e.target.value)}
                                                            className="py-1.5 px-2 pr-7 bg-gray-50 border border-gray-100 rounded-lg text-gray-800 focus:ring-1 focus:ring-blue-400 w-20 text-sm"
                                                        />
                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                            {tariff.type === 'percentage' ? (
                                                                <Percent size={12} className="text-gray-400" />
                                                            ) : (
                                                                <span className="text-gray-400 text-xs">KES</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
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
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-5 text-center text-gray-500 text-sm">
                                            No tariffs found matching your criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 bg-blue-50/70 rounded-xl p-3 border border-blue-100 backdrop-blur-sm">
                    <div className="flex items-start gap-2">
                        <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-blue-700">About Tariffs</h3>
                            <p className="text-blue-600 text-xs mt-0.5 leading-relaxed">
                                Tariffs can be configured as either a flat rate (fixed amount) or a percentage of the transaction value.
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
                }}
                title={getModalTitle()}
                size={modalType === 'delete' ? 'sm' : 'md'}
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
                                                ? 'bg-white shadow-sm text-gray-800 font-medium'
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
                                                ? 'bg-white shadow-sm text-gray-800 font-medium'
                                                : 'text-gray-500'
                                            }`}
                                    >
                                        <Percent size={12} />
                                        <span>Percentage</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="value" className="block text-xs font-medium text-gray-700 mb-1">
                                    {formData.type === 'flat' ? 'Fixed Amount (KES)' : 'Percentage Value (%)'}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        id="value"
                                        name="value"
                                        value={formData.value}
                                        onChange={handleFormChange}
                                        min="0"
                                        step={formData.type === 'percentage' ? '0.1' : '1'}
                                        required
                                        className="w-full py-2 px-3 pr-8 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        {formData.type === 'percentage' ? (
                                            <Percent size={14} className="text-gray-400" />
                                        ) : (
                                            <span className="text-gray-400 text-xs">KES</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-lg w-fit">
                                    <button
                                        type="button"
                                        onClick={() => handleFormStatusChange('active')}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${formData.status === 'active'
                                                ? 'bg-white shadow-sm text-gray-800 font-medium'
                                                : 'text-gray-500'
                                            }`}
                                    >
                                        <span>Active</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleFormStatusChange('inactive')}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${formData.status === 'inactive'
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