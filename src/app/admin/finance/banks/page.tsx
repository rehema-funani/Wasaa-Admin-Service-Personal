import React, { useState } from 'react';
import { Search, PlusCircle, Trash2, Edit, Save, Check, SlidersHorizontal, Info, Globe, Building, MapPin, ArrowDownToLine, ArrowUpFromLine, X, ChevronDown, ChevronUp, Upload } from 'lucide-react';

interface Bank {
    id: string;
    name: string;
    swiftCode: string;
    country: string;
    logoUrl: string;
    accountNumberFormat: string;
    accountNumberLength: number;
    allowsWithdrawal: boolean;
    allowsTopUp: boolean;
    status: 'active' | 'inactive';
    lastUpdated: string;
}

type ModalType = 'add' | 'edit' | 'delete' | null;

const page = () => {
    const [banks, setBanks] = useState<Bank[]>([
        {
            id: '1',
            name: 'Kenya Commercial Bank',
            swiftCode: 'KCBLKENX',
            country: 'Kenya',
            logoUrl: '/images/banks/kcb.png',
            accountNumberFormat: 'Numeric',
            accountNumberLength: 12,
            allowsWithdrawal: true,
            allowsTopUp: true,
            status: 'active',
            lastUpdated: '2025-05-10'
        },
        {
            id: '2',
            name: 'Equity Bank',
            swiftCode: 'EQBLKENA',
            country: 'Kenya',
            logoUrl: '/images/banks/equity.png',
            accountNumberFormat: 'Numeric',
            accountNumberLength: 13,
            allowsWithdrawal: true,
            allowsTopUp: true,
            status: 'active',
            lastUpdated: '2025-05-08'
        },
        {
            id: '3',
            name: 'Standard Chartered',
            swiftCode: 'SCBLKENX',
            country: 'Kenya',
            logoUrl: '/images/banks/standard-chartered.png',
            accountNumberFormat: 'Alphanumeric',
            accountNumberLength: 14,
            allowsWithdrawal: true,
            allowsTopUp: true,
            status: 'active',
            lastUpdated: '2025-05-05'
        },
        {
            id: '4',
            name: 'Barclays Bank',
            swiftCode: 'BARCKENX',
            country: 'Kenya',
            logoUrl: '/images/banks/barclays.png',
            accountNumberFormat: 'Numeric',
            accountNumberLength: 10,
            allowsWithdrawal: true,
            allowsTopUp: true,
            status: 'inactive',
            lastUpdated: '2025-04-30'
        }
    ]);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [operationFilter, setOperationFilter] = useState<'all' | 'withdrawal' | 'topup'>('all');
    const [sortField, setSortField] = useState<keyof Bank>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [currentBank, setCurrentBank] = useState<Bank | null>(null);
    const [bankFormData, setBankFormData] = useState<Omit<Bank, 'id' | 'lastUpdated'>>({
        name: '',
        swiftCode: '',
        country: '',
        logoUrl: '',
        accountNumberFormat: 'Numeric',
        accountNumberLength: 10,
        allowsWithdrawal: true,
        allowsTopUp: true,
        status: 'active'
    });

    const sortBanks = (a: Bank, b: Bank) => {
        let valueA = a[sortField];
        let valueB = b[sortField];

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
        }

        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    };

    const handleSort = (field: keyof Bank) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const filteredBanks = banks
        .filter(bank => {
            const matchesSearch = bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bank.swiftCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bank.country.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || bank.status === statusFilter;
            const matchesOperation = operationFilter === 'all' ||
                (operationFilter === 'withdrawal' && bank.allowsWithdrawal) ||
                (operationFilter === 'topup' && bank.allowsTopUp);
            return matchesSearch && matchesStatus && matchesOperation;
        })
        .sort(sortBanks);

    const handleSave = () => {
        console.log('Saving banks:', banks);
        setSuccessMessage('Bank configurations updated successfully');

        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
    };

    const openAddModal = () => {
        setBankFormData({
            name: '',
            swiftCode: '',
            country: 'Kenya',
            logoUrl: '',
            accountNumberFormat: 'Numeric',
            accountNumberLength: 10,
            allowsWithdrawal: true,
            allowsTopUp: true,
            status: 'active'
        });
        setModalType('add');
        setIsModalOpen(true);
    };

    const openEditModal = (bank: Bank) => {
        setCurrentBank(bank);
        setBankFormData({
            name: bank.name,
            swiftCode: bank.swiftCode,
            country: bank.country,
            logoUrl: bank.logoUrl,
            accountNumberFormat: bank.accountNumberFormat,
            accountNumberLength: bank.accountNumberLength,
            allowsWithdrawal: bank.allowsWithdrawal,
            allowsTopUp: bank.allowsTopUp,
            status: bank.status
        });
        setModalType('edit');
        setIsModalOpen(true);
    };

    const openDeleteModal = (bank: Bank) => {
        setCurrentBank(bank);
        setModalType('delete');
        setIsModalOpen(true);
    };

    const handleBankFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;
        setBankFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked :
                name === 'accountNumberLength' ? parseInt(value) || 0 : value
        }));
    };

    const handleBankStatusChange = (status: 'active' | 'inactive') => {
        setBankFormData(prev => ({
            ...prev,
            status
        }));
    };

    const handleBankFormSubmit = (e: React.MouseEvent) => {
        e.preventDefault();

        if (modalType === 'add') {
            const newBank: Bank = {
                id: (banks.length + 1).toString(),
                ...bankFormData,
                lastUpdated: new Date().toISOString().split('T')[0]
            };

            setBanks([...banks, newBank]);
            setSuccessMessage('Bank added successfully');
        } else if (modalType === 'edit' && currentBank) {
            setBanks(banks.map(bank =>
                bank.id === currentBank.id
                    ? {
                        ...bank,
                        name: bankFormData.name,
                        swiftCode: bankFormData.swiftCode,
                        country: bankFormData.country,
                        logoUrl: bankFormData.logoUrl,
                        accountNumberFormat: bankFormData.accountNumberFormat,
                        accountNumberLength: bankFormData.accountNumberLength,
                        allowsWithdrawal: bankFormData.allowsWithdrawal,
                        allowsTopUp: bankFormData.allowsTopUp,
                        status: bankFormData.status,
                        lastUpdated: new Date().toISOString().split('T')[0]
                    }
                    : bank
            ));

            setSuccessMessage('Bank updated successfully');
        }

        setIsModalOpen(false);
        setModalType(null);
        setCurrentBank(null);

        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
    };

    const handleDeleteBank = () => {
        if (currentBank) {
            setBanks(banks.filter(bank => bank.id !== currentBank.id));

            setSuccessMessage('Bank deleted successfully');

            setIsModalOpen(false);
            setModalType(null);
            setCurrentBank(null);

            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        }
    };

    const Modal = ({ isOpen, children, title }: { isOpen: boolean, children: React.ReactNode, title: string }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-auto">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
                        <button
                            onClick={() => {
                                setIsModalOpen(false);
                                setModalType(null);
                                setCurrentBank(null);
                            }}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-4">
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    const renderSortIndicator = (field: keyof Bank) => {
        if (sortField !== field) return null;

        return sortDirection === 'asc'
            ? <ChevronUp size={14} className="ml-1" />
            : <ChevronDown size={14} className="ml-1" />;
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-2xl font-bold text-gray-900">Bank Management</h1>
                        <p className="mt-1 text-sm text-gray-500">Configure banks for withdrawals and deposits</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div className="relative flex-grow max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search banks by name, swift code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-1 flex">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-3 py-1.5 rounded text-sm transition-all ${statusFilter === 'all' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setStatusFilter('active')}
                                className={`px-3 py-1.5 rounded text-sm transition-all ${statusFilter === 'active' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setStatusFilter('inactive')}
                                className={`px-3 py-1.5 rounded text-sm transition-all ${statusFilter === 'inactive' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                Inactive
                            </button>
                        </div>

                        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-1 flex">
                            <button
                                onClick={() => setOperationFilter('all')}
                                className={`px-3 py-1.5 rounded text-sm transition-all ${operationFilter === 'all' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                All Operations
                            </button>
                            <button
                                onClick={() => setOperationFilter('withdrawal')}
                                className={`px-3 py-1.5 rounded text-sm transition-all ${operationFilter === 'withdrawal' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                Withdrawals
                            </button>
                            <button
                                onClick={() => setOperationFilter('topup')}
                                className={`px-3 py-1.5 rounded text-sm transition-all ${operationFilter === 'topup' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                Top-ups
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Save size={16} className="mr-2" />
                                Save Changes
                            </button>
                            <button
                                onClick={openAddModal}
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <PlusCircle size={16} className="mr-2" />
                                Add Bank
                            </button>
                        </div>
                    </div>
                </div>

                {successMessage && (
                    <div className="mb-6 flex items-center p-4 bg-green-50 rounded-lg border border-green-100 shadow-sm">
                        <Check size={18} className="text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-green-700">{successMessage}</span>
                    </div>
                )}

                <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center">
                                            Bank
                                            {renderSortIndicator('name')}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('swiftCode')}
                                    >
                                        <div className="flex items-center">
                                            Swift Code
                                            {renderSortIndicator('swiftCode')}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('country')}
                                    >
                                        <div className="flex items-center">
                                            Country
                                            {renderSortIndicator('country')}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Account Details
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Operations
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('status')}
                                    >
                                        <div className="flex items-center">
                                            Status
                                            {renderSortIndicator('status')}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('lastUpdated')}
                                    >
                                        <div className="flex items-center">
                                            Last Updated
                                            {renderSortIndicator('lastUpdated')}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBanks.length > 0 ? (
                                    filteredBanks.map(bank => (
                                        <tr key={bank.id} className={bank.status === 'inactive' ? 'bg-gray-50' : undefined}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mr-3">
                                                        {bank.logoUrl ? (
                                                            <img src={bank.logoUrl} alt={bank.name} className="w-8 h-8 object-contain" />
                                                        ) : (
                                                            <Building size={16} className="text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900">{bank.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{bank.swiftCode}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-700 flex items-center">
                                                    <Globe size={14} className="text-gray-400 mr-1.5" />
                                                    {bank.country}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{bank.accountNumberFormat}</div>
                                                <div className="text-xs text-gray-500">{bank.accountNumberLength} digits</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {bank.allowsWithdrawal && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                            <ArrowDownToLine size={10} className="mr-1" />
                                                            Withdrawal
                                                        </span>
                                                    )}
                                                    {bank.allowsTopUp && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                                            <ArrowUpFromLine size={10} className="mr-1" />
                                                            Top-up
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bank.status === 'active'
                                                        ? 'bg-green-50 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {bank.status === 'active' ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{bank.lastUpdated}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => openEditModal(bank)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(bank)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
                                            No banks found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-100 shadow-sm">
                    <div className="flex items-start">
                        <Info size={20} className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h3 className="font-medium text-blue-800">About Bank Management</h3>
                            <p className="mt-1 text-sm text-blue-600">
                                Configure the banks that users can withdraw to or top up from. Make sure to set the
                                correct account number format and length to validate user inputs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                title={modalType === 'add' ? 'Add New Bank' : modalType === 'edit' ? `Edit Bank: ${currentBank?.name}` : 'Delete Bank'}
            >
                {modalType === 'delete' ? (
                    <div>
                        <p className="text-gray-700 mb-4">
                            Are you sure you want to delete the bank <span className="font-semibold">{currentBank?.name}</span>?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setModalType(null);
                                    setCurrentBank(null);
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteBank}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Bank Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={bankFormData.name}
                                        onChange={handleBankFormChange}
                                        required
                                        className="w-full py-2 px-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm"
                                        placeholder="e.g., Kenya Commercial Bank"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="swiftCode" className="block text-sm font-medium text-gray-700 mb-1">
                                            SWIFT/BIC Code
                                        </label>
                                        <input
                                            type="text"
                                            id="swiftCode"
                                            name="swiftCode"
                                            value={bankFormData.swiftCode}
                                            onChange={handleBankFormChange}
                                            required
                                            className="w-full py-2 px-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm"
                                            placeholder="e.g., KCBLKENX"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            value={bankFormData.country}
                                            onChange={handleBankFormChange}
                                            required
                                            className="w-full py-2 px-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm"
                                            placeholder="e.g., Kenya"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                        Bank Logo URL
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            id="logoUrl"
                                            name="logoUrl"
                                            value={bankFormData.logoUrl}
                                            onChange={handleBankFormChange}
                                            className="w-full py-2 px-3 bg-white border border-r-0 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm"
                                            placeholder="/images/banks/logo.png"
                                        />
                                        <button
                                            type="button"
                                            className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 text-gray-600 rounded-r-lg hover:bg-gray-200 text-sm flex items-center"
                                        >
                                            <Upload size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="accountNumberFormat" className="block text-sm font-medium text-gray-700 mb-1">
                                            Account Number Format
                                        </label>
                                        <select
                                            id="accountNumberFormat"
                                            name="accountNumberFormat"
                                            value={bankFormData.accountNumberFormat}
                                            onChange={handleBankFormChange}
                                            className="w-full py-2 px-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm"
                                        >
                                            <option value="Numeric">Numeric</option>
                                            <option value="Alphanumeric">Alphanumeric</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="accountNumberLength" className="block text-sm font-medium text-gray-700 mb-1">
                                            Account Number Length
                                        </label>
                                        <input
                                            type="number"
                                            id="accountNumberLength"
                                            name="accountNumberLength"
                                            value={bankFormData.accountNumberLength}
                                            onChange={handleBankFormChange}
                                            required
                                            min="1"
                                            max="30"
                                            className="w-full py-2 px-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm"
                                            placeholder="e.g., 10"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Supported Operations
                                        </label>
                                        <div className="space-y-3">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="allowsWithdrawal"
                                                    checked={bankFormData.allowsWithdrawal}
                                                    onChange={handleBankFormChange}
                                                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Allow Withdrawals</span>
                                            </label>

                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="allowsTopUp"
                                                    checked={bankFormData.allowsTopUp}
                                                    onChange={handleBankFormChange}
                                                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Allow Top-up</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleBankStatusChange('active')}
                                                className={`px-4 py-2 rounded-lg text-sm ${bankFormData.status === 'active'
                                                        ? 'bg-green-100 text-green-800 border border-green-200 font-medium'
                                                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                                                    }`}
                                            >
                                                Active
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleBankStatusChange('inactive')}
                                                className={`px-4 py-2 rounded-lg text-sm ${bankFormData.status === 'inactive'
                                                        ? 'bg-gray-700 text-white border border-gray-800 font-medium'
                                                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                                                    }`}
                                            >
                                                Inactive
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setModalType(null);
                                        setCurrentBank(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleBankFormSubmit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                                >
                                    {modalType === 'add' ? 'Add Bank' : 'Update Bank'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default page;