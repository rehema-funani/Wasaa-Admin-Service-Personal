import React from 'react';
import { Search, SlidersHorizontal, Percent, DollarSign, Edit, Trash2, ChevronDown, ChevronRight, Check, Loader, Plus } from 'lucide-react';

const TariffsList = ({
    tariffs,
    isLoading,
    error,
    successMessage,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    expandedRows,
    toggleRowExpansion,
    handleTypeChange,
    handleValueChange,
    openEditModal,
    openDeleteModal,
    openAddRangeModal,
    openEditRangeModal,
    openDeleteRangeModal
}) => {
    const formatRange = (range) => {
        if (range.max === null) {
            return `KES ${range.min.toLocaleString()} and above`;
        }
        return `KES ${range.min.toLocaleString()} - ${range.max.toLocaleString()}`;
    };

    return (
        <>
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

            {isLoading && (
                <div className="mb-5 flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-700">
                    <Loader size={16} className="animate-spin" />
                    <span className="text-sm">Loading tariffs...</span>
                </div>
            )}

            {error && (
                <div className="mb-5 flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100 text-red-700">
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="mb-5 flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100 text-green-700">
                    <Check size={16} className="flex-shrink-0" />
                    <span className="text-sm">{successMessage}</span>
                </div>
            )}

            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 backdrop-blur-sm bg-white/90">
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
                            {tariffs.length > 0 ? (
                                tariffs.map((tariff) => (
                                    <React.Fragment key={tariff.id}>
                                        <tr className={`${expandedRows[tariff.id] ? 'bg-blue-50/50' : 'hover:bg-gray-50/50'} transition-colors`}>
                                            <td className="px-3 py-3 text-center">
                                                <button
                                                    onClick={() => toggleRowExpansion(tariff.id)}
                                                    className="p-1 rounded-md hover:bg-gray-100 transition-colors text-gray-500"
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
                                                        disabled={isLoading}
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
                                                        disabled={isLoading}
                                                    >
                                                        <Percent size={12} />
                                                        <span>Percentage</span>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {tariff.type === 'percentage' && (
                                                    <div className="flex items-center">
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.1"
                                                                value={tariff.value}
                                                                onChange={(e) => handleValueChange(tariff.id, e.target.value)}
                                                                className="py-1.5 px-2 pr-7 bg-gray-50 border border-gray-100 rounded-lg text-gray-800 focus:ring-1 focus:ring-blue-400 w-20 text-sm"
                                                                disabled={isLoading}
                                                            />
                                                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                                <Percent size={12} className="text-gray-400" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {tariff.type !== 'percentage' && (
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
                                                        disabled={isLoading}
                                                    >
                                                        <Edit size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(tariff)}
                                                        className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50"
                                                        title="Delete"
                                                        disabled={isLoading}
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {expandedRows[tariff.id] && (
                                            <tr className="bg-blue-50/30">
                                                <td colSpan={8} className="px-6 py-2 border-t border-blue-100">
                                                    <div className="py-2">
                                                        {tariff.type === 'flat' && (
                                                            <>
                                                                <div className="flex justify-between items-center mb-3">
                                                                    <h4 className="text-sm font-medium text-gray-700">Fixed Fee Ranges</h4>
                                                                    <button
                                                                        onClick={() => openAddRangeModal(tariff, 'fixed')}
                                                                        className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all text-xs"
                                                                        disabled={isLoading}
                                                                    >
                                                                        <Plus size={14} />
                                                                        <span>Add Range</span>
                                                                    </button>
                                                                </div>

                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                                                                    {tariff.fixedRanges && tariff.fixedRanges.length > 0 ? (
                                                                        tariff.fixedRanges.map((range) => (
                                                                            <div
                                                                                key={range.id}
                                                                                className="p-3 bg-white rounded-xl border border-gray-100"
                                                                            >
                                                                                <div className="flex justify-between items-start mb-2">
                                                                                    <div className="text-sm font-medium text-gray-700">{formatRange(range)}</div>
                                                                                    <div className="flex gap-0.5">
                                                                                        <button
                                                                                            onClick={() => openEditRangeModal(tariff, range, 'fixed')}
                                                                                            className="p-1 text-gray-400 hover:text-blue-500 rounded-md hover:bg-blue-50"
                                                                                            title="Edit Range"
                                                                                            disabled={isLoading}
                                                                                        >
                                                                                            <Edit size={14} />
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={() => openDeleteRangeModal(tariff, range, 'fixed')}
                                                                                            className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50"
                                                                                            title="Delete Range"
                                                                                            disabled={isLoading || (tariff.fixedRanges && tariff.fixedRanges.length === 1)}
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
                                                                        ))
                                                                    ) : (
                                                                        <div className="col-span-full text-center text-gray-500 text-sm py-3">
                                                                            No fixed fee ranges defined. Add one to get started.
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}

                                                        {tariff.type === 'percentage' && (
                                                            <>
                                                                <div className="flex justify-between items-center mb-3">
                                                                    <h4 className="text-sm font-medium text-gray-700">Percentage Fee Ranges</h4>
                                                                    <button
                                                                        onClick={() => openAddRangeModal(tariff, 'percentage')}
                                                                        className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all text-xs"
                                                                        disabled={isLoading}
                                                                    >
                                                                        <Plus size={14} />
                                                                        <span>Add Range</span>
                                                                    </button>
                                                                </div>

                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                    {tariff.percentageRanges && tariff.percentageRanges.length > 0 ? (
                                                                        tariff.percentageRanges.map((range) => (
                                                                            <div
                                                                                key={range.id}
                                                                                className="p-3 bg-white rounded-xl border border-gray-100"
                                                                            >
                                                                                <div className="flex justify-between items-start mb-2">
                                                                                    <div className="text-sm font-medium text-gray-700">{formatRange(range)}</div>
                                                                                    <div className="flex gap-0.5">
                                                                                        <button
                                                                                            onClick={() => openEditRangeModal(tariff, range, 'percentage')}
                                                                                            className="p-1 text-gray-400 hover:text-blue-500 rounded-md hover:bg-blue-50"
                                                                                            title="Edit Range"
                                                                                            disabled={isLoading}
                                                                                        >
                                                                                            <Edit size={14} />
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={() => openDeleteRangeModal(tariff, range, 'percentage')}
                                                                                            className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50"
                                                                                            title="Delete Range"
                                                                                            disabled={isLoading || (tariff.percentageRanges && tariff.percentageRanges.length === 1)}
                                                                                        >
                                                                                            <Trash2 size={14} />
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex items-center">
                                                                                    <span className="text-gray-500 text-xs mr-2">Fee:</span>
                                                                                    <span className="text-gray-800 font-medium text-sm">{range.fee}%</span>
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div className="col-span-full text-center text-gray-500 text-sm py-3">
                                                                            No percentage fee ranges defined. Add one to get started.
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-4 py-5 text-center text-gray-500 text-sm">
                                        {isLoading ? 'Loading tariffs...' : 'No tariffs found matching your criteria'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default TariffsList;