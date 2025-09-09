import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Minus,
  Calendar,
  DollarSign,
  Target,
  User,
  Briefcase,
  AlertCircle,
  X,
  Check,
  CreditCard,
  Info
} from 'lucide-react';
import { escrowService } from '../../../api/services/escrow';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

const CreateSystemEscrowPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    tenantId: "82208244-c5f4-4144-9d08-fa3779b5c154", // default tenant ID
    buyerId: "",
    sellerId: "",
    paymentMethodId: "3",
    has_milestone: false,
    agreementType: "BUSINESS",
    currency: "KES",
    amountMinor: "",
    system: "yes",
    purpose: "",
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)), // 3 months from now
    milestones: [] as any[],
  });

  const [milestone, setMilestone] = useState({
    amountMinor: "",
    name: "",
    description: "",
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)), // 3 months from now
    completedDate: new Date(new Date().setMonth(new Date().getMonth() + 3)), // 3 months from now
    order: 0,
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.buyerId) newErrors.buyerId = "Buyer ID is required";
    if (!formData.sellerId) newErrors.sellerId = "Seller ID is required";
    if (!formData.amountMinor) newErrors.amountMinor = "Amount is required";
    if (!formData.purpose) newErrors.purpose = "Purpose is required";

    // Validate amount
    if (
      formData.amountMinor &&
      parseInt(formData.amountMinor.toString()) <= 0
    ) {
      newErrors.amountMinor = "Amount must be greater than 0";
    }

    // Validate milestones if has_milestone is true
    if (formData.has_milestone && formData.milestones.length === 0) {
      newErrors.milestones = "At least one milestone is required";
    }

    // Validate that milestone amounts don't exceed total amount
    if (
      formData.has_milestone &&
      formData.milestones.length > 0 &&
      formData.amountMinor
    ) {
      const totalMilestoneAmount = formData.milestones.reduce(
        (sum, m) => sum + parseInt(m.amountMinor.toString()),
        0
      );

      if (totalMilestoneAmount > parseInt(formData.amountMinor.toString())) {
        newErrors.milestones =
          "Total milestone amounts cannot exceed the escrow amount";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Handle checkboxes
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
      return;
    }

    // Handle numeric inputs
    if (name === "amountMinor") {
      // Only allow numbers
      if (value && !/^\d+$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleMilestoneChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Handle numeric inputs
    if (name === "amountMinor") {
      // Only allow numbers
      if (value && !/^\d+$/.test(value)) return;
    }

    setMilestone({ ...milestone, [name]: value });
  };

  const handleDateChange = (date: Date | null, fieldName: string) => {
    if (date) {
      setFormData({ ...formData, [fieldName]: date });
    }
  };

  const handleMilestoneDateChange = (date: Date | null, fieldName: string) => {
    if (date) {
      setMilestone({ ...milestone, [fieldName]: date });
    }
  };

  const addMilestone = () => {
    // Validate milestone
    if (!milestone.name) {
      setErrors({ ...errors, milestoneName: "Milestone name is required" });
      return;
    }
    if (!milestone.amountMinor) {
      setErrors({ ...errors, milestoneAmount: "Milestone amount is required" });
      return;
    }

    // Add milestone to the list
    const newMilestones = [
      ...formData.milestones,
      { ...milestone, order: formData.milestones.length },
    ];

    setFormData({ ...formData, milestones: newMilestones });

    // Reset milestone form
    setMilestone({
      amountMinor: "",
      name: "",
      description: "",
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      completedDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      order: formData.milestones.length + 1,
    });

    // Clear milestone errors
    const { milestoneName, milestoneAmount, ...restErrors } = errors;
    setErrors(restErrors);
  };

  const removeMilestone = (index: number) => {
    const newMilestones = [...formData.milestones];
    newMilestones.splice(index, 1);

    // Update order for remaining milestones
    newMilestones.forEach((m, i) => {
      m.order = i;
    });

    setFormData({ ...formData, milestones: newMilestones });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const escrowData = {
        ...formData,
        amountMinor: parseInt(formData.amountMinor.toString()),
        milestones: formData.has_milestone
          ? formData.milestones.map((m) => ({
              ...m,
              amountMinor: parseInt(m.amountMinor.toString()),
              deadline: m.deadline.toISOString(),
              completedDate: m.completedDate.toISOString(),
            }))
          : [],
        deadline: formData.deadline.toISOString(),
      };

      const response = await escrowService.createSystemEscrow(escrowData);

      toast.success("System escrow created successfully");
      navigate(`/admin/escrow/system-escrow/${response.id}`);
    } catch (error) {
      console.error("Failed to create system escrow:", error);
      toast.error("Failed to create system escrow");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalMilestoneAmount = formData.milestones.reduce(
    (sum, m) => sum + parseInt(m.amountMinor.toString()),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-950">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={() => navigate("/admin/escrow/system-escrows")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 bg-clip-text text-transparent">
                  Create System Escrow
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Set up a new system escrow agreement
                </p>
              </div>
            </div>

            <motion.button
              className={`px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              onClick={handleSubmit}
              whileHover={isSubmitting ? {} : { scale: 1.02 }}
              whileTap={isSubmitting ? {} : { scale: 0.98 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Escrow
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary-500" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Purpose <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.purpose
                      ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                  } bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100`}
                  placeholder="E.g., Raising school fees"
                />
                {errors.purpose && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.purpose}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Agreement Type
                </label>
                <select
                  name="agreementType"
                  value={formData.agreementType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="USER">User</option>
                  <option value="BUSINESS">Business</option>
                  <option value="FUNDRAISER">Fundraiser</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Buyer ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="buyerId"
                  value={formData.buyerId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.buyerId
                      ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                  } bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100`}
                  placeholder="Enter buyer ID"
                />
                {errors.buyerId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.buyerId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Seller ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="sellerId"
                  value={formData.sellerId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.sellerId
                      ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                  } bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100`}
                  placeholder="Enter seller ID"
                />
                {errors.sellerId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.sellerId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="KES">KES (Kenyan Shilling)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="GBP">GBP (British Pound)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="amountMinor"
                    value={formData.amountMinor}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                      errors.amountMinor
                        ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                    } bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100`}
                    placeholder="Enter amount"
                  />
                </div>
                {errors.amountMinor && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.amountMinor}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deadline
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <DatePicker
                    selected={formData.deadline}
                    onChange={(date) => handleDateChange(date, "deadline")}
                    minDate={new Date()}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="paymentMethodId"
                    value={formData.paymentMethodId}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter payment method ID"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="has_milestone"
                  name="has_milestone"
                  checked={formData.has_milestone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      has_milestone: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label
                  htmlFor="has_milestone"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Has Milestones
                </label>
              </div>
            </div>
          </motion.div>

          {/* Milestones */}
          {formData.has_milestone && (
            <motion.div
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary-500" />
                  Milestones
                </h2>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total: {totalMilestoneAmount} / {formData.amountMinor || 0}{" "}
                    {formData.currency}
                  </span>
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div
                      className={`h-full rounded-full ${
                        totalMilestoneAmount >
                        parseInt(formData.amountMinor || "0")
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: formData.amountMinor
                          ? `${Math.min(
                              (totalMilestoneAmount /
                                parseInt(formData.amountMinor || "1")) *
                                100,
                              100
                            )}%`
                          : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {errors.milestones && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.milestones}
                  </div>
                </div>
              )}

              {/* Add Milestone Form */}
              <div className="bg-gray-50/80 dark:bg-slate-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-6">
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">
                  Add New Milestone
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={milestone.name}
                      onChange={handleMilestoneChange}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        errors.milestoneName
                          ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                      } bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100`}
                      placeholder="E.g., Design Phase"
                    />
                    {errors.milestoneName && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {errors.milestoneName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="amountMinor"
                        value={milestone.amountMinor}
                        onChange={handleMilestoneChange}
                        className={`w-full pl-9 pr-3 py-2 rounded-lg border ${
                          errors.milestoneAmount
                            ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                        } bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100`}
                        placeholder="Enter amount"
                      />
                    </div>
                    {errors.milestoneAmount && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {errors.milestoneAmount}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={milestone.description}
                    onChange={handleMilestoneChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500"
                    rows={2}
                    placeholder="Enter milestone description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Deadline
                    </label>
                    <DatePicker
                      selected={milestone.deadline}
                      onChange={(date: Date | null) =>
                        handleMilestoneDateChange(date, "deadline")
                      }
                      minDate={new Date()}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500"
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Completed Date
                    </label>
                    <DatePicker
                      selected={milestone.completedDate}
                      onChange={(date) =>
                        handleMilestoneDateChange(date, "completedDate")
                      }
                      minDate={new Date()}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500"
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <motion.button
                    type="button"
                    className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors flex items-center gap-1"
                    onClick={addMilestone}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Milestone
                  </motion.button>
                </div>
              </div>

              {/* Milestones List */}
              {formData.milestones.length > 0 ? (
                <div className="space-y-3">
                  {formData.milestones.map((m, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-medium px-2 py-0.5 rounded-full">
                            #{index + 1}
                          </span>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">
                            {m.name}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <p className="text-gray-600 dark:text-gray-400">
                            Amount:{" "}
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                              {m.amountMinor} {formData.currency}
                            </span>
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            Deadline:{" "}
                            <span className="font-mono text-gray-800 dark:text-gray-200">
                              {m.deadline.toLocaleDateString()}
                            </span>
                          </p>
                          {m.description && (
                            <p className="text-gray-600 dark:text-gray-400 md:col-span-3 truncate">
                              {m.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <motion.button
                        type="button"
                        className="ml-2 p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                        onClick={() => removeMilestone(index)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50/50 dark:bg-slate-700/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                  <Target className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <h3 className="text-gray-500 dark:text-gray-400 mb-1">
                    No Milestones Added
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Add milestones to track progress
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Advanced Settings */}
          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-500" />
              Advanced Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tenant ID
                </label>
                <input
                  type="text"
                  name="tenantId"
                  value={formData.tenantId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter tenant ID"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Default: 82208244-c5f4-4144-9d08-fa3779b5c154
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  System
                </label>
                <select
                  name="system"
                  value={formData.system}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Determines if this is a system escrow
                </p>
              </div>
            </div>

            {/* Summary Section */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">
                Escrow Summary
              </h3>

              <div className="bg-gray-50/80 dark:bg-slate-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Agreement Type
                      </span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {formData.agreementType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Currency
                      </span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {formData.currency}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Amount
                      </span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {formData.amountMinor
                          ? `${formData.amountMinor} ${formData.currency}`
                          : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Has Milestones
                      </span>
                      <span className="text-sm font-medium">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            formData.has_milestone
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {formData.has_milestone ? "Yes" : "No"}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Deadline
                      </span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {formData.deadline.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Payment Method
                      </span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {formData.paymentMethodId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Milestones Count
                      </span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {formData.milestones.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        System Escrow
                      </span>
                      <span className="text-sm font-medium">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            formData.system === "yes"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {formData.system === "yes" ? "Yes" : "No"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <motion.button
              type="submit"
              className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              whileHover={isSubmitting ? {} : { scale: 1.02 }}
              whileTap={isSubmitting ? {} : { scale: 0.98 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create System Escrow
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSystemEscrowPage;