import React, { useState, useEffect } from 'react';
import { Save, Info, Loader, Plus, Trash2, AlertTriangle } from 'lucide-react';
import financeService from '../../../../api/services/finance';
import { Modal } from '../../../../components/common/Modal';
import TariffsList from './TariffsList';
import TariffForm from './TariffForm';
import RangeForm from './RangeForm';

const page = () => {
    const [tariffs, setTariffs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [currentTariff, setCurrentTariff] = useState(null);
    const [currentRange, setCurrentRange] = useState(null);
    const [expandedRows, setExpandedRows] = useState({});
    const [deleteConfirmed, setDeleteConfirmed] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'flat',
        value: 0,
        fixedRanges: [],
        percentageRanges: [],
        status: 'active'
    });

    const [rangeFormData, setRangeFormData] = useState({
        min: 0,
        max: null,
        fee: 0
    });

    useEffect(() => {
        fetchTariffs();
    }, []);

    const fetchTariffs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const tariffsData = await financeService.getAllTariffs();

            const formattedTariffs = tariffsData?.walletBillings?.map((tariff) => {
                const formattedTariff = {
                    id: tariff.id || '',
                    name: tariff.name,
                    description: tariff.description,
                    type: tariff.type,
                    value: tariff.value || 0,
                    status: tariff.status,
                    lastUpdated: tariff.updatedAt ? new Date(tariff.updatedAt).toISOString().split('T')[0] :
                        new Date().toISOString().split('T')[0],
                    fixedRanges: (tariff.fixedRanges || [])
                        .map(range => ({
                            id: range.id,
                            min: range.min,
                            max: range.max,
                            fee: range.fee
                        }))
                        .sort((a, b) => a.min - b.min),
                    percentageRanges: (tariff.percentageRanges || [])
                        .map(range => ({
                            id: range.id,
                            min: range.min,
                            max: range.max,
                            fee: range.fee
                        }))
                        .sort((a, b) => a.min - b.min)
                };

                return formattedTariff;
            }) || [];

            setTariffs(formattedTariffs);
        } catch (err) {
            setError('Failed to fetch tariffs. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredTariffs = tariffs.filter(tariff => {
        const matchesSearch = tariff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tariff.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || tariff.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const toggleRowExpansion = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const showSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const openAddModal = () => {
        setFormData({
            name: '',
            description: '',
            type: 'flat',
            value: 0,
            fixedRanges: [{ id: `new-1`, min: 0, max: null, fee: 0 }],
            percentageRanges: [],
            status: 'active'
        });
        setModalType('add');
        setIsModalOpen(true);
    };

    const openEditModal = (tariff) => {
        setCurrentTariff(tariff);
        setFormData({
            name: tariff.name,
            description: tariff.description,
            type: tariff.type,
            value: tariff.value,
            fixedRanges: [...tariff.fixedRanges],
            percentageRanges: [...tariff.percentageRanges],
            status: tariff.status
        });
        setModalType('edit');
        setIsModalOpen(true);
    };

    const openDeleteModal = (tariff: any) => {
        setCurrentTariff(tariff);
        setModalType('delete');
        setDeleteConfirmed(false);
        setIsModalOpen(true);
    };

    const openAddRangeModal = (tariff: any, rangeType: any) => {
        setCurrentTariff(tariff);

        const ranges = rangeType === 'fixed' ? tariff.fixedRanges : tariff.percentageRanges;

        const highestRange = [...ranges].sort((a, b) => (b.max || Infinity) - (a.max || Infinity))[0];
        const suggestedMin = highestRange && highestRange.max !== null ? highestRange.max + 1 : 0;

        setRangeFormData({
            min: suggestedMin,
            max: null,
            fee: 0
        });

        setModalType(rangeType === 'fixed' ? 'addFixedRange' : 'addPercentageRange');
        setIsModalOpen(true);
    };

    const openEditRangeModal = (tariff: any, range: any, rangeType: any) => {
        setCurrentTariff(tariff);
        setCurrentRange(range);
        setRangeFormData({
            min: range.min,
            max: range.max,
            fee: range.fee
        });
        setModalType(rangeType === 'fixed' ? 'editFixedRange' : 'editPercentageRange');
        setIsModalOpen(true);
    };

    const openDeleteRangeModal = (tariff, range, rangeType) => {
        setCurrentTariff(tariff);
        setCurrentRange(range);
        setModalType(rangeType === 'fixed' ? 'deleteFixedRange' : 'deletePercentageRange');
        setDeleteConfirmed(false);
        setIsModalOpen(true);
    };

    const handleTypeChange = async (id: any, type: any) => {
        const tariff = tariffs.find(t => t.id === id);
        if (!tariff) return;

        setIsLoading(true);
        setError(null);

        try {
            await financeService.updateTariff(id, { type });

            setTariffs(tariffs.map(t =>
                t.id === id ? {
                    ...t,
                    type,
                    lastUpdated: new Date().toISOString().split('T')[0]
                } : t
            ));

            showSuccess(`Tariff type updated to ${type}`);
        } catch (err) {
            setError('Failed to update tariff type. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleValueChange = async (id: string, value: any) => {
        const numValue = parseFloat(value) || 0;

        setIsLoading(true);
        setError(null);

        try {
            await financeService.updateTariff(id, { value: numValue });

            setTariffs(tariffs.map(tariff =>
                tariff.id === id ? { ...tariff, value: numValue } : tariff
            ));
        } catch (err) {
            setError('Failed to update tariff value. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTariff = async () => {
        if (!currentTariff) return;

        setIsLoading(true);
        setError(null);

        try {
            await financeService.deleteTariff(currentTariff.id);
            setTariffs(tariffs.filter(tariff => tariff.id !== currentTariff.id));

            showSuccess('Tariff deleted successfully');
        } catch (err) {
            setError('Failed to delete tariff. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
            setModalType(null);
            setCurrentTariff(null);
        }
    };

    const handleAddRange = async (rangeType: any) => {
        if (!currentTariff) return;

        if (rangeFormData.min < 0) {
            showSuccess('Minimum value cannot be negative');
            return;
        }

        if (rangeFormData.max !== null && rangeFormData.max <= rangeFormData.min) {
            showSuccess('Maximum value must be greater than minimum value');
            return;
        }

        const ranges = rangeType === 'fixed' ? currentTariff.fixedRanges : currentTariff.percentageRanges;

        const overlapping = ranges.some(range => {
            const rangeMin = range.min;
            const rangeMax = range.max === null ? Infinity : range.max;
            const newMin = rangeFormData.min;
            const newMax = rangeFormData.max === null ? Infinity : rangeFormData.max;
            return (newMin <= rangeMax && newMax >= rangeMin);
        });

        if (overlapping) {
            showSuccess('This range overlaps with an existing range');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const rangeData = {
                walletBillingId: currentTariff.id,
                min: rangeFormData.min,
                max: rangeFormData.max,
                fee: rangeFormData.fee
            };

            let newRange;
            if (rangeType === 'fixed') {
                newRange = await financeService.createFixedRange(rangeData);
            } else {
                newRange = await financeService.createPercentageFeeRange(rangeData);
            }

            fetchTariffs();
            showSuccess('Range added successfully');
        } catch (err) {
            setError('Failed to add range. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
            setModalType(null);
            setCurrentTariff(null);
            setCurrentRange(null);
        }
    };

    const handleEditRange = async (rangeType) => {
        if (!currentTariff || !currentRange) return;

        if (rangeFormData.min < 0) {
            showSuccess('Minimum value cannot be negative');
            return;
        }

        if (rangeFormData.max !== null && rangeFormData.max <= rangeFormData.min) {
            showSuccess('Maximum value must be greater than minimum value');
            return;
        }

        const ranges = rangeType === 'fixed' ? currentTariff.fixedRanges : currentTariff.percentageRanges;

        const overlapping = ranges.some(range => {
            if (range.id === currentRange.id) return false;

            const rangeMin = range.min;
            const rangeMax = range.max === null ? Infinity : range.max;
            const newMin = rangeFormData.min;
            const newMax = rangeFormData.max === null ? Infinity : rangeFormData.max;

            return (newMin <= rangeMax && newMax >= rangeMin);
        });

        if (overlapping) {
            showSuccess('This range overlaps with an existing range');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const updateData = {
                min: rangeFormData.min,
                max: rangeFormData.max,
                fee: rangeFormData.fee
            };

            if (rangeType === 'fixed') {
                await financeService.updateFixedRange(currentRange.id, updateData);
            } else {
                await financeService.updatePercentageFeeRange(currentRange.id, updateData);
            }

            setTariffs(tariffs.map(tariff =>
                tariff.id === currentTariff.id
                    ? {
                        ...tariff,
                        ...(rangeType === 'fixed'
                            ? {
                                fixedRanges: tariff.fixedRanges.map(range =>
                                    range.id === currentRange.id
                                        ? { ...range, ...rangeFormData }
                                        : range
                                ).sort((a: any, b: any) => a.min - b.min)
                            }
                            : {
                                percentageRanges: tariff.percentageRanges.map(range =>
                                    range.id === currentRange.id
                                        ? { ...range, ...rangeFormData }
                                        : range
                                ).sort((a, b) => a.min - b.min)
                            }
                        ),
                        lastUpdated: new Date().toISOString().split('T')[0]
                    }
                    : tariff
            ));

            showSuccess('Range updated successfully');
        } catch (err) {
            setError('Failed to update range. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
            setModalType(null);
            setCurrentTariff(null);
            setCurrentRange(null);
        }
    };

    const handleDeleteRange = async (rangeType) => {
        if (!currentTariff || !currentRange) return;

        const ranges = rangeType === 'fixed' ? currentTariff.fixedRanges : currentTariff.percentageRanges;

        if (ranges.length === 1) {
            showSuccess(`Cannot delete the last ${rangeType} range.`);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (rangeType === 'fixed') {
                await financeService.deleteFixedRange(currentRange.id);
            } else {
                await financeService.deletePercentageFeeRange(currentRange.id);
            }

            setTariffs(tariffs.map(tariff =>
                tariff.id === currentTariff.id
                    ? {
                        ...tariff,
                        ...(rangeType === 'fixed'
                            ? {
                                fixedRanges: tariff.fixedRanges.filter(range =>
                                    range.id !== currentRange.id
                                )
                            }
                            : {
                                percentageRanges: tariff.percentageRanges.filter(range =>
                                    range.id !== currentRange.id
                                )
                            }
                        ),
                        lastUpdated: new Date().toISOString().split('T')[0]
                    }
                    : tariff
            ));

            showSuccess('Range deleted successfully');
        } catch (err) {
            setError('Failed to delete range. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
            setModalType(null);
            setCurrentTariff(null);
            setCurrentRange(null);
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
            case 'addFixedRange':
                return 'Add New Fixed Range';
            case 'editFixedRange':
                return 'Edit Fixed Range';
            case 'deleteFixedRange':
                return 'Delete Fixed Range';
            case 'addPercentageRange':
                return 'Add New Percentage Range';
            case 'editPercentageRange':
                return 'Edit Percentage Range';
            case 'deletePercentageRange':
                return 'Delete Percentage Range';
            default:
                return '';
        }
    };

    const handleModalSubmit = () => {
        switch (modalType) {
            case 'delete':
                return handleDeleteTariff();
            case 'addFixedRange':
                return handleAddRange('fixed');
            case 'editFixedRange':
                return handleEditRange('fixed');
            case 'deleteFixedRange':
                return handleDeleteRange('fixed');
            case 'addPercentageRange':
                return handleAddRange('percentage');
            case 'editPercentageRange':
                return handleEditRange('percentage');
            case 'deletePercentageRange':
                return handleDeleteRange('percentage');
            default:
                return;
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
                                onClick={openAddModal}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                                <span>New Tariff</span>
                            </button>
                        </div>
                    </div>

                    <TariffsList
                        tariffs={filteredTariffs}
                        isLoading={isLoading}
                        error={error}
                        successMessage={successMessage}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        expandedRows={expandedRows}
                        toggleRowExpansion={toggleRowExpansion}
                        handleTypeChange={handleTypeChange}
                        handleValueChange={handleValueChange}
                        openEditModal={openEditModal}
                        openDeleteModal={openDeleteModal}
                        openAddRangeModal={openAddRangeModal}
                        openEditRangeModal={openEditRangeModal}
                        openDeleteRangeModal={openDeleteRangeModal}
                    />
                </div>

                <div className="mt-6 bg-blue-50/70 rounded-xl p-3 border border-blue-100 backdrop-blur-sm">
                    <div className="flex items-start gap-2">
                        <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-blue-700">About Tariffs</h3>
                            <p className="text-blue-600 text-xs mt-0.5 leading-relaxed">
                                Tariffs can be configured as either a flat rate (with transaction amount ranges) or a percentage of the transaction value.
                                For flat rate tariffs, you can define different fees for different transaction amount ranges. For percentage tariffs, you can define different percentages for different transaction amount ranges.
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
                size={
                    ['delete', 'deleteFixedRange', 'deletePercentageRange'].includes(modalType)
                        ? 'sm'
                        : ['addFixedRange', 'editFixedRange', 'addPercentageRange', 'editPercentageRange'].includes(modalType)
                            ? 'md'
                            : 'lg'
                }
            >
                {modalType === 'add' || modalType === 'edit' ? (
                    <TariffForm
                        formData={formData}
                        setFormData={setFormData}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        setError={setError}
                        currentTariff={currentTariff}
                        financeService={financeService}
                        tariffs={tariffs}
                        setTariffs={setTariffs}
                        showSuccess={showSuccess}
                        setIsModalOpen={setIsModalOpen}
                        setModalType={setModalType}
                        setCurrentTariff={setCurrentTariff}
                    />
                ) : ['addFixedRange', 'editFixedRange', 'addPercentageRange', 'editPercentageRange'].includes(modalType) ? (
                    <RangeForm
                        rangeFormData={rangeFormData}
                        setRangeFormData={setRangeFormData}
                        isLoading={isLoading}
                        onSubmit={handleModalSubmit}
                        onCancel={() => {
                            setIsModalOpen(false);
                            setModalType(null);
                            setCurrentTariff(null);
                            setCurrentRange(null);
                        }}
                    />
                ) : ['delete', 'deleteFixedRange', 'deletePercentageRange'].includes(modalType) ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center w-full">
                            <div className="bg-red-100 p-3 rounded-full">
                                <AlertTriangle size={28} className="text-red-600" />
                            </div>
                        </div>

                        <div className="text-center">
                            <h3 className="text-lg font-bold text-red-700 mb-1">Critical Operation</h3>

                            {modalType === 'delete' ? (
                                <p className="text-gray-700">
                                    You are about to <span className="font-bold text-red-600">permanently delete</span> the tariff:
                                    <div className="text-lg font-semibold mt-2 mb-2 text-gray-900 border-y border-red-100 py-2">
                                        {currentTariff?.name}
                                    </div>
                                </p>
                            ) : (
                                <p className="text-gray-700">
                                    You are about to <span className="font-bold text-red-600">permanently delete</span> this range
                                    from the <span className="font-semibold">{currentTariff?.name}</span> tariff.
                                </p>
                            )}
                        </div>

                        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md">
                            <p className="text-sm text-red-800">
                                <span className="font-bold">CAUTION:</span> {modalType === 'delete' ?
                                    "Deleting this tariff will remove all associated pricing tiers and may impact active transactions. Users currently charged under this tariff may be affected." :
                                    "Deleting this range will remove the pricing tier. Any transactions that would have fallen in this range may be charged differently or fail."
                                }
                            </p>
                        </div>

                        <div className="mt-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="rounded border-red-300 text-red-600 focus:ring-red-500 h-4 w-4"
                                    onChange={(e) => setDeleteConfirmed(e.target.checked)}
                                    disabled={isLoading}
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    I understand that this action cannot be undone
                                </span>
                            </label>
                        </div>

                        <div className="flex justify-between gap-2 mt-5 pt-3 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setModalType(null);
                                    setCurrentTariff(null);
                                    setCurrentRange(null);
                                    setDeleteConfirmed(false);
                                }}
                                className="flex-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleModalSubmit}
                                disabled={isLoading || !deleteConfirmed}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5
                ${deleteConfirmed && !isLoading
                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                        : 'bg-red-300 text-white cursor-not-allowed'}`}
                            >
                                {isLoading ? (
                                    <Loader size={14} className="animate-spin mr-1.5" />
                                ) : (
                                    <Trash2 size={16} className="mr-1" />
                                )}
                                {isLoading ? "Processing..." : "Delete Permanently"}
                            </button>
                        </div>
                    </div>
                ) : null}
            </Modal>
        </div>
    );
};

export default page;