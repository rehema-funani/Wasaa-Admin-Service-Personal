import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronRight,
  Globe,
  DollarSign,
  Clock,
  Shield,
  Users,
  Edit,
  AlertCircle,
  Loader,
} from "lucide-react";
import userService from "../../../../api/services/users";
import { useParams } from "react-router-dom";

export default function CompactUserProfile() {
  const [expandedSection, setExpandedSection] = useState("personal");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error("User ID is missing");
        }

        const userData = await userService.getUserById(id);
        setUserData(userData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setError("Failed to load user details. Please try again.");
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    try {
      const date = new Date(dateString);
      return `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getDate()}, ${date.getFullYear()}`;
    } catch (error) {
      return "Invalid date";
    }
  };

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div
        className="h-full overflow-y-auto bg-white shadow-sm rounded-lg flex flex-col items-center justify-center p-4"
        style={{ maxWidth: "256px" }}
      >
        <Loader size={24} className="text-indigo-500 animate-spin mb-2" />
        <p className="text-sm text-gray-600">Loading user profile...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="h-full overflow-y-auto bg-white shadow-sm rounded-lg flex flex-col items-center justify-center p-4"
        style={{ maxWidth: "256px" }}
      >
        <AlertCircle size={24} className="text-red-500 mb-2" />
        <p className="text-sm text-red-600 text-center">{error}</p>
      </div>
    );
  }

  // No data state
  if (!userData) {
    return (
      <div
        className="h-full overflow-y-auto bg-white shadow-sm rounded-lg flex flex-col items-center justify-center p-4"
        style={{ maxWidth: "256px" }}
      >
        <User size={24} className="text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 text-center">
          No user data available
        </p>
      </div>
    );
  }

  const userInitials = `${userData.first_name?.[0] || ""}${
    userData.last_name?.[0] || ""
  }`.toUpperCase();
  const fullName =
    `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
    userData.username;

  const renderKycBadge = (level) => {
    const colors = {
      basic: "bg-blue-100 text-blue-700",
      intermediate: "bg-amber-100 text-amber-700",
      advanced: "bg-emerald-100 text-emerald-700",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          colors[level] || "bg-gray-100 text-gray-700"
        }`}
      >
        <Shield size={10} className="mr-1" />
        KYC: {level?.charAt(0).toUpperCase() + level?.slice(1) || "None"}
      </span>
    );
  };

  return (
    <div
      className="h-full overflow-y-auto bg-white shadow-sm rounded-lg"
      style={{ maxWidth: "256px" }}
    >
      {/* Profile Header */}
      <div className="relative">
        <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg"></div>
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            {userData.profile_picture ? (
              <img
                src={userData.profile_picture}
                alt={fullName}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-md">
                {userInitials}
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white"></div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-12 pb-3 px-4 text-center">
        <h2 className="text-base font-bold text-gray-800">{fullName}</h2>
        <p className="text-xs text-gray-500 mb-2">@{userData.username}</p>
        <div className="flex justify-center space-x-1 mb-3">
          {renderKycBadge(userData.kyc_level)}
        </div>
        {userData.about && (
          <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2 mb-2">
            {userData.about}
          </p>
        )}
        <div className="flex justify-center space-x-4 text-xs text-gray-500 mt-2">
          <div className="flex flex-col items-center">
            <span className="font-semibold">{userData.followers}</span>
            <span>Followers</span>
          </div>
          <div className="h-8 border-r border-gray-200"></div>
          <div className="flex flex-col items-center">
            <span className="font-semibold">{userData.following}</span>
            <span>Following</span>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3">
        {/* Personal Information Section */}
        <div className="mb-2 border border-gray-100 rounded-lg overflow-hidden">
          <div
            className={`p-2 flex items-center justify-between cursor-pointer ${
              expandedSection === "personal"
                ? "bg-indigo-50"
                : "bg-white hover:bg-gray-50"
            }`}
            onClick={() => toggleSection("personal")}
          >
            <div className="flex items-center">
              <User size={14} className="text-indigo-500 mr-2" />
              <span className="text-xs font-medium">Personal Information</span>
            </div>
            {expandedSection === "personal" ? (
              <ChevronDown size={14} className="text-indigo-500" />
            ) : (
              <ChevronRight size={14} className="text-gray-400" />
            )}
          </div>

          {expandedSection === "personal" && (
            <div className="p-2 pt-0 border-t border-gray-100 text-xs">
              <div className="space-y-2 mt-2">
                <div className="flex items-center py-1">
                  <Mail
                    size={12}
                    className="text-gray-400 mr-2 flex-shrink-0"
                  />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] text-gray-500">Email</p>
                    <p className="text-xs text-gray-800 truncate">
                      {userData.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center py-1">
                  <Phone
                    size={12}
                    className="text-gray-400 mr-2 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500">Phone</p>
                    <p className="text-xs text-gray-800">
                      {userData.phone_number || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center py-1">
                  <MapPin
                    size={12}
                    className="text-gray-400 mr-2 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500">Location</p>
                    <p className="text-xs text-gray-800">
                      {userData.country || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center py-1">
                  <Calendar
                    size={12}
                    className="text-gray-400 mr-2 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500">Birthday</p>
                    <p className="text-xs text-gray-800">
                      {formatDate(userData.dob)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center py-1">
                  <User
                    size={12}
                    className="text-gray-400 mr-2 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500">Gender</p>
                    <p className="text-xs text-gray-800">
                      {userData.gender
                        ? userData.gender.charAt(0).toUpperCase() +
                          userData.gender.slice(1)
                        : "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preferences Section */}
        <div className="mb-2 border border-gray-100 rounded-lg overflow-hidden">
          <div
            className={`p-2 flex items-center justify-between cursor-pointer ${
              expandedSection === "preferences"
                ? "bg-indigo-50"
                : "bg-white hover:bg-gray-50"
            }`}
            onClick={() => toggleSection("preferences")}
          >
            <div className="flex items-center">
              <Globe size={14} className="text-indigo-500 mr-2" />
              <span className="text-xs font-medium">Preferences</span>
            </div>
            {expandedSection === "preferences" ? (
              <ChevronDown size={14} className="text-indigo-500" />
            ) : (
              <ChevronRight size={14} className="text-gray-400" />
            )}
          </div>

          {expandedSection === "preferences" && userData.preferences && (
            <div className="p-2 pt-0 border-t border-gray-100 text-xs">
              <div className="space-y-2 mt-2">
                <div className="flex items-center py-1">
                  <Globe
                    size={12}
                    className="text-gray-400 mr-2 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500">Language</p>
                    <p className="text-xs text-gray-800">
                      {userData.preferences.default_language?.toUpperCase() ||
                        "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center py-1">
                  <DollarSign
                    size={12}
                    className="text-gray-400 mr-2 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500">Currency</p>
                    <p className="text-xs text-gray-800">
                      {userData.preferences.default_currency || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center py-1">
                  <Clock
                    size={12}
                    className="text-gray-400 mr-2 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500">Timezone</p>
                    <p className="text-xs text-gray-800">
                      {userData.preferences.default_timezone || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2">
          <button className="w-full text-xs bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg mb-2 flex items-center justify-center">
            <Edit size={12} className="mr-1" />
            Edit Profile
          </button>
          <button className="w-full text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg flex items-center justify-center">
            <Users size={12} className="mr-1" />
            View Connections
          </button>
        </div>
      </div>
    </div>
  );
}
