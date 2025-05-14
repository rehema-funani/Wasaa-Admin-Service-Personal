import React, { useState, useEffect } from 'react';
import { Save, Info, Loader, Plus } from 'lucide-react';
import financeService from '../../../../api/services/finance';
import { Modal } from '../../../../components/common/Modal';
import { ModalType, Tariff, TariffRange } from '../../../../types/finance';
import TariffsList from './TariffsList';
import TariffForm from './TariffForm';
import RangeForm from './RangeForm';

const TariffsManagement = () => {
    const [tariffs, setTariffs] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [currentTariff, setCurrentTariff] = useState<any>(null);
    const [currentRange, setCurrentRange] = useState<any>(null);
    const [expandedRows, setExpandedRows] = useState<any>({});
    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        type: string;
        value: number;
        fixedRanges: { id: string; min: number; max: number | null; fee: number }[];
        percentageRanges: { id: string; min: number; max: number | null; fee: number }[];
        status: string;
    }>({
        name: '',
        description: '',
        type: 'flat',
        value: 0,
        fixedRanges: [],
        percentageRanges: [],
        status: 'active'
    });

    const [rangeFormData, setRangeFormData] = useState<Omit<TariffRange, 'id'>>({
        min: 0,
        max: null,
        fee: 0
    });

    // Load tariffs on component mount
    useEffect(() => {
        fetchTariffs();
    }, []);

    // Fetch all tariffs and their fee ranges
    const fetchTariffs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const tariffsData = await financeService.getAllTariffs();

            const formattedTariffs = tariffsData?.walletBillings?.map((tariff) => {
                // Format for our frontend model
                const formattedTariff: any = {
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

    const toggleRowExpansion = (id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Helper function to show success message
    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    // Handle saving all changes
    const handleSave = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // This could be a bulk update endpoint in your API
            // For now, we'll just inform the user that changes are saved
            showSuccess('All tariff changes have been saved successfully');
        } catch (err) {
            setError('Failed to save changes. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Open modal for adding new tariff
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

    // Open modal for editing tariff
    const openEditModal = (tariff: Tariff) => {
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

    // Open modal for deleting tariff
    const openDeleteModal = (tariff: Tariff) => {
        setCurrentTariff(tariff);
        setModalType('delete');
        setIsModalOpen(true);
    };

    // Open modal for adding range to a tariff
    const openAddRangeModal = (tariff: Tariff, rangeType: 'fixed' | 'percentage') => {
        setCurrentTariff(tariff);

        const ranges = rangeType === 'fixed' ? tariff.fixedRanges : tariff.percentageRanges;

        // Find highest range to suggest a new min value
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

    const openEditRangeModal = (tariff: Tariff, range: TariffRange, rangeType: 'fixed' | 'percentage') => {
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

    const openDeleteRangeModal = (tariff: Tariff, range: TariffRange, rangeType: 'fixed' | 'percentage') => {
        setCurrentTariff(tariff);
        setCurrentRange(range);
        setModalType(rangeType === 'fixed' ? 'deleteFixedRange' : 'deletePercentageRange');
        setIsModalOpen(true);
    };

    // Handler for changing tariff type (flat/percentage)
    const handleTypeChange = async (id: string, type: 'flat' | 'percentage' | 'tiered') => {
        const tariff = tariffs.find(t => t.id === id);
        if (!tariff) return;

        setIsLoading(true);
        setError(null);

        try {
            // Update tariff type in the API
            await financeService.updateTariff(id, { type });

            // Update local state
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

    // Handler for changing percentage tariff value
    const handleValueChange = async (id: string, value: string) => {
        const numValue = parseFloat(value) || 0;

        setIsLoading(true);
        setError(null);

        try {
            // Update tariff value in the API
            await financeService.updateTariff(id, { value: numValue } as Partial<Tariff>);

            // Update local state
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

    // Handle deleting a tariff
    const handleDeleteTariff = async () => {
        if (!currentTariff) return;

        setIsLoading(true);
        setError(null);

        try {
            // Delete tariff from API
            await financeService.deleteTariff(currentTariff.id);

            // Remove tariff from local state
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

    // Handle adding a range (works for both fixed and percentage ranges)
    const handleAddRange = async (rangeType: 'fixed' | 'percentage') => {
        if (!currentTariff) return;

        // Validate range
        if (rangeFormData.min < 0) {
            showSuccess('Minimum value cannot be negative');
            return;
        }

        if (rangeFormData.max !== null && rangeFormData.max <= rangeFormData.min) {
            showSuccess('Maximum value must be greater than minimum value');
            return;
        }

        // Check for overlapping ranges
        const ranges = rangeType === 'fixed' ? currentTariff.fixedRanges : currentTariff.percentageRanges;

        const overlapping = ranges.some(range => {
            const rangeMin = range.min;
            const rangeMax = range.max === null ? Infinity : range.max;
            const newMin = rangeFormData.min;
            const newMax = rangeFormData.max === null ? Infinity : rangeFormData.max;

            // Check for overlap
            return (newMin <= rangeMax && newMax >= rangeMin);
        });

        if (overlapping) {
            showSuccess('This range overlaps with an existing range');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const endpoint = rangeType === 'fixed' ?
                financeService.createFeeRange :
                financeService.createPercentageRange;

            const newRange = await endpoint({
                walletBillingId: currentTariff.id,
                min: rangeFormData.min,
                max: rangeFormData.max,
                fee: rangeFormData.fee
            });

            // Add range to tariff in local state
            setTariffs(tariffs.map(tariff =>
                tariff.id === currentTariff.id
                    ? {
                        ...tariff,
                        ...(rangeType === 'fixed'
                            ? {
                                fixedRanges: [...tariff.fixedRanges, {
                                    id: newRange.id,
                                    min: newRange.min,
                                    max: newRange.max,
                                    fee: newRange.fee
                                }].sort((a, b) => a.min - b.min)
                            }
                            : {
                                percentageRanges: [...tariff.percentageRanges, {
                                    id: newRange.id,
                                    min: newRange.min,
                                    max: newRange.max,
                                    fee: newRange.fee
                                }].sort((a, b) => a.min - b.min)
                            }
                        ),
                        lastUpdated: new Date().toISOString().split('T')[0]
                    }
                    : tariff
            ));

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

    // Handle editing a range
    const handleEditRange = async (rangeType: 'fixed' | 'percentage') => {
        if (!currentTariff || !currentRange) return;

        // Validate range
        if (rangeFormData.min < 0) {
            showSuccess('Minimum value cannot be negative');
            return;
        }

        if (rangeFormData.max !== null && rangeFormData.max <= rangeFormData.min) {
            showSuccess('Maximum value must be greater than minimum value');
            return;
        }

        // Check for overlapping ranges (excluding the current range)
        const ranges = rangeType === 'fixed' ? currentTariff.fixedRanges : currentTariff.percentageRanges;

        const overlapping = ranges.some(range => {
            if (range.id === currentRange.id) return false;

            const rangeMin = range.min;
            const rangeMax = range.max === null ? Infinity : range.max;
            const newMin = rangeFormData.min;
            const newMax = rangeFormData.max === null ? Infinity : rangeFormData.max;

            // Check for overlap
            return (newMin <= rangeMax && newMax >= rangeMin);
        });

        if (overlapping) {
            showSuccess('This range overlaps with an existing range');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Update range in API
            const endpoint = rangeType === 'fixed' ?
                financeService.updateFixedRange :
                financeService.updatePercentageRange;

            await endpoint(currentRange.id, {
                min: rangeFormData.min,
                max: rangeFormData.max,
                fee: rangeFormData.fee
            });

            // Update range in local state
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
                                ).sort((a, b) => a.min - b.min)
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

    // Handle deleting a range
    const handleDeleteRange = async (rangeType: 'fixed' | 'percentage') => {
        if (!currentTariff || !currentRange) return;

        // Check if this is the last range
        const ranges = rangeType === 'fixed' ? currentTariff.fixedRanges : currentTariff.percentageRanges;

        if (ranges.length === 1) {
            showSuccess(`Cannot delete the last ${rangeType} range.`);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Delete range from API
            const endpoint = rangeType === 'fixed' ?
                financeService.deleteFixedRange :
                financeService.deletePercentageRange;

            await endpoint(currentRange.id);

            // Remove range from local state
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
                                onClick={handleSave}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all text-sm"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                                <span>Save Changes</span>
                            </button>

                            <button
                                onClick={openAddModal}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-sm"
                                disabled={isLoading}
                            >
                                <Plus size={16} />
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

                {/* Info Card */}
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
                    ['delete', 'deleteFixedRange', 'deletePercentageRange'].includes(modalType || '')
                        ? 'sm'
                        : ['addFixedRange', 'editFixedRange', 'addPercentageRange', 'editPercentageRange'].includes(modalType || '')
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
                ) : ['addFixedRange', 'editFixedRange', 'addPercentageRange', 'editPercentageRange'].includes(modalType || '') ? (
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
                ) : ['delete', 'deleteFixedRange', 'deletePercentageRange'].includes(modalType || '') ? (
                    <div className="space-y-3">
                        <p className="text-gray-700 text-sm">
                            Are you sure you want to delete {modalType === 'delete' ? 'the tariff ' : 'this range'}
                            {modalType === 'delete' && <span className="font-semibold"> {currentTariff?.name}</span>}?
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
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleModalSubmit}
                                className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm flex items-center gap-1.5"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader size={14} className="animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                ) : null}
            </Modal>
        </div>
    );
};

export default TariffsManagement;