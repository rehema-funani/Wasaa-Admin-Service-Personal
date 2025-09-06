import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Users,
  DollarSign,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Search,
  Upload,
  Info,
  Clock,
} from "lucide-react";

const CreateEscrowPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    buyerId: "",
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    buyerKycStatus: "",

    // Seller Information
    sellerId: "",
    sellerName: "",
    sellerEmail: "",
    sellerPhone: "",
    sellerKycStatus: "",

    // Transaction Details
    amount: "",
    currency: "KES",
    category: "",
    subcategory: "",
    description: "",

    // Payment & Terms
    paymentMethod: "",
    releaseConditions: "",
    expiryDate: "",
    autoRelease: false,

    documents: [],
    adminNotes: "",
    tags: [],

    riskLevel: "medium",
    complianceFlags: [],
    requiresApproval: false,
  });

  const [searchResults, setSearchResults] = useState({
    buyers: [],
    sellers: [],
  });

  const [validation, setValidation] = useState({
    errors: {},
    warnings: [],
  });

  const steps = [
    { id: 1, title: "Parties", description: "Select buyer and seller" },
    { id: 2, title: "Transaction", description: "Amount and details" },
    { id: 3, title: "Terms", description: "Payment and conditions" },
    { id: 4, title: "Review", description: "Confirm and create" },
  ];

  const currencies = [
    { code: "KES", name: "Kenyan Shilling", symbol: "KES" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
    { code: "ZAR", name: "South African Rand", symbol: "R" },
  ];

  const categories = [
    {
      value: "goods",
      label: "Physical Goods",
      subcategories: [
        "Electronics",
        "Clothing",
        "Furniture",
        "Automotive",
        "Books",
        "Other",
      ],
    },
    {
      value: "services",
      label: "Services",
      subcategories: [
        "Consulting",
        "Development",
        "Design",
        "Marketing",
        "Legal",
        "Other",
      ],
    },
    {
      value: "digital",
      label: "Digital Goods",
      subcategories: [
        "Software",
        "Content",
        "Courses",
        "Subscriptions",
        "Other",
      ],
    },
    {
      value: "real_estate",
      label: "Real Estate",
      subcategories: ["Residential", "Commercial", "Land", "Rental Deposit"],
    },
    {
      value: "freelance",
      label: "Freelance Work",
      subcategories: [
        "Writing",
        "Programming",
        "Design",
        "Translation",
        "Other",
      ],
    },
  ];

  const paymentMethods = [
    {
      value: "wallet",
      label: "WasaaChat Wallet",
      description: "Instant transfer from wallet balance",
    },
    {
      value: "mobile_money",
      label: "Mobile Money",
      description: "M-Pesa, Airtel Money, etc.",
    },
    {
      value: "bank_transfer",
      label: "Bank Transfer",
      description: "Direct bank account transfer",
    },
    {
      value: "card",
      label: "Credit/Debit Card",
      description: "Visa, Mastercard, etc.",
    },
  ];

  const searchUsers = async (query: string, type: "buyer" | "seller") => {
    if (query.length < 2) return;

    setIsLoading(true);
    setTimeout(() => {
      const mockUsers = [
        {
          id: "user001",
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+254700123456",
          kycStatus: "verified",
          riskScore: 85,
        },
        {
          id: "user002",
          name: "Mary Johnson",
          email: "mary.j@example.com",
          phone: "+254700234567",
          kycStatus: "verified",
          riskScore: 92,
        },
        {
          id: "user003",
          name: "David Chen",
          email: "david.c@example.com",
          phone: "+254700345678",
          kycStatus: "pending",
          riskScore: 76,
        },
        {
          id: "user004",
          name: "Sarah Ahmed",
          email: "sarah.a@example.com",
          phone: "+254700456789",
          kycStatus: "expired",
          riskScore: 68,
        },
      ].filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults((prev) => ({
        ...prev,
        [type === "buyer" ? "buyers" : "sellers"]: mockUsers,
      }));
      setIsLoading(false);
    }, 500);
  };

  const selectUser = (user: any, type: "buyer" | "seller") => {
    const prefix = type === "buyer" ? "buyer" : "seller";
    setFormData((prev) => ({
      ...prev,
      [`${prefix}Id`]: user.id,
      [`${prefix}Name`]: user.name,
      [`${prefix}Email`]: user.email,
      [`${prefix}Phone`]: user.phone,
      [`${prefix}KycStatus`]: user.kycStatus,
    }));

    // Clear search results
    setSearchResults((prev) => ({
      ...prev,
      [type === "buyer" ? "buyers" : "sellers"]: [],
    }));
  };

  const getKycStatusBadge = (status: string) => {
    const statusConfig = {
      verified: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
      },
      pending: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Clock,
      },
      expired: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: AlertTriangle,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {status || "Unknown"}
      </span>
    );
  };

  const validateStep = (step: number) => {
    const errors: any = {};
    const warnings: string[] = [];

    switch (step) {
      case 1:
        if (!formData.buyerId) errors.buyer = "Buyer is required";
        if (!formData.sellerId) errors.seller = "Seller is required";
        if (formData.buyerId === formData.sellerId)
          errors.parties = "Buyer and seller cannot be the same person";
        if (formData.buyerKycStatus !== "verified")
          warnings.push("Buyer KYC is not verified");
        if (formData.sellerKycStatus !== "verified")
          warnings.push("Seller KYC is not verified");
        break;
      case 2:
        if (!formData.amount || parseFloat(formData.amount) <= 0)
          errors.amount = "Valid amount is required";
        if (!formData.category) errors.category = "Category is required";
        if (!formData.description.trim())
          errors.description = "Description is required";
        if (parseFloat(formData.amount) > 1000000)
          warnings.push("High value transaction requires additional approval");
        break;
      case 3:
        if (!formData.paymentMethod)
          errors.paymentMethod = "Payment method is required";
        if (!formData.expiryDate) errors.expiryDate = "Expiry date is required";
        if (new Date(formData.expiryDate) <= new Date())
          errors.expiryDate = "Expiry date must be in the future";
        break;
    }

    setValidation({ errors, warnings });
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Creating escrow with data:", formData);
      setIsLoading(false);
      // Redirect to transaction details or success page
    }, 2000);
  };

  const formatCurrency = (amount: string, currency: string) => {
    if (!amount) return "";
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;

    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-4">
          <motion.button
            className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            whileHover={{ x: -2 }}
            whileTap={{ x: 0 }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Create Escrow Transaction
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Set up a secure escrow transaction between parties
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Step {currentStep} of {steps.length}
        </div>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step.id
                      ? "bg-primary-600 text-white"
                      : currentStep > step.id
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle size={16} /> : step.id}
                </div>
                <div className="ml-3">
                  <div
                    className={`text-sm font-medium ${
                      currentStep >= step.id
                        ? "text-gray-900 dark:text-gray-100"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {step.description}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-6 h-0.5 w-16 ${
                    currentStep > step.id
                      ? "bg-green-600"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Validation Messages */}
      {(Object.keys(validation.errors).length > 0 ||
        validation.warnings.length > 0) && (
        <motion.div
          className="mb-6 space-y-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {Object.values(validation.errors).map((error, index) => (
            <div
              key={index}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center"
            >
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-red-700 dark:text-red-300 text-sm">
                {error as string}
              </span>
            </div>
          ))}
          {validation.warnings.map((warning, index) => (
            <div
              key={index}
              className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-center"
            >
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mr-2" />
              <span className="text-amber-700 dark:text-amber-300 text-sm">
                {warning}
              </span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Step Content */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="p-6">
          {/* Step 1: Parties */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Select Parties
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Buyer Selection */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100">
                    Buyer Information
                  </h4>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search buyer by name or email..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onChange={(e) => searchUsers(e.target.value, "buyer")}
                    />
                    {searchResults.buyers.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {searchResults.buyers.map((user: any) => (
                          <div
                            key={user.id}
                            className="p-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                            onClick={() => selectUser(user, "buyer")}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {user.email}
                                </div>
                              </div>
                              {getKycStatusBadge(user.kycStatus)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {formData.buyerId && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-blue-800 dark:text-blue-200">
                          Selected Buyer
                        </span>
                        {getKycStatusBadge(formData.buyerKycStatus)}
                      </div>
                      <div className="text-blue-700 dark:text-blue-300">
                        <div className="font-medium">{formData.buyerName}</div>
                        <div className="text-sm">{formData.buyerEmail}</div>
                        <div className="text-sm">{formData.buyerPhone}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Seller Selection */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100">
                    Seller Information
                  </h4>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search seller by name or email..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onChange={(e) => searchUsers(e.target.value, "seller")}
                    />
                    {searchResults.sellers.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {searchResults.sellers.map((user: any) => (
                          <div
                            key={user.id}
                            className="p-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                            onClick={() => selectUser(user, "seller")}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {user.email}
                                </div>
                              </div>
                              {getKycStatusBadge(user.kycStatus)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {formData.sellerId && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-800 dark:text-green-200">
                          Selected Seller
                        </span>
                        {getKycStatusBadge(formData.sellerKycStatus)}
                      </div>
                      <div className="text-green-700 dark:text-green-300">
                        <div className="font-medium">{formData.sellerName}</div>
                        <div className="text-sm">{formData.sellerEmail}</div>
                        <div className="text-sm">{formData.sellerPhone}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Transaction Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Transaction Details
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount *
                    </label>
                    <div className="flex">
                      <select
                        value={formData.currency}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            currency: e.target.value,
                          }))
                        }
                        className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {currencies.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            amount: e.target.value,
                          }))
                        }
                        placeholder="0.00"
                        className="flex-1 px-3 py-2 border-t border-r border-b border-gray-200 dark:border-gray-600 rounded-r-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    {formData.amount && (
                      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(formData.amount, formData.currency)}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                          subcategory: "",
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select category...</option>
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.category && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subcategory
                      </label>
                      <select
                        value={formData.subcategory}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            subcategory: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select subcategory...</option>
                        {categories
                          .find((c) => c.value === formData.category)
                          ?.subcategories.map((sub) => (
                            <option
                              key={sub}
                              value={sub.toLowerCase().replace(" ", "_")}
                            >
                              {sub}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe the goods or services being escrowed..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {formData.description.length}/500 characters
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Risk Assessment
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["low", "medium", "high"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              riskLevel: level,
                            }))
                          }
                          className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                            formData.riskLevel === level
                              ? level === "low"
                                ? "bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200"
                                : level === "medium"
                                ? "bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200"
                                : "bg-red-100 border-red-300 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200"
                              : "bg-white border-gray-200 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment & Terms */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Payment & Terms
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Method *
                    </label>
                    <div className="space-y-2">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.value}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              paymentMethod: method.value,
                            }))
                          }
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.paymentMethod === method.value
                              ? "border-primary-300 bg-primary-50 dark:border-primary-700 dark:bg-primary-900/20"
                              : "border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                formData.paymentMethod === method.value
                                  ? "border-primary-600 bg-primary-600"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              {formData.paymentMethod === method.value && (
                                <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {method.label}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {method.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          expiryDate: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Transaction will expire if not completed by this date
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="autoRelease"
                      checked={formData.autoRelease}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          autoRelease: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <label
                      htmlFor="autoRelease"
                      className="text-sm text-gray-700 dark:text-gray-300"
                    >
                      Enable auto-release on expiry
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Release Conditions
                    </label>
                    <textarea
                      value={formData.releaseConditions}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          releaseConditions: e.target.value,
                        }))
                      }
                      placeholder="Specify conditions that must be met before funds are released..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Supporting Documents
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <button className="text-primary-600 dark:text-primary-400 hover:text-primary-500">
                          Upload files
                        </button>
                        <span className="text-gray-500 dark:text-gray-400">
                          {" "}
                          or drag and drop
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PDF, DOC, JPG, PNG up to 10MB each
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Admin Notes (Internal)
                    </label>
                    <textarea
                      value={formData.adminNotes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          adminNotes: e.target.value,
                        }))
                      }
                      placeholder="Internal notes for admin reference..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Review & Confirm
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Transaction Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3">
                    Transaction Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Amount:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(formData.amount, formData.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Category:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {
                          categories.find((c) => c.value === formData.category)
                            ?.label
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Payment Method:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {
                          paymentMethods.find(
                            (p) => p.value === formData.paymentMethod
                          )?.label
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Risk Level:
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          formData.riskLevel === "low"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : formData.riskLevel === "medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {formData.riskLevel.charAt(0).toUpperCase() +
                          formData.riskLevel.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Expires:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {formData.expiryDate
                          ? new Date(formData.expiryDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Parties Summary */}
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Buyer
                    </h4>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <div className="font-medium">{formData.buyerName}</div>
                      <div>{formData.buyerEmail}</div>
                      <div className="mt-1">
                        {getKycStatusBadge(formData.buyerKycStatus)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                      Seller
                    </h4>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      <div className="font-medium">{formData.sellerName}</div>
                      <div>{formData.sellerEmail}</div>
                      <div className="mt-1">
                        {getKycStatusBadge(formData.sellerKycStatus)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description & Conditions */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">
                    Description
                  </h4>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                    {formData.description || "No description provided"}
                  </div>
                </div>

                {formData.releaseConditions && (
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">
                      Release Conditions
                    </h4>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                      {formData.releaseConditions}
                    </div>
                  </div>
                )}
              </div>

              {/* Final Confirmation */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    <div className="font-medium mb-1">Important Notice</div>
                    <div>
                      Please review all details carefully. Once created, this
                      escrow transaction will be binding and funds will be held
                      securely until release conditions are met or the
                      transaction expires.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <motion.button
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                currentStep === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={prevStep}
              disabled={currentStep === 1}
              whileHover={currentStep > 1 ? { x: -2 } : {}}
              whileTap={currentStep > 1 ? { x: 0 } : {}}
            >
              <ArrowLeft size={16} className="mr-2" />
              Previous
            </motion.button>

            <div className="flex items-center space-x-2">
              <motion.button
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
              >
                <Save size={16} className="mr-2" />
                Save Draft
              </motion.button>

              {currentStep < steps.length ? (
                <motion.button
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-700 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600"
                  onClick={nextStep}
                  whileHover={{ x: 2 }}
                  whileTap={{ x: 0 }}
                >
                  Next
                  <ArrowRight size={16} className="ml-2" />
                </motion.button>
              ) : (
                <motion.button
                  className="flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 dark:bg-green-700 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} className="mr-2" />
                      Create Escrow
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateEscrowPage;