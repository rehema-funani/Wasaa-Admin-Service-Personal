import React from 'react';
import { Percent, DollarSign, Plus, X, Loader } from 'lucide-react';

const TariffForm = ({
  formData,
  setFormData,
  isLoading,
  setIsLoading,
  setError,
  currentTariff,
  financeService,
  tariffs,
  setTariffs,
  showSuccess,
  setIsModalOpen,
  setModalType,
  setCurrentTariff
}) => {
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle form type change
  const handleFormTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      // Initialize ranges based on type
      ...(type === 'flat' && prev.fixedRanges.length === 0 && {
        fixedRanges: [{ id: 'new-1', min: 0, max: null, fee: 0 }]
      }),
      ...(type === 'percentage' && prev.percentageRanges.length === 0 && {
        percentageRanges: [{ id: 'new-1', min: 0, max: null, fee: 0 }]
      })
    }));
  };

  // Handle form status change
  const handleFormStatusChange = (status) => {
    setFormData(prev => ({
      ...prev,
      status
    }));
  };

  const handleAddFormRange = (rangeType) => {
    const ranges = rangeType === 'fixed' ? formData.fixedRanges : formData.percentageRanges;
    const tempId = `new-${ranges.length + 1}`;

    const highestRange = [...ranges].sort((a, b) => (b.max || Infinity) - (a.max || Infinity))[0];
    const suggestedMin = highestRange && highestRange.max !== null ? highestRange.max + 1 : 0;

    const newRange = { id: tempId, min: suggestedMin, max: null, fee: 0 };

    if (rangeType === 'fixed') {
      setFormData(prev => ({
        ...prev,
        fixedRanges: [...prev.fixedRanges, newRange].sort((a, b) => a.min - b.min)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        percentageRanges: [...prev.percentageRanges, newRange].sort((a, b) => a.min - b.min)
      }));
    }
  };

  const handleRemoveFormRange = (id, rangeType) => {
    const ranges = rangeType === 'fixed' ? formData.fixedRanges : formData.percentageRanges;

    if (ranges.length === 1) {
      showSuccess(`Cannot delete the last ${rangeType} range.`);
      return;
    }

    if (rangeType === 'fixed') {
      setFormData(prev => ({
        ...prev,
        fixedRanges: prev.fixedRanges.filter(range => range.id !== id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        percentageRanges: prev.percentageRanges.filter(range => range.id !== id)
      }));
    }
  };

  // Handle updating a range in the form data
  const handleUpdateFormRange = (id, field, value, rangeType) => {
    // Handle null for max value
    if (field === 'max' && (value === '' || value === 'null')) {
      if (rangeType === 'fixed') {
        setFormData(prev => ({
          ...prev,
          fixedRanges: prev.fixedRanges.map(range =>
            range.id === id
              ? { ...range, max: null }
              : range
          )
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          percentageRanges: prev.percentageRanges.map(range =>
            range.id === id
              ? { ...range, max: null }
              : range
          )
        }));
      }
      return;
    }

    if (rangeType === 'fixed') {
      setFormData(prev => ({
        ...prev,
        fixedRanges: prev.fixedRanges.map(range =>
          range.id === id
            ? { ...range, [field]: field === 'min' || field === 'max' || field === 'fee' ? parseFloat(value) || 0 : value }
            : range
        ).sort((a, b) => a.min - b.min)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        percentageRanges: prev.percentageRanges.map(range =>
          range.id === id
            ? { ...range, [field]: field === 'min' || field === 'max' || field === 'fee' ? parseFloat(value) || 0 : value }
            : range
        ).sort((a, b) => a.min - b.min)
      }));
    }
  };

  const validateRanges = (ranges) => {
    const rangeMap = new Map();
    let hasOverlap = false;

    for (const range of ranges) {
      const min = range.min;
      const max = range.max === null ? Infinity : range.max;

      if (min < 0) {
        showSuccess('Minimum value cannot be negative');
        return false;
      }

      if (max !== Infinity && max <= min) {
        showSuccess('Maximum value must be greater than minimum value');
        return false;
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
      showSuccess('There are overlapping ranges. Please fix them before saving.');
      return false;
    }

    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate the appropriate ranges based on tariff type
    if (formData.type === 'flat' && !validateRanges(formData.fixedRanges)) {
      return;
    }

    if (formData.type === 'percentage' && !validateRanges(formData.percentageRanges)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!currentTariff) {
        // Create new tariff in API - only sending required fields in the correct format
        const tariffToCreate = {
          name: formData.name,
          description: formData.description,
          type: formData.type,
          status: formData.status
        };

        // Only include value if it's a percentage type
        if (formData.type === 'percentage') {
          tariffToCreate.value = formData.value;
        }

        const createdTariff = await financeService.createTariff(tariffToCreate);

        // Create ranges based on tariff type
        let createdFixedRanges = [];
        let createdPercentageRanges = [];

        if (formData.type === 'flat') {
          createdFixedRanges = await Promise.all(
            formData.fixedRanges.map(async (range) => {
              const rangeToCreate = {
                walletBillingId: createdTariff.id,
                min: range.min,
                max: range.max,
                fee: range.fee
              };

              const createdRange = await financeService.createFixedRange(rangeToCreate);

              return {
                id: createdRange.id,
                min: createdRange.min,
                max: createdRange.max,
                fee: createdRange.fee
              };
            })
          );
        } else if (formData.type === 'percentage') {
          createdPercentageRanges = await Promise.all(
            formData.percentageRanges.map(async (range) => {
              const rangeToCreate = {
                walletBillingId: createdTariff.id,
                min: range.min,
                max: range.max,
                fee: range.fee
              };

              const createdRange = await financeService.createPercentageRange(rangeToCreate);

              return {
                id: createdRange.id,
                min: createdRange.min,
                max: createdRange.max,
                fee: createdRange.fee
              };
            })
          );
        }

        // Add new tariff to local state
        const newTariff = {
          id: createdTariff.id,
          name: createdTariff.name,
          description: createdTariff.description,
          type: createdTariff.type,
          value: createdTariff.value || 0,
          fixedRanges: createdFixedRanges,
          percentageRanges: createdPercentageRanges,
          status: createdTariff.status,
          lastUpdated: new Date().toISOString().split('T')[0]
        };

        setTariffs([...tariffs, newTariff]);
        showSuccess('Tariff added successfully');
      } else {
        const tariffToUpdate = {
          name: formData.name,
          description: formData.description,
          type: formData.type,
          status: formData.status
        };

        if (formData.type === 'percentage') {
          tariffToUpdate.value = formData.value;
        }

        await financeService.updateTariff(currentTariff.id, tariffToUpdate);

        // Handle fixed ranges
        let updatedFixedRanges = [];
        if (formData.type === 'flat') {
          // Get existing range IDs
          const existingRangeIds = currentTariff.fixedRanges.map(r => r.id);

          // Process each range in form data
          updatedFixedRanges = await Promise.all(
            formData.fixedRanges.map(async (range) => {
              // Check if this is an existing range or new one
              if (existingRangeIds.includes(range.id)) {
                // Update existing range
                await financeService.updateFixedRange(range.id, {
                  min: range.min,
                  max: range.max,
                  fee: range.fee
                });
                return range;
              } else {
                // Create new range
                const rangeToCreate = {
                  walletBillingId: currentTariff.id,
                  min: range.min,
                  max: range.max,
                  fee: range.fee
                };

                const createdRange = await financeService.createFixedRange(rangeToCreate);

                return {
                  id: createdRange.id,
                  min: createdRange.min,
                  max: createdRange.max,
                  fee: createdRange.fee
                };
              }
            })
          );

          // Find and delete ranges that were removed
          const formRangeIds = formData.fixedRanges.map(r => r.id);
          const rangesToDelete = currentTariff.fixedRanges.filter(r => !formRangeIds.includes(r.id));

          await Promise.all(
            rangesToDelete.map(range => financeService.deleteFixedRange(range.id))
          );
        }

        // Handle percentage ranges
        let updatedPercentageRanges = [];
        if (formData.type === 'percentage') {
          // Get existing range IDs
          const existingRangeIds = currentTariff.percentageRanges.map(r => r.id);

          // Process each range in form data
          updatedPercentageRanges = await Promise.all(
            formData.percentageRanges.map(async (range) => {
              // Check if this is an existing range or new one
              if (existingRangeIds.includes(range.id)) {
                // Update existing range
                await financeService.updatePercentageRange(range.id, {
                  min: range.min,
                  max: range.max,
                  fee: range.fee
                });
                return range;
              } else {
                // Create new range
                const rangeToCreate = {
                  walletBillingId: currentTariff.id,
                  min: range.min,
                  max: range.max,
                  fee: range.fee
                };

                const createdRange = await financeService.createPercentageRange(rangeToCreate);

                return {
                  id: createdRange.id,
                  min: createdRange.min,
                  max: createdRange.max,
                  fee: createdRange.fee
                };
              }
            })
          );

          // Find and delete ranges that were removed
          const formRangeIds = formData.percentageRanges.map(r => r.id);
          const rangesToDelete = currentTariff.percentageRanges.filter(r => !formRangeIds.includes(r.id));

          await Promise.all(
            rangesToDelete.map(range => financeService.deletePercentageRange(range.id))
          );
        }

        // Update local state
        setTariffs(tariffs.map(tariff =>
          tariff.id === currentTariff.id
            ? {
              ...tariff,
              name: formData.name,
              description: formData.description,
              type: formData.type,
              value: formData.value,
              fixedRanges: formData.type === 'flat' ? updatedFixedRanges : [],
              percentageRanges: formData.type === 'percentage' ? updatedPercentageRanges : [],
              status: formData.status,
              lastUpdated: new Date().toISOString().split('T')[0]
            }
            : tariff
        ));

        showSuccess('Tariff updated successfully');
      }
    } catch (err) {
      setError('Failed to save tariff. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      setModalType(null);
      setCurrentTariff(null);
    }
  };

  return (
    <div className="space-y-4">
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
            disabled={isLoading}
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
            disabled={isLoading}
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
                ? 'bg-white text-gray-800 font-medium'
                : 'text-gray-500'
                }`}
              disabled={isLoading}
            >
              <DollarSign size={12} />
              <span>Flat Rate</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormTypeChange('percentage')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${formData.type === 'percentage'
                ? 'bg-white text-gray-800 font-medium'
                : 'text-gray-500'
                }`}
              disabled={isLoading}
            >
              <Percent size={12} />
              <span>Percentage</span>
            </button>
          </div>
        </div>

        {formData.type === 'percentage' && (
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
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Percent size={14} className="text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {/* Fixed Fee Ranges */}
        {formData.type === 'flat' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-medium text-gray-700">
                Fixed Fee Ranges
              </label>
              <button
                type="button"
                onClick={() => handleAddFormRange('fixed')}
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-xs"
                disabled={isLoading}
              >
                <Plus size={14} />
                <span>Add Range</span>
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {formData.fixedRanges.map((range, index) => (
                <div
                  key={range.id}
                  className="p-3 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-700">Range {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFormRange(range.id, 'fixed')}
                      className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50"
                      disabled={isLoading || formData.fixedRanges.length === 1}
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
                        onChange={(e) => handleUpdateFormRange(range.id, 'min', e.target.value, 'fixed')}
                        min="0"
                        required
                        className="w-full py-1.5 px-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-xs"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Max (KES)
                      </label>
                      <input
                        type="text" // Using text to allow "null" value
                        value={range.max === null ? '' : range.max}
                        onChange={(e) => handleUpdateFormRange(range.id, 'max', e.target.value, 'fixed')}
                        placeholder="Leave empty for 'and above'"
                        className="w-full py-1.5 px-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-xs"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Fee (KES)
                      </label>
                      <input
                        type="number"
                        value={range.fee}
                        onChange={(e) => handleUpdateFormRange(range.id, 'fee', e.target.value, 'fixed')}
                        min="0"
                        step="0.1"
                        required
                        className="w-full py-1.5 px-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-xs"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Percentage Fee Ranges */}
        {formData.type === 'percentage' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-medium text-gray-700">
                Percentage Fee Ranges
              </label>
              <button
                type="button"
                onClick={() => handleAddFormRange('percentage')}
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-xs"
                disabled={isLoading}
              >
                <Plus size={14} />
                <span>Add Range</span>
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {formData.percentageRanges.map((range, index) => (
                <div
                  key={range.id}
                  className="p-3 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-700">Range {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFormRange(range.id, 'percentage')}
                      className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50"
                      disabled={isLoading || formData.percentageRanges.length === 1}
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
                        onChange={(e) => handleUpdateFormRange(range.id, 'min', e.target.value, 'percentage')}
                        min="0"
                        required
                        className="w-full py-1.5 px-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-xs"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Max (KES)
                      </label>
                      <input
                        type="text" // Using text to allow "null" value
                        value={range.max === null ? '' : range.max}
                        onChange={(e) => handleUpdateFormRange(range.id, 'max', e.target.value, 'percentage')}
                        placeholder="Leave empty for 'and above'"
                        className="w-full py-1.5 px-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-xs"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Fee (%)
                      </label>
                      <input
                        type="number"
                        value={range.fee}
                        onChange={(e) => handleUpdateFormRange(range.id, 'fee', e.target.value, 'percentage')}
                        min="0"
                        step="0.1"
                        required
                        className="w-full py-1.5 px-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-xs"
                        disabled={isLoading}
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
                ? 'bg-white text-gray-800 font-medium'
                : 'text-gray-500'
                }`}
              disabled={isLoading}
            >
              <span>Active</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormStatusChange('inactive')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${formData.status === 'inactive'
                ? 'bg-white text-gray-800 font-medium'
                : 'text-gray-500'
                }`}
              disabled={isLoading}
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
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleFormSubmit}
          className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center gap-1.5"
          disabled={isLoading}
        >
          {isLoading && <Loader size={14} className="animate-spin" />}
          {!currentTariff ? 'Add Tariff' : 'Update Tariff'}
        </button>
      </div>
    </div>
  );
};

export default TariffForm;