import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Briefcase,
  MapPin,
  User,
  Phone,
  Mail,
  Shield,
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  X,
  Globe,
  Image,
  Info,
  Settings,
} from "lucide-react";

const BusinessRegistrationPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newBusinessId, setNewBusinessId] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    tier: "SME",
    region: "",
    description: "",
    logo: null,
    
    email: "",
    phone: "",
    website: "",
    address: "",
    
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    ownerRole: "",
    
    businessCertificate: null,
    taxCertificate: null,
    ownerIdDocument: null,
    
    verifyImmediately: true,
    notifyBusiness: true,
    enableStorefront: true,
    allowWalletTransactions: true,
    notes: "",
  });
  
  const categories = [
    { value: "", label: "Select a category" },
    { value: "Technology", label: "Technology" },
    { value: "Retail", label: "Retail" },
    { value: "Food & Beverage", label: "Food & Beverage" },
    { value: "Health", label: "Health" },
    { value: "Education", label: "Education" },
    { value: "Finance", label: "Finance" },
    { value: "Tourism", label: "Tourism" },
    { value: "Environmental", label: "Environmental" },
    { value: "Energy", label: "Energy" },
    { value: "Transport", label: "Transport" },
    { value: "Services", label: "Services" },
    { value: "Other", label: "Other" },
  ];
  
  const tiers = [
    { value: "SME", label: "SME" },
    { value: "Enterprise", label: "Enterprise" },
    { value: "NGO", label: "NGO" },
  ];
  
  const regions = [
    { value: "", label: "Select a region" },
    { value: "Nairobi", label: "Nairobi" },
    { value: "Mombasa", label: "Mombasa" },
    { value: "Kisumu", label: "Kisumu" },
    { value: "Nakuru", label: "Nakuru" },
    { value: "Eldoret", label: "Eldoret" },
    { value: "Other", label: "Other" },
  ];
  
  // Form validation
  type ErrorFields = {
    name?: string;
    category?: string;
    region?: string;
    email?: string;
    phone?: string;
    ownerName?: string;
    ownerEmail?: string;
    ownerPhone?: string;
    // Add other fields as needed
  };
  const [errors, setErrors] = useState<ErrorFields>({});
  
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Business name is required";
      if (!formData.category) newErrors.category = "Category is required";
      if (!formData.region) newErrors.region = "Region is required";
    }
    else if (step === 2) {
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Valid email is required";
      
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    }
    else if (step === 3) {
      if (!formData.ownerName.trim()) newErrors.ownerName = "Owner name is required";
      if (!formData.ownerEmail.trim()) newErrors.ownerEmail = "Owner email is required";
      else if (!/^\S+@\S+\.\S+$/.test(formData.ownerEmail)) newErrors.ownerEmail = "Valid email is required";
      
      if (!formData.ownerPhone.trim()) newErrors.ownerPhone = "Owner phone is required";
    }
    else if (step === 4) {
      // Documents are optional for admin registration
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };
  
  const handleLogoUpload = () => {
    fileInputRef.current.click();
  };
  
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));
    }
  };
  
  const handleRemoveLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logo: null,
    }));
  };
  
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, you would create a FormData object
      // to handle file uploads and send to your API
      
      // Simulate API call with a timeout
      setTimeout(() => {
        // Generate a random business ID
        const randomId = `BUS-${Math.floor(10000 + Math.random() * 90000)}`;
        setNewBusinessId(randomId);
        setShowSuccessModal(true);
        setIsSubmitting(false);
      }, 1500);
      
      // Real API call would look like this:
      // const formDataObj = new FormData();
      // Object.keys(formData).forEach(key => {
      //   formDataObj.append(key, formData[key]);
      // });
      // const response = await businessService.registerBusiness(formDataObj);
      // setNewBusinessId(response.id);
      // setShowSuccessModal(true);
      
    } catch (error) {
      console.error("Error registering business:", error);
      setIsSubmitting(false);
      // Handle error appropriately
    }
  };
  
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };
  
  const getStepStatus = (step) => {
    if (currentStep > step) return "complete";
    if (currentStep === step) return "active";
    return "incomplete";
  };
  
  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center">
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  getStepStatus(step) === "complete" 
                    ? "bg-green-100 text-green-600" 
                    : getStepStatus(step) === "active"
                    ? "bg-blue-100 text-blue-600 ring-2 ring-blue-600 ring-offset-2"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {getStepStatus(step) === "complete" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span>{step}</span>
                )}
              </div>
              {step < 5 && (
                <div 
                  className={`w-full h-1 mx-2 ${
                    getStepStatus(step + 1) === "incomplete" 
                      ? "bg-gray-200" 
                      : "bg-blue-600"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <div className="text-xs text-center w-20">Business Info</div>
          <div className="text-xs text-center w-20">Contact</div>
          <div className="text-xs text-center w-20">Owner</div>
          <div className="text-xs text-center w-20">Documents</div>
          <div className="text-xs text-center w-20">Settings</div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                onClick={() => navigate("/admin/business/all-businesses")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Register New Business
                </h1>
                <p className="text-gray-500 mt-1">
                  Create a new business account in the WasaaChat platform
                </p>
              </div>
            </div>

            <motion.button
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              onClick={handleSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting || currentStep !== 5}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Registering...</span>
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Register Business
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {renderStepIndicator()}
        
        <motion.div
          className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Business Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Business Information
                </h2>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${
                          errors.name ? "border-red-300" : "border-gray-300"
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter business name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border ${
                            errors.category ? "border-red-300" : "border-gray-300"
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
                        >
                          {categories.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                          Region <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="region"
                          name="region"
                          value={formData.region}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border ${
                            errors.region ? "border-red-300" : "border-gray-300"
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
                        >
                          {regions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {errors.region && (
                          <p className="mt-1 text-sm text-red-600">{errors.region}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="tier" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Tier
                      </label>
                      <div className="flex space-x-4">
                        {tiers.map((tier) => (
                          <label key={tier.value} className="flex items-center">
                            <input
                              type="radio"
                              name="tier"
                              value={tier.value}
                              checked={formData.tier === tier.value}
                              onChange={handleChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{tier.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe the business..."
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="md:w-1/3 flex flex-col items-center justify-start">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Logo
                    </label>
                    <div 
                      className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={handleLogoUpload}
                    >
                      {formData.logo ? (
                        <div className="relative w-full h-full p-2">
                          <img 
                            src={URL.createObjectURL(formData.logo)} 
                            alt="Business Logo Preview" 
                            className="w-full h-full object-contain rounded-lg"
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveLogo();
                            }}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Image className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload logo</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG (Max. 2MB)</p>
                        </>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleLogoChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border ${
                          errors.email ? "border-red-300" : "border-gray-300"
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="business@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border ${
                          errors.phone ? "border-red-300" : "border-gray-300"
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="+254 XXX XXX XXX"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Physical address"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-700">
                        <strong>Note:</strong> Contact information will be used for:
                      </p>
                      <ul className="mt-2 text-sm text-blue-700 list-disc pl-5 space-y-1">
                        <li>Sending business verification emails</li>
                        <li>Customer service and support</li>
                        <li>Transaction notifications</li>
                        <li>WasaaChat platform updates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Owner Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Owner Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
                      Owner Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="ownerName"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${
                        errors.ownerName ? "border-red-300" : "border-gray-300"
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Full name"
                    />
                    {errors.ownerName && (
                      <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="ownerRole" className="block text-sm font-medium text-gray-700 mb-1">
                      Role in Business
                    </label>
                    <input
                      type="text"
                      id="ownerRole"
                      name="ownerRole"
                      value={formData.ownerRole}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., CEO, Owner, Director"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Owner Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="ownerEmail"
                        name="ownerEmail"
                        value={formData.ownerEmail}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border ${
                          errors.ownerEmail ? "border-red-300" : "border-gray-300"
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="owner@example.com"
                      />
                    </div>
                    {errors.ownerEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.ownerEmail}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="ownerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Owner Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="ownerPhone"
                        name="ownerPhone"
                        value={formData.ownerPhone}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border ${
                          errors.ownerPhone ? "border-red-300" : "border-gray-300"
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="+254 XXX XXX XXX"
                      />
                    </div>
                    {errors.ownerPhone && (
                      <p className="mt-1 text-sm text-red-600">{errors.ownerPhone}</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-xl">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-amber-700">
                        <strong>Important:</strong> Owner information is used for:
                      </p>
                      <ul className="mt-2 text-sm text-amber-700 list-disc pl-5 space-y-1">
                        <li>KYC (Know Your Customer) verification</li>
                        <li>Legal business ownership records</li>
                        <li>Account recovery and security verification</li>
                        <li>Business-critical notifications</li>
                      </ul>
                      <p className="mt-2 text-sm text-amber-700">
                        All data is encrypted and handled according to our data protection policies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 4: Documents */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Business Documents
                </h2>
                
                <p className="text-sm text-gray-500">
                  Upload verification documents for the business. For admin-created accounts, documents can be uploaded later by the business owner.
                </p>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Business Registration Certificate
                      </label>
                      <input
                        type="file"
                        id="businessCertificate"
                        name="businessCertificate"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label 
                        htmlFor="businessCertificate" 
                        className="cursor-pointer text-blue-600 text-sm hover:text-blue-800 flex items-center gap-1"
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </label>
                    </div>
                    
                    {formData.businessCertificate ? (
                      <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formData.businessCertificate.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatBytes(formData.businessCertificate.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => setFormData(prev => ({ ...prev, businessCertificate: null }))}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-500">No file uploaded</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Tax Certificate
                      </label>
                      <input
                        type="file"
                        id="taxCertificate"
                        name="taxCertificate"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label 
                        htmlFor="taxCertificate" 
                        className="cursor-pointer text-blue-600 text-sm hover:text-blue-800 flex items-center gap-1"
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </label>
                    </div>
                    
                    {formData.taxCertificate ? (
                      <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formData.taxCertificate.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatBytes(formData.taxCertificate.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => setFormData(prev => ({ ...prev, taxCertificate: null }))}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-500">No file uploaded</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Owner ID Document
                      </label>
                      <input
                        type="file"
                        id="ownerIdDocument"
                        name="ownerIdDocument"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label 
                        htmlFor="ownerIdDocument" 
                        className="cursor-pointer text-blue-600 text-sm hover:text-blue-800 flex items-center gap-1"
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </label>
                    </div>
                    
                    {formData.ownerIdDocument ? (
                      <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formData.ownerIdDocument.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatBytes(formData.ownerIdDocument.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => setFormData(prev => ({ ...prev, ownerIdDocument: null }))}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-500">No file uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-green-700">
                        <strong>Admin Note:</strong> For admin-created business accounts:
                      </p>
                      <ul className="mt-2 text-sm text-green-700 list-disc pl-5 space-y-1">
                        <li>Documents can be uploaded now or later</li>
                        <li>You can manually verify businesses regardless of document status</li>
                        <li>Business owners can upload missing documents through their dashboard</li>
                        <li>All document uploads are logged in the business audit trail</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 5: Additional Settings */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Business Settings
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <label htmlFor="verifyImmediately" className="font-medium text-gray-700">
                        Verify Business Immediately
                      </label>
                      <p className="text-sm text-gray-500 mt-1">
                        Automatically mark business as verified upon registration
                      </p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="verifyImmediately"
                        name="verifyImmediately"
                        checked={formData.verifyImmediately}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="verifyImmediately"
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                          formData.verifyImmediately ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                            formData.verifyImmediately ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <label htmlFor="notifyBusiness" className="font-medium text-gray-700">
                        Send Notification Email
                      </label>
                      <p className="text-sm text-gray-500 mt-1">
                        Notify business owner about account creation
                      </p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="notifyBusiness"
                        name="notifyBusiness"
                        checked={formData.notifyBusiness}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="notifyBusiness"
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                          formData.notifyBusiness ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                            formData.notifyBusiness ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <label htmlFor="enableStorefront" className="font-medium text-gray-700">
                        Enable Storefront
                      </label>
                      <p className="text-sm text-gray-500 mt-1">
                        Allow business to set up and manage their storefront
                      </p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="enableStorefront"
                        name="enableStorefront"
                        checked={formData.enableStorefront}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="enableStorefront"
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                          formData.enableStorefront ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                            formData.enableStorefront ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <label htmlFor="allowWalletTransactions" className="font-medium text-gray-700">
                        Enable Wallet Transactions
                      </label>
                      <p className="text-sm text-gray-500 mt-1">
                        Allow business to receive and process payments
                      </p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="allowWalletTransactions"
                        name="allowWalletTransactions"
                        checked={formData.allowWalletTransactions}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="allowWalletTransactions"
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                          formData.allowWalletTransactions ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                            formData.allowWalletTransactions ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add any relevant notes about this business..."
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    These notes are only visible to administrators.
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-700">
                        <strong>Registration Summary:</strong>
                      </p>
                      <ul className="mt-2 text-sm text-blue-700 list-none space-y-1">
                        <li><strong>Business Name:</strong> {formData.name}</li>
                        <li><strong>Category:</strong> {formData.category}</li>
                        <li><strong>Tier:</strong> {formData.tier}</li>
                        <li><strong>Owner:</strong> {formData.ownerName}</li>
                        <li><strong>Contact:</strong> {formData.email}, {formData.phone}</li>
                        <li><strong>Verification:</strong> {formData.verifyImmediately ? "Immediate" : "Pending"}</li>
                      </ul>
                      <p className="mt-2 text-sm text-blue-700">
                        Review the information above and click "Register Business" to complete.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step Navigation */}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                  onClick={prevStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </motion.button>
              )}
              
              {currentStep < 5 && (
                <motion.button
                  type="button"
                  className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                  onClick={nextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Next
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </motion.button>
              )}
              
              {currentStep === 5 && (
                <motion.button
                  type="submit"
                  className="ml-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Registering...</span>
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Register Business
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full border border-white/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Business Registered Successfully
              </h3>
              <p className="text-gray-600 mb-6">
                The business has been registered with ID: <span className="font-mono font-medium">{newBusinessId}</span>
              </p>
              
              <div className="space-y-3">
                <motion.button
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/admin/business/view/${newBusinessId}`)}
                >
                  View Business
                </motion.button>
                <motion.button
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/admin/business/all-businesses")}
                >
                  Return to Business List
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BusinessRegistrationPage;