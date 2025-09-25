// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { ArrowLeft, Save, Briefcase, AlertTriangle, Loader2 } from "lucide-react";
// import businessService from "../../../api/services/businessService";
// import { Business } from "../../../types/business";

// const EditBusinessPage = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const [business, setBusiness] = useState<Partial<Business>>({
//     name: "",
//     type: "SME",
//     country: "",
//     registration_number: "",
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   useEffect(() => {
//     if (!id) {
//       toast.error("No business ID provided.");
//       navigate("/admin/business/all-businesses");
//       return;
//     }

//     const fetchBusiness = async () => {
//       setIsLoading(true);
//       try {
//         const data = await businessService.getBusinessById(id);
//         setBusiness({
//           id: data.id,
//           name: data.name || "",
//           type: data.type || "SME",
//           country: data.country || "",
//           registration_number: data.registration_number || "",
//         });
//       } catch (error) {
//         console.error("Failed to fetch business:", error);
//         toast.error("Failed to load business data.");
//         navigate("/admin/business/all-businesses");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchBusiness();
//   }, [id, navigate]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setBusiness((prev) => ({ ...prev, [name]: value }));
//   };

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {};
//     if (!business?.name?.trim()) newErrors.name = "Business name is required.";
//     if (!business?.type) newErrors.type = "Business type is required.";
//     if (!business?.country?.trim()) newErrors.country = "Country is required.";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!id || !business || !validateForm()) return;

//     setIsSaving(true);
//     try {
//       const payload = {
//         name: business.name,
//         type: business.type,
//         country: business.country,
//         registration_number: business.registration_number,
//       };
//       await businessService.updateBusiness(id, payload);
//       toast.success("Business updated successfully!");
//       navigate(`/admin/business/view/${id}`);
//     } catch (error) {
//       console.error("Failed to update business:", error);
//       toast.error((error as Error).message || "Failed to update business.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
//       </div>
//     );
//   }

//   if (!business) {
//     return (
//       <div className="flex flex-col justify-center items-center min-h-screen text-center">
//         <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
//         <h2 className="text-xl font-bold">Could not load business data.</h2>
//         <p className="text-gray-500 mb-4">Please try again or go back to the list.</p>
//         <button
//           onClick={() => navigate("/admin/business/all-businesses")}
//           className="px-4 py-2 bg-primary-600 text-white rounded-lg"
//         >
//           Back to Businesses
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
//         <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <motion.button
//               className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl"
//               onClick={() => navigate(`/admin/business/view/${id}`)}
//             >
//               <ArrowLeft className="w-5 h-5" />
//             </motion.button>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Business</h1>
//               <p className="text-gray-500 dark:text-gray-400">{business.name}</p>
//             </div>
//           </div>
//           <motion.button
//             className="px-4 py-2 bg-primary-600 text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-50"
//             onClick={handleSubmit}
//             disabled={isSaving}
//           >
//             {isSaving ? (
//               <Loader2 className="w-4 h-4 animate-spin" />
//             ) : (
//               <Save className="w-4 h-4" />
//             )}
//             {isSaving ? "Saving..." : "Save Changes"}
//           </motion.button>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto p-6">
//         <motion.div
//           className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
//               <Briefcase className="w-5 h-5 text-primary-600" />
//               Business Details
//             </h2>

//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Business Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={business.name || ""}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
//                   errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
//                 } bg-white dark:bg-gray-700`}
//               />
//               {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Business Type <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   id="type"
//                   name="type"
//                   value={business.type || ""}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
//                     errors.type ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
//                   } bg-white dark:bg-gray-700`}
//                 >
//                   <option value="SME">SME</option>
//                   <option value="ENTERPRISE">Enterprise</option>
//                   <option value="NGO">NGO</option>
//                 </select>
//                 {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
//               </div>

//               <div>
//                 <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Country / Region <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="country"
//                   name="country"
//                   value={business.country || ""}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
//                     errors.country ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
//                   } bg-white dark:bg-gray-700`}
//                 />
//                 {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
//               </div>
//             </div>

//             <div>
//               <label htmlFor="registration_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Registration Number
//               </label>
//               <input
//                 type="text"
//                 id="registration_number"
//                 name="registration_number"
//                 value={business.registration_number || ""}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700"
//               />
//             </div>

//             <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
//               <motion.button
//                 type="submit"
//                 className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-50"
//                 disabled={isSaving}
//               >
//                 {isSaving ? (
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                 ) : (
//                   <Save className="w-5 h-5" />
//                 )}
//                 {isSaving ? "Saving Changes..." : "Save Changes"}
//               </motion.button>
//             </div>
//           </form>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default EditBusinessPage;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowLeft, Save, Briefcase, AlertTriangle, Loader2 } from "lucide-react";
import businessService from "../../../api/services/businessService";
import { Business } from "../../../types/business";

const EditBusinessPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Initialize with null to distinguish between loading and loaded state
  const [business, setBusiness] = useState<Partial<Business> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!id) {
      toast.error("No business ID provided.");
      navigate("/admin/business/all-businesses");
      return;
    }

    const fetchBusiness = async () => {
      setIsLoading(true);
      try {
        const response = await businessService.getBusinessById(id);
        console.log("Fetched business data:", response); // Debug log
        
        // Handle nested response structure - check if data is nested under 'business' key
        const data = response.business || response;
        
        // Ensure we set all fields with proper defaults
        const businessData = {
          id: data.id,
          name: data.name || "",
          type: data.type || "SME",
          country: data.country || "",
          registration_number: data.registration_number || "",
        };
        
        console.log("Setting business state:", businessData); // Debug log
        setBusiness(businessData);
      } catch (error) {
        console.error("Failed to fetch business:", error);
        toast.error("Failed to load business data.");
        navigate("/admin/business/all-businesses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusiness();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBusiness((prev) => prev ? { ...prev, [name]: value } : null);
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!business?.name?.trim()) newErrors.name = "Business name is required.";
    if (!business?.type) newErrors.type = "Business type is required.";
    if (!business?.country?.trim()) newErrors.country = "Country is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !business || !validateForm()) return;

    setIsSaving(true);
    try {
      const payload = {
        name: business.name?.trim(),
        type: business.type,
        country: business.country?.trim(),
        registration_number: business.registration_number?.trim() || null,
      };
      
      console.log("Updating business with payload:", payload); // Debug log
      await businessService.updateBusiness(id, payload);
      toast.success("Business updated successfully!");
      navigate(`/admin/business/view/${id}`);
    } catch (error) {
      console.error("Failed to update business:", error);
      toast.error((error as Error).message || "Failed to update business.");
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
          <p className="text-gray-500">Loading business data...</p>
        </div>
      </div>
    );
  }

  // Show error state if business data couldn't be loaded
  if (!business) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold">Could not load business data.</h2>
        <p className="text-gray-500 mb-4">Please try again or go back to the list.</p>
        <button
          onClick={() => navigate("/admin/business/all-businesses")}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Back to Businesses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
              onClick={() => navigate(`/admin/business/view/${id}`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Business</h1>
              <p className="text-gray-500 dark:text-gray-400">
                {business.name || "Loading..."}
              </p>
            </div>
          </div>
          <motion.button
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={handleSubmit}
            disabled={isSaving}
            whileHover={!isSaving ? { scale: 1.02 } : {}}
            whileTap={!isSaving ? { scale: 0.98 } : {}}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-600" />
              Business Details
            </h2>

            {/* Business Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={business.name || ""}
                onChange={handleChange}
                placeholder="Enter business name"
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                  errors.name 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Business Type and Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Business Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={business.type || "SME"}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                    errors.type 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                >
                  <option value="SME">SME</option>
                  <option value="ENTERPRISE">Enterprise</option>
                  <option value="NGO">NGO</option>
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country / Region <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={business.country || ""}
                  onChange={handleChange}
                  placeholder="Enter country or region"
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                    errors.country 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400`}
                />
                {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
              </div>
            </div>

            {/* Registration Number */}
            <div>
              <label htmlFor="registration_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Registration Number
                <span className="text-gray-400 text-xs ml-1">(Optional)</span>
              </label>
              <input
                type="text"
                id="registration_number"
                name="registration_number"
                value={business.registration_number || ""}
                onChange={handleChange}
                placeholder="Enter registration number (optional)"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
              />
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <motion.button
                type="button"
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => navigate(`/admin/business/view/${id}`)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isSaving}
                whileHover={!isSaving ? { scale: 1.02 } : {}}
                whileTap={!isSaving ? { scale: 0.98 } : {}}
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isSaving ? "Saving Changes..." : "Save Changes"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditBusinessPage;