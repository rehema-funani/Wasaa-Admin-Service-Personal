import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Database,
  Users,
  Briefcase,
  DollarSign,
  Info,
  AlertCircle,
  ChevronRight,
  Check,
  X,
  Shield
} from 'lucide-react';
import { escrowService } from '../../../api/services/escrow';

const CreateSubwalletPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    tenantId: "",
    ownerType: "USER",
    ownerId: "",
    ownerName: "",
    kind: "TRUST",
    currency: "KES",
    initialBalance: 0,
    escrowAgreementId: "",
    status: "ACTIVE",
  });

  const [tenants, setTenants] = useState([]);
  const [owners, setOwners] = useState([]);
  const [escrowAgreements, setEscrowAgreements] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (formData.tenantId) {
      fetchOwnersByTenantId(formData.tenantId);
      fetchEscrowAgreementsByTenantId(formData.tenantId);
    }
  }, [formData.tenantId]);

  const fetchInitialData = async () => {
    try {
      const tenantsResponse = await escrowService.getTenants();
      setTenants(tenantsResponse);

      // Pre-set tenant ID if only one tenant exists
      if (tenantsResponse.length === 1) {
        setFormData((prev) => ({
          ...prev,
          tenantId: tenantsResponse[0].id,
        }));
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const fetchOwnersByTenantId = async (tenantId) => {
    try {
      const ownersResponse = await escrowService.getOwnersByTenantId(tenantId);
      setOwners(ownersResponse);
    } catch (error) {
      console.error("Error fetching owners:", error);
    }
  };

  const fetchEscrowAgreementsByTenantId = async (tenantId) => {
    try {
      const agreementsResponse =
        await escrowService.getEscrowAgreementsByTenantId(tenantId);
      setEscrowAgreements(agreementsResponse);
    } catch (error) {
      console.error("Error fetching escrow agreements:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleOwnerSelect = (owner) => {
    setFormData((prev) => ({
      ...prev,
      ownerId: owner.id,
      ownerName:
        owner.name || `${owner.firstName} ${owner.lastName}` || owner.id,
    }));
  };

  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.tenantId) newErrors.tenantId = "Tenant ID is required";
      if (!formData.ownerType) newErrors.ownerType = "Owner type is required";
      if (!formData.ownerId) newErrors.ownerId = "Owner ID is required";
    } else if (currentStep === 2) {
      if (!formData.kind) newErrors.kind = "Account kind is required";
      if (!formData.currency) newErrors.currency = "Currency is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(step)) return;

    setIsLoading(true);

    try {
      const subwalletData = {
        ...formData,
        initialBalance: parseInt(formData.initialBalance),
      };

      const response = await escrowService.createSubwallet(subwalletData);

      // Success, navigate to the new subwallet
      navigate(`/admin/escrow/subwallet/${response.id}`);
    } catch (error) {
      console.error("Error creating subwallet:", error);
      setErrors({
        submit: "Failed to create subwallet. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tenant <span className="text-red-500">*</span>
                </label>
                <select
                  name="tenantId"
                  value={formData.tenantId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.tenantId
                      ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-200 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500"
                  } bg-white/80 dark:bg-slate-800/80 text-gray-900 dark:text-gray-100 backdrop-blur-sm transition-all`}
                >
                  <option value="">Select Tenant</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name || tenant.id}
                    </option>
                  ))}
                </select>
                {errors.tenantId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.tenantId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Owner Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    className={`flex flex-col items-center justify-center py-4 px-3 rounded-xl border ${
                      formData.ownerType === "USER"
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30"
                        : "bg-white/80 dark:bg-slate-800/80 border-gray-200 dark:border-slate-700"
                    } transition-colors`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      handleInputChange({
                        target: { name: "ownerType", value: "USER" },
                      })
                    }
                  >
                    <Users
                      className={`w-6 h-6 mb-2 ${
                        formData.ownerType === "USER"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        formData.ownerType === "USER"
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      User
                    </span>
                  </motion.button>

                  <motion.button
                    type="button"
                    className={`flex flex-col items-center justify-center py-4 px-3 rounded-xl border ${
                      formData.ownerType === "BUSINESS"
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30"
                        : "bg-white/80 dark:bg-slate-800/80 border-gray-200 dark:border-slate-700"
                    } transition-colors`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      handleInputChange({
                        target: { name: "ownerType", value: "BUSINESS" },
                      })
                    }
                  >
                    <Briefcase
                      className={`w-6 h-6 mb-2 ${
                        formData.ownerType === "BUSINESS"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        formData.ownerType === "BUSINESS"
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Business
                    </span>
                  </motion.button>
                </div>
                {errors.ownerType && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.ownerType}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Owner <span className="text-red-500">*</span>
                </label>
                {owners.length > 0 ? (
                  <div className="space-y-4">
                    <select
                      name="ownerId"
                      value={formData.ownerId}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.ownerId
                          ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-200 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500"
                      } bg-white/80 dark:bg-slate-800/80 text-gray-900 dark:text-gray-100 backdrop-blur-sm transition-all`}
                    >
                      <option value="">Select Owner</option>
                      {owners.map((owner) => (
                        <option key={owner.id} value={owner.id}>
                          {owner.name ||
                            `${owner.firstName} ${owner.lastName}` ||
                            owner.id}
                        </option>
                      ))}
                    </select>
                    {formData.ownerId && (
                      <motion.div
                        className="p-4 bg-blue-50/80 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            {formData.ownerType === "USER" ? (
                              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {formData.ownerName || formData.ownerId}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formData.ownerType} · ID:{" "}
                              {formData.ownerId.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="ownerId"
                      value={formData.ownerId}
                      onChange={handleInputChange}
                      placeholder="Enter Owner ID"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.ownerId
                          ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-200 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500"
                      } bg-white/80 dark:bg-slate-800/80 text-gray-900 dark:text-gray-100 backdrop-blur-sm transition-all`}
                    />
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      placeholder="Enter Owner Name (optional)"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-gray-900 dark:text-gray-100 backdrop-blur-sm transition-all focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
                {errors.ownerId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.ownerId}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              Account Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "TRUST", label: "Trust", icon: Shield },
                    { value: "OPERATING", label: "Operating", icon: Database },
                    {
                      value: "COMMISSION",
                      label: "Commission",
                      icon: DollarSign,
                    },
                    { value: "FEE", label: "Fee", icon: DollarSign },
                  ].map((type, index) => (
                    <motion.button
                      key={type.value}
                      type="button"
                      className={`flex items-center gap-2 p-3 rounded-xl border ${
                        formData.kind === type.value
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-300"
                          : "bg-white/80 dark:bg-slate-800/80 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300"
                      } transition-colors`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        handleInputChange({
                          target: { name: "kind", value: type.value },
                        })
                      }
                    >
                      <type.icon
                        className={`w-4 h-4 ${
                          formData.kind === type.value
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                      <span className="text-sm font-medium">{type.label}</span>
                    </motion.button>
                  ))}
                </div>
                {errors.kind && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.kind}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Currency <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "KES", label: "KES", flag: "🇰🇪" },
                    { value: "USD", label: "USD", flag: "🇺🇸" },
                    { value: "EUR", label: "EUR", flag: "🇪🇺" },
                    { value: "GBP", label: "GBP", flag: "🇬🇧" },
                  ].map((currency) => (
                    <motion.button
                      key={currency.value}
                      type="button"
                      className={`flex items-center gap-2 p-3 rounded-xl border ${
                        formData.currency === currency.value
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-300"
                          : "bg-white/80 dark:bg-slate-800/80 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300"
                      } transition-colors`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        handleInputChange({
                          target: { name: "currency", value: currency.value },
                        })
                      }
                    >
                      <span className="text-lg">{currency.flag}</span>
                      <span className="text-sm font-medium">
                        {currency.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
                {errors.currency && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.currency}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Initial Balance
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="initialBalance"
                  value={formData.initialBalance}
                  onChange={handleNumberInput}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-gray-900 dark:text-gray-100 backdrop-blur-sm transition-all focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Initial balance in {formData.currency}. Leave 0 if no initial
                funding.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Escrow Agreement (Optional)
                </label>
                <select
                  name="escrowAgreementId"
                  value={formData.escrowAgreementId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-gray-900 dark:text-gray-100 backdrop-blur-sm transition-all focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">None</option>
                  {escrowAgreements.map((agreement) => (
                    <option key={agreement.id} value={agreement.id}>
                      {agreement.purpose || agreement.id}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Link this subwallet to an existing escrow agreement
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border ${
                      formData.status === "ACTIVE"
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-300"
                        : "bg-white/80 dark:bg-slate-800/80 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300"
                    } transition-colors`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      handleInputChange({
                        target: { name: "status", value: "ACTIVE" },
                      })
                    }
                  >
                    <Check
                      className={`w-4 h-4 ${
                        formData.status === "ACTIVE"
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                    <span className="text-sm font-medium">Active</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border ${
                      formData.status === "FROZEN"
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-300"
                        : "bg-white/80 dark:bg-slate-800/80 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300"
                    } transition-colors`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      handleInputChange({
                        target: { name: "status", value: "FROZEN" },
                      })
                    }
                  >
                    <Shield
                      className={`w-4 h-4 ${
                        formData.status === "FROZEN"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                    <span className="text-sm font-medium">Frozen</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              Review & Confirm
            </h2>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800/30 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100/80 dark:bg-blue-900/40 rounded-xl">
                  <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  New Subwallet Summary
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-4 border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      Basic Information
                    </h4>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Tenant ID
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formData.tenantId}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Owner Type
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formData.ownerType}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Owner ID
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formData.ownerId}
                        </span>
                      </div>
                      {formData.ownerName && (
                        <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Owner Name
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formData.ownerName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-4 border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      Account Details
                    </h4>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Account Type
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formData.kind}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Currency
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formData.currency}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Initial Balance
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Intl.NumberFormat("en-KE", {
                            style: "currency",
                            currency: formData.currency,
                          }).format(formData.initialBalance)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Status
                        </span>
                        <span
                          className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                            formData.status === "ACTIVE"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          }`}
                        >
                          {formData.status}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Escrow Agreement
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formData.escrowAgreementId || "None"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="p-4 bg-red-50/80 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/30 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {errors.submit}
                  </p>
                </div>
              </div>
            )}

            <div className="p-4 bg-yellow-50/80 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-800/30 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                    Important Note
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Creating a subwallet with an initial balance will trigger a
                    fund transfer operation. Make sure the source account has
                    sufficient funds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-950">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={() => navigate("/admin/escrow/subwallets")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Create System Escrow Account
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Add a new subwallet to the escrow system
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Step Indicator */}
        <motion.div
          className="mb-8 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-slate-700/30 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === stepNumber
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : step > stepNumber
                      ? "bg-green-500 text-white"
                      : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-600"
                  }`}
                >
                  {step > stepNumber ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {stepNumber === 1 && "Basic Info"}
                  {stepNumber === 2 && "Account Details"}
                  {stepNumber === 3 && "Review"}
                </p>
              </div>
            ))}
          </div>
          <div className="relative mt-6">
            <div className="absolute top-0 left-6 right-6 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div
              className="absolute top-0 left-6 h-1 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </motion.div>

        {/* Form Content */}
        <motion.div
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/30 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              {step > 1 ? (
                <motion.button
                  type="button"
                  className="px-5 py-2.5 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600 transition-colors flex items-center gap-2"
                  onClick={prevStep}
                  whileHover={{ scale: 1.02, x: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </motion.button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <motion.button
                  type="button"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                  onClick={nextStep}
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create Subwallet
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateSubwalletPage;