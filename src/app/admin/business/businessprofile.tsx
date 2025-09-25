import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowLeft, Save, Briefcase, AlertTriangle, Loader2, Mail, Phone, Globe, MapPin, Eye } from "lucide-react";
import businessService from "../../../api/services/businessService";
import { Business } from "../../../types/business";

const BusinessProfilePage = () => {
  const navigate = useNavigate();
  const { id: businessId } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [profile, setProfile] = useState({
    id: null,
    phone: "",
    email: "",
    industry: "",
    address: "",
    visibility: "PUBLIC",
    website: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!businessId) {
      toast.error("No business ID provided.");
      navigate("/admin/business/all-businesses");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [businessData, profileData] = await Promise.all([
          businessService.getBusinessById(businessId),
          businessService.getBusinessProfile(businessId),
        ]);

        setBusiness(businessData);

        if (profileData) {
          setProfile({
            id: profileData.id,
            phone: profileData.phone || "",
            email: profileData.email || "",
            industry: profileData.industry || "",
            address: profileData.address || "",
            visibility: profileData.visibility || "PUBLIC",
            website: profileData.website || "",
            description: profileData.description || "",
          });
          setIsEditing(true); // A profile exists, so we are in "edit" mode
        } else {
          // Pre-fill from business data if no profile exists
          setProfile(prev => ({
            ...prev,
            email: businessData.email || "",
            phone: businessData.phone || "",
            address: businessData.address || "",
          }));
          setIsEditing(false); // No profile exists, so we are in "create" mode
        }
      } catch (error) {
        console.error("Failed to fetch business data:", error);
        toast.error("Failed to load business data.");
        navigate("/admin/business/all-businesses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [businessId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;

    setIsSaving(true);
    try {
      const payload = {
        phone: profile.phone,
        email: profile.email,
        industry: profile.industry,
        address: profile.address,
        visibility: profile.visibility,
        website: profile.website,
        description: profile.description,
      };

      if (profile.id) {
        // Update existing profile
        await businessService.updateBusinessProfile(businessId, payload);
        toast.success("Business profile updated successfully!");
      } else {
        // Create new profile
        await businessService.createBusinessProfile(businessId, payload);
        toast.success("Business profile created successfully!");
      }
      navigate(`/admin/business/view/${businessId}`);
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error((error as Error).message || "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl"
              onClick={() => navigate(`/admin/business/view/${businessId}`)}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {isEditing ? "Edit Business Profile" : "Create Business Profile"}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">{business?.name}</p>
            </div>
          </div>
          <motion.button
            className="px-4 py-2 bg-primary-600 text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving..." : (isEditing ? "Save Changes" : "Create Profile")}
          </motion.button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isEditing && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-blue-700 dark:text-blue-300 text-sm">
                <p className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span>This business doesn't have a public profile yet. Fill out the details below to create one.</span>
                </p>
              </div>
            )}
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-600" />
              Public Profile Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Public Email</label>
                <input type="email" id="email" name="email" value={profile.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Public Phone</label>
                <input type="tel" id="phone" name="phone" value={profile.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
                <input type="url" id="website" name="website" value={profile.website} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700" />
              </div>
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                <input type="text" id="industry" name="industry" value={profile.industry} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700" />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <input type="text" id="address" name="address" value={profile.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea id="description" name="description" value={profile.description} onChange={handleChange} rows={4} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700" />
            </div>

            <div>
              <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visibility</label>
              <select id="visibility" name="visibility" value={profile.visibility} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700">
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <motion.button
                type="submit"
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isSaving ? "Saving..." : (isEditing ? "Save Changes" : "Create Profile")}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default BusinessProfilePage;